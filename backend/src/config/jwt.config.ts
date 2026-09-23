export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'construction-tracker-local-secret',
  accessTokenTtl: '30m',
  refreshTokenTtl: '7d'
};
