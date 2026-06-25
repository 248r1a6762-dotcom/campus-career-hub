import { getCollection } from '../config/db.js';

const counselingDb = getCollection('counseling');

export const getCounselingSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await counselingDb.find({ studentId: userId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving counseling sessions.', error: error.message });
  }
};

export const bookCounselingSession = async (req, res) => {
  try {
    const { advisorName, date, time, notes } = req.body;
    const studentId = req.user.id;

    if (!advisorName || !date || !time) {
      return res.status(400).json({ message: 'Advisor name, date, and time are required.' });
    }

    const session = await counselingDb.create({
      studentId,
      advisorName,
      date,
      time,
      notes: notes || '',
      status: 'Confirmed'
    });

    res.status(201).json({ message: 'Counseling appointment booked successfully!', session });
  } catch (error) {
    res.status(500).json({ message: 'Error booking counseling session.', error: error.message });
  }
};
