import { Card, Flex, Switch } from "antd";

import CardBox from "@/components/ui/Card";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import { usePlaceSummaryMarker } from "@/hooks/user-places";
import { useGlobalMapContext } from "@/context/MapContext";
export default function MapLayerTwoSidebar({}) {
  const { placeSelected, setEnabledMarkers } = useGlobalMapContext();
  const {
    data: summaryMarker,
    isLoading: isLoadingPlaceSummary,
    isError: isErrorPlaceSummary,
  } = usePlaceSummaryMarker(placeSelected?._id);
  if (isLoadingPlaceSummary) return <div>Loading...</div>;
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
        <div className="grid grid-cols-2 gap-4 mx-5 my-1 font-semibold items-start">
          {/* Column 1: Labels */}
          <div className="flex flex-col gap-2">
            <span>ประชากร</span>
            <span>ครัวเรือน</span>
            {summaryPlace.map((item, index) => (
              <span key={index}>{item.name}</span>
            ))}
          </div>

          {/* Column 2: Values + inline switches */}
          <div className="flex flex-col gap-2">
            <div>{placeSelected?.population} คน</div>
            <div>{placeSelected?.household} ครัวเรือน</div>
            {summaryPlace.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{item.count} ที่</span>
                {item.count > 0 && (
                  <Switch
                    defaultChecked
                    onChange={(checked) => handleToggle(item._id, checked)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardBox>
      <CardBox
        title={"ข้อมูลคนเมือง"}
        fontColor={"#0FA4AF"}
        borderColor={"#0FA4AF"}
      >
        <div className="grid grid-cols-2 gap-4 mx-5 my-1 font-semibold items-start">
          {/* Column 1: Labels */}
          <div className="flex flex-col gap-2">
            {summary.map((item, index) => (
              <p key={index}>{item.name}</p>
            ))}
          </div>

          {/* Column 2: Value + inline switch */}
          <div className="flex flex-col gap-2">
            {summary.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{item.count} คน</span>
                {item.count > 0 && (
                  <Switch
                    defaultChecked
                    onChange={(checked) => handleToggle(item._id, checked)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardBox>
    </Flex>
  );
}
