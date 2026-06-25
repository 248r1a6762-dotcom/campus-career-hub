import { getCollection } from './db.js';
import { assessmentQuestions, industries, skillCourses, sampleJobs, sampleAlumni, sampleEvents,
         sampleBooks, sampleLibraryBooks, sampleHostelRooms } from '../data/seedData.js';

export const seedDatabase = async () => {
  try {
    const usersDb = getCollection('users');
    const jobsDb = getCollection('jobs');
    const assessmentsDb = getCollection('assessments');
    const skillsDb = getCollection('skills');
    const eventsDb = getCollection('events');
    const booksDb = getCollection('books');
    const libraryDb = getCollection('library');
    const hostelDb = getCollection('hostel');

    // Seed assessment questions
    const currentQuestions = await assessmentsDb.find();
    if (currentQuestions.length === 0) {
      console.log('Seeding career assessment questions...');
      for (const q of assessmentQuestions) { await assessmentsDb.create(q); }
    }

    // Seed jobs
    const currentJobs = await jobsDb.find();
    if (currentJobs.length === 0) {
      console.log('Seeding sample jobs...');
      for (const j of sampleJobs) { await jobsDb.create(j); }
    }

    // Seed skill courses
    const currentSkills = await skillsDb.find();
    if (currentSkills.length === 0) {
      console.log('Seeding skill development courses...');
      for (const c of skillCourses) { await skillsDb.create(c); }
    }

    // Seed events
    const currentEvents = await eventsDb.find();
    if (currentEvents.length === 0) {
      console.log('Seeding virtual career events...');
      for (const e of sampleEvents) { await eventsDb.create(e); }
    }

    // Seed alumni
    const currentUsers = await usersDb.find({ role: 'alumni' });
    if (currentUsers.length === 0) {
      console.log('Seeding sample alumni profiles...');
      for (const a of sampleAlumni) { await usersDb.create(a); }
    }

    // Seed book exchange listings
    const currentBooks = await booksDb.find();
    if (currentBooks.length === 0) {
      console.log('Seeding book exchange listings...');
      for (const b of sampleBooks) { await booksDb.create(b); }
    }

    // Seed library catalogue
    const currentLibrary = await libraryDb.find();
    if (currentLibrary.length === 0) {
      console.log('Seeding library catalogue...');
      for (const l of sampleLibraryBooks) { await libraryDb.create(l); }
    }

    // Seed hostel rooms
    const currentHostel = await hostelDb.find();
    if (currentHostel.length === 0) {
      console.log('Seeding hostel room listings...');
      for (const h of sampleHostelRooms) { await hostelDb.create(h); }
    }

    console.log('Database verification and seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
