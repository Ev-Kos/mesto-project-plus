import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
  SECRET_KEY = 'super-strong-secret',
} = process.env;
