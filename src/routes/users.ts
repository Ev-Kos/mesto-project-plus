import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';
import {
  getUserValidation,
  updateUserValidation,
  updateAvatarValidation,
} from '../middleware/validation';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserValidation, getUserById);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);
userRouter.get('/me', getCurrentUser);

export default userRouter;
