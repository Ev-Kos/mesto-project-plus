import { Request } from 'express';
import { Model, Document } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface IRequestCustom extends Request {
  user?: {
    _id: string;
  }
}

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface IUserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

export interface ISessionCustom extends Request {
  user?: string | JwtPayload ;
}
