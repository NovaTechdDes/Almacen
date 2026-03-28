export const fechaHora = (fecha: string) => {
  const dia = fecha.slice(0, 10);
  const hora = fecha.slice(11, 19);
  return `${dia} ${hora}`;
};
