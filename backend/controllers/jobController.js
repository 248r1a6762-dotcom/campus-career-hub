import { getCollection } from '../config/db.js';

const jobsDb = getCollection('jobs');
const applicationsDb = getCollection('applications');
const usersDb = getCollection('users');

export const getJobs = async (req, res) => {
  try {
    const { search, industry, type } = req.query;
    const allJobs = await jobsDb.find();

    let filteredJobs = allJobs;

    if (search) {
      const query = search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    if (industry) {
      filteredJobs = filteredJobs.filter(job => job.industry === industry);
    }

    if (type) {
      filteredJobs = filteredJobs.filter(job => job.type === type);
    }

    res.status(200).json(filteredJobs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving job listings.', error: error.message });
  }
};

export const postJob = async (req, res) => {
  try {
    const { title, company, location, salary, type, description, requirements, industry } = req.body;
    const userId = req.user.id;

    if (!title || !company || !type || !description || !industry) {
      return res.status(400).json({ message: 'Missing required fields for job posting.' });
    }

    const newJob = await jobsDb.create({
      title,
      company,
      location: location || 'Remote',
      salary: salary || 'N/A',
      type,
      description,
      requirements: requirements || '',
      industry,
      employerId: userId
    });

    res.status(201).json({ message: 'Job posted successfully!', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Error posting job.', error: error.message });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeText, coverLetterText } = req.body;
    const studentId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required.' });
    }

    const job = await jobsDb.findOne({ _id: jobId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const student = await usersDb.findOne({ _id: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student user not found.' });
    }

    // Check if already applied
    const existingApp = await applicationsDb.findOne({ jobId, studentId });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this position.' });
    }

    const application = await applicationsDb.create({
      jobId,
      jobTitle: job.title,
      company: job.company,
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      resumeText: resumeText || student.profile.resumeUrl || 'Using profile resume',
      coverLetterText: coverLetterText || '',
      status: 'Applied'
    });

    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for job.', error: error.message });
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const applications = await applicationsDb.find({ studentId });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving your applications.', error: error.message });
  }
};

export const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user.id;
    
    // Find jobs posted by this employer
    const employerJobs = await jobsDb.find({ employerId });
    const jobIds = employerJobs.map(j => j._id);

    // Find all applications for those jobs
    const allApplications = await applicationsDb.find();
    const filteredApps = allApplications.filter(app => jobIds.includes(app.jobId));

    res.status(200).json(filteredApps);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving applications for your postings.', error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body; // e.g. "Reviewed", "Interviewing", "Accepted", "Rejected"

    if (!applicationId || !status) {
      return res.status(400).json({ message: 'Application ID and new status are required.' });
    }

    const updatedApp = await applicationsDb.findByIdAndUpdate(applicationId, { status }, { new: true });
    
    if (!updatedApp) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json({ message: 'Application status updated!', application: updatedApp });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status.', error: error.message });
  }
};
