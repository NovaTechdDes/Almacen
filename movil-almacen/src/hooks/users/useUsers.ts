import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../actions/user.actions";
import { Vendedor } from "../../interface";

export const useUsers = () => {
  return useQuery<Vendedor[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};
