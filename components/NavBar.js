import React, { useState } from 'react';
import { PageHeader, Tabs, Badge, Dropdown, Button, Divider, Menu } from 'antd';
import { ShoppingCartOutlined, UserAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { TabPane } = Tabs;

const Home = (
  <Link href="/">
    <a>Home</a>
  </Link>
);

const menu = (
  <Menu>
    <Menu.Item key="profile">
      <Link href="/view">
        <a>View</a>
      </Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="edit">
      <Link href="/edit">
        <a>Edit</a>
      </Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout">
      <a type="button">Logout</a>
    </Menu.Item>
  </Menu>
);

const SignIn = (
  <Link href="/signin" key="2">
    <a style={{ fontSize: 21, textAlign: 'center' }}>
      <UserAddOutlined /> Sign in
    </a>
  </Link>
);

const Profile = (
  <Dropdown overlay={menu} placement="bottomCenter" key="3">
    <Button
      type="link"
      style={{ fontSize: 21, textAlign: 'center' }}
      onClick={(e) => e.preventDefault()}>
      <UserSwitchOutlined /> My Profile
    </Button>
  </Dropdown>
);

export default function NavBar() {
  // eslint-disable-next-line no-unused-vars
  const [login, setLogin] = useState(false);
  const user = login ? Profile : SignIn;

  return (
    <PageHeader
      className="site-page-header-responsive"
      style={{ position: 'sticky', zIndex: 1, width: '100%' }}
      onBack={() => window.history.back()}
      title={Home}
      subTitle="This is a subtitle"
      extra={[
        <Badge count={0} showZero key="1">
          <Link href="/cart">
            <a style={{ fontSize: 21, textAlign: 'center' }}>
              <ShoppingCartOutlined /> Cart
            </a>
          </Link>
        </Badge>,
        <Divider type="vertical" key="4" />,
        user,
      ]}
      footer={
        <Tabs defaultActiveKey="1">
          <TabPane tab="Details" key="1" />
          <TabPane tab="Rule" key="2" />
        </Tabs>
      }></PageHeader>
  );
}
