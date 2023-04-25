import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import userId from './middleware/userId';
import cardRouter from './routes/cards';
import errorHandler from './middleware/errorHandler';
import userRouter from './routes/users';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(userId);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errors);
app.use(errorHandler);
app.listen(PORT);
