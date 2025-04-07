import MainMarkerType from "@/components/admin/marker-type-manage/MainMarkerType";
import MarkerType from "@/components/admin/marker-type-manage/MarkerType";
import { ENDPOINT } from "@/components/endpoint";
import TitlePage from "@/components/ui/Admin/TitlePage";
import ApiClient from "@/utils/apiClient";
import { useEffect, useState } from "react";
import { MarkerTypeContextProvider } from "@/context/MasterData/MarkerTypeContext";

const MarkerTypePage = () => {
  const [mainMarker, setMainMarker] = useState([]);
  const apiClient = new ApiClient();
  useEffect(() => {
    fetchMainMarker();
  }, []);

  const fetchMainMarker = async () => {
    try {
      const url = ENDPOINT.GET_ALL_MAIN_MARKER;
      const response = await apiClient.get(url);
      setMainMarker(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <TitlePage title={"จัดการประเภทหมุด"} />

      <MainMarkerType
        mainMarker={mainMarker}
        fetchMainMarker={fetchMainMarker}
      />

      <MarkerType mainMarker={mainMarker} />
    </>
  );
};

// const MarkerTypePage = () => {
//   return (
//     <MarkerTypeContextProvider>
//       <MarkerTypeContent />
//     </MarkerTypeContextProvider>
//   );
// };

export default MarkerTypePage;
