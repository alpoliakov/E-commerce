import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import { Card, Col, Row, Space, Typography, Form, Input, Button, Divider } from 'antd';
import valid from '../../utils/validation';
import { patchData } from '../../utils/fetchData';

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
  const { auth, notify } = state;

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

  return (
    <div style={{ width: '100%', marginTop: 40 }}>
      <Head>
        <title>Profile Page</title>
      </Head>
      <Row justify="center" align="center" gutter={[50, 30]}>
        <Col xs={24} sm={24} md={20} xl={8} xxl={6}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2}>{auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}</Title>
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
        <Col xs={24} sm={24} md={20} xl={14} xxl={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2}>Orders</Title>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
