import { createLogger, format, transports } from 'winston';
import { Module, Provider } from '@nestjs/common';

const providers: Provider[] = [
  {
    provide: 'LOGGER',
    useFactory: () =>
      createLogger({
        level: 'info',
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.errors({ stack: true }),
          format.splat(),
          format.json(),
        ),
        defaultMeta: { service: 'pong' },
        transports: [
          new transports.File({ filename: 'pong-error.log', level: 'error' }),
          new transports.File({ filename: 'pong-combined.log' }),
        ],
      }),
  },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class LoggerModule {}
