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

const ModalAddMarker = ({
  visible,
  onCancel,
  handleOK,
  data,
  place,
  pointSelected,
  zoneSelected,
  getLocation,
  isLoadingLatLng,
  isLatLngError,
  isTriggerReq,
  isAdmin,
}) => {
  console.dir(place);
  console.log(pointSelected);
  console.log(zoneSelected);
  console.log(data);
  const [form] = Form.useForm();
  const [mainTypeSelected, setMainTypeSelected] = useState();
  useEffect(() => {
    if (place && pointSelected) {
      form.setFieldsValue({
        placeId: place._id,
        zone: zoneSelected?.zoneId,
        latitude: pointSelected[0] || "", // lat
        longitude: pointSelected[1] || "", // lng
      });
    }
  }, [place, pointSelected, form]);

  const handleAddMarker = () => {
    form.validateFields().then((values) => {
      const selectedType = data.find((item) => item._id === values.markerType);
      console.log(values);

      const updatedValues = {
        ...values,
        typeName: selectedType ? selectedType.type.name : undefined,
      };

      handleOK(updatedValues); // Pass updated values
      form.resetFields();
    });
  };


  const onSelectMarkerType = (value) => {
    const selectedType = data.find((item) => item._id === value);
    const typeName = selectedType ? selectedType.type.name : undefined;

    setMainTypeSelected(typeName); // Update state (if needed)
    form.setFieldsValue({ typeName }); // Set value in the form
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
                  <Input placeholder="e.g., ตลาดน้ำ" maxLength={20} />
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
                  {data ? (
                    <Select
                      onChange={onSelectMarkerType}
                      placeholder="ประเภทข้อมูล"
                      options={data.map((type) => ({
                        label: type.name,
                        value: type._id,
                      }))}
                    />
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
                    data={data}
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
                    data={data}
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
