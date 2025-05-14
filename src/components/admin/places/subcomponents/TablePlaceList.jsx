import { Table, Space, Button } from "antd";
import { useAllPlace } from "@/hooks/user-places";
export const TablePlaceList = ({ handleEditSelected, handleDelete }) => {
  const { data } = useAllPlace();
  const columns = () => [
    { title: "ชื่อ", dataIndex: "municipalityName", key: "municipalityName" },
    {
      title: "จัดการ",
      key: "action",
      width: 200,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="middle" onClick={() => handleEditSelected(record)}>
            <p>แก้ไข</p>
          </Button>
          <Button size="middle" onClick={() => handleDelete(record._id)}>
            <p>ลบ</p>
          </Button>
        </div>
      ),
    },
  ];
  return <Table columns={columns()} dataSource={data} rowKey="_id" />;
};
