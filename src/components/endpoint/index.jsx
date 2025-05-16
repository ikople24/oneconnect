const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const ENDPOINT = {
  // TODO: Users
  GET_ALL_USER: `/users`,
  UPDATE_USER: `/users`,

  // TODO: Role
  GET_ALL_ROLE: `/role`,

  //TODO: Places
  //POST
  CREATE_PLACE: `/places`,
  CREATE_PLACE_DASHBOARD: `/places/create-dashboard`,
  //PATCH
  UPDATE_PLACE: `/places/update`, // PARAM
  ADD_PLACE_MARKER_TYPE: `/places/add-marker`,
  REMOVE_PLACE_MARKER_TYPE: `/places/remove-marker`,

  //GET
  // dropdown
  GET_ALL_PROVINCE: `/places/province`,
  GET_ALL_CITY: `/places/city`,
  GET_ALL_ZONE: `/places/zone`,
  GET_ALL_PLACE: `/places`,
  GET_ALL_PROVINCE_NAME: `/places/province/name`,
  GET_ALL_GEOGRAPHY: `/places/geography`,
  GET_ALL_PINTYPES: `/places/pin`,
  GET_SUMMARY_PLACE: `/places/summary`,
  // DELETE
  DELETE_PLACE: `/places`, // PARAM

  // TODO: Marker Type
  GET_ALL_MAIN_MARKER: `/marker-type/main`,
  CREATE_MAIN_MARKER: `/marker-type/main`,
  UPDATE_MAIN_MARKER: `/marker-type/main`,
  DELETE_MAIN_MARKER: `/marker-type/main`,
  GET_ALL_MARKER_TYPE: `/marker-type`,
  GET_ALL_MARKER_TYPE_PLACE: `/marker-type/all`,
  CREATE_MARKER_TYPE: `/marker-type`,
  DELETE_MARKER_TYPE: `/marker-type`,
  GET_PLACE_MARKER_TYPE: `/marker-type/place`,
  EDIT_MARKER_TYPE: `/marker-type`,

  //TODO: Marker
  // POST
  CREATE_MARKER: `/markers`,
  // ADMIN

  // GET
  GET_ALL_MARKER_ADMIN_DATA: `/markers/private/admin/data`,
  GET_ALL_MARKER_ADMIN: `/markers/private/admin`,
  GET_ONE_MARKER_ADMIN: `/markers/private/admin/`, // PARAM
  GET_COUNT_MARKER_ADMIN: `/markers/private/admin/count`,
  // PATCH
  PATCH_MARKERS_ADMIN: `/markers/private/admin`, // PARAM
  // DELETE
  DELETE_MARKER_ADMIN: `/markers/private/admin/`, // PARAM
  // User
  //GET
  GET_MARKERS: `/markers/get`,
  GET_ONE_MARKER: `/markers/`, // PARAM
};
