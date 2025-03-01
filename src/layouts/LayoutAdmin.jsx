import React from "react";
import { Flex, Layout, Menu } from "antd";
import Navbar from "@/components/nevbar/Navbar";
import { Outlet } from "react-router";
import {
  PushpinFilled,
  TeamOutlined,
  ApartmentOutlined
} from "@ant-design/icons";
const { Header, Footer, Sider, Content } = Layout;

const items = [
  {
    icon: <PushpinFilled />,
    label: "หมุด",
  },
  {
    icon:<ApartmentOutlined /> ,
    label: "เมือง",
  },
  {
    icon: <TeamOutlined />,
    label: "ผู้ใช้งาน",
  },
];
const LayoutAdmin = () => (
  <Layout className="h-screen">
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
    {/* <Footer style={footerStyle}>Footer</Footer> */}
  </Layout>
);
export default LayoutAdmin;
