import { Table, Space, Tooltip, Button, App } from "antd";
import { useState } from "react";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { ENDPOINT } from "../endpoint";
export default function TableEditMarkerAdmin({
  markers,
  isAdmin,
  setSelectedRecord,
  setModalMarkerIsVisible,
  modalMarkerIsVisible,
  fetchData,
}) {
  const { message, modal } = App.useApp();
  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 100,
      render: (text, record, index) => {
        const { current, pageSize } = tableParams.pagination;
        const realIndex = (current - 1) * pageSize + index + 1; // คำนวณลำดับจริง
        return realIndex;
      },
    },
    {
      title: "ชื่อข้อมูล",
      dataIndex: ["properties", "name"],
      key: "name",
      align: "center",
      width: 200,
    },
    {
      title: "ประเภทข้อมูล",
      dataIndex: ["properties", "markerType"],
      key: "markerType",
      align: "center",
      width: 200,
    },
    {
      title: "แอคชั่น",
      key: "action",
      align: "center",
      width: 200,
      render: (text, record) => (
        <Space>
          <Tooltip title="ดูรายละเอียด" open={false}>
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="ลบ" open={false}>
            <Button
              color="danger"
              variant="solid"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const deleteMarker = async (id) => {
    console.log("ID", id);
    return await fetch(`${ENDPOINT.DELETE_MARKER_ADMIN}${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleDelete = (record) => {
    console.log("ลบ", record);
    modal.confirm({
      title: "คุณแน่ใจไหม?",
      content: "หากคุณลบข้อมูลนี้จะไม่สามารถกู้คืนได้",
      okText: "ใช่",
      cancelText: "ยกเลิก",
      async onOk() {
        const { _id } = record;
        try {
          await deleteMarker(_id);

          message.success({
            content: "ลบข้อมูลสำเร็จ!",
            duration: 3,
          });
          await fetchData();
        } catch (error) {
          message.error({
            content: error.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
            duration: 3,
          });
        }
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    });
  };
  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination, // Update pagination
    });
  };
  const handleView = (record) => {
    console.log("ดูรายละเอียด", record);
    setSelectedRecord(record);
    setModalMarkerIsVisible(!modalMarkerIsVisible);
  };
  return (
    <>
      {isAdmin ? (
        <div className="mt-3 max-w-7xl mx-auto shadow-lg rounded-lg">
          <Table
            columns={columns}
            dataSource={markers}
            rowKey="_id"
            scroll={{ x: "max-content" }}
            onChange={handleTableChange}
          />
        </div>
      ) : null}
    </>
  );
}
