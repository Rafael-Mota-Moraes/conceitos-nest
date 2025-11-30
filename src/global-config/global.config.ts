import { registerAs } from '@nestjs/config';

export default registerAs('globalConfig', () => {
  return {
    database: {
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: Boolean(process.env.DB_AUTO_LOAD_ENTITIES),
      synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    },
    environment: process.env.NODE_ENV || 'development',
  };
});
