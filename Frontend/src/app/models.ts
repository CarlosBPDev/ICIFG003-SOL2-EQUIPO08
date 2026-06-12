export interface CarreraResponseDTO {
  id: number;
  nombreCarrera: string;
  facultad: string;
}

export interface EdificioResponseDTO {
  id: number;
  nombreEdificio: string;
  direccion: string;
}

export interface EstadoReservaResponseDTO {
  id: number;
  nombreEstado: string;
}

export interface HorarioDisponibleResponseDTO {
  id: number;
  horaInicio: string; // "HH:mm:ss"
  horaTermino: string; // "HH:mm:ss"
}

export interface EstudianteResponseDTO {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  fechaRegistro: string;
  carrera?: CarreraResponseDTO;
}

export interface SalaResponseDTO {
  id: number;
  codigoSala: string;
  nombreSala: string;
  capacidad: number;
  piso: number;
  descripcion: string;
  estado: string;
  edificio?: EdificioResponseDTO;
  horarios?: HorarioDisponibleResponseDTO[];
}

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface ReservaRequestDTO {
  fechaReserva: string; // "YYYY-MM-DD"
  observacion: string;
  estudianteId: number;
  salaId: number;
  horarioDisponibleId: number;
  estadoReservaId: number;
}

export interface ReservaResponseDTO {
  id: number;
  fechaReserva: string;
  observacion: string;
  fechaCreacion: string;
  estudiante?: EstudianteResponseDTO;
  sala?: SalaResponseDTO;
  horarioDisponible?: HorarioDisponibleResponseDTO;
  estadoReserva?: EstadoReservaResponseDTO;
}
