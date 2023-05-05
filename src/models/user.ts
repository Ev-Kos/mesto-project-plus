import { model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { IUser, IUserModel } from '../types/user';
import { linkValidation } from '../middleware/validation';
import UnAuthorized from '../errors/UnAuthorized';
import {
  aboutDefault,
  avatarDefault,
  incorrectEmailMessage,
  incorrectEmailOrPassword,
  incorrectUrlMessage,
  nameDefault,
} from '../constants/constants';

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlength: [2, 'Должно быть минимум 2 символа, получено {VALUE}'],
    maxlength: [30, 'Должно быть максимум 30 символов, получено {VALUE}'],
    default: nameDefault,
  },
  about: {
    type: String,
    minlength: [2, 'Должно быть минимум 2 символа, получено {VALUE}'],
    maxlength: [200, 'Должно быть максимум 200 символов, получено {VALUE}'],
    default: aboutDefault,
  },
  avatar: {
    type: String,
    default: avatarDefault,
    validate: {
      validator: linkValidation,
      message: incorrectUrlMessage,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: incorrectEmailMessage,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnAuthorized(incorrectEmailOrPassword));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnAuthorized(incorrectEmailOrPassword));
          }
          return user;
        });
    });
});

export default model<IUser, IUserModel>('User', userSchema);
