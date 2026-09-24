import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasService } from './tareas.service.js';
import { TareasController } from './tareas.controller.js';
import { Tarea } from './entities/tarea.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarea]),
  ],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}