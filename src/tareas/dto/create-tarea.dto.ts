import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTareaDto {
  @ApiProperty({
    example: 'Aprender validaciones en NestJS',
    description: 'El título de la tarea (mínimo 3 letras)',
  })
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @MinLength(3, { message: 'El título debe tener al menos 3 letras' })
  titulo: string;
}