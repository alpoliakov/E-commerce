import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from 'antd';
import PaypalBtn from './paypalBtn';

const { Title } = Typography;

const CartPayment = ({ orderDetail }) => {
  return (
    <>
      {orderDetail.map((order, index) => (
        <div key={index + 2}>
          <Card
            title={
              <Title mark level={3}>
                Total: {order.total}
              </Title>
            }
            style={{ marginTop: 16 }}>
            {order.paid ? (
              <Title type="success" level={5}>{`Paid ${order.dateOfPayment}`}</Title>
            ) : (
              <PaypalBtn order={order} />
            )}
          </Card>
        </div>
      ))}
    </>
  );
};

CartPayment.propTypes = {
  orderDetail: PropTypes.array,
};

export default CartPayment;
