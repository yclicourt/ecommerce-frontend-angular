import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {

  const userService = inject(UserService)
  const token = userService.getToken()

  if(token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
