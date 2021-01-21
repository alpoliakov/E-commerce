import { Alert, Card, Image, Space, Typography } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const { Title, Text } = Typography;

const OrderDetail = ({ orderDetail }) => {
  return (
    <>
      {orderDetail.map((order, index) => (
        <div key={index + 1}>
          <Card
            title={
              <Title mark level={3}>
                Order #{order._id}
              </Title>
            }
            style={{ marginTop: 16 }}>
            <Card
              type="inner"
              title={
                <Title mark level={4}>
                  Shipping
                </Title>
              }>
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
            <Card
              type="inner"
              title={
                <Title mark level={4}>
                  Delivery
                </Title>
              }
              style={{ marginTop: 16 }}>
              {order.delivered ? (
                <Alert message="Delivered" type="success" style={{ marginTop: 16 }} />
              ) : (
                <Alert message="Not delivered" type="error" style={{ marginTop: 16 }} />
              )}
            </Card>
            <Card
              type="inner"
              title={
                <Title mark level={4}>
                  Payment
                </Title>
              }
              style={{ marginTop: 16 }}>
              {order.paid ? (
                <Alert
                  message={`Paid on ${order.dateOfPayment}`}
                  type="success"
                  style={{ marginTop: 16 }}
                />
              ) : (
                <Alert message="Not paid" type="error" style={{ marginTop: 16 }} />
              )}
            </Card>
            <Card
              type="inner"
              title={
                <Title mark level={4}>
                  Order items
                </Title>
              }
              style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ fontSize: '16px', width: '100%' }}>
                {order.cart.map((item) => (
                  <Space key={index + 1} style={{ width: '100%', justifyContent: 'space-between' }}>
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
    </>
  );
};

OrderDetail.propTypes = {
  orderDetail: PropTypes.array,
};

export default OrderDetail;
