import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  Switch,
  ConfigProvider,
  Radio,
  Flex,
  Tag,
} from "antd";
import th_TH from "antd/lib/locale/th_TH";

import ModalAddMaker from "../Form/Person/ModalAddMarker";
import ModalAddPlace from "../Form/Place/ModalAddPlace";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { usePlaceMarkerType } from "@/hooks/user-places";

const ModalAddMarker = ({
  visible,
  onCancel,
  handleOK,
  place,
  pointSelected,
  zoneSelected,
  getLocation,
  isLoadingLatLng,
  isLatLngError,
  isTriggerReq,
  isAdmin,
}) => {
  const { data: placeMarkerType } = usePlaceMarkerType(place?._id);
  console.dir(place);
  console.log(pointSelected);
  console.log(zoneSelected);
  console.log(placeMarkerType);
  const [form] = Form.useForm();
  const [mainTypeSelected, setMainTypeSelected] = useState();
  // use for render border in marker type selected
  const [selectMarkerTypeId, setSelectMarkerTypeId] = useState(undefined);
  useEffect(() => {
    if (place && pointSelected) {
      form.setFieldsValue({
        placeId: place._id,
        zone: zoneSelected?.zoneId,
        latitude: pointSelected[0] || "", // lat
        longitude: pointSelected[1] || "", // lng
      });
      setMainTypeSelected(undefined);
      setSelectMarkerTypeId(undefined);
    }
  }, [place, pointSelected, form]);

  const handleAddMarker = () => {
    form.validateFields().then((values) => {
      console.log(values);

      const updatedValues = {
        ...values,
        typeName: mainTypeSelected,
      };

      handleOK(updatedValues); // Pass updated values
      form.resetFields();
    });
  };

  const onSelectMarkerType = (value) => {
    setSelectMarkerTypeId(value);
    const selectedType = placeMarkerType.find((item) => item._id === value);
    const typeName = selectedType ? selectedType.type.name : undefined;

    setMainTypeSelected(typeName); // Update state (if needed)
    form.setFieldsValue({ markerType: value}); 
    form.setFieldsValue({ typeName: typeName}); 
  };

  return (
    <ConfigProvider locale={th_TH}>
      <Modal
        title="ลงทะเบียนหมุด"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            ยกเลิก
          </Button>,
          isAdmin ? (
            <Button key="add" type="primary" onClick={handleAddMarker}>
              ปักหมุด
            </Button>
          ) : (
            <Button
              key="add"
              type="primary"
              onClick={handleAddMarker}
              disabled={
                (isLatLngError && isLoadingLatLng === false) ||
                isTriggerReq !== true
              }
            >
              ปักหมุด
            </Button>
          ),
        ]}
        width={{
          xs: "90%",
          sm: "80%",
          md: "90%",
          lg: "50%",
          xl: "35%",
          xxl: "35%",
        }}
        
        bodyStyle={{ overflowY: "auto", maxHeight: "calc(100vh - 40vh)" }}
      >
        <div className="p-4">
          <Form form={form} layout="vertical">
            <Row gutter={8}>
              <Col span={24} sm={24} md={24} xl={24} xxl={24}>
                <Form.Item
                  name="name"
                  label="ชื่อหมุด"
                  rules={[{ required: true, message: "กรุณากรอกชื่อของหมุด" }]}
                >
                  <Input placeholder="e.g., ตลาดน้ำ" maxLength={255} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24} sm={24} md={24} xl={24} xxl={24}>
                <Form.Item
                  name="markerType"
                  label="ประเภทหมุด"
                  rules={[
                    { required: true, message: "กรุณาเลือกประเภทของหมุด" },
                  ]}
                >
                  {placeMarkerType ? (
                    <div className="flex gap-2 flex-wrap">
                      {placeMarkerType.map((type) => (
                        <Button
                        
                        name="markerType"
                          className={`rounded-md border-gray-100   ${
                            selectMarkerTypeId === type._id
                              ? "border-green-800"
                              : ""
                          }`}
                          key={type._id}
                          onClick={() => onSelectMarkerType(type._id)}
                        >
                          {type.icon && (
                            <span>
                              <img
                                className="w-5 h-5 rounded-full"
                                src={type.icon}
                                alt={type.name}
                              />
                            </span>
                          )}
                          {type.name}
                        </Button>
                      ))}
                    </div>
                  ) : (
                
                    <span>Loading...</span>
                  )}
                 
                </Form.Item>
              </Col>
            </Row>
            {(() => {
              if (mainTypeSelected === MainMarkerTypeEnum.PERSON) {
                return (
                  <ModalAddMaker
                    form={form}
                    zoneSelected={zoneSelected}
                    place={place}
                    pointSelected={pointSelected}
                    getLocation={getLocation}
                    isLoadingLatLng={isLoadingLatLng}
                    isLatLngError={isLatLngError}
                    isTriggerReq={isTriggerReq}
                    isAdmin={isAdmin}
                  />
                );
              } else if (mainTypeSelected === MainMarkerTypeEnum.PLACES) {
                return (
                  <ModalAddPlace
                    form={form}
                    zoneSelected={zoneSelected}
                    place={place}
                    pointSelected={pointSelected}
                    getLocation={getLocation}
                    isLoadingLatLng={isLoadingLatLng}
                    isLatLngError={isLatLngError}
                    isTriggerReq={isTriggerReq}
                    isAdmin={isAdmin}
                  />
                );
              }
              return null;
            })()}
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};
<style>.radio-gap{}</style>;

export default ModalAddMarker;
