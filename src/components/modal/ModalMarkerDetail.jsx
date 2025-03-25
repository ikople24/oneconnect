import React, { useMemo } from "react";
import { Row, Col, Modal, Divider, Button } from "antd";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import {
  convertToThaiFullDateWithTime,
  convertToThaiLocalTimeRange,
} from "@/utils/date";
import { genderFormat } from "@/utils/utils";

const renderIcon = (marker) => {
  const iconUrl = marker?.properties?.markerType?.icon;
  if (!iconUrl) return null;

  return <img width={25} height={25} className="text-center" src={iconUrl} />;
};

const ModalPlaceDetail = ({ marker }) => {
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
              <div>{marker?.properties.markerInfo?.name}</div>
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

const ModalPersonDetail = ({ marker }) => {
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
                {marker?.properties?.markerInfo?.data?.birthdate}
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

const ModalMarkerDetail = ({ visible, onCancel, data }) => {
  if (!data) return null;

  const markerType = useMemo(() => {
    switch (data.properties.markerType.type.name) {
      case MainMarkerTypeEnum.PLACES:
        return <ModalPlaceDetail marker={data} />;
      case MainMarkerTypeEnum.PERSON:
        return <ModalPersonDetail marker={data} />;
      default:
        return null;
    }
  }, [data]);

  return (
    <>
      <Modal
        open={visible}
        onCancel={onCancel}
        key={data._id}
        footer={() => {
          return <Button onClick={onCancel}>ปิด</Button>;
        }}
      >
        {markerType}
      </Modal>
    </>
  );
};

export default ModalMarkerDetail;
