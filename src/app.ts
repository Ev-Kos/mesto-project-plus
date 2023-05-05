import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import auth from './middleware/auth';
import errorHandler from './middleware/errorHandler';
import { login, createUser } from './controllers/users';
import { requestLogger, errorLogger } from './middleware/logger';
import { loginValidation, createUserValidation } from './middleware/validation';
import NotFoundError from './errors/NotFoundError';
import { PORT, MONGO_URL } from '../config';
import indexRouter from './routes';

const app = express();

app.use(express.json());
app.use(requestLogger);

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use(indexRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors);
app.use(errorHandler);
app.listen(PORT);
