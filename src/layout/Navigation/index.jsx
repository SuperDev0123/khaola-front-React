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
  ShoppingCartOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/selectors";

const { Sider } = Layout;
const { SubMenu } = Menu;

function Navigation() {
  const [collapsed, setCollapsed] = useState(false);
  const { current } = useSelector(selectAuth);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true)
    }
  })

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const Menus = {
    admin: [
      {
        icon: <ShoppingCartOutlined />,
        link: '/providers',
        content: 'Provider List'
      },
      {
        icon: <UserOutlined />,
        link: '/clients',
        content: 'Client List'
      },
      {
        icon: <CalculatorOutlined />,
        link: '/reserves',
        content: 'Video Call Requests'
      }
    ],
    provider: [
      {
        icon: <UserOutlined />,
        link: '/clients',
        content: 'Client List'
      }
    ]
  }
  const defaultSelectedKeys = Menus[current.role].findIndex(elem => {
    return elem.link == window.location.pathname
  })
  console.log(defaultSelectedKeys)
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
        <Menu theme="dark" defaultSelectedKeys={[`${defaultSelectedKeys < 0 ? 1 : (defaultSelectedKeys + 1)}`]} mode="inline">
          {Menus[current.role].map((elem, index) => {
            return (
              <Menu.Item key={index + 1} icon={elem.icon}>
                <Link to={elem.link} />
                {elem.content}
              </Menu.Item>
            )
          })}
        </Menu>
      </Sider>
    </>
  );
}
export default Navigation;
