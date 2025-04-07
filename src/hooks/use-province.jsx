import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/utils/apiClient";
import { ENDPOINT } from "@/components/endpoint";

const apiClient = new ApiClient();

export const useProvince = (geographyId) => {
  const param = geographyId ? new URLSearchParams({ geographyId }) : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["province", geographyId],
    queryFn: async () =>
      await apiClient.get(`${ENDPOINT.GET_ALL_PROVINCE}?${param}`),
  });
  return { data, isLoading, isError };
};
