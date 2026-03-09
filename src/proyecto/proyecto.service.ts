import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProyectoService {
	
	constructor(private prisma: PrismaService){}
	
	
	async crearProyecto(data: {
		nombre: string;
		empresaId: number;
	}) {
	  return this.prisma.proyecto.create({
    data,
  });
 }
 
	async listarProyectos() {
    return this.prisma.proyecto.findMany();
  }

}
