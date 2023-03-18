import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    frontendHost: process.env.FRONTEND_HOST,
    secret: process.env.SECRET,
    jwtSecret: process.env.JWT_SECRET,
  };
});
