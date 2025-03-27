import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/utils/apiClient";
import { ENDPOINT } from "@/components/endpoint";

const apiClient = new ApiClient();

export const usePlacePolygon = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["placePolygon"],
    queryFn: async () => (await apiClient.get(ENDPOINT.GET_ALL_PLACE)).data,
  });
  return { data, isLoading, isError };
};

export const usePlace = ({ placeId, geographyId } = {}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["place", geographyId],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (placeId) params.append("placeId", placeId);
        if (geographyId) params.append("geographyId", geographyId);
        
        const queryString = params.toString();
        console.log(queryString);
        const url = `${ENDPOINT.GET_ALL_PLACE}${queryString ? `?${queryString}` : ''}`;
        const response = await apiClient.get(url);
        return response.data ?? [];
      } catch (error) {
        console.error('Error fetching places:', error);
        return [];
      }
    },
  });
  return { data, isLoading, isError };
};
