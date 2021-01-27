import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import {
  Result,
  Button,
  Table,
  Row,
  Col,
  Typography,
  Space,
  Image,
  Tooltip,
  Form,
  Input,
  Card,
  Divider,
  Modal,
} from 'antd';
import {
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { increase, decrease, remove } from '../../store/Actions';
import { getData, postData } from '../../utils/fetchData';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

const Cart = () => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, orders } = state;

  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [callback, setCallback] = useState(false);

  const { confirm } = Modal;
  const router = useRouter();

  const showDeleteConfirm = (data, id, title) => {
    confirm({
      title: <Title level={4}>Remove Product?</Title>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <Space direction="vertical">
          <Text>Are you sure you want to remove the following product from the cart?</Text>
          <Title level={5} style={{ textTransform: 'capitalize' }}>
            {title}
          </Title>
        </Space>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatch(remove(cart, id, 'ADD_CART'));
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'name',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Space>
          <Space style={{ width: 100 }}>
            <Image
              className="img__detail_product"
              src={record.image}
              style={{ minWidth: 80, height: 80 }}
            />
          </Space>
          <Space direction="vertical" style={{ minWidth: 200 }}>
            <Title level={5} style={{ textTransform: 'capitalize' }}>
              <Link href={`/product/${record.key}`}>
                <a>{text}</a>
              </Link>
            </Title>
            <Text type="danger">
              {record.inStock > 0 ? `In Stock: ${record.inStock}` : `Out Stock`}
            </Text>
            <Text level={5} type="danger">
              {record.inStock > 0 ? `$ ${record.money}` : `Not Available`}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Total amount (USD)',
      className: 'column-money',
      key: 'total_amount',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (record) => {
        return (
          <>
            <Text dataIndex="total_amount">{record.money * record.quantity}</Text>
          </>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      justify: 'center',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button
            onClick={() => dispatch(decrease(cart, record.key))}
            disabled={record.quantity === 1 ? true : false}>
            <MinusOutlined />
          </Button>
          <Text>{text}</Text>
          <Button
            onClick={() => dispatch(increase(cart, record.key))}
            disabled={record.quantity === record.inStock ? true : false}>
            <PlusOutlined />
          </Button>
        </Space>
      ),
    },
    {
      title: 'Remove',
      key: 'action',
      align: 'center',
      // eslint-disable-next-line react/display-name
      render: (record) => (
        <Space size="middle">
          <a>
            <Tooltip title="remove item" color="volcano">
              <DeleteTwoTone
                className="trash"
                onClick={() => showDeleteConfirm(cart, record.key, record.name)}
              />
            </Tooltip>
          </a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(res);
    };

    const getData = () => {
      const fixedData = [];
      cart.forEach((item) => {
        fixedData.push({
          key: item._id,
          name: item.title,
          image: item.images[0].url,
          inStock: item.inStock,
          money: item.price,
          quantity: item.quantity,
        });
      });

      setData(fixedData);
    };

    getTotal();
    getData();
  }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem('__next__cart01__app'));

    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`);
          const { _id, title, images, price, inStock, sold } = res.product;

          if (inStock > 0) {
            newArr.push({
              _id,
              title,
              images,
              price,
              inStock,
              sold,
              quantity: item.quantity > inStock ? 1 : item.quantity,
            });
          }
        }

        dispatch({ type: 'ADD_CART', payload: newArr });
      };

      updateCart();
    }
  }, [callback]);

  const handlePayment = async () => {
    if (!address || !mobile) {
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Please add your address and mobile.' },
      });
    }

    let newCart = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`);
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item);
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback);
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'The product is out of stock or the quantity is insufficient.' },
      });
    }

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    postData('order', { address, mobile, cart, total }, auth.token).then((res) => {
      if (res.err) {
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      }

      dispatch({ type: 'ADD_CART', payload: [] });

      const newOrder = {
        ...res.newOrder,
        user: auth.user,
      };

      dispatch({ type: 'ADD_ORDERS', payload: [...orders, newOrder] });
      dispatch({ type: 'NOTIFY', payload: { success: res.msg } });

      return router.push(`/order/${res.newOrder._id}`);
    });
  };

  if (!cart.length) {
    return (
      <div>
        <Head>
          <title>Cart Page</title>
        </Head>
        <Result
          icon={<ShoppingCartOutlined twoToneColor="#eb2f96" />}
          title="Sorry, but your cart is empty!"
          extra={
            <Link href="/">
              <Button type="primary">Start shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', marginTop: 40 }}>
      <Head>
        <title>Cart Page</title>
      </Head>
      <Row justify="center" align="center" gutter={[50, 30]}>
        <Col xs={24} sm={24} md={20} xl={14} xxl={12}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            title={() => <Title level={2}>Shopping Cart</Title>}
          />
        </Col>
        <Col xs={24} sm={24} md={20} xl={8} xxl={6}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={2}>Shipping</Title>
            <Card style={{ width: '100%' }}>
              <Form layout="vertical">
                <Form.Item label="Address" required tooltip="Your address.">
                  <Input
                    placeholder="Your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Mobile" required tooltip="Your mobile.">
                  <Input
                    placeholder="Your mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </Form.Item>
              </Form>
              <Divider />
              <Title type="danger" level={3} align="right">
                Total: {total} USD
              </Title>
              <Divider />
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link href={auth.user ? '#' : '/signin'}>
                <Button type="primary" block onClick={handlePayment}>
                  Proceed with payment
                </Button>
              </Link>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
