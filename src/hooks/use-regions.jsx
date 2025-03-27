import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/utils/apiClient";
import { ENDPOINT } from "@/components/endpoint";

const apiClient = new ApiClient();

export const useRegions = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => await apiClient.get(ENDPOINT.GET_ALL_GEOGRAPHY),
  });
  return { data: data, isLoading, isError };
};
