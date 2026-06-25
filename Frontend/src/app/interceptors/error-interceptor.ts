import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userMessage = '';

      if (error.status === 0) {
        userMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.';
      } else if (error.status >= 500) {
        userMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';
      } else if (error.status === 404) {
        userMessage = 'El recurso solicitado no fue encontrado.';
      } else if (error.status === 400) {
        userMessage = error.error?.message || 'Solicitud inválida. Revisa los datos ingresados.';
      } else if (error.status === 401 || error.status === 403) {
        userMessage = 'No autorizado. Verifica tus credenciales.';
      }

      const enhancedError = new HttpErrorResponse({
        error: { ...(error.error || {}), userMessage },
        status: error.status,
        statusText: error.statusText,
        url: error.url || undefined,
      });

      return throwError(() => enhancedError);
    })
  );
};
