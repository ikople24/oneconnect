import { ENDPOINT } from "@/components/endpoint";
import TitlePage from "@/components/ui/Admin/TitlePage";
import { useGlobalContext } from "@/context/Context";
import Role from "@/enum/role.enum";
import { useUser } from "@clerk/clerk-react";
import {
  Select,
  Table,
  Space,
  Form,
  Button,
  Modal,
  App,
  Flex,
  Spin,
} from "antd";
import { useContext, useEffect, useState } from "react";
import CreatePlaceForm from "../../../components/Form/Place/CreatePlaceForm";
import ComponentGuard from "@/routes/ComponentGuard";
import ApiClient from "@/utils/apiClient";
import {
  useAllPlace,
  usePlaceMarkerType,
  usePlaceMarkerTypeCreate,
  usePlaceMarkerTypeDelete,
} from "@/hooks/user-places";
import { useMarkerType } from "@/hooks/user-markers";
import { MainPlaceComponent } from "@/components/admin/places/MainPlaceComponent";

const PlaceDropdown = ({ setPlaceSelected, placeSelected, role }) => {
  const { data: places, isLoading: isLoadingPlaces } = useAllPlace();
  if (isLoadingPlaces) return <Spin />;
  return (
    <Select
      placeholder="เลือกเมือง"
      style={{ width: 200, marginBottom: 20 }}
      onChange={(value) => setPlaceSelected(value)}
      value={placeSelected}
      disabled={role === Role.ADMIN}
    >
      {places?.map((place) => (
        <Select.Option key={place._id} value={place._id}>
          {place.municipalityName}
        </Select.Option>
      ))}
    </Select>
  );
};

const PlaceMarkerTypeTable = ({ handleEdit, handleDelete, placeSelected }) => {
  const { data: placeMarkerType, isLoading: isLoadingPlaceMarkerType } =
    usePlaceMarkerType(placeSelected || "");
  if (isLoadingPlaceMarkerType) return <Spin />;

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
  placeSelected,
  isModalOpen,
  setIsModalOpen,
  handleCreate,
  loading,
  form,
}) => {
  console.log("placeSelected", placeSelected);
  const { data: markerType, isLoading: isLoadingMarkerType } =
    useMarkerType(placeSelected);
  if (isLoadingMarkerType) return <Spin />;

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
  const [placeSelected, setPlaceSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const { role, userPlaceId } = useGlobalContext();
  const apiClient = new ApiClient();
  const { mutate: createPlaceMarkerType } = usePlaceMarkerTypeCreate();
  const { mutate: deletePlaceMarkerType } = usePlaceMarkerTypeDelete();

  useEffect(() => {
    if (role && role === Role.ADMIN && userPlaceId) {
      setPlaceSelected(userPlaceId);
      return;
    }
  }, [role, userPlaceId]);

  const handleCreate = async (values) => {
    setLoading(true);
    console.log(values);
    const markerTypes = {
      markerTypes: [values.type],
    };
    try {
      createPlaceMarkerType({ placeId: placeSelected, body: markerTypes });
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
      title: "ยืนยันการยกเลิกการเชื่อมหมุด",
      content: "คุณแน่ใจหรือว่าต้องการยกเลิกการเชื่อมหมุดนี้?",
      okText: "ใช่, ยกเลิกการเชื่อมหมุด",
      cancelText: "ยกเลิก",
      onOk: async () => {
        setLoading(true);
        try {
          const markerTypes = {
            markerTypes: markerTypeId,
          };
          deletePlaceMarkerType({ placeId: placeSelected, body: markerTypes });
          message.success("ยกเลิกการเชื่อมหมุดสำเร็จ!");
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
      {/* <ComponentGuard allowedRoles={[Role.SUPER_ADMIN]}>
        <CreatePlaceForm />
      </ComponentGuard> */}
      <MainPlaceComponent />
      <TitlePage title={"จัดการหมุดเมือง"} />
      <div className="flex justify-between my-2">
        <PlaceDropdown
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
        handleDelete={handleDelete}
        placeSelected={placeSelected}
      />
      <ModalCreate
        placeSelected={placeSelected}
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
