import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompraService {

  constructor(private prisma: PrismaService) {}

  async crearCompra(data: {
    nombre: string;
    monto: number;
    proyectoId: number;
  }) {

    try {

      // Validar que el proyecto exista
      const proyecto = await this.prisma.proyecto.findUnique({
        where: { id: data.proyectoId },
      });

      if (!proyecto) {
        throw new HttpException(
          'El proyecto no existe',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Crear compra
      return await this.prisma.compra.create({
        data,
      });

    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error al crear la compra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    }

  }

  async obtenerComprasPorProyecto(proyectoId: number) {

    try {

      return await this.prisma.compra.findMany({
        where: { proyectoId },
      });

    } catch (error) {

      throw new HttpException(
        'Error al obtener compras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    }

  }
  
  async obtenerCostoTotal(proyectoId: number) {

    try {

      const resultado = await this.prisma.compra.aggregate({
        where: { proyectoId },
        _sum: {
          monto: true,
        },
      });

      return {
        proyectoId,
        costoTotal: resultado._sum.monto || 0,
      };

    } catch (error) {

      throw new HttpException(
        'Error al calcular costo total',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    }

  }

}

