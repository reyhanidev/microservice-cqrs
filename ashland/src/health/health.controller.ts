import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';

@Controller(HealthController.path)
export class HealthController {
  static path = 'health';

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private mysqlDb: SequelizeHealthIndicator,
  ) {}

  /* This is a method in a NestJS controller that is used to perform a health check on an HTTP
  endpoint. It uses the `@Get` decorator to specify the HTTP method and route path for the endpoint.
  The `@HealthCheck()` decorator is used to indicate that this endpoint is a health check endpoint.
  The `checkHTTP()` method then uses the `HealthCheckService` to perform a health check on the
  specified HTTP endpoint (`https://www.google.com`) using the `HttpHealthIndicator` and returns the
  result of the health check. */
  @Get('http')
  @HealthCheck()
  checkHTTP() {
    return this.health.check([
      () => this.http.pingCheck('Google', 'https://www.google.com'),
    ]);
  }

  /* This is a method in a NestJS controller that is used to perform a health check on a database
  connection using the Sequelize ORM. */
  @Get('mysql')
  @HealthCheck()
  checkDB() {
    return this.health.check([async () => this.mysqlDb.pingCheck('sequelize')]);
  }

  /* This is a method in a NestJS controller that is used to perform a health check on the storage
  space of the server. It uses the `@Get` decorator to specify the HTTP method and route path for
  the endpoint. The `@HealthCheck()` decorator is used to indicate that this endpoint is a health
  check endpoint. The `checkStorage()` method then uses the `HealthCheckService` to perform a health
  check on the storage space of the server using the `DiskHealthIndicator` and returns the result of
  the health check. The `checkStorage()` method checks the storage space of the root directory (`/`)
  and sets a threshold of 250 GB using the `checkStorage()` method of the `DiskHealthIndicator`. */
  @Get('storage')
  @HealthCheck()
  checkStorage() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          threshold: 250 * 1024 * 1024 * 1024,
        }),
    ]);
  }

  /* This is a method in a NestJS controller that is used to perform a health check on the heap memory
  usage of the server. It uses the `@Get` decorator to specify the HTTP method and route path for
  the endpoint. The `@HealthCheck()` decorator is used to indicate that this endpoint is a health
  check endpoint. The `checkMemoryHeap()` method then uses the `HealthCheckService` to perform a
  health check on the heap memory usage of the server using the `MemoryHealthIndicator` and returns
  the result of the health check. The `checkHeap()` method of the `MemoryHealthIndicator` is used to
  check the heap memory usage and sets a threshold of 150 MB. */
  @Get('memory_heap')
  @HealthCheck()
  checkMemoryHeap() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  /* This is a method in a NestJS controller that is used to perform a health check on the resident set
  size (RSS) memory usage of the server. It uses the `@Get` decorator to specify the HTTP method and
  route path for the endpoint. The `@HealthCheck()` decorator is used to indicate that this endpoint
  is a health check endpoint. The `checkMemoryRSS()` method then uses the `HealthCheckService` to
  perform a health check on the RSS memory usage of the server using the `MemoryHealthIndicator` and
  returns the result of the health check. The `checkRSS()` method of the `MemoryHealthIndicator` is
  used to check the RSS memory usage and sets a threshold of 150 MB. */
  @Get('memory_rss')
  @HealthCheck()
  checkMemoryRSS() {
    return this.health.check([
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
