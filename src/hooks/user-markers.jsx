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
  console.log("data", data);
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

export function useMarkerUpdate() {
  const queryClient = useQueryClient();
  const { placeSelected } = useGlobalMapContext();
  const { isAdmin } = useGlobalContext();
  return useMutation({
    mutationFn: async ({ id, body }) => {
      const payload = {
        ...body,
        markerInfo: {
          name: body.name,
          description: body.description,
        },
        properties: {
          openingDate: body.openingDate,
          openingTime: body.openingTime,
          firstName: body.firstName,
          lastName: body.lastName,
          gender: body.gender,
          idCard: body.idCard,
          telNumber: body.telNumber,
          birthdate: body.birthdate,
          age: body.age,
        },
      };
      await apiClient.patch(`${ENDPOINT.PATCH_MARKERS_ADMIN}/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markers", placeSelected?._id, isAdmin],
      });
      return true
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

export function useMainMarkerType() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["mainMarkerType"],
    queryFn: async () => await apiClient.get(`${ENDPOINT.GET_ALL_MAIN_MARKER}`),
  });
  return { data, isLoading, isError };
}

export function useMainMarkerTypeCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) =>
      await apiClient.post(ENDPOINT.CREATE_MAIN_MARKER, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mainMarkerType"] });
    },
  });
}

export function useMainMarkerTypeEdit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mainMarkerId, body }) =>
      await apiClient.patch(
        `${ENDPOINT.UPDATE_MAIN_MARKER}/${mainMarkerId}`,
        body
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mainMarkerType"] });
    },
  });
}

export function useMainMarkerTypeDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) =>
      await apiClient.delete(`${ENDPOINT.DELETE_MAIN_MARKER}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mainMarkerType"] });
    },
  });
}

export function useMarkerType(placeId) {
  console.log("placeId", placeId);
  const params = new URLSearchParams();
  if (placeId) {
    params.append("placeId", placeId);
  }
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["markerType", placeId],
    queryFn: async () =>
      await apiClient.get(
        `${ENDPOINT.GET_ALL_MARKER_TYPE}?${params.toString()}`
      ),
  });
  return { data, isLoading, isError, refetch };
}

export function useMarkerTypeCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) =>
      await apiClient.postBuffer(ENDPOINT.CREATE_MARKER_TYPE, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markerType"] });
    },
  });
}

export function useMarkerTypeEdit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ markerTypeId, body }) =>
      await apiClient.patchBuffer(
        `${ENDPOINT.EDIT_MARKER_TYPE}/${markerTypeId}`,
        body
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markerType"] });
    },
  });
}

export function useMarkerTypeDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) =>
      await apiClient.delete(`${ENDPOINT.DELETE_MARKER_TYPE}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markerType"] });
    },
  });
}
