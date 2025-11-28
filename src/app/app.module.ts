import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceptsManual } from 'src/concepts-manual/concepts-manual.module';

@Module({
  imports: [ConceptsManual],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
