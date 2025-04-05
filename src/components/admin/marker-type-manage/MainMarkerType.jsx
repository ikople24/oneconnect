import {
  useMainMarkerType,
  useMainMarkerTypeCreate,
  useMainMarkerTypeDelete,
  useMainMarkerTypeEdit,
} from "@/hooks/user-markers";
import ApiClient from "@/utils/apiClient";
import {
  Table,
  Space,
  Form,
  Modal,
  Input,
  Button,
  Flex,
  App,
  Spin,
} from "antd";
import { useEffect, useState } from "react";

const TableMainMarker = ({ mainMarker, handleDelete, handleEdit }) => {
  const columns = () => [
    { title: "ชื่อ", dataIndex: "name", key: "name" },

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
  return <Table columns={columns()} dataSource={mainMarker} rowKey="_id" />;
};

const ModalCreate = ({
  isModalOpen,
  setIsModalOpen,
  handleCreate,
  loading,
  form,
}) => {
  return (
    <Modal
      title="สร้างประเภทหมุดหลัก"
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
const ModalEdit = ({
  isModalOpen,
  setIsModalOpen,
  handleEdit,
  loading,
  form,
  initialData,
}) => {
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [form, initialData]);

  return (
    <Modal
      title="แก้ไขประเภทหมุดหลัก"
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

const MainMarkerType = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mainMarkerTypeSelected, setMainMarkerTypeSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const { data: mainMarker, isLoading: isLoadingMainMarkerType } =
    useMainMarkerType();
  const { mutate: createMainMarker } = useMainMarkerTypeCreate();
  const { mutate: updateMainMarker } = useMainMarkerTypeEdit();
  const { mutate: deleteMainMarker } = useMainMarkerTypeDelete();
  if (isLoadingMainMarkerType) return <Spin />;

  const handleCreate = async (values) => {
    setLoading(true);
    try {
      const body = values;
      createMainMarker(body);
      message.success("สร้างประเภทหมุดหลักสำเร็จ!");
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการสร้างหมุดหลัก");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (values) => {
    setLoading(true);
    try {
      const body = values;
      updateMainMarker({ mainMarkerId: mainMarkerTypeSelected._id, body });
      message.success("แก้ไขประเภทหมุดหลักสำเร็จ!");
      form.resetFields();
      setMainMarkerTypeSelected(null);
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการแก้ไขหมุดหลัก");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mainMarkerId) => {
    modal.confirm({
      title: "ยืนยันการลบ",
      content: "คุณแน่ใจหรือว่าต้องการลบหมุดหลักนี้?",
      okText: "ใช่, ลบเลย",
      cancelText: "ยกเลิก",
      onOk: async () => {
        setLoading(true);
        try {
          deleteMainMarker(mainMarkerId);
          message.success("ลบหมุดหลักสำเร็จ!");
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบหมุดหลัก");
        } finally {
          setLoading(false);
        }
      },
    });
  };
  const handleEditClick = (record) => {
    setIsEditModalOpen(true);
    setMainMarkerTypeSelected(record);
  };
  return (
    <>
      <div className="text-xl">ประเภทหมุดหลัก</div>
      <div className="flex justify-end my-2">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          สร้างประเภทหมุดหลัก
        </Button>
      </div>
      <TableMainMarker
        mainMarker={mainMarker}
        handleDelete={handleDelete}
        handleEdit={handleEditClick}
      />
      <ModalCreate
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
        initialData={mainMarkerTypeSelected}
      />
    </>
  );
};

export default MainMarkerType;
