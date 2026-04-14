export interface Cliente {
  id_cliente: number;
  denominacion: string;
  tipo_doc: 'TIPO_DNI';
  documento: string;
  telefono: string;
  domicilio: string;
  id_iva: 2;
  id_loc: number;
  ctacte: 'Habilitada';
  id_servidor?: number;
  id_movil?: string;
}

export interface ClienteMovil {
  id_cliente: number;
  denominacion: string;
  tipo_doc: 'TIPO_DNI';
  documento: string;
  telefono: string;
  domicilio: string;
  id_iva: 2;
  id_loc: number;
  ctacte: 'Habilitada';
  id_servidor: number;
}
