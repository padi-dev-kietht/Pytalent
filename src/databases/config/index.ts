import { env } from '@env';

const { db } = env;

interface DatabaseConfigInterface {
  type: string;
  database: string;
  host: string;
  port: number;
  username: string;
  password: string;
  synchronize: boolean;
  logging: boolean;
}

const databaseConfig = {} as DatabaseConfigInterface;

switch (db.dialect) {
  case 'sqlite':
    databaseConfig.type = 'sqlite';
    databaseConfig.database = db.storage;
    databaseConfig.synchronize = db.synchronize;
    databaseConfig.logging = db.logging;
    break;
  case 'postgres':
    databaseConfig.type = 'postgres';
    databaseConfig.database = db.database;
    databaseConfig.host = db.host;
    databaseConfig.port = db.port;
    databaseConfig.username = db.username;
    databaseConfig.password = db.password;
    databaseConfig.synchronize = db.synchronize;
    databaseConfig.logging = db.logging;
    break;
  default:
    databaseConfig.type = 'sqlite';
    databaseConfig.database = db.storage;
    databaseConfig.synchronize = db.synchronize;
    databaseConfig.logging = db.logging;
    break;
}

export default databaseConfig;
