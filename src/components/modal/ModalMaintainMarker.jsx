import React from "react";
import { Modal, Button, Row, Col,Image } from "antd";
import { renderIcon } from "@/utils/utils";
const ModalMaintainMarkerDetail = ({ visible, onCancel, marker }) => {
  if (!marker) return null;

  return (
    <>
      <Modal
        open={visible}
        onCancel={onCancel}
        key={marker._id}
        footer={() => {
          return <Button onClick={onCancel}>ปิด</Button>;
        }}
      >
        <div className="">
          <div className="space-y-4">
            <Row justify={"center"} gutter={[0, 10]}>
              <Col span={24}>
                <div className="text-2xl flex items-center justify-center gap-2 ">
                  <div>{renderIcon(marker)}</div>
                  <div>{marker?.properties?.markerInfo?.problems}</div>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <div>รายละเอียด:</div>
                  <div className="border py-0.5 px-1 rounded-md bg-gray-100">
                    {marker?.properties?.markerInfo?.description || "-"}
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <div>สถานะ: </div>
                  <span className="border py-0.5 px-1 rounded-md bg-gray-100">
                    {marker?.properties?.markerInfo?.status || "-"}
                  </span>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <p>รูปภาพ:</p>
                  <Image.PreviewGroup>
                    {marker?.properties?.markerInfo?.image?.length > 0
                      ? marker?.properties?.markerInfo?.image.map((item) => {
                        return (
                          <Image
                            key={item}
                            src={item}
                            width={200}
                            height={200}
                            alt=""
                            className=""
                          />
                        );
                      })
                      : "-"}
                  </Image.PreviewGroup>
                  {/* <div className="flex items-center gap-2">
                    {marker?.properties?.markerInfo?.image?.length > 0
                      ? marker?.properties?.markerInfo?.image.map((item) => {
                          return (
                            <img
                              key={item}
                              src={item}
                              alt=""
                              className="w-24 h-24 object-cover"
                            />
                          );
                        })
                      : "-"}
                  </div> */}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalMaintainMarkerDetail;
