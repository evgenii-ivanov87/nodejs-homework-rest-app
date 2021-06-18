const Joi = require('joi');
const { HttpCode, Subscription } = require('../helpers/constants');

const schemaSignupUser = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/)
    .min(2)
    .max(30)
    .optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  subscription: Joi.string()
    .valid(Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS)
    .optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
});

const schemaUpdateSubscriptionUser = Joi.object({
  subscription: Joi.string()
    .valid(Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS)
    .required(),
});

const schemaRepeatSendVerifyEmail = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (error) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${error.message.replace(/"/g, '')}`,
    });
  }
};

module.exports.validateSignupUser = (req, _res, next) => {
  return validate(schemaSignupUser, req.body, next);
};

module.exports.validateLoginUser = (req, _res, next) => {
  return validate(schemaLoginUser, req.body, next);
};

module.exports.validateUpdateSubscriptionUser = (req, _res, next) => {
  return validate(schemaUpdateSubscriptionUser, req.body, next);
};

module.exports.validateRepeatSendVerifyEmail = (req, _res, next) => {
  return validate(schemaRepeatSendVerifyEmail, req.body, next);
};
