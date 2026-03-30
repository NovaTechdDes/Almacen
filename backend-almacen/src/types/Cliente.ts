export interface Cliente {
  id_cliente: number;
  denominacion: string;
  dni: string;
  telefono: string;
  direccion: string;
  localidad: string;
  fecha_registro: Date;
}

export interface ClienteMovil {
  id_cliente: number;
  denominacion: string;
  dni: string;
  telefono: string;
  direccion: string;
  localidad: string;
  fecha_registro: Date;
  id_servidor: number;
}
