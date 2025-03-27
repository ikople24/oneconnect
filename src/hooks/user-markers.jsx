import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/utils/apiClient";
import { ENDPOINT } from "@/components/endpoint";

const apiClient = new ApiClient();



export default function useMarker(placeId) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["markers", placeId],
    queryFn: () => apiClient.get(ENDPOINT.GET_MARKERS + placeId),
  });
  return { data, isLoading, isError };
}


export default function useMarkerAdmin(placeId) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["markers", placeId],
        queryFn: () => apiClient.get(ENDPOINT.GET_ALL_MARKER_ADMIN + placeId),
    });
    return { data, isLoading, isError };
}
