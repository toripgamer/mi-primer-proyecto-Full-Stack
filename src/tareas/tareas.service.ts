import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity.js';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';

@Injectable()
export class TareasService {
  constructor(
    
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
  ) {}

  
  async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
    const nuevaTarea = this.tareaRepository.create(createTareaDto);
    return await this.tareaRepository.save(nuevaTarea);
  }


  async findAll(): Promise<Tarea[]> {
    return await this.tareaRepository.find();
  }

  async findOne(id: number): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOneBy({ id });
    if (!tarea) {
      throw new NotFoundException(`La tarea con ID ${id} no existe en la base de datos`);
    }
    return tarea;
  }


  async update(id: number, updateTareaDto: UpdateTareaDto): Promise<Tarea> {
    const tarea = await this.findOne(id);
    Object.assign(tarea, updateTareaDto);
    return await this.tareaRepository.save(tarea);
  }


  async remove(id: number) {
    const tarea = await this.findOne(id);
    await this.tareaRepository.remove(tarea);
    return { mensaje: `Tarea ${id} eliminada permanentemente de la base de datos` };
  }
}