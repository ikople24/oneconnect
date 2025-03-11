import React from "react";
import { Layout, Menu } from "antd";
import Navbar from "@/components/nevbar/Navbar";
import { Outlet, useNavigate } from "react-router";
import {
  PushpinFilled,
  TeamOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "@/context/Context";
import Role from "@/enum/role.enum";

const { Sider, Content } = Layout;

const LayoutAdmin = () => {
  const navigate = useNavigate(); // Move this above the onClickMenu function
  const { role } = useGlobalContext();
  const items = [
    {
      icon: <PushpinFilled />,
      label: "ประเภทหมุด",
      onClick: () => navigate("/admin/marker-manage"), // Use `onClick` instead of `onclick`
    },
    {
      icon: <ApartmentOutlined />,
      label: "เมือง",
      onClick: () => navigate("/admin/place-manage"),
    },
    role && role !== Role.ADMIN && role === Role.SUPER_ADMIN && {
      icon: <TeamOutlined />,
      label: "ผู้ใช้งาน",
      onClick: () => navigate("/admin/user-manage"),
    },
  ].filter(Boolean);

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          style={{ backgroundColor: "#024950" }}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["4"]}
            items={items}
            style={{ backgroundColor: "#024950" }}
          />
        </Sider>
        <Content className="m-4">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
