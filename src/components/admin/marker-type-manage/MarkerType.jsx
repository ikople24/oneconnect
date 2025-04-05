import { ENDPOINT } from "@/components/endpoint";
import {
  useMarkerType,
  useMarkerTypeCreate,
  useMarkerTypeDelete,
  useMarkerTypeEdit,
} from "@/hooks/user-markers";
import ApiClient from "@/utils/apiClient";
import { UploadOutlined } from "@ant-design/icons";
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
  Upload,
  Spin,
} from "antd";
import { name } from "dayjs/locale/th";
import { useEffect, useState } from "react";

const TableMarkerType = ({ markerType, handleDelete, handleEdit }) => {
  const columns = (onEditClick) => [
    { title: "ชื่อ", dataIndex: "name", key: "name" },
    {
      title: "รูปหมุด",
      dataIndex: "icon",
      key: "icon",
      render: (text, record) =>
        record.icon ? (
          <img src={record.icon} width={25} height={25} alt="icon" />
        ) : null,
    },
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
  beforeUpload,
  handleFileChange,
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
        <Form.Item
          label="รูปหมุด"
          name="icon"
          rules={[{ required: true, message: "กรุณาอัปโหลดรูปหมุด" }]}
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            onChange={(info) => handleFileChange(info)}
            value={initialData?.icon}
          >
            <div className="flex items-center gap-5">
              {initialData?.icon && (
                <img
                  src={initialData?.icon}
                  width={25}
                  height={25}
                  alt="icon"
                />
              )}
              <Button icon={<UploadOutlined />}>อัพโหลดรูปหมุด</Button>
            </div>
          </Upload>
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
  beforeUpload,
  handleFileChange,
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
          rules={[{ required: true, message: "กรุณาอัปโหลดรูปหมุด" }]}
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            onChange={(info) => handleFileChange(info)}
          >
            <Button icon={<UploadOutlined />}>อัพโหลดรูปหมุด</Button>
          </Upload>
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
  // const [markerType, setMarkerType] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editData, setEditData] = useState(null);
  const { message, modal } = App.useApp();
  const [file, setFile] = useState(null);
  const apiClient = new ApiClient();
  const { data: markerType, isLoading: isLoadingMarkerType } = useMarkerType();
  const { mutate: createMarkerType, isLoading: isLoadingCreateMarkerType } =
    useMarkerTypeCreate();
  const { mutate: editMarkerType, isLoading: isLoadingEditMarkerType } =
    useMarkerTypeEdit();
  const { mutate: deleteMarkerType, isLoading: isLoadingDeleteMarkerType } =
    useMarkerTypeDelete();
  if (isLoadingMarkerType) {
    return <Spin />;
  }

  // useEffect(() => {
  //   fetchMarkerType();
  // }, []);

  const handleCreate = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("icon", file);
      formData.append("type", values.type);
      createMarkerType(formData);
      message.success("สร้างประเภทหมุดสำเร็จ!");
      form.resetFields();
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
          deleteMarkerType(markerTypeId);
          message.success("ลบหมุดสำเร็จ!");
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
      if (!file) {
        message.error("กรุณาอัปโหลดรูปหมุด");
        return;
      }
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("icon", file);
      formData.append("type", values.type);
      editMarkerType({ markerTypeId: editData._id, body: formData });
      message.success("แก้ไขประเภทหมุดสำเร็จ!");
      form.resetFields();
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

  const beforeUpload = (file) => {
    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";

    if (!isImage) {
      message.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPEG หรือ PNG)");
    }

    return !isImage;
  };

  const handleFileChange = (info) => {
    const file = info.file;
    console.log("file", file);
    setFile(file);
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
        beforeUpload={beforeUpload}
        handleFileChange={handleFileChange}
      />
      <ModalEdit
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        handleEdit={handleEdit}
        loading={loading}
        form={form}
        initialData={editData}
        mainMarker={mainMarker}
        beforeUpload={beforeUpload}
        handleFileChange={handleFileChange}
      />
    </>
  );
};

export default MarkerType;
