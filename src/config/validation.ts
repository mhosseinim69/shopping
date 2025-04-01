import * as Joi from 'joi';

export const validationSchema = Joi.object({
  port: Joi.number(),
  database: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().default(3306),
    password: Joi.string(),
    name: Joi.string().required(),
    user: Joi.string().required(),
  }),
  environment: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  jwt: Joi.object({
    accessSecret: Joi.string().required(),
    refreshSecret: Joi.string().required(),
    accessExpiresIn: Joi.string().required(),
    refreshExpiresIn: Joi.string().required(),
  }),
});
