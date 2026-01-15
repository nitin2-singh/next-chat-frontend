import { axiosInstance } from "@/lib/axios-instance";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export function useUserSearch(search: string) {
  return useQuery({
    queryKey: ["user-search", search],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ users: User[] }>(
        `/users?search=${search}`
      );
      return data.users;
    },
    enabled: !!search,
  });
}
