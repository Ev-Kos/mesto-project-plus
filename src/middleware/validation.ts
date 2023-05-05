import { celebrate, Joi } from 'celebrate';
import { link } from '../constants/constants';

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(link),
    password: Joi.string().required().min(6),
    email: Joi.string().required().email(),
  }),
});

export const linkValidation = (url: string) => {
  link.test(url);
};

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string(),
  }),
});

export const cardValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

export const getUserValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

export const updateUserValidation = celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).max(200).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

export const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(link).required(),
  }),
});
