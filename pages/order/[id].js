import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { useRouter } from 'next/router';
import Link from 'next/link';
// eslint-disable-next-line no-unused-vars
import { Row, Typography, Button, Space, Col, Divider, Card, Alert, Image } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DetailOrder = () => {
  // eslint-disable-next-line no-unused-vars
  const { state, dispatch } = useContext(DataContext);
  // eslint-disable-next-line no-unused-vars
  const { orders, auth } = state;

  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArray = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArray);
    console.log(orderDetail);
  }, [orders]);

  return (
    <div style={{ width: '100%', marginTop: 40 }}>
      <Head>
        <title>Detail Order</title>
      </Head>
      <Row justify="center" align="center" gutter={[50, 30]}>
        <Col xs={24} sm={24} md={20} xl={14} xxl={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => router.back()}>
              <RollbackOutlined /> Go Back
            </Button>
            {orderDetail.map((order, index) => (
              <div key={index + 1}>
                <Card title={<Title level={4}>Order #{order._id}</Title>} style={{ marginTop: 16 }}>
                  <Card type="inner" title={<Title level={5}>Shipping</Title>}>
                    <Space direction="vertical" style={{ fontSize: '16px' }}>
                      <Text>
                        Name: <strong>{order.user.name}</strong>
                      </Text>
                      <Text>
                        Email: <strong>{order.user.email}</strong>
                      </Text>
                      <Text>
                        Address: <strong>{order.address}</strong>
                      </Text>
                      <Text>
                        Mobile: <strong>{order.mobile}</strong>
                      </Text>
                    </Space>
                  </Card>
                  {order.delivered ? (
                    <Alert message="Delivered" type="success" style={{ marginTop: 16 }} />
                  ) : (
                    <Alert message="Not delivered" type="error" style={{ marginTop: 16 }} />
                  )}
                  <Card
                    type="inner"
                    title={<Title level={5}>Order items</Title>}
                    style={{ marginTop: 16 }}>
                    <Space direction="vertical" style={{ fontSize: '16px', width: '100%' }}>
                      {order.cart.map((item) => (
                        <Space
                          key={index + 1}
                          style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Space>
                            <Space style={{ width: 100, marginRight: 30 }}>
                              <Image
                                className="img__detail_product"
                                src={item.images[0].url}
                                style={{ minWidth: 80, height: 80 }}
                              />
                            </Space>
                            <Space>
                              <Title level={4} style={{ textTransform: 'capitalize' }}>
                                <Link href={`/product/${item._id}`}>
                                  <a>{item.title}</a>
                                </Link>
                              </Title>
                            </Space>
                          </Space>
                          <Space align="flex-end">
                            <Title level={5} type="danger">
                              {item.quantity} x {item.price} = ${item.quantity * item.price}
                            </Title>
                          </Space>
                        </Space>
                      ))}
                    </Space>
                  </Card>
                </Card>
              </div>
            ))}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default DetailOrder;
