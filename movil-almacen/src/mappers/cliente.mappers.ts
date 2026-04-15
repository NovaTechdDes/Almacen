import { Cliente } from '../interface';

interface ClienteBackEnd {
  id_cliente: number;
  denominacion: string;
  tipo_doc: 'TIPO_DNI';
  documento: string;
  domicilio: string;
  telefono: string;
  ctacte: 'Habilitada';
  id_loc: 1;
  id_iva: 2;
}

export const clienteMapper = (cliente: ClienteBackEnd): Cliente => {
  return {
    denominacion: cliente.denominacion,
    dni: cliente.documento,
    direccion: cliente.domicilio,
    telefono: cliente.telefono,
    localidad: '',
  };
};

export const clienteMapperBackEnd = (cliente: Cliente) => {
  return {
    id_cliente: cliente.id_cliente,
    denominacion: cliente.denominacion,
    tipo_doc: 'TIPO_DNI',
    documento: cliente.dni,
    domicilio: cliente.direccion,
    telefono: cliente.telefono,
    ctacte: 'Habilitada',
    id_loc: 1,
    id_iva: 2,
  };
};
