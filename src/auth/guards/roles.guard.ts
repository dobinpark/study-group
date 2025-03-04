import { Injectable, CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
import { SetMetadata } from '@nestjs/common';

export function RolesGuard(...roles: UserRole[]): Type<CanActivate> {
    @Injectable()
    class RolesGuardMixin implements CanActivate {
        constructor(private readonly reflector: Reflector) { }

        canActivate(context: ExecutionContext): boolean {
            const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

            if (!requiredRoles) {
                return true;
            }

            const { user } = context.switchToHttp().getRequest();

            if (!user || !user.role) {
                return false;
            }

            return requiredRoles.some((role) => user.role === role);
        }
    }

    return mixin(RolesGuardMixin);
}
