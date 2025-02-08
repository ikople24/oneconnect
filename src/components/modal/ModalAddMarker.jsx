import React, { useState } from "react";
import { Modal, Input, Button, Form, Select, DatePicker, Row, Col } from "antd";

const { Option } = Select;

const ModalAddMarker = ({ visible, onCancel, handleOK, data }) => {
  const [form] = Form.useForm();

  const handleAddMarker = () => {
    form.validateFields().then((values) => {
      handleOK(values);
      form.resetFields();
    });
  };
  
  return (
    <Modal
      title="ลงทะเบียนคนเมือง"
      open={visible}
      onCancel={onCancel}
      style={{ top: 20 }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          ยกเลิก
        </Button>,
        <Button key="add" type="primary" onClick={handleAddMarker}>
          เพิ่ม
        </Button>,
      ]}
      width={{
        xs: "90%",
        sm: "80%",
        md: "90%",
        lg: "50%",
        xl: "35%",
        xxl: "35%",
      }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={8}>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            <Form.Item
              name="pinType"
              label="ประเภทข้อมูล"
              rules={[{ required: true, message: "กรุณาเลือกประเภทข้อมูล" }]}
            >
              <Select placeholder="ประเภทข้อมูล">
                {data.pintypes.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            <Form.Item
              name="idCard"
              label="เลขบัตรประชาชน (13 หลัก)"
              rules={[{ required: true, message: "กรุณากรอกเลขบัตรประชาชน" }]}
            >
              <Input placeholder="กรอกเลขบัตรประชาชน" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item
              name="firstName"
              label="ชื่อจริง"
              rules={[{ required: true, message: "กรุณากรอกชื่อจริง" }]}
            >
              <Input placeholder="กรอกชื่อจริง" />
            </Form.Item>
          </Col>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item
              name="lastName"
              label="นามสกุล"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
            >
              <Input placeholder="กรอกนามสกุล" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            <Form.Item
              name="gender"
              label="เพศ"
              rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
            >
              <Select placeholder="กรุณาเลือกเพศ">
                <Option value="Male">ชาย</Option>
                <Option value="Female">หญิง</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item
              name="birthdate"
              label="วันเกิด"
              rules={[{ required: true, message: "กรุณากรอกวันเกิด" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันเกิด"
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item
              name="age"
              label="อายุ"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
            >
              <Input placeholder="กรอกอายุ" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            <Form.Item
              name="telNumber"
              label="เบอร์โทรศัพท์"
              rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์" }]}
            >
              <Input placeholder="กรอกเบอร์โทรศัพท์" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            <Form.Item
              name="zone"
              label="ชุมชน"
              rules={[{ required: true, message: "กรุณากรอกชื่อชุมชน" }]}
            >
              <Input placeholder="กรอกชื่อชุมชน" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={24} xl={24} xxl={24}>
            <Form.Item
              name="placeId"
              label="รหัสเมือง"
              rules={[{ required: true, message: "กรุณากรอกรหัสเมือง" }]}
            >
              <Input placeholder="กรอกรหัสเมือง" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item
              name="latitude"
              label="ละติจูด"
              rules={[{ required: true, message: "ละติจูด" }]}
            >
              <Input placeholder=""/>
            </Form.Item>
          </Col>
          <Col span={24} sm={24} md={12} xl={12} xxl={12}>
            <Form.Item
              name="longitude"
              label="ลองจิจูด"
              rules={[{ required: true, message: "ลองจิจูด" }]}
            >
              <Input placeholder=""/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalAddMarker;
