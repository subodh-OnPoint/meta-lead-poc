import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetaModule } from './meta/meta.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MetaModule,
  ],
})
export class AppModule {}