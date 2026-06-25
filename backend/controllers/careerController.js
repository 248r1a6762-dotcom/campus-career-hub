import { getCollection } from '../config/db.js';
import { industries } from '../data/seedData.js';

const assessmentsDb = getCollection('assessments');
const usersDb = getCollection('users');

export const getAssessmentQuestions = async (req, res) => {
  try {
    const questions = await assessmentsDb.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment questions.', error: error.message });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body; // Map of questionId -> selectedOptionIndex
    const userId = req.user.id;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Answers are required.' });
    }

    const questions = await assessmentsDb.find();
    const scores = {
      engineering: 0,
      finance: 0,
      design: 0,
      marketing: 0,
      counseling: 0
    };

    // Calculate scores based on user choices
    for (const qId in answers) {
      const qIndex = parseInt(qId) - 1;
      const optionIndex = answers[qId];
      const question = questions.find(q => q.id === parseInt(qId));
      
      if (question && question.options[optionIndex]) {
        const points = question.options[optionIndex].points || {};
        for (const track in points) {
          scores[track] = (scores[track] || 0) + points[track];
        }
      }
    }

    // Determine the top recommended tracks
    const sortedTracks = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([track]) => track);

    const recommendations = sortedTracks.map(trackId => {
      return industries.find(ind => ind.id === trackId);
    }).filter(Boolean);

    // Save user's assessment result in their profile
    const user = await usersDb.findOne({ _id: userId });
    if (user) {
      const updatedProfile = {
        ...user.profile,
        recommendedCareers: recommendations.map(r => r.id),
        assessmentCompleted: true
      };
      await usersDb.findByIdAndUpdate(userId, { profile: updatedProfile });
    }

    res.status(200).json({
      scores,
      primaryRecommendation: recommendations[0] || null,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing assessment.', error: error.message });
  }
};

export const getIndustries = async (req, res) => {
  try {
    res.status(200).json(industries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving industries.', error: error.message });
  }
};

export const getCareerPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await usersDb.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user.profile.careerPathPlan || []);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving career plan.', error: error.message });
  }
};

export const updateCareerPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body; // Array of roadmap nodes

    if (!Array.isArray(plan)) {
      return res.status(400).json({ message: 'Plan must be an array of steps.' });
    }

    const user = await usersDb.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedProfile = {
      ...user.profile,
      careerPathPlan: plan
    };

    await usersDb.findByIdAndUpdate(userId, { profile: updatedProfile });

    res.status(200).json({ message: 'Career development plan updated successfully!', plan });
  } catch (error) {
    res.status(500).json({ message: 'Error saving career plan.', error: error.message });
  }
};
