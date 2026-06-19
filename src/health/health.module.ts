import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { RedisModule } from 'src/infra/redis/redis.module';
import { DbModule } from 'src/infra/database/db.module';

@Module({
  imports: [DbModule, RedisModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
