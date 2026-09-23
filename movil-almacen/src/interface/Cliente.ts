export interface Cliente {
  id_cliente?: string;
  denominacion: string;
  dni: string;
  telefono: string;
  direccion: string;
  localidad?: string;
  email?: string;
  id_servidor?: number;
}
