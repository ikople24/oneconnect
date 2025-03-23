import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Spin } from "antd";
import { ENDPOINT } from "@/components/endpoint"; // Assuming you have an endpoint for fetching roles
import ApiClient from "@/utils/apiClient";

const { Option } = Select;

const UserEditModal = ({ visible, onCancel, onSubmit, user }) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]); // State to store roles
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state while fetching roles
  const apiClient = new ApiClient();

  useEffect(() => {
    if (visible) {
      fetchRoles();
      fetchPlaces();
    }

    if (user) {
      form.setFieldsValue({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role?._id || "", // Set the role if available in user
        places: user.places?._id || "",
      });
    }
  }, [user, visible]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const url = ENDPOINT.GET_ALL_ROLE;
      const response = await apiClient.get(url);
      setRoles(response || []); // Assuming data contains the roles array
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const url = ENDPOINT.GET_ALL_PLACE;
      const response = await apiClient.get(url);
      setPlaces(response.data || []); // Assuming data contains the roles array
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values); // Pass the form values to onSubmit handler
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="แก้ไขข้อมูลผู้ใช้"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading} // Disable OK button while loading
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="อีเมลล์"
          name="email"
          //   rules={[{ required: true, message: "กรุณากรอกอีเมลล์!" }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          //   rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้!" }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="ชื่อ"
          name="firstName"
          rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="นามสกุล"
          name="lastName"
          rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="บทบาท"
          name="role"
          rules={[{ required: true, message: "กรุณาเลือกบทบาท!" }]}
        >
          {loading ? (
            <Spin /> // Show a loading spinner while fetching roles
          ) : (
            <Select placeholder="เลือกบทบาท" allowClear>
              {roles.map((role) => (
                <Option key={role._id} value={role._id}>
                  {role.roleTH}{" "}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label="สถานที่่"
          name="places"
          rules={[{ required: true, message: "กรุณาเลือกสถานที่!" }]}
        >
          {loading ? (
            <Spin />
          ) : (
            <Select placeholder="เลือกบทบาท" allowClear>
              {places.map((place) => (
                <Option key={place._id} value={place._id}>
                  {place.municipalityName}{" "}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
