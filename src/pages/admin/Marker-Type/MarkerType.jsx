import MainMarkerType from "@/components/admin/marker-type-manage/MainMarkerType";
import MarkerType from "@/components/admin/marker-type-manage/MarkerType";
import { ENDPOINT } from "@/components/endpoint";
import TitlePage from "@/components/ui/Admin/TitlePage";
import { useEffect, useState } from "react";

const MarkerTypePage = () => {
  const [mainMarker, setMainMarker] = useState([]);
  useEffect(() => {
    fetchMainMarker();
  }, []);

  const fetchMainMarker = async () => {
    try {
      const fetchMainMarker = await fetch(ENDPOINT.GET_ALL_MAIN_MARKER);
      const data = await fetchMainMarker.json();
      console.log(data);
      setMainMarker(data);
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

export default MarkerTypePage;
