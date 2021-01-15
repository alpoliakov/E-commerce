import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Form, Input, Button, Checkbox, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { DataContext } from '../../store/GlobalState';
import { postData } from '../../utils/fetchData';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

const SignIn = () => {
  const initialState = { email: '', password: '' };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const router = useRouter();

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    const res = await postData('auth/login', userData);

    if (res.err) {
      return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
    }

    dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    dispatch({ type: 'NOTIFY', payload: {} });

    dispatch({
      type: 'AUTH',
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });

    Cookie.set('refreshtoken', res.refresh_token, {
      path: 'api/auth/accessToken',
      expires: 3,
    });

    localStorage.setItem('firstLogin', true);
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) {
      router.push('/');
      dispatch({ type: 'NOTIFY', payload: {} });
    }
  }, [auth]);

  return (
    <div style={{ width: '300px' }}>
      <Head>
        <title>Sign In</title>
      </Head>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}>
          <Input
            name="email"
            value={email}
            onChange={handleChangeInput}
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input
            name="password"
            value={password}
            onChange={handleChangeInput}
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link href="/message">
            <a className="login-form-forgot">Forgot password</a>
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: '100%' }}>
            Log in
          </Button>
          <Divider />
          Or{' '}
          <Link href="/register">
            <a>register now!</a>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
