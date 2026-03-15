import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ProyectoService {

  constructor(private prisma: PrismaService) {}

  async crearProyecto(data: {
    nombre: string;
    empresaId: number;
  }) {

    try {

      const proyecto = await this.prisma.proyecto.create({
        data,
      });

      return proyecto;

    } catch (error) {

      throw new HttpException(
        'Error al crear el proyecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    }

  }

  async listarProyectos() {

    try {

      return await this.prisma.proyecto.findMany();

    } catch (error) {

      throw new HttpException(
        'Error al obtener proyectos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    }

  }

}