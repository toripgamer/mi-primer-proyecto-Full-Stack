import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tareas') 
export class Tarea {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column() 
  titulo: string;

  @Column({ default: false }) 
  completada: boolean;
}