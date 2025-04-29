import { useEffect, useMemo } from "react";
import { Form, TimePicker, Input, Row, Col, Select } from "antd";
import dayjs from "dayjs";

export const ModalEditPlaceDetail = ({ form, marker, visible }) => {
  console.log("PLACE", marker);
  if (!visible) return null;

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

  useEffect(() => {
    form.setFieldsValue(markerDetail);
  }, [markerDetail, form]);

  return (
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
            <Select placeholder="e.g., ทุกวัน">
              <Option value="ทุกวัน">ทุกวัน</Option>
              <Option value="จันทร์ - ศุกร์">จันทร์ - ศุกร์</Option>
              <Option value="เสาร์ - อาทิตย์">เสาร์ - อาทิตย์</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={24} xl={24} xxl={24}>
          <Form.Item
            name="openingTime"
            label="เวลาทำการ"
            rules={[{ required: true, message: "กรุณาเลือกเวลาเปิดปิด" }]}
          >
            <TimePicker.RangePicker />
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={24} xl={24} xxl={24}>
          <Form.Item name="description" label="รายละเอียด">
            <Input.TextArea
              className="text-black"
              rows={4}
              type="text"
              placeholder="e.g., กรอกรายละเอียดพื้นที่"
              maxLength={20}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
