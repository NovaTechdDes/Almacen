interface RubroBackEnd {
  id_rubro: number;
  nom_rubro: string;
}

export const rubroMapper = (rubro: RubroBackEnd) => {
  return {
    id_rubro: rubro.id_rubro,
    nom_rubro: rubro.nom_rubro,
  };
};
