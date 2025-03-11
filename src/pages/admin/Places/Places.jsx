import { ENDPOINT } from "@/components/endpoint";
import TitlePage from "@/components/ui/Admin/TitlePage";
import { useGlobalContext } from "@/context/Context";
import Role from "@/enum/role.enum";
import { useUser } from "@clerk/clerk-react";
import { Select, Table, Space, Form, Button, Modal, App, Flex } from "antd";
import { useContext, useEffect, useState } from "react";
const PlaceDropdown = ({ places, setPlaceSelected, placeSelected, role }) => {
  return (
    <Select
      placeholder="เลือกเมือง"
      style={{ width: 200, marginBottom: 20 }}
      onChange={(value) => setPlaceSelected(value)}
      value={placeSelected}
      disabled={role === Role.ADMIN}
    >
      {places.map((place) => (
        <Select.Option key={place._id} value={place._id}>
          {place.municipalityName}
        </Select.Option>
      ))}
    </Select>
  );
};

const PlaceMarkerTypeTable = ({
  placeMarkerType,
  handleEdit,
  handleDelete,
}) => {
  const columns = () => [
    { title: "ชื่อ", dataIndex: "name", key: "name" },

    {
      title: "จัดการ",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleDelete(record._id)}>ลบ</a>
        </Space>
      ),
    },
  ];
  return (
    <Table columns={columns()} dataSource={placeMarkerType} rowKey="_id" />
  );
};
const ModalCreate = ({
  markerType,
  isModalOpen,
  setIsModalOpen,
  handleCreate,
  loading,
  form,
}) => {
  return (
    <Modal
      title="เชื่อมโยงประเภทหมุดเมือง"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleCreate}>
        <Form.Item
          label="ประเภทหมุด"
          name="type"
          rules={[{ required: true, message: "กรุณาเลือกประเภทหมุด" }]}
        >
          <Select placeholder="เลือกประเภทหมุด">
            {markerType?.map((item) => (
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
const Places = () => {
  const [placeMarkerType, setPlaceMarkerType] = useState([]);
  const [markerType, setMarkerType] = useState([]);
  const [placeSelected, setPlaceSelected] = useState();
  const [places, setPlaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const { role, userPlaceId } = useGlobalContext();

  useEffect(() => {
    console.log(role, userPlaceId);
    if (role && role === Role.ADMIN && userPlaceId) {
      console.log(userPlaceId);
      fetchPlaceList();
      setPlaceSelected(userPlaceId);
      return;
    }
    fetchPlaceList();
  }, [role, userPlaceId]);

  useEffect(() => {
    if (placeSelected) {
      fetchMarkerType();
      fetchPlaceMarkerType();
    }
  }, [placeSelected]);

  const fetchPlaceList = async () => {
    try {
      const response = await fetch(ENDPOINT.GET_ALL_PLACE);
      const data = await response.json();
      console.log(data.data);
      setPlaces(data.data || []);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
  const fetchMarkerType = async () => {
    const fetchMarkerType = await fetch(
      `${ENDPOINT.GET_ALL_MARKER_TYPE}?placeId=${placeSelected || ""}`
    );
    const data = await fetchMarkerType.json();
    console.log(data);
    setMarkerType(data);
  };

  const fetchPlaceMarkerType = async () => {
    try {
      const response = await fetch(
        `${ENDPOINT.GET_PLACE_MARKER_TYPE}/${placeSelected}`
      );
      const data = await response.json();
      console.log(data);
      setPlaceMarkerType(data || []);
    } catch (error) {
      console.error("Error fetching place marker types:", error);
    }
  };
  const handleCreate = async (values) => {
    setLoading(true);
    console.log(values);
    const markerTypes = {
      markerTypes: [values.type],
    };
    try {
      const response = await fetch(
        `${ENDPOINT.ADD_PLACE_MARKER_TYPE}/${placeSelected}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(markerTypes),
        }
      );

      if (!response.ok) throw new Error("Failed to create marker");

      message.success("สร้างประเภทหมุดสำเร็จ!");
      form.resetFields();
      fetchPlaceMarkerType();
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
      title: "ยืนยันการยกเลิกการเชื่อมหมุด",
      content: "คุณแน่ใจหรือว่าต้องการยกเลิกการเชื่อมหมุดนี้?",
      okText: "ใช่, ยกเลิกการเชื่อมหมุด",
      cancelText: "ยกเลิก",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${ENDPOINT.REMOVE_PLACE_MARKER_TYPE}/${placeSelected}`,
            {
              method: "PATCH",
              body: JSON.stringify({ markerTypes: markerTypeId }),
              headers: { "Content-Type": "application/json" },
            }
          );
          if (!response.ok) throw new Error("Failed to delete marker");
          message.success("ยกเลิกการเชื่อมหมุดสำเร็จ!");
          fetchPlaceMarkerType();
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการยกเลิกการเชื่อม");
        } finally {
          setLoading(false);
        }
      },
    });
  };
  return (
    <>
      <TitlePage title={"จัดการหมุดเมือง"} />

      <div className="flex justify-between my-2">
        <PlaceDropdown
          places={places}
          setPlaceSelected={setPlaceSelected}
          placeSelected={placeSelected}
          role={role}
        />

        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={!placeSelected}
        >
          เชื่อมประเภทหมุด
        </Button>
      </div>
      <PlaceMarkerTypeTable
        placeMarkerType={placeMarkerType}
        handleDelete={handleDelete}
      />
      <ModalCreate
        markerType={markerType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleCreate={handleCreate}
        loading={loading}
        form={form}
      />
    </>
  );
};

export default Places;
