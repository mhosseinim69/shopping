import { Logger } from '@nestjs/common';
import * as Joi from 'joi';
import { validationSchema } from './validation';

export function validateEnv() {
  const { error, value } = validationSchema.validate(process.env, {
    abortEarly: false,
  });

  if (error) {
    const logger = new Logger('ConfigValidation');

    logger.error('❌ Missing or invalid environment variables:');
    error.details.forEach((err) => {
      logger.error(`- ${err.message}`);
    });

    process.exit(1);
  }

  return value;
}
