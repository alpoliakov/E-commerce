import React, { useContext } from 'react';
import { PageHeader, Tabs, Badge, Dropdown, Button, Divider, Menu } from 'antd';
import { ShoppingCartOutlined, UserAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DataContext } from '../store/GlobalState';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

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
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart } = state;
  const router = useRouter();
  // const user = Object.keys(auth).length === 0 ? Profile : SignIn;

  const handleLogout = () => {
    Cookie.remove('refreshtoken', { path: 'api/auth/accessToken' });
    localStorage.removeItem('firstLogin');
    dispatch({ type: 'AUTH', payload: {} });
    dispatch({ type: 'NOTIFY', payload: { success: 'Logged out!' } });
    router.push('/');
    setTimeout(() => {
      dispatch({ type: 'NOTIFY', payload: {} });
    }, 1000);
  };

  // eslint-disable-next-line no-unused-vars
  const adminRouter = () => {
    return (
      <>
        <Menu.Item key="users" align="center">
          <Link href="/users">
            <a>Users</a>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="create" align="center">
          <Link href="/create">
            <a>Products</a>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="categories" align="center">
          <Link href="/categories">
            <a>Categories</a>
          </Link>
        </Menu.Item>
      </>
    );
  };

  const menu = (
    <Menu>
      <Menu.Item key="edit" align="center">
        <Link href="/profile">
          <a>Profile</a>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      {auth.user && auth.user.role === 'admin' && adminRouter()}
      <Menu.Divider />
      <Menu.Item key="logout" align="center">
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
      title={Home}
      subTitle="This is a subtitle"
      extra={[
        <Badge count={cart.length} key="1">
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
