import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config/index';
import { join } from 'path';

const options = config as DataSourceOptions;

const AppDataSourceOption: DataSourceOptions = {
  ...options,
  entities: [join(__dirname, '../entities/*.{js,ts}')],
  migrations: [__dirname + '/migration/*.{js,ts}'],
};

export const AppDataSource = new DataSource(AppDataSourceOption);
