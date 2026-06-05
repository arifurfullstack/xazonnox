import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RouteProgressService } from './route-progress.service';

@Injectable({
  providedIn: 'root' // Provides this interceptor at the root level
})
export class RouteProgressInterceptor implements HttpInterceptor {

  // Inject RouteProgressService using the new inject function
  private progressService = inject(RouteProgressService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressService.show();

    return next.handle(req).pipe(
      finalize(() => this.progressService.hide())
    );
  }
}
