import React from "react";
import { Row, Col, Modal, Divider, Button } from "antd";

const ModalMarkerDetail = ({ visible, onCancel, data }) => {
  if (!data) return null;

  return (
    <>
      <Modal
        open={visible}
        onCancel={onCancel}
        key={data._id}
        footer={() => {
          return (
            <Button onClick={onCancel}>
              ปิด
            </Button>
          )
        }}
      >
        <div className="space-y-4 px-4">
          <Row gutter={24}>
            <Col span={24}>
              <p className="text-2xl font-bold">รายละเอียดข้อมูล</p>
            </Col>
          </Row>
          <Divider />
          <div className="space-y-2">
            <Row gutter={24}>
              <Col span={12}>
                <p className="text-base">ชื่อข้อมูล</p>
              </Col>
              <Col span={12}>
                <p>{data.properties.name ? data.properties.name : "N/A"}</p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <p className="text-base">ชื่อประเภทข้อมูล</p>
              </Col>
              <Col span={12}>
                <p>
                  {data.properties.markerType
                    ? data.properties.markerType
                    : "N/A"}
                </p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <p className="text-base">พิกัด</p>
              </Col>
              <Col span={12}>
                <p>
                  {data.geometry ? data.geometry.coordinates[0] : "N/A"},{" "}
                  {data.geometry ? data.geometry.coordinates[1] : "N/A"}
                </p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <p className="text-base">ชื่อ-นามสกุล</p>
              </Col>
              <Col span={12}>
                <p>
                  {data.properties.users?.firstName
                    ? data.properties.users?.firstName
                    : "N/A"}{" "}
                  {data.properties.users?.lastName
                    ? data.properties.users?.lastName
                    : "N/A"}
                </p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <p className="text-base">เพศ</p>
              </Col>
              <Col span={12}>
                <p>
                  {data.properties.users?.gender
                    ? data.properties.users?.gender
                    : "N/A"}
                </p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <p className="text-base">วันเดือนปีเกิด</p>
              </Col>
              <Col span={12}>
                <p>
                  {data.properties.users?.birthdate
                    ? data.properties.users?.birthdate
                    : "N/A"}
                </p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <p className="text-base">อายุ</p>
              </Col>
              <Col span={12}>
                <p>
                  {data.properties.users?.age
                    ? data.properties.users?.age
                    : "N/A"}
                </p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <p className="text-base">เบอร์โทรศัพท์</p>
              </Col>
              <Col span={12}>
                <p>
                  {data.properties.users?.telNumber
                    ? data.properties.users?.telNumber
                    : "N/A"}
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalMarkerDetail;
