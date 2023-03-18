import * as Joi from 'joi';

const configSchema = Joi.object({
  FRONTEND_HOST: Joi.string().required(),
  SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});

export default configSchema;
