import { Row, Col } from "antd";
import {
  convertToThaiFullDateWithTime,
  convertToThaiLocalTimeRange,
} from "@/utils/date";
import { renderIcon } from "@/utils/utils";

export const ModalPlaceDetail = ({ marker }) => {
  const openingTime = marker?.properties?.markerInfo?.data?.openingTime ?? [
    null,
    null,
  ];
  const [open, close] = openingTime;

  return (
    <div className="">
      <div className="space-y-4">
        <Row justify={"center"} gutter={[0, 10]}>
          <Col span={24}>
            <div className="text-2xl flex items-center justify-center gap-2 ">
              <div>{renderIcon(marker)}</div>
              <div className="break-all">
                {marker?.properties.markerInfo?.name}
              </div>
            </div>
          </Col>
          <Col span={24}>
            <p>
              ประเภท :{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {marker?.properties?.markerType?.name}
              </span>
            </p>
          </Col>

          <Col span={24}>
            <p>
              เวลาทำการ :{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {marker?.properties?.markerInfo?.data?.openingDate}
              </span>
            </p>
          </Col>
          <Col span={24}>
            <p>
              เวลาเปิด-ปิด :{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {convertToThaiLocalTimeRange(open, close)}
              </span>
            </p>
          </Col>
          <Col span={24}>
            <p>
              เวลาที่ปักหมุด :{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {convertToThaiFullDateWithTime(marker?.createdAt)}
              </span>
            </p>
          </Col>
          <Col span={24}>
            <p>
              เวลาที่แก้ไข :{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {convertToThaiFullDateWithTime(marker?.updatedAt)}
              </span>
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
};
