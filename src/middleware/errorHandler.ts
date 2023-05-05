import { NextFunction, Request, Response } from 'express';
import { serverErrorMessage } from '../constants/constants';

const errorHandler = (err:any, req:Request, res:Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const standartMessage = err.message;
  res.status(statusCode).send(statusCode === 500
    ? { message: serverErrorMessage }
    : { message: standartMessage });
  next();
};

export default errorHandler;
