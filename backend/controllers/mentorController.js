import { getCollection } from '../config/db.js';

const usersDb = getCollection('users');
const sessionsDb = getCollection('sessions');

export const getMentors = async (req, res) => {
  try {
    const allUsers = await usersDb.find();
    // Filter for users who are alumni and have mentor enabled
    const mentors = allUsers.filter(u => u.role === 'alumni' && u.profile && u.profile.isMentor);
    
    const sanitizedMentors = mentors.map(m => ({
      id: m._id,
      name: m.name,
      email: m.email,
      company: m.profile.company,
      title: m.profile.title,
      industry: m.profile.industry,
      graduationYear: m.profile.graduationYear,
      skills: m.profile.skills || [],
      interests: m.profile.interests || [],
      bio: m.profile.bio || m.profile.mentorBio || ''
    }));

    res.status(200).json(sanitizedMentors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors.', error: error.message });
  }
};

export const matchMentors = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await usersDb.findOne({ _id: userId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student user not found.' });
    }

    const { targetIndustry } = req.body;
    const studentInterests = student.profile.interests || [];
    
    const allUsers = await usersDb.find();
    const mentors = allUsers.filter(u => u.role === 'alumni' && u.profile && u.profile.isMentor);

    const matches = mentors.map(mentor => {
      let score = 0;
      
      // Match by industry
      if (targetIndustry && mentor.profile.industry === targetIndustry) {
        score += 10;
      } else if (student.profile.recommendedCareers && student.profile.recommendedCareers.includes(mentor.profile.industry)) {
        score += 5;
      }

      // Match by overlapping skills/interests
      const mentorInterests = mentor.profile.interests || [];
      const overlap = studentInterests.filter(i => mentorInterests.includes(i));
      score += overlap.length * 2;

      return {
        mentor: {
          id: mentor._id,
          name: mentor.name,
          company: mentor.profile.company,
          title: mentor.profile.title,
          industry: mentor.profile.industry,
          bio: mentor.profile.bio || mentor.profile.mentorBio || '',
          skills: mentor.profile.skills || []
        },
        matchScore: score
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error processing mentor match.', error: error.message });
  }
};

export const scheduleSession = async (req, res) => {
  try {
    const { mentorId, date, time, topic, notes } = req.body;
    const studentId = req.user.id;

    if (!mentorId || !date || !time || !topic) {
      return res.status(400).json({ message: 'Mentor ID, date, time, and topic are required.' });
    }

    const student = await usersDb.findOne({ _id: studentId });
    const mentor = await usersDb.findOne({ _id: mentorId });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found.' });
    }

    const session = await sessionsDb.create({
      studentId,
      studentName: student.name,
      mentorId,
      mentorName: mentor.name,
      mentorCompany: mentor.profile.company,
      mentorTitle: mentor.profile.title,
      date,
      time,
      topic,
      notes: notes || '',
      meetingLink: `https://meet.jit.si/campus-career-hub-${Math.random().toString(36).substring(7)}`,
      status: 'Scheduled'
    });

    res.status(201).json({ message: 'Mentorship session scheduled successfully!', session });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling session.', error: error.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = {};
    if (userRole === 'student') {
      query = { studentId: userId };
    } else if (userRole === 'alumni') {
      query = { mentorId: userId };
    }

    const sessions = await sessionsDb.find(query);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions.', error: error.message });
  }
};
