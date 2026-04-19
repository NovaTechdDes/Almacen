import { useQuery } from '@tanstack/react-query';
import { getRubros } from '../../actions/rubros.actions';

export const useRubros = () => {
  return useQuery({
    queryKey: ['rubros'],
    queryFn: () => getRubros(),
  });
};
