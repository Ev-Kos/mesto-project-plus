import { NextFunction, Response } from 'express';
import { IRequestCustom } from '../types/user';

const userId = (req: IRequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '64478b53036d8cbdf2179a55',
  };
  next();
};

export default userId;