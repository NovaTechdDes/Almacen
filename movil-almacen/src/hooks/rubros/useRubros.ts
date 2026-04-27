import { useQuery } from '@tanstack/react-query';
import { getRubros } from '../../actions/rubros.actions';
import { Rubro } from '../../interface';

export const useRubros = () => {
  return useQuery<Rubro[]>({
    queryKey: ['rubros'],
    queryFn: () => getRubros(),
  });
};
