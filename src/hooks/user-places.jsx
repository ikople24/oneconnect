import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApiClient from "@/utils/apiClient";
import { ENDPOINT } from "@/components/endpoint";
import { useGlobalMapContext } from "@/context/MapContext";
import { useEffect } from "react";

const apiClient = new ApiClient();

export const usePlacePolygon = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["placePolygon"],
    queryFn: async () => (await apiClient.get(ENDPOINT.GET_ALL_PLACE)).data,
  });
  return { data, isLoading, isError };
};

export const useAllPlace = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["AllPlace"],
        queryFn: async () => (await apiClient.get(ENDPOINT.GET_ALL_PLACE)).data,
      });
      return { data, isLoading, isError };
}

// export const useFindPlaceById = ({ placeId} = {}) => {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["placeId", placeId],
//     queryFn: async () => {
//       try {
//         const params = new URLSearchParams();
//         if (placeId) params.append("placeId", placeId);
//         const queryString = params.toString();
//         const url = `${ENDPOINT.GET_ALL_PLACE}${
//           queryString ? `?${queryString}` : ""
//         }`;
//         const response = await apiClient.get(url);
//         console.log('place from hook', response.data)
//         return response.data ?? [];
//       } catch (error) {
//         console.error("Error fetching places:", error);
//         return [];
//       }
//     },
//     refetchOnMount: true,
//   });
//   return { data, isLoading, isError };
// }; 

export const useDeletePlace= () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({placeId}) => {
            await apiClient.delete(`${ENDPOINT.DELETE_PLACE}/${placeId}`);
            return placeId;
        },
        onSuccess: ({placeId}) => {
            queryClient.invalidateQueries({ queryKey: ["AllPlace"] });
        },
    })
}


export const usePlace = ({ placeId, geographyId } = {}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["place", geographyId],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (placeId) params.append("placeId", placeId);
        if (geographyId) params.append("geographyId", geographyId);

        const queryString = params.toString();
        const url = `${ENDPOINT.GET_ALL_PLACE}${
          queryString ? `?${queryString}` : ""
        }`;
        const response = await apiClient.get(url);
        return response.data ?? [];
      } catch (error) {
        console.error("Error fetching places:", error);
        return [];
      }
    },
    refetchOnMount: true,
  });
  return { data, isLoading, isError };
};

export const usePlaceSummaryMarker = (placeId) => {
  const { setEnabledMarkers } = useGlobalMapContext();
  const url = `${ENDPOINT.GET_SUMMARY_PLACE}/${placeId}`;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["placeSummaryMarker", placeId],
    queryFn: async () => await apiClient.get(url).then((res) => res),
    enabled: !!placeId,
  });

  useEffect(() => {
    if (data) {
      setEnabledMarkers(data.map((type) => type._id));
    }
  }, [data, setEnabledMarkers]);

  console.log("placeSummaryMarker", data);

  return { data, isLoading, isError };
};

export const usePlaceMarkerType = (placeId) => {
  console.log("placeMarkerType", placeId);
  const url = `${ENDPOINT.GET_PLACE_MARKER_TYPE}/${placeId}`;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["placeMarkerType", placeId],
    queryFn: async () => await apiClient.get(url).then((res) => res),
    enabled: !!placeId,
  });
  return { data, isLoading, isError, refetch };
};

export const usePlaceMarkerTypeCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({placeId, body}) => {
      console.log(placeId, body);
      await apiClient.patch(
        `${ENDPOINT.ADD_PLACE_MARKER_TYPE}/${placeId}`,
        body
      );
      return {placeId};
    },
    onSuccess: ({placeId}) => {
      queryClient.invalidateQueries({ queryKey: ["placeMarkerType", placeId] });
      queryClient.invalidateQueries({ queryKey: ["markerType", placeId] });
    },
  });
};

export const usePlaceMarkerTypeDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({placeId, body}) => {
      console.log("payload", placeId, body);
      await apiClient.patch(
        `${ENDPOINT.REMOVE_PLACE_MARKER_TYPE}/${placeId}`,
        body
      );
      return {placeId};
    },
    onSuccess: ({placeId}) => {
      queryClient.invalidateQueries({ queryKey: ["placeMarkerType", placeId] });
      queryClient.invalidateQueries({ queryKey: ["markerType", placeId] });
    },
  });
};
