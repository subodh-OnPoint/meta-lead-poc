import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetaModule } from './meta/meta.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    MetaModule,
  ],
})
export class AppModule {}