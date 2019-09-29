import { Module } from '@nestjs/common';
import { LecturesModule } from './lectures/lectures.module';

@Module({
  imports: [LecturesModule],
})
export class AppModule {}
