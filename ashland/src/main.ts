import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from '@common/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* The `app.connectMicroservice()` method is used to connect a microservice to the NestJS
  application. In this case, it is connecting a gRPC microservice. */
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${Config.rabbitMq.username}:${Config.rabbitMq.password}@${Config.rabbitMq.host}:${Config.rabbitMq.port}`,
      ],
      queue: 'logs_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  /* The `await app.startAllMicroservices();` line of code is starting all the microservices that have
  been connected to the NestJS application. This is necessary to establish communication between the
  microservices and the main application. Once the microservices are started, they can send and
  receive messages or perform other tasks as defined in their respective implementations. */
  await app.startAllMicroservices();

  await app.listen(Config.app.port);
}
bootstrap();
