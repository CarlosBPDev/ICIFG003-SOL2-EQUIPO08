import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  info(message: string, ...data: any[]): void {
    console.info(`[INFO] ${new Date().toISOString()} - ${message}`, ...data);
  }

  warn(message: string, ...data: any[]): void {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...data);
  }

  error(message: string, ...data: any[]): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...data);
  }

  debug(message: string, ...data: any[]): void {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...data);
  }
}
