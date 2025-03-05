import { ENDPOINT } from "@/components/endpoint";
import {
  Table,
  Space,
  message,
  Form,
  Modal,
  Input,
  Button,
  Flex,
  Select,
  App,
} from "antd";
import { name } from "dayjs/locale/th";
import { useEffect, useState } from "react";

const TableMarkerType = ({ markerType, handleDelete, handleEdit }) => {
  const columns = (onEditClick) => [
    { title: "ชื่อ", dataIndex: "name", key: "name" },
    { title: "รูปหมุด", dataIndex: "icon", key: "icon" },
    {
      title: "ประเภทหมุดหลัก",
      dataIndex: "type",
      key: "type",
      render: (_, record) => <p>{record?.type?.name}</p>,
    },

    {
      title: "จัดการ",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>แก้ไข</a>
          <a onClick={() => handleDelete(record._id)}>ลบ</a>
        </Space>
      ),
    },
  ];
  return <Table columns={columns()} dataSource={markerType} rowKey="_id" />;
};
const ModalEdit = ({
  isModalOpen,
  setIsModalOpen,
  handleEdit,
  loading,
  form,
  initialData,
  mainMarker,
}) => {
  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      form.setFieldsValue({
        name: initialData.name,
        icon: initialData.icon,
        type: initialData.type?._id,
      });
    }
  }, [form, initialData]);

  return (
    <Modal
      title="แก้ไขประเภทหมุด"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleEdit}>
        <Form.Item
          label="ชื่อประเภทหมุด"
          name="name"
          rules={[{ required: true, message: "กรุณากรอกชื่อประเภทหมุด" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="รูปหมุด" name="icon">
          <Input />
        </Form.Item>
        <Form.Item
          label="ประเภทหมุดหลัก"
          name="type"
          rules={[{ required: true, message: "กรุณาเลือกประเภทหมุด" }]}
        >
          <Select placeholder="เลือกประเภทหมุดหลัก">
            {mainMarker?.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Flex justify="end" align="middle">
            <Button type="primary" htmlType="submit" loading={loading}>
              บันทึก
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ModalCreate = ({
  mainMarker,
  isModalOpen,
  setIsModalOpen,
  handleCreate,
  loading,
  form,
}) => {
  return (
    <Modal
      title="สร้างประเภทหมุด"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleCreate}>
        <Form.Item
          label="ชื่อประเภทหมุด"
          name="name"
          rules={[{ required: true, message: "กรุณากรอกชื่อประเภทหมุด" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="รูปหมุด"
          name="icon"
          //   rules={[{ required: true, message: "กรุณากรอกชื่อประเภทหมุด" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="ประเภทหมุดหลัก"
          name="type"
          rules={[{ required: true, message: "กรุณาเลือกประเภทหมุด" }]}
        >
          <Select placeholder="เลือกประเภทหมุดหลัก">
            {mainMarker?.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Flex justify="end" align="middle">
            <Button type="primary" htmlType="submit" loading={loading}>
              บันทึก
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const MarkerType = ({ mainMarker }) => {
  const [markerType, setMarkerType] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editData, setEditData] = useState(null);
  const { message, modal } = App.useApp();
  useEffect(() => {
    fetchMarkerType();
  }, []);
  const handleCreate = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINT.CREATE_MARKER_TYPE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to create marker");

      message.success("สร้างประเภทหมุดสำเร็จ!");
      form.resetFields();
      fetchMarkerType();
      setIsModalOpen(false);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการสร้างหมุด");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (markerTypeId) => {
    modal.confirm({
      title: "ยืนยันการลบ",
      content: "คุณแน่ใจหรือว่าต้องการลบหมุดหลักนี้?",
      okText: "ใช่, ลบเลย",
      cancelText: "ยกเลิก",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${ENDPOINT.DELETE_MARKER_TYPE}/${markerTypeId}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) throw new Error("Failed to delete marker");
          message.success("ลบหมุดสำเร็จ!");
          fetchMarkerType();
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบหมุด");
        } finally {
          setLoading(false);
        }
      },
    });
  };
  const handleEdit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${ENDPOINT.EDIT_MARKER_TYPE}/${editData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to edit marker");

      message.success("แก้ไขประเภทหมุดสำเร็จ!");
      form.resetFields();
      fetchMarkerType();
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการแก้ไขหมุด");
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = (data) => {
    setEditData(data); // Set the data for editing
    setIsEditModalOpen(true); // Open the edit modal
  };

  const fetchMarkerType = async () => {
    const fetchMarkerType = await fetch(ENDPOINT.GET_ALL_MARKER_TYPE);
    const data = await fetchMarkerType.json();
    console.log(data);
    setMarkerType(data);
  };
  return (
    <>
      <div className="text-xl">ประเภทหมุด</div>
      <div className="flex justify-end my-2">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          สร้างประเภทหมุด
        </Button>
      </div>
      <TableMarkerType
        markerType={markerType}
        handleDelete={handleDelete}
        handleEdit={handleEditClick}
      />
      <ModalCreate
        mainMarker={mainMarker}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleCreate={handleCreate}
        loading={loading}
        form={form}
      />
      <ModalEdit
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        handleEdit={handleEdit}
        loading={loading}
        form={form}
        initialData={editData}
        mainMarker={mainMarker}
      />
    </>
  );
};

export default MarkerType;
