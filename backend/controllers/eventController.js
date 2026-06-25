import { getCollection } from '../config/db.js';

const eventsDb = getCollection('events');

export const getEvents = async (req, res) => {
  try {
    const events = await eventsDb.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events.', error: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required.' });
    }

    const event = await eventsDb.findOne({ _id: eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const attendees = event.attendees || [];
    if (attendees.includes(userId)) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }

    attendees.push(userId);
    await eventsDb.findByIdAndUpdate(eventId, { attendees });

    res.status(200).json({ message: 'Successfully registered for this event!', event });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event.', error: error.message });
  }
};
