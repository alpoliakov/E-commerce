import React, { useContext } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { Col, Modal, Row, Space, Table, Tag, Tooltip, Typography } from 'antd';
import Link from 'next/link';
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { remove } from '../../store/Actions';
import { deleteData } from '../../utils/fetchData';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Users = () => {
  const { state, dispatch } = useContext(DataContext);
  const { users, auth } = state;

  const showDeleteUserConfirm = (data, id, name) => {
    confirm({
      title: <Title level={4}>Remove User?</Title>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <Space direction="vertical">
          <Text>Are you sure you want to remove the following user?</Text>
          <Title level={5} style={{ textTransform: 'capitalize' }}>
            {name}
          </Title>
        </Space>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteData(`user/${id}`, auth.token).then((res) => {
          if (res.err) {
            return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
          }

          return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
        });

        dispatch(remove(data, id, 'ADD_USERS'));
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      dataIndex: 'index',
      key: 'index',
      align: 'center',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      // eslint-disable-next-line react/display-name
      render: (text) => (
        <Link href={`/user/${text}`}>
          <a>{text}</a>
        </Link>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (role, records) => {
        return role === 'admin' ? (
          records.root ? (
            <Tag color="green">admin root</Tag>
          ) : (
            <Tag color="green">admin</Tag>
          )
        ) : (
          <Tag color="volcano">user</Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space size="middle">
          <Link
            href={
              (auth.user.root && auth.user.email) !== record.email
                ? `/edit_user/${record.id}`
                : '#!'
            }>
            <a>
              <Tooltip title="edit user" color="volcano">
                <EditTwoTone style={{ fontSize: 20 }} />
              </Tooltip>
            </a>
          </Link>
          {(auth.user.root && auth.user.email) !== record.email ? (
            <a>
              <Tooltip title="remove user" color="volcano">
                <DeleteTwoTone
                  className="trash"
                  onClick={() => showDeleteUserConfirm(users, record.id, record.name)}
                />
              </Tooltip>
            </a>
          ) : (
            <a>
              <Tooltip title="action is impossible" color="volcano">
                <DeleteTwoTone className="trash" twoToneColor="#456" />
              </Tooltip>
            </a>
          )}
        </Space>
      ),
    },
  ];

  const getUsersData = () => {
    return users.map((user, index) => ({
      index: index + 1,
      key: user._id,
      name: user.name,
      id: user._id,
      email: user.email,
      role: user.role,
      root: user.root,
    }));
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div style={{ width: '100%', marginTop: 40 }}>
      <Head>
        <title>Users</title>
      </Head>
      <Row justify="center" align="center" gutter={[50, 30]}>
        <Col xs={24} sm={24} md={20} xl={14} xxl={12}>
          <Table
            columns={columns}
            dataSource={getUsersData()}
            pagination={false}
            title={() => <Title level={2}>Users</Title>}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Users;
