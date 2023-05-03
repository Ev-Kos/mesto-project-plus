import { model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { IUser, IUserModel } from '../types/user';
import { linkValidation } from '../middleware/validation';

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
    validate: {
      validator: (v: string) => v.length >= 2 && v.length <= 30,
      message: 'Текст должен быть от 2 до 30 символов',
    },
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
    validate: {
      validator: (v: string) => v.length >= 2 && v.length <= 200,
      message: 'Текст должен быть от 2 до 200 символов',
    },
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: linkValidation,
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неверный формат почты',
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
        return Promise.reject(new Error('Неверные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неверные почта или пароль'));
          }
          return user;
        });
    });
});

export default model<IUser, IUserModel>('User', userSchema);
