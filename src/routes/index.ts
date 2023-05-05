import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';

const indexRouter = Router();

indexRouter.use('/users', userRouter);

indexRouter.use('/cards', cardRouter);

export default indexRouter;
