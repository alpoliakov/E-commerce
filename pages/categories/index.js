import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { Card, Row, Space, Typography, Form, Input, Button, Divider, Modal, Tooltip } from 'antd';
import { EditTwoTone, DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteData, postData, putData } from '../../utils/fetchData';
import { remove, updateItem } from '../../store/Actions';

const { Title, Text } = Typography;

const Categories = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [form] = Form.useForm();
  const { confirm } = Modal;

  const { state, dispatch } = useContext(DataContext);
  // eslint-disable-next-line no-unused-vars
  const { categories, auth } = state;

  const createCategory = async () => {
    if (auth.user.role !== 'admin') {
      return dispatch({ type: 'NOTIFY', payload: { error: 'Authentication is not valid!' } });
    }

    if (!name) {
      return dispatch({ type: 'NOTIFY', payload: { error: 'Name can not be left blank.' } });
    }

    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    let res;

    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token);
      if (res.err) {
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      }

      dispatch(updateItem(categories, id, res.category, 'ADD_CATEGORIES'));
    } else {
      res = await postData('categories', { name }, auth.token);
      if (res.err) {
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      }

      dispatch({ type: 'ADD_CATEGORIES', payload: [...categories, res.newCategory] });
    }

    setName('');
    setId('');
    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
  };

  const handleEditCategory = (category) => {
    setId(category._id);
    setName(category.name);
  };

  const showDeleteCategoryConfirm = (data, id, title) => {
    confirm({
      title: <Title level={4}>Remove Category?</Title>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <Space direction="vertical">
          <Text>Are you sure you want to remove the following category?</Text>
          <Title level={5} style={{ textTransform: 'capitalize' }}>
            {title}
          </Title>
        </Space>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteData(`categories/${id}`, auth.token).then((res) => {
          if (res.err) {
            return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
          }

          return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
        });

        dispatch(remove(data, id, 'ADD_CATEGORIES'));
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      name: name,
    });
  }, [name]);

  return (
    <div style={{ width: '100%', marginTop: 20 }}>
      <Head>
        <title>Categories</title>
      </Head>
      <Row justify="center" align="center" gutter={50}>
        <Space direction="vertical" style={{ width: '420px' }}>
          <Title level={2} className="text-uppercase">
            {id ? 'Update Category' : 'Create Category'}
          </Title>
          <Card style={{ width: '100%' }} hoverable={true}>
            <Form name="add_category" form={form}>
              <Form.Item name="name">
                <Input
                  name="name"
                  placeholder="Add a new category"
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <Divider />
              <Form.Item>
                <Button type="primary" htmlType="submit" block onClick={createCategory}>
                  {id ? 'Update' : 'Create'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Title level={2} className="text-uppercase" style={{ marginTop: 20 }}>
            Categories
          </Title>
          {categories.map((category) => (
            <Card
              size="small"
              hoverable={true}
              key={category._id}
              style={{ width: '100%', marginBottom: 20 }}
              align="center"
              actions={[
                <Tooltip key="edit" title="edit category" color="volcano">
                  <EditTwoTone
                    style={{ fontSize: 20 }}
                    onClick={() => handleEditCategory(category)}
                  />
                </Tooltip>,
                <Tooltip key="delete" title="remove category" color="volcano">
                  <DeleteTwoTone
                    twoToneColor="#eb2f96"
                    style={{ fontSize: 20 }}
                    onClick={() =>
                      showDeleteCategoryConfirm(categories, category._id, category.name)
                    }
                  />
                </Tooltip>,
              ]}>
              <Title level={4}>{category.name}</Title>
            </Card>
          ))}
        </Space>
      </Row>
    </div>
  );
};

export default Categories;
