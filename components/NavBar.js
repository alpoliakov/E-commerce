import React, { useContext } from 'react';
import { PageHeader, Tabs, Badge, Dropdown, Button, Divider, Menu } from 'antd';
import { ShoppingCartOutlined, UserAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DataContext } from '../store/GlobalState';
import Cookie from 'js-cookie';

const { TabPane } = Tabs;

const Home = (
  <Link href="/">
    <a>Home</a>
  </Link>
);

const SignIn = () => {
  return (
    <Link href="/signin" key="2">
      <a style={{ fontSize: 21, textAlign: 'center' }}>
        <UserAddOutlined /> Sign in
      </a>
    </Link>
  );
};

export default function NavBar() {
  // eslint-disable-next-line no-unused-vars
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  // const user = Object.keys(auth).length === 0 ? Profile : SignIn;

  const handleLogout = () => {
    Cookie.remove('refreshtoken', { path: 'api/auth/accessToken' });
    localStorage.removeItem('firstLogin');
    dispatch({ type: 'AUTH', payload: {} });
    dispatch({ type: 'NOTIFY', payload: { success: 'Logged out!' } });
    setTimeout(() => {
      dispatch({ type: 'NOTIFY', payload: {} });
    }, 2000);
  };

  const menu = (
    <Menu>
      <Menu.Item key="view">
        <Link href="/view">
          <a>View</a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="edit">
        <Link href="/edit-profile">
          <a>Edit</a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <a type="button" onClick={handleLogout}>
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );

  // eslint-disable-next-line react/prop-types
  const Profile = ({ name }) => {
    return (
      <Dropdown overlay={menu} placement="bottomCenter" key="3">
        <Button
          type="link"
          style={{ fontSize: 21, textAlign: 'center' }}
          onClick={(e) => e.preventDefault()}>
          <UserSwitchOutlined /> Hi, {name}
        </Button>
      </Dropdown>
    );
  };

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
        Object.keys(auth).length === 0 ? (
          <SignIn key="signin" />
        ) : (
          <Profile key="profile" name={auth.user.name} />
        ),
      ]}
      footer={
        <Tabs defaultActiveKey="1">
          <TabPane tab="Details" key="1" />
          <TabPane tab="Rule" key="2" />
        </Tabs>
      }></PageHeader>
  );
}
