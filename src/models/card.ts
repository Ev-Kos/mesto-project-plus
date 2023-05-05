import { model, Schema } from 'mongoose';
import { ICard } from '../types/card';
import { linkValidation } from '../middleware/validation';
import { incorrectUrlMessage } from '../constants/constants';

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: [2, 'Должно быть минимум 2 символа, получено {VALUE}'],
    maxlength: [30, 'Должно быть максимум 30 символов, получено {VALUE}'],
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: linkValidation,
      message: incorrectUrlMessage,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
