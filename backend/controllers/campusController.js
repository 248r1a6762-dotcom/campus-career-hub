import { getCollection } from '../config/db.js';
import { samplePayments } from '../data/seedData.js';

const booksDb = getCollection('books');
const studyGroupsDb = getCollection('studygroups');
const libraryDb = getCollection('library');
const hostelDb = getCollection('hostel');
const paymentsDb = getCollection('payments');
const usersDb = getCollection('users');

// ===== BOOK EXCHANGE =====
export const getBooks = async (req, res) => {
  try {
    const { search, subject, type } = req.query;
    let books = await booksDb.find();
    if (search) {
      const q = search.toLowerCase();
      books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.subject.toLowerCase().includes(q));
    }
    if (subject) books = books.filter(b => b.subject === subject);
    if (type) books = books.filter(b => b.listingType === type);
    res.status(200).json(books);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const postBook = async (req, res) => {
  try {
    const { title, author, subject, condition, price, listingType } = req.body;
    const userId = req.user.id;
    const user = await usersDb.findOne({ _id: userId });
    if (!title || !author || !subject || !listingType) return res.status(400).json({ message: 'All fields are required.' });
    const book = await booksDb.create({
      title, author, subject, condition: condition || 'Good',
      price: price || 0, listingType, available: true,
      sellerId: userId,
      sellerName: user?.name || 'Campus Student',
      sellerEmail: user?.email || ''
    });
    res.status(201).json({ message: 'Book listed successfully!', book });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const markBookUnavailable = async (req, res) => {
  try {
    const { bookId } = req.body;
    const updated = await booksDb.findByIdAndUpdate(bookId, { available: false });
    if (!updated) return res.status(404).json({ message: 'Book not found.' });
    res.status(200).json({ message: 'Book marked as exchanged/sold.', book: updated });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ===== GROUP STUDIES =====
export const getStudyGroups = async (req, res) => {
  try {
    const groups = await studyGroupsDb.find();
    res.status(200).json(groups);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createStudyGroup = async (req, res) => {
  try {
    const { subject, topic, date, time, maxMembers, description, mode } = req.body;
    const userId = req.user.id;
    const user = await usersDb.findOne({ _id: userId });
    if (!subject || !topic || !date || !time) return res.status(400).json({ message: 'All fields required.' });
    const meetLink = mode === 'Online' ? `https://meet.jit.si/campus-study-${Math.random().toString(36).substring(7)}` : null;
    const group = await studyGroupsDb.create({
      subject, topic, date, time,
      maxMembers: maxMembers || 10,
      description: description || '',
      mode: mode || 'Online',
      meetLink,
      createdBy: userId,
      creatorName: user?.name || 'Student',
      members: [userId],
      memberNames: [user?.name || 'Student']
    });
    res.status(201).json({ message: 'Study group created!', group });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const joinStudyGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;
    const user = await usersDb.findOne({ _id: userId });
    const group = await studyGroupsDb.findOne({ _id: groupId });
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    if ((group.members || []).includes(userId)) return res.status(400).json({ message: 'Already a member of this group.' });
    if ((group.members || []).length >= group.maxMembers) return res.status(400).json({ message: 'Group is full.' });
    const updatedMembers = [...(group.members || []), userId];
    const updatedMemberNames = [...(group.memberNames || []), user?.name || 'Student'];
    const updated = await studyGroupsDb.findByIdAndUpdate(groupId, { members: updatedMembers, memberNames: updatedMemberNames });
    res.status(200).json({ message: 'Joined study group!', group: updated });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ===== LIBRARY =====
export const getLibraryBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    let books = await libraryDb.find();
    if (search) {
      const q = search.toLowerCase();
      books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (category) books = books.filter(b => b.category === category);
    res.status(200).json(books);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const reserveLibraryBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    const book = await libraryDb.findOne({ _id: bookId });
    if (!book) return res.status(404).json({ message: 'Book not found in library.' });
    if (book.availableCopies <= 0) return res.status(400).json({ message: 'No copies available for reservation.' });
    const updated = await libraryDb.findByIdAndUpdate(bookId, {
      availableCopies: book.availableCopies - 1,
      reservedBy: [...(book.reservedBy || []), userId]
    });
    res.status(200).json({ message: `Reserved "${book.title}" successfully! Collect from ${book.location}.`, book: updated });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ===== HOSTEL =====
export const getHostelRooms = async (req, res) => {
  try {
    const { block, type } = req.query;
    let rooms = await hostelDb.find();
    if (block) rooms = rooms.filter(r => r.block.includes(block));
    if (type) rooms = rooms.filter(r => r.type === type);
    res.status(200).json(rooms);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const applyForHostel = async (req, res) => {
  try {
    const { roomId, studentPhone, studentYear, emergencyContact } = req.body;
    const userId = req.user.id;
    const user = await usersDb.findOne({ _id: userId });
    const room = await hostelDb.findOne({ _id: roomId });
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    if (!room.available || room.occupiedBeds >= room.totalBeds) return res.status(400).json({ message: 'Room is fully occupied.' });
    const updated = await hostelDb.findByIdAndUpdate(roomId, {
      occupiedBeds: room.occupiedBeds + 1,
      available: (room.occupiedBeds + 1) < room.totalBeds
    });
    res.status(200).json({
      message: `Room ${room.roomNumber} in ${room.block} allotted successfully! Report to Hostel Office with this confirmation.`,
      allotment: {
        studentName: user?.name,
        studentEmail: user?.email,
        room: updated,
        allottedOn: new Date().toISOString(),
        applicationId: `HALL-${Date.now().toString(36).toUpperCase()}`
      }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ===== PAYMENTS =====
export const getPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await usersDb.findOne({ _id: userId });
    let payments = await paymentsDb.find({ studentId: userId });

    // Auto-create invoices on first login
    if (payments.length === 0) {
      const defaults = samplePayments(userId, user?.name || 'Student');
      for (const p of defaults) { await paymentsDb.create(p); }
      payments = await paymentsDb.find({ studentId: userId });
    }
    res.status(200).json(payments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const processPayment = async (req, res) => {
  try {
    const { paymentId, cardNumber, cardName, expiry, cvv, upiId, paymentMethod } = req.body;
    const userId = req.user.id;
    if (!paymentId) return res.status(400).json({ message: 'Payment invoice ID is required.' });
    const payment = await paymentsDb.findOne({ _id: paymentId });
    if (!payment) return res.status(404).json({ message: 'Invoice not found.' });
    if (payment.status === 'Paid') return res.status(400).json({ message: 'This invoice has already been paid.' });
    // Simulate card/UPI validation
    if (paymentMethod === 'Card' && (!cardNumber || !expiry || !cvv)) return res.status(400).json({ message: 'Card details incomplete.' });
    if (paymentMethod === 'UPI' && !upiId) return res.status(400).json({ message: 'UPI ID is required.' });

    const updated = await paymentsDb.findByIdAndUpdate(paymentId, {
      status: 'Paid',
      paidDate: new Date().toISOString(),
      paymentMethod: paymentMethod || 'Card',
      transactionId: `TXN${Date.now().toString(36).toUpperCase()}`
    });
    res.status(200).json({ message: 'Payment successful! Receipt generated.', payment: updated });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
