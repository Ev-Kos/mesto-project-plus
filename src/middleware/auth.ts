import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ISessionCustom } from '../types/user';

export default (req: ISessionCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res.status(401).send({ message: err });
  }

  req.user = payload;

  next();
};
