import { celebrate, Joi } from 'celebrate';

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
    avatar: Joi.string(),
    password: Joi.string().required().min(6),
    email: Joi.string().required().email(),
  }),
});

export const linkValidation = (url: string) => {
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\/+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\/+.~#?&//=]*)/.test(url);
};

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string(),
  }),
});

export const cardValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
});

export const getUserValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

export const updateUserValidation = celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).max(200),
    name: Joi.string().min(2).max(30),
  }),
});

export const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
});
