import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProyectoDto } from './dto/create-proyecto.dto';

@Controller('proyectos')
export class ProyectoController {

  constructor(private readonly proyectoService: ProyectoService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async crearProyecto(
    @Body() body: CreateProyectoDto,
    @Request() req,
  ) {
    const empresaId = req.user.empresaId;

    return this.proyectoService.crearProyecto({
      ...body,
      empresaId,
    });
  }
  
  @Get()
  async listarProyectos() {
    return this.proyectoService.listarProyectos();
  }

}