import { SwitchMode } from "../admin/SwitchMode";
import { Flex } from "antd";
import olderIcon from "@/assets/markerIcon/older_person.png";
import philosopherIcon from "@/assets/markerIcon/philosopher.png";
import leaderIcon from "@/assets/markerIcon/community_leader.png";
import rescueIcon from "@/assets/markerIcon/rescue.png";
export default function MapLayerTwoSidebar({ place, isAdmin, setIsAdmin }) {
  const mapIconMarker = (type) => {
    switch (type) {
      case "ผู้สูงอายุ":
        return olderIcon;
      case "ปราชญ์ชุมชน":
        return philosopherIcon;
      case "ผู้นำชุมชน":
        return leaderIcon;
      case "กู้ภัย":
        return rescueIcon;
      default:
        return false;
    }
  };

  return (
    <>
      <SwitchMode isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <h2 className="text-xl font-bold text-gray-700">ข้อมูลสรุป</h2>

      <p className="text-gray-600 text-lg py-1">
        จำนวนประชากร:{" "}
        <span className="font-semibold text-blue-600">
          {place.population} คน
        </span>
      </p>
      <p className="text-gray-600 text-lg py-1">
        จำนวนครัวเรือน:{" "}
        <span className="font-semibold text-blue-600">
          {place.household} ครัวเรือน
        </span>
      </p>

      {place?.summary.map((summary, idx) => {
        return (
          <div key={idx} className="text-gray-600 text-lg py-1">
            <Flex gap={10} align="center" wrap>
              <div>
                {mapIconMarker(summary.name) !== false ? (
                  <img
                    className="w-10 h-10"
                    src={mapIconMarker(summary.name)}
                  />
                ) : (
                  summary.name
                )}
              </div>
              <span className="font-semibold text-blue-600">
                {summary.count} หมุด
              </span>
            </Flex>
          </div>
        );
      })}

      {/* <h2 className="text-xl font-bold text-gray-700 mt-4">
            ข้อมูลตามชุมชน
          </h2> */}
      <ul className="space-y-3 mt-2">
        {/* {communities.map((community) => (
              <li
                key={community.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-300"
              >
                <span className="font-semibold text-gray-800">
                  {community.name}
                </span>
                :
                <span className="text-blue-600 font-medium">
                  {" "}
                  {community.elderly_count} คน
                </span>
              </li>
            ))} */}
      </ul>
    </>
  );
}
