import React, { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button, Divider, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import valid from '../../utils/validation';
import { DataContext } from '../../store/GlobalState';
import { postData } from '../../utils/fetchData';
import { useRouter } from 'next/router';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Register = () => {
  const [form] = Form.useForm();
  const initialState = { name: '', email: '', password: '', confirm: '' };
  const [userData, setUserData] = useState(initialState);
  const { name, email, password, confirm } = userData;
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
    const errMsg = valid(name, email, password);

    if (errMsg) {
      return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
    }

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    const res = await postData('auth/register', userData);

    if (res.err) {
      return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
    }

    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) {
      router.push('/');
      dispatch({ type: 'NOTIFY', payload: {} });
    }
  }, [auth]);

  return (
    <div style={{ width: '470px' }}>
      <Head>
        <title>Register</title>
      </Head>
      <Form
        {...formItemLayout}
        initialValues={{ remember: true }}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError>
        <Form.Item
          name="name"
          label={
            <span>
              Name&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}>
          <Input name="name" value={name} onChange={handleChangeInput} />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
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
          <Input name="email" value={email} onChange={handleChangeInput} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback>
          <Input.Password name="password" value={password} onChange={handleChangeInput} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
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
          <Input.Password name="confirm" value={confirm} onChange={handleChangeInput} />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                // eslint-disable-next-line no-undef
                value ? Promise.resolve() : Promise.reject('Should accept agreement'),
            },
          ]}
          {...tailFormItemLayout}>
          <Checkbox>
            I have read the <a>agreement</a>
          </Checkbox>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
          <Divider type="vertical" />
          Or{' '}
          <Link href="/signin">
            <a>Login now!</a>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
