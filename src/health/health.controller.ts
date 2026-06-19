import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'System health check',
    description: 'Checks database and Redis connectivity',
  })
  @ApiResponse({
    status: 200,
    description: 'System is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-06-17T12:00:00.000Z',
        services: {
          database: {
            status: 'up',
          },
          redis: {
            status: 'up',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System is unhealthy',
    schema: {
      example: {
        status: 'error',
        timestamp: '2026-06-17T12:00:00.000Z',
        services: {
          database: {
            status: 'down',
            error: 'Connection refused',
          },
          redis: {
            status: 'up',
          },
        },
      },
    },
  })
  async health() {
    return this.healthService.getHealth();
  }
}
