import { Provider } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

class DataSourceConfigError extends Error {
  constructor (message) {
    super(message);
    this.name = 'DataSourceConfigError';
  }
}

function validateNonNull(value: string, name: string) {
  if (value === undefined || value === null) {
    throw new DataSourceConfigError(`${name} is required`);
  }
}

function readDataSourceOptions(): DataSourceOptions {
  const  {
    DATASOURCE_HOST: host,
    DATASOURCE_PORT: port,
    DATASOURCE_USERNAME: username,
    DATASOURCE_PASSWORD: password,
    DATASOURCE_DATABASE: database,
  } = process.env;

  validateNonNull(host, 'host');
  validateNonNull(port, 'port');
  validateNonNull(username, 'username');
  validateNonNull(password, 'password');
  validateNonNull(database, 'database');

  return {
    type: 'postgres',
    port: Number.parseInt(port),
    host,
    username,
    password,
    database,
    synchronize: false,
    entities: [
      __dirname + '/**/*.entity{.ts,.js}',
    ],
  }
}

export const databaseProviders: Provider[] = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return new DataSource(readDataSourceOptions()).initialize();
    },
  },
];