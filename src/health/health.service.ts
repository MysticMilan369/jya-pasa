import { Injectable } from '@nestjs/common';
import { DbService } from '../infra/database/db.service';
import { RedisService } from '../infra/redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly db: DbService,
    private readonly redis: RedisService,
  ) {}

  async getHealth() {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const healthy = database.status === 'up' && redis.status === 'up';

    return {
      status: healthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      services: {
        database,
        redis,
      },
    };
  }

  private async checkDatabase() {
    try {
      await this.db.$queryRaw`SELECT 1`;

      return {
        status: 'up',
      };
    } catch (error) {
      return {
        status: 'down',
        error:
          error instanceof Error ? error.message : 'Unknown database error',
      };
    }
  }

  private async checkRedis() {
    try {
      const result = await this.redis.ping();

      return {
        status: result === 'PONG' ? 'up' : 'down',
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown redis error',
      };
    }
  }
}
