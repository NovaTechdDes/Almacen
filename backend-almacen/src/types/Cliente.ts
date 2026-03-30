export interface Cliente {
  id_cliente: number;
  denominacion: string;
  dni: string;
  telefono: string;
  direccion: string;
  localidad: string;
  fecha_registro: Date;
  id_movil: number;
}

export interface ClienteMovil {
  id: number;
  denominacion: string;
  dni: string;
  telefono: string;
  direccion: string;
  localidad: string;
  fecha_registro: Date;
}
