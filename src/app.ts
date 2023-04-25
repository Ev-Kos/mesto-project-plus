import express from 'express';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  autoIndex: true,
  autoCreate: true,
});

app.listen(PORT);