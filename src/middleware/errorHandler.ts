import { NextFunction, Request, Response } from 'express';

const errorHandler = (err:any, req:Request, res:Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const messages = err.message || 'На сервере произошла ошибка';
  res.status(statusCode).send(statusCode === 500
    ? { message: 'На сервере произошла ошибка' }
    : { message: messages });
  next();
};

export default errorHandler;
