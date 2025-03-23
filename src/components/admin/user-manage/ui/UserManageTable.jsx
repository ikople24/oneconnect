import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { ENDPOINT } from "@/components/endpoint";
import UserEditModal from "@/components/admin/user-manage/ui/UserEditModal";
const columns = (onEditClick) => [
  { title: "username", dataIndex: "username", key: "username" },
  {
    title: "รูปภาพ",
    dataIndex: "clerkImage",
    key: "clerkImage",
    render: (url) => (
      <img
        src={url}
        alt="User"
        style={{ width: 40, height: 40, borderRadius: "50%" }}
      />
    ),
  },
  { title: "อีเมลล์", dataIndex: "email", key: "email" },

  {
    title: "ชื่อ - นามสกุล",
    dataIndex: "fullName",
    key: "fullName",
    render: (_, record) => {
      const firstName = record.firstName;
      const lastName = record.lastName;
      if (firstName && lastName) return `${firstName} ${lastName}`;
      return "-";
    },
  },

  {
    title: "บทบาท",
    dataIndex: "role",
    key: "role",
    render: (role) => <span>{role?.roleTH || "-"}</span>,
  },
  {
    title: "สถานที่",
    dataIndex: "places",
    key: "places",
    render: (places) => places?.municipalityName || "-",
  },
  {
    title: "จัดการ",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a onClick={() => onEditClick(record)}>แก้ไข</a>
        <a>ลบ</a>
      </Space>
    ),
  },
];

const UserManageTable = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(ENDPOINT.GET_ALL_USER,{credentials: 'include'});
      const data = await response.json();
      console.log(data);
      setUsers(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (updatedData) => {
    console.log("Updated user data:", updatedData);

    try {
      const response = await fetch(
        `${ENDPOINT.UPDATE_USER}/${selectedUser._id}`,
        {
          method: "PATCH", // Use PATCH method
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          credentials: 'include',
          body: JSON.stringify(updatedData), // Convert the updated data to a JSON string
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const responseData = await response.json();
      console.log("Updated user:", responseData);
      fetchUsers();

      setIsModalOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <Table
        columns={columns(handleEditClick)}
        dataSource={users}
        rowKey="_id"
      />

      <UserEditModal
        visible={isModalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />
    </>
  );
};

export default UserManageTable;
