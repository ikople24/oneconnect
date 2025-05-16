
import { Row, Col } from "antd";
import { genderFormat, renderIcon } from "@/utils/utils";
import { convertToThaiFullDateWithTime } from "@/utils/date";

export const ModalPersonDetail = ({ marker }) => {
  return (
    <div className="">
      <div className="space-y-4">
        <Row justify={"center"} gutter={[0, 10]}>
          <Col span={24}>
            <div className="text-2xl flex items-center justify-center gap-2 ">
              <div>{renderIcon(marker)}</div>
              <div>{marker?.properties.markerInfo?.name}</div>
            </div>
          </Col>
          <Col span={24}>
            <p>
              รายละเอียด:{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {marker?.properties?.markerInfo?.description || "-"}
              </span>
            </p>
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
              ชื่อ-นามสกุล :{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {marker?.properties?.markerInfo?.data?.firstName}{" "}
                {marker?.properties?.markerInfo?.data?.lastName}
              </span>
            </p>
          </Col>
          <Col span={24}>
            <p>
              เพศ:{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {genderFormat(marker?.properties?.markerInfo?.data?.gender)}
              </span>
            </p>
          </Col>
          <Col span={24}>
            <p>
              เบอร์โทรศัพท์:{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {marker?.properties?.markerInfo?.data?.telNumber}
              </span>
            </p>
          </Col>
          <Col span={24}>
            <p>
              วันเดือนปีเกิด:{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {convertToThaiFullDateWithTime(marker?.properties?.markerInfo?.data?.birthdate)}
              </span>
            </p>
          </Col>
          <Col span={24}>
            <p>
              อายุ:{" "}
              <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                {marker?.properties?.markerInfo?.data?.age}
              </span>
              ปี
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
};
