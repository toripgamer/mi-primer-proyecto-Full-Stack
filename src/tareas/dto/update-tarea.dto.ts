import { ApiProperty } from '@nestjs/swagger';

export class UpdateTareaDto {
  @ApiProperty({ example: 'Mi tarea terminada', required: false })
  titulo?: string;

  @ApiProperty({ example: true, required: false })
  completada?: boolean;
}