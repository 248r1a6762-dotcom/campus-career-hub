import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class MockCollection {
  constructor(name) {
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading mock db file ${this.filePath}:`, error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing mock db file ${this.filePath}:`, error);
    }
  }

  async find(query = {}) {
    const items = this.read();
    return items.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const items = this.read();
    return items.find(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  }

  async create(data) {
    const items = this.read();
    const newItem = {
      _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...data
    };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const items = this.read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...update, updatedAt: new Date().toISOString() };
    this.write(items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    const items = this.read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1);
    this.write(items);
    return deleted[0];
  }
}

export const dbCollections = {
  users: new MockCollection('users'),
  jobs: new MockCollection('jobs'),
  applications: new MockCollection('applications'),
  mentors: new MockCollection('mentors'),
  sessions: new MockCollection('sessions'),
  assessments: new MockCollection('assessments'),
  skills: new MockCollection('skills'),
  events: new MockCollection('events'),
  counseling: new MockCollection('counseling'),
  messages: new MockCollection('messages'),
  books: new MockCollection('books'),
  studygroups: new MockCollection('studygroups'),
  library: new MockCollection('library'),
  hostel: new MockCollection('hostel'),
  payments: new MockCollection('payments')
};
