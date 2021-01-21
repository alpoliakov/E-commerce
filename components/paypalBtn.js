import React, { useEffect, useRef, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import { patchData } from '../utils/fetchData';
import { DataContext } from '../store/GlobalState';
import PropTypes from 'prop-types';
import { updateItem } from '../store/Actions';

// eslint-disable-next-line react/prop-types,no-unused-vars
const PaypalBtn = ({ order }) => {
  const refPaypalBtn = useRef();
  const { state, dispatch } = useContext(DataContext);
  const { auth, orders } = state;

  useEffect(() => {
    // eslint-disable-next-line no-undef
    paypal
      .Buttons({
        createOrder: function (data, actions) {
          // This function sets up the details of the transaction, including the amount and line item details.
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: order.total,
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          // This function captures the funds from the transaction.
          return actions.order.capture().then(function (details) {
            dispatch({ type: 'NOTIFY', payload: { loading: true } });
            // eslint-disable-next-line react/prop-types
            patchData(`order/${order._id}`, null, auth.token).then((res) => {
              if (res.err) {
                return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
              }

              dispatch(
                updateItem(
                  orders,
                  order._id,
                  {
                    ...order,
                    paid: true,
                    dateOfPayment: new Date().toISOString(),
                  },
                  'ADD_ORDERS',
                ),
              );

              return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
            });
            // This function shows a transaction success message to your buyer.
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        },
      })
      .render(refPaypalBtn.current);
  }, []);

  return <div ref={refPaypalBtn}></div>;
};

PaypalBtn.propTypes = {
  order: PropTypes.object,
};

export default PaypalBtn;
