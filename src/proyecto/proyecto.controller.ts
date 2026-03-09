import { Controller, Post, Body, Get } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';

@Controller('proyectos')
export class ProyectoController {

  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async crearProyecto(
    @Body() body: { nombre: string; empresaId: number },
  ) {
    return this.proyectoService.crearProyecto(body);
  }
  
  @Get()
  async listarProyectos() {
    return this.proyectoService.listarProyectos();
  }

}