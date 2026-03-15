import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {

    const usuario = await this.usuarioService.findByEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
	  empresaId: usuario.empresaId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
