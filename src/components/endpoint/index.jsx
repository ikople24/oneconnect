const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const ENDPOINT = {
  // Places
  //POST
  CREATE_PLACE: `${baseUrl}/places`,
  //PATCH
  UPDATE_PLACE: `${baseUrl}/places/`, // PARAM
  //GET
  // dropdown
  GET_ALL_CITY: `${baseUrl}/places/city`,
  GET_ALL_ZONE: `${baseUrl}/places/zone`,
  GET_ALL_PLACE: `${baseUrl}/places`,
  // DELETE
  DELETE_PLACE: `${baseUrl}/places`, // PARAM
  // Marker
  // POST
  CREATE_MARKER: `${baseUrl}/markers`,
  // ADMIN
  // GET
  GET_ALL_MARKER_ADMIN_DATA: `${baseUrl}/markers/private/admin/data`,
  GET_ALL_MARKER_ADMIN: `${baseUrl}/markers/private/admin`,
  GET_ONE_MARKER_ADMIN: `${baseUrl}/markers/private/admin/`, // PARAM
  GET_COUNT_MARKER_ADMIN: `${baseUrl}/markers/private/admin/count`,
  // PATCH
  PATCH_MARKERS_ADMIN: `${baseUrl}/markers/private/admin/`, // PARAM
  // DELETE
  DELETE_MARKER_ADMIN: `${baseUrl}/markers/private/admin/`, // PARAM
  // User
  //GET
  GET_MARKERS: `${baseUrl}/markers`,
  GET_ONE_MARKER: `${baseUrl}/markers/`, // PARAM
};
