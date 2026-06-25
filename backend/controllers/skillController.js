import { getCollection } from '../config/db.js';

const skillsDb = getCollection('skills');
const usersDb = getCollection('users');

export const getCourses = async (req, res) => {
  try {
    const courses = await skillsDb.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving courses.', error: error.message });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonIndex } = req.body;
    const userId = req.user.id;

    if (!courseId || lessonIndex === undefined) {
      return res.status(400).json({ message: 'Course ID and lesson index are required.' });
    }

    const user = await usersDb.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Keep track of course progress in user's profile
    const progress = user.profile.courseProgress || {};
    if (!progress[courseId]) {
      progress[courseId] = [];
    }

    if (!progress[courseId].includes(lessonIndex)) {
      progress[courseId].push(lessonIndex);
    }

    const updatedProfile = {
      ...user.profile,
      courseProgress: progress
    };

    await usersDb.findByIdAndUpdate(userId, { profile: updatedProfile });
    res.status(200).json({ message: 'Lesson marked as complete!', progress: progress[courseId] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course progress.', error: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { courseId, selectedIndex } = req.body;
    const userId = req.user.id;

    if (!courseId || selectedIndex === undefined) {
      return res.status(400).json({ message: 'Course ID and selected index are required.' });
    }

    const course = await skillsDb.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const user = await usersDb.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isCorrect = course.quiz.answerIndex === selectedIndex;
    
    if (isCorrect) {
      const currentBadges = user.profile.badges || [];
      if (!currentBadges.includes(course.badge)) {
        currentBadges.push(course.badge);
      }

      const updatedProfile = {
        ...user.profile,
        badges: currentBadges
      };

      await usersDb.findByIdAndUpdate(userId, { profile: updatedProfile });

      return res.status(200).json({
        correct: true,
        message: `Congratulations! You answered correctly and earned the '${course.badge}' badge!`,
        badges: currentBadges
      });
    } else {
      return res.status(200).json({
        correct: false,
        message: 'Incorrect answer. Please review the material and try again!'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying quiz.', error: error.message });
  }
};
