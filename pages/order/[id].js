import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { useRouter } from 'next/router';
import { Row, Button, Space, Col } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import OrderDetail from '../../components/OrderDetail';
import CartPayment from '../../components/CartPayment';

const DetailOrder = () => {
  const { state, dispatch } = useContext(DataContext);
  const { orders, auth } = state;

  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArray = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArray);
    console.log(orderDetail);
  }, [orders]);

  if (!auth.user) {
    return null;
  }

  return (
    <div style={{ width: '100%', marginTop: 40 }}>
      <Head>
        <title>Detail Order</title>
      </Head>
      <Row justify="center" align="flex-start" gutter={[50, 30]}>
        <Button type="primary" onClick={() => router.back()}>
          <RollbackOutlined /> Go Back
        </Button>
      </Row>
      <Row justify="center" align="center" gutter={[50, 30]}>
        <Col xs={24} sm={22} md={18} xl={14} xxl={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <OrderDetail orderDetail={orderDetail} state={state} dispatch={dispatch} />
          </Space>
        </Col>
        {auth.user.role !== 'admin' && (
          <Col xs={24} sm={22} md={18} xl={8} xxl={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <CartPayment orderDetail={orderDetail} />
            </Space>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DetailOrder;
