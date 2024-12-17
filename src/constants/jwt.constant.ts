export const jwtConstants = {
  access: {
    secret: process.env.ACCESS_SECRET || 'qwertytr',
    expiresTime: process.env.ACCESS_EXPIRES || '10m',
  },
  refresh: {
    secret: process.env.REFRESH_SECRET || 'qwertyu',
    expiresTime: process.env.REFRESH_EXPIRES || '30m',
  },
};
