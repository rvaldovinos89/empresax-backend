import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCompraDto {

  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsNumber()
  proyectoId: number;
}
