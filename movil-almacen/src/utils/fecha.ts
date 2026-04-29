export const fechaHora = (fecha: string) => {
  const dia = fecha.slice(0, 10);
  const hora = new Date(fecha);

  const horaArgentina = hora.toLocaleTimeString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return `${dia} ${horaArgentina}`;
};

export const inicioDia = () => {
  const fecha = new Date();

  const retorno = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0);

  return retorno.toISOString();
};

export const finDia = () => {
  const fecha = new Date();

  const retorno = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1, 0, 0, 0);

  return retorno.toISOString();
};
