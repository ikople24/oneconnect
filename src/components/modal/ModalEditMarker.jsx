import React, { useMemo } from "react";
import {
  Form,
  TimePicker,
  Input,
  Row,
  Col,
  Modal,
  Divider,
  Button,
  Select,
} from "antd";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import {
  convertToThaiFullDateWithTime,
  convertToThaiLocalTimeRange,
} from "@/utils/date";
import { genderFormat } from "@/utils/utils";
import dayjs from "dayjs";
import { ENDPOINT } from "../endpoint";
import ApiClient from "@/utils/apiClient";
// import { ENDPOINT } from "../endpoint";

const apiClient = new ApiClient();

const renderIcon = (marker) => {
  const iconUrl = marker?.properties?.markerType?.icon;
  if (!iconUrl) return null;

  return <img width={25} height={25} className="text-center" src={iconUrl} />;
};

const ModalEditPlaceDetail = ({ form, marker, onSubmit }) => {
  if (!marker) return null;
  const { Option } = Select;
  const markerDetail = useMemo(() => {
    return {
      openingDate: marker.properties.markerInfo.data.openingDate,
      openingTime: marker?.properties.markerInfo.data.openingTime.map((time) =>
        dayjs(time)
      ),
      description: marker.properties.markerInfo.description,
      name: marker.properties.markerInfo.name,
    };
  }, [marker]);

  console.log(markerDetail);

  return (
    <React.Fragment>
      <Form form={form} name="edit-place-detail" initialValues={markerDetail}>
        <Row gutter={8}>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item
              name="name"
              label="ชื่อหมุด"
              rules={[{ required: true, message: "กรุณากรอกชื่อหมุด" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item label="ประเภทหมุด">
              <Input value={marker.properties.markerType.name} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item
              name="openingDate"
              label="วันทำการ"
              rules={[{ required: true, message: "กรุณาเลือกวันทำการ" }]}
            >
              <Select
                placeholder="e.g., ทุกวัน"
                value={marker?.properties?.openingDate}
              >
                <Option key={"ทุกวัน"} value={"ทุกวัน"}>
                  ทุกวัน
                </Option>
                <Option key={"จันทร์ - ศุกร์"} value={"จันทร์ - ศุกร์"}>
                  จันทร์ - ศุกร์
                </Option>
                <Option key={"เสาร์ - อาทิตย์"} value={"เสาร์ - อาทิตย์"}>
                  เสาร์ - อาทิตย์
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Row gutter={8}>
            <Col span={24} sm={24} md={24} xl={24} xxl={24}>
              <Form.Item
                name="openingTime"
                label="เวลาทำการ"
                rules={[{ required: true, message: "กรุณาเลือกเวลาเปิดปิด" }]}
              >
                <TimePicker.RangePicker />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            <Form.Item
              name="description"
              label="รายละเอียด"
              rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
            >
              <Input.TextArea
                rows={4}
                type=""
                placeholder="e.g., กรอกรายละเอียดพื้นที่"
                maxLength={20}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

const ModalEditPersonDetail = ({ marker, onSubmit }) => {
  // TODO: make form person edit detail
  // TODO: after that make service update backend or use old function ?
  if (!marker) return null;
  return <div className=""></div>;
};

const ModalEditMarkerDetail = ({ visible, onCancel, data }) => {
  if (!data) return null;
  // const apiClient = new ApiClient();
  const [form] = Form.useForm();
  const onSubmit = async () => {
    await form.validateFields();
    console.log(form.getFieldValue());
    const value = await form.getFieldsValue();

    try {
      const url = `${ENDPOINT.PATCH_MARKERS_ADMIN}/${data._id}`;
      const response = await apiClient.patch(url, {
        ...value,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  const markerType = useMemo(() => {
    switch (data.properties.markerType.type.name) {
      case MainMarkerTypeEnum.PLACES:
        return (
          <ModalEditPlaceDetail form={form} onSubmit={onSubmit} marker={data} />
        );
      case MainMarkerTypeEnum.PERSON:
        return (
          <ModalEditPersonDetail
            form={form}
            onSubmit={onSubmit}
            marker={data}
          />
        );
      default:
        return null;
    }
  }, [data]);

  return (
    <>
      <Modal
        open={visible || false}
        onCancel={onCancel}
        key={data._id}
        footer={() => {
          return (
            <>
              <Button type="primary" onClick={onSubmit}>
                บันทึก
              </Button>
              <Button onClick={onCancel}>ปิด</Button>
            </>
          );
        }}
      >
        <div>
          <p className="text-xl">แก้ไขข้อมูลหมุด</p>
        </div>
        <div className="my-5">{markerType}</div>
      </Modal>
    </>
  );
};

export default ModalEditMarkerDetail;
