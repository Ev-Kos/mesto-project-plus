import { model, Schema } from 'mongoose';
import { ICard } from '../types/card';
import { linkValidation } from '../middleware/validation';

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    validate: {
      validator: (v: string) => v.length >= 2 && v.length <= 30,
      message: 'Текст должен быть от 2 до 30 символов',
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: linkValidation,
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
