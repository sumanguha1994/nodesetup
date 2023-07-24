import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService {
  constructor(private injector: Injector) {}

  intercept(req: any, next: any): Observable<any> {
    let authService = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      setHeaders: {
        'x-access-token': `${authService.getAdminToken()}`,
      },
    });
    return next.handle(tokenizedReq);
  }
}
