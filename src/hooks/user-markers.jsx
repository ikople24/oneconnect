import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApiClient from "@/utils/apiClient";
import { ENDPOINT } from "@/components/endpoint";
import { useGlobalContext } from "@/context/Context";
import { useGlobalMapContext } from "@/context/MapContext";
const apiClient = new ApiClient();

export function useMarker(placeId) {

  // dont fetch markers if doesn't have placeId
  const { data, isLoading, isError } = useQuery({
    queryKey: ["markers", placeId],
    queryFn: () =>
      apiClient.post(ENDPOINT.GET_MARKERS + `?placeId=${placeId}`, {}),
    enabled: !!placeId,
  });
  return { data, isLoading, isError };
}

export function useMarkerAdmin(placeId) {
  const { isAdmin } = useGlobalContext();
  // dont fetch markers if doesn't have admin role and placeId
  const { data, isLoading, isError } = useQuery({
    queryKey: ["markers", placeId, isAdmin],
    queryFn: () =>
      apiClient.post(ENDPOINT.GET_ALL_MARKER_ADMIN + `?placeId=${placeId}`, {}),
    enabled: !!placeId && isAdmin,
  });
  return { data, isLoading, isError };
}

export function useMarkerCreate() {
  const { isAdmin } = useGlobalContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body) =>
      await apiClient.post(ENDPOINT.CREATE_MARKER, body),
    onSuccess: (_data, body) => {
      const checkRenderMarkerRole = () => {
        if (isAdmin) {
          return ["markers", body.place, isAdmin];
        } else {
          return ["markers", body.place];
        }
      };
      // refetch all markers after add new marker
      const keysToInvalidate = [
        checkRenderMarkerRole(),
        ["placeSummaryMarker", body.place],
        ["placeMarkerType", body.place],
      ];

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}

export function useMarkerDelete() {
  const { isAdmin } = useGlobalContext();
  const queryClient = useQueryClient();
  const { placeSelected } = useGlobalMapContext();
  return useMutation({
    mutationFn: async (id) =>
      await apiClient.delete(`${ENDPOINT.DELETE_MARKER_ADMIN}${id}`),
    onSuccess: () => {
      const checkRenderMarkerRole = () => {
        if (isAdmin) {
          return ["markers", placeSelected?._id, isAdmin];
        } else {
          return ["markers", placeSelected?._id];
        }
      };

      // refetch all markers after add delete marker
      const keysToInvalidate = [
        checkRenderMarkerRole(),
        ["placeSummaryMarker", placeSelected?._id],
        ["placeMarkerType", placeSelected?._id],
      ];

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
