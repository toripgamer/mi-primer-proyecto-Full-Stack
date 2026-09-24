import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TareasModule } from './tareas/tareas.module.js';

@Module({
  imports: [
    // CONFIGURACIÓN DE POSTGRESQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres', 
      password: 'admin123', 
      database: 'tareas_db',
      autoLoadEntities: true,
      synchronize: true
    }),
    TareasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}