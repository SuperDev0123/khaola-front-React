import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  SettingOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/selectors";

const { Sider } = Layout;
const { SubMenu } = Menu;

function Navigation() {
  const [collapsed, setCollapsed] = useState(false);
  const { current } = useSelector(selectAuth);

  useEffect(() => {
    if(window.innerWidth < 768){
      setCollapsed(true)
    }
  })

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const providerMenus = () => {
    return (
      <>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to="/clients" />
          Client List
        </Menu.Item>
      </>
    )
  }

  const adminMenus = () => {
    return (
      <>
        <Menu.Item key="1" icon={<ShoppingCartOutlined />}>
          <Link to="/providers" />
          Client List
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/clients" />
          Client List
        </Menu.Item>
      </>
    )
  }

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{
          zIndex: 1000,
        }}
      >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          {current.role == 'provider' ? providerMenus() : ''}
          {current.role == 'admin' ? adminMenus() : ''}
          {/* <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/" />
            Home Page
          </Menu.Item>
          <Menu.Item key="2" icon={<CustomerServiceOutlined />}>
            <Link to="/customer">Customer</Link>
          </Menu.Item>
          <Menu.Item key="24" icon={<UserOutlined />}>
            <Link to="/selectcustomer">Custom Select Customer</Link>
          </Menu.Item>
          <Menu.Item key="21" icon={<FileTextOutlined />}>
            <Link to="/lead" />
            Lead
          </Menu.Item>
          <Menu.Item key="3" icon={<FileSyncOutlined />}>
            <Link to="/product" />
            Product
          </Menu.Item>
          <Menu.Item key="31" icon={<TeamOutlined />}>
            <Link to="/admin" />
            Admins Management
          </Menu.Item>

          <Menu.Item key="32" icon={<SettingOutlined />}>
            <Link to="/settings" />
            Settings
          </Menu.Item> */}
        </Menu>
      </Sider>
    </>
  );
}
export default Navigation;
