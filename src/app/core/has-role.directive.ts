import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@features/auth/interfaces/register.interface';
import { Role } from '@features/auth/enums/role.enum';
import { UserService } from '@shared/services/user.service';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef);

  // Inject Services
  private viewContainerRef = inject(ViewContainerRef);
  private userService = inject(UserService);

  roles = input.required<Role[]>({
    alias: 'hasRole',
  });
  private user = toSignal(this.userService.currentUser$);

  constructor() {
    effect(() => {
      const user = this.user();
      const roles = this.roles();

      this.viewContainerRef.clear();

      if (user && roles.length > 0 && this.hasRole(user, roles)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }

  hasRole(user: User, roles: Role[]) {
    return user.role?.some((role) => roles.includes(role));
  }
}
