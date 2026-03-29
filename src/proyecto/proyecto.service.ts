import { 
Injectable,
HttpException,
HttpStatus,
NotFoundException,
ConflictException, 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ProyectoService {

  constructor(private prisma: PrismaService) {}

   private async buscarProyectoPorId(id: number) {
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { id },
    });

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return proyecto;
  }

  async crearProyecto(data: {
    nombre: string;
    empresaId: number;
	presupuesto?: number;
	precioVenta?: number;
  }) {

    try {

      const proyecto = await this.prisma.proyecto.create({
        data:{
			nombre: data.nombre,
			empresaId: data.empresaId,
			presupuesto: data.presupuesto,
			precioVenta: data.precioVenta,
		},
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
  
   async actualizarProyecto(
    proyectoId: number,
    data: {
      nombre?: string;
      presupuesto?: number;
      precioVenta?: number;
    },
  ) {
    try {
      const proyecto = await this.buscarProyectoPorId(proyectoId);

      if (proyecto.estado?.toLowerCase() === 'cerrado') {
        throw new ConflictException(
          'El proyecto está cerrado y no permite edición',
        );
      }

      return await this.prisma.proyecto.update({
        where: { id: proyectoId },
        data: {
          nombre: data.nombre,
          presupuesto: data.presupuesto,
          precioVenta: data.precioVenta,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new HttpException(
        'Error al actualizar el proyecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
   async obtenerMargen(proyectoId: number) {

    try {

     const proyecto = await this.prisma.proyecto.findUnique({
      where: { id: proyectoId },
    });

    if (!proyecto) {
      throw new HttpException(
        'Proyecto no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const resultado = await this.prisma.compra.aggregate({
      where: { proyectoId },
      _sum: {
        monto: true,
      },
    });

    const costoTotal = resultado._sum.monto || 0;
    const precioVenta = proyecto.precioVenta || 0;

    return {
      proyectoId,
      costoTotal,
      precioVenta,
      margen: precioVenta - costoTotal,
    };

  } catch (error) {

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Error al calcular margen',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

  }

}

   async obtenerResumenProyecto(proyectoId: number) {
    try {
      const proyecto = await this.buscarProyectoPorId(proyectoId);

      const resultado = await this.prisma.compra.aggregate({
        where: { proyectoId },
        _sum: {
          monto: true,
        },
      });

      const costoTotal = resultado._sum.monto || 0;
      const presupuesto = proyecto.presupuesto ?? 0;
      const precioVenta = proyecto.precioVenta ?? null;

      const saldoDisponible = presupuesto - costoTotal;

      const porcentajeConsumido =
        presupuesto > 0 ? (costoTotal / presupuesto) * 100 : null;

      const margen =
        precioVenta && precioVenta > 0 ? precioVenta - costoTotal : null;

      const margenPorcentaje =
        precioVenta && precioVenta > 0
          ? ((precioVenta - costoTotal) / precioVenta) * 100
          : null;

      return {
        proyectoId: proyecto.id,
        presupuesto,
        precioVenta,
        costoTotal,
        saldoDisponible,
        porcentajeConsumido,
        margen,
        margenPorcentaje,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error al obtener resumen del proyecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}