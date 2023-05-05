import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ISessionCustom } from '../types/user';
import UnAuthorized from '../errors/UnAuthorized';
import { SECRET_KEY } from '../../config';
import { unAuthorizedMessage } from '../constants/constants';

export default (req: ISessionCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthorized(unAuthorizedMessage);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new UnAuthorized(unAuthorizedMessage);
  }

  req.user = payload;

  next();
};
