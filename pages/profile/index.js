import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import { Card, Col, Row, Space, Typography, Form, Input, Button, Divider, Table, Tag } from 'antd';
import valid from '../../utils/validation';
import { patchData } from '../../utils/fetchData';
import Link from 'next/link';

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();

  const initialState = {
    name: '',
    password: '',
    confirm: '',
  };

  const [data, setData] = useState(initialState);
  const { name, password, confirm } = data;

  const { state, dispatch } = useContext(DataContext);
  // eslint-disable-next-line no-unused-vars
  const { auth, notify, orders } = state;

  useEffect(() => {
    if (auth.user) {
      setData({ ...data, name: auth.user.name });
    }
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    setData({ ...data, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  if (!auth.user) {
    return null;
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log(password);
    if (password) {
      const errMsg = valid(name, auth.user.email, password);
      if (errMsg) {
        return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
      }

      updatePassword();
    }

    if (name !== auth.user.name) {
      updateInfo();
    }
  };

  const updatePassword = () => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    patchData('user/resetPassword', { password }, auth.token).then((res) => {
      if (res.err) {
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      }

      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  const updateInfo = () => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    patchData('user', { name }, auth.token).then((res) => {
      if (res.err) {
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      }

      dispatch({ type: 'AUTH', payload: { token: auth.token, user: res.user } });

      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  const getOrdersData = () => {
    return orders.map((order) => ({
      key: order._id,
      id: order._id,
      date: order.createdAt,
      total: `$${order.total}`,
      delivered: order.delivered,
      paid: order.paid,
    }));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      // eslint-disable-next-line react/display-name
      render: (text) => (
        <Link href={`/order/${text}`}>
          <a>{text}</a>
        </Link>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
    },
    {
      title: 'Delivered',
      dataIndex: 'delivered',
      key: 'delivered',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (delivered) => {
        return delivered ? <Tag color="green">delivered</Tag> : <Tag color="volcano">pending</Tag>;
      },
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (paid) => {
        return paid ? <Tag color="green">paid</Tag> : <Tag color="volcano">not paid</Tag>;
      },
    },
  ];

  return (
    <div style={{ width: '100%', marginTop: 40 }}>
      <Head>
        <title>Profile Page</title>
      </Head>
      <Row justify="center" align="center" gutter={[50, 30]}>
        <Col xs={24} sm={22} md={18} xl={8} xxl={6}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2} className="text-uppercase">
              {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}
            </Title>
            <Card style={{ width: '100%' }}>
              <Form form={form} layout="vertical">
                <Form.Item
                  name="name"
                  label="Name"
                  tooltip="Your name."
                  rules={[
                    {
                      required: true,
                      message: 'Please input your name!',
                    },
                  ]}>
                  <Input name="name" placeholder="Your name" value={name} onChange={handleChange} />
                </Form.Item>

                <Form.Item name="email" label="E-mail" initialValue={auth.user.email}>
                  <Input name="email" disabled />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  tooltip="Enter a new password."
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please input your new password!',
                    },
                  ]}>
                  <Input
                    name="password"
                    placeholder="New password"
                    value={password}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm password"
                  tooltip="Confirm a new password."
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your new password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          // eslint-disable-next-line no-undef
                          return Promise.resolve();
                        }
                        // eslint-disable-next-line no-undef
                        return Promise.reject('The two passwords that you entered do not match!');
                      },
                    }),
                  ]}>
                  <Input
                    name="confirm"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={handleChange}
                  />
                </Form.Item>

                <Divider />

                <Form.Item>
                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    disabled={notify.loading}
                    onClick={handleUpdateProfile}>
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Space>
        </Col>
        <Col xs={24} sm={22} md={18} xl={14} xxl={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2} className="text-uppercase">
              Orders
            </Title>
            <Table columns={columns} dataSource={getOrdersData()} pagination={false} bordered />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
