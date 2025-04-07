import { Card, Flex, Switch } from "antd";

import CardBox from "@/components/ui/Card";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import { usePlaceSummaryMarker } from "@/hooks/user-places";
import { useGlobalMapContext } from "@/context/MapContext";
export default function MapLayerTwoSidebar({
}) {
  const { placeSelected, setEnabledMarkers } = useGlobalMapContext();
  const {
    data: summaryMarker,
    isLoading: isLoadingPlaceSummary,
    isError: isErrorPlaceSummary,
  } = usePlaceSummaryMarker(placeSelected?._id);
  if(isLoadingPlaceSummary) return <div>Loading...</div>
  const handleToggle = (_id, checked) => {
    if (checked) {
      setEnabledMarkers((prev) => [...prev, _id]);
    } else {
      setEnabledMarkers((prev) => prev.filter((id) => id !== _id));
    }
  };
  const markerPlaceSummary = () => {
    return summaryMarker.filter((marker) => {
      return marker.mainType === MainMarkerTypeEnum.PLACES;
    });
  };

  const markerOtherPlaceSummary = () => {
    return summaryMarker.filter((marker) => {
      return marker.mainType != MainMarkerTypeEnum.PLACES;
    });
  };
  const summary = markerOtherPlaceSummary();
  const summaryPlace = markerPlaceSummary();

  return (
    <Flex vertical gap={10}>
      <CardBox
        title="ข้อมูลพื้นฐาน"
        backgroundColor={"#0FA4AF"}
        fontColor={"white"}
      >
        <Flex gap={20} className="mx-5 my-1 font-semibold">
          <div>
            <li>ประชากร</li>
            <li>ครัวเรือน</li>
            {summaryPlace.map((item, index) => (
              <div key={index}>
                <li>{item.name}</li>
              </div>
            ))}
          </div>
          <div>
            <p>{placeSelected?.population} คน</p>
            <p>{placeSelected?.household} ครัวเรือน</p>
            {summaryPlace.map((item, index) => (
              <p key={index}>{item.count} ที่</p>
            ))}
          </div>
        </Flex>
      </CardBox>
      <CardBox
        title={"ข้อมูลคนเมือง"}
        // backgroundColor={"#0FA4AF"}
        fontColor={"#0FA4AF"}
        borderColor={"#0FA4AF"}
      >
        <Flex gap={20} className="mx-5 my-1 font-semibold" justify="center">
          <div>
            {summary.map((item, index) => (
              <p key={index}>{item.name}</p>
            ))}
          </div>
          <div>
            {summary.map((item, index) => (
              <p key={index}>{item.count} คน</p>
            ))}
          </div>
          <div>
            {summary.map((item, index) => (
              <p key={index}>
                <Switch
                  defaultChecked
                  onChange={(checked) => handleToggle(item._id, checked)}
                />
              </p>
            ))}
          </div>
        </Flex>
      </CardBox>
    </Flex>
  );
}
