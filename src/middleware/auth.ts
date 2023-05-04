import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ISessionCustom } from '../types/user';
import UnAuthorized from '../errors/UnAuthorized';

export default (req: ISessionCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new UnAuthorized('Необходима авторизация');
  }

  req.user = payload;

  next();
};
