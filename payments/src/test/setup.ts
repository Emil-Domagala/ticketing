import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (userId?: string) => string[];
}

jest.mock('../natsClient');
jest.mock('../stripe.ts');
let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'testkey';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (userId?: string) => {
  const tokenExpiration = 60 * 60 * 1000 * 2;

  const token = jwt.sign({ email: 'test@test.com', userId: userId || new mongoose.Types.ObjectId().toHexString() }, process.env.JWT_KEY!, {
    expiresIn: tokenExpiration,
  });

  return [`jwt=${token}`];
};
