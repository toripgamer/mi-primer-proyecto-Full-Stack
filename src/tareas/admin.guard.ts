import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  // Define cuál será tu clave secreta de administrador:
  private readonly CLAVE_SECRETA = 'admin123';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Leemos la cabecera 'x-api-key' enviada por el cliente:
    const apiKey = request.headers['x-api-key'];

    if (apiKey !== this.CLAVE_SECRETA) {
      throw new UnauthorizedException('No tienes permisos de administrador para realizar esta acción');
    }

    return true; // Si la clave es correcta, permite pasar
  }
}