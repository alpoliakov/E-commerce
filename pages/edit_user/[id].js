import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, Divider, Form, Input, Row, Space, Typography, Checkbox } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { patchData } from '../../utils/fetchData';
import { updateItem } from '../../store/Actions';

const { Title } = Typography;

const EditUser = () => {
  const [form] = Form.useForm();

  const { state, dispatch } = useContext(DataContext);
  const { users, auth } = state;

  const router = useRouter();
  const { id } = router.query;

  const [checkAdmin, setCheckAdmin] = useState(false);
  const [editUser, setEditUser] = useState([]);
  const [num, setNum] = useState(0);

  useEffect(() => {
    users.forEach((user) => {
      if (user._id === id) {
        setCheckAdmin(user.role === 'admin' ? true : false);
        setEditUser(user);
        form.setFieldsValue({
          name: user.name,
          email: user.email,
        });
      }
    });
  }, [users]);

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };

  const handleSubmit = () => {
    let role = checkAdmin ? 'admin' : 'user';

    if (num % 2 !== 0) {
      dispatch({ type: 'NOTIFY', payload: { loading: true } });
      patchData(`user/${editUser._id}`, { role }, auth.token).then((res) => {
        if (res.err) {
          return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
        }

        dispatch(updateItem(users, editUser._id, { ...editUser, role }, 'ADD_USERS'));
        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
      });
    }
  };

  return (
    <div>
      <Head>
        <title>Edit User</title>
      </Head>
      <Row justify="center" align="flex-start" gutter={[50, 30]}>
        <Button type="primary" onClick={() => router.back()}>
          <RollbackOutlined /> Go Back
        </Button>
      </Row>
      <Row justify="center" align="center" gutter={50}>
        <Space direction="vertical" style={{ width: '320px' }}>
          <Title level={2} className="text-uppercase">
            Edit User: <em>{editUser.name}</em>
          </Title>
          <Card style={{ width: '100%' }}>
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Name" tooltip="User name">
                <Input name="name" disabled />
              </Form.Item>

              <Form.Item name="email" label="E-mail" tooltip="User email">
                <Input name="email" disabled />
              </Form.Item>

              <Form.Item name="isAdmin">
                <Checkbox checked={checkAdmin} onChange={handleCheck}>
                  is Admin
                </Checkbox>
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button type="primary" block htmlType="submit" onClick={handleSubmit}>
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Row>
    </div>
  );
};

export default EditUser;
