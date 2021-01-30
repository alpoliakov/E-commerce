import React, { useContext } from 'react';
import { Card, Divider, Typography, Space, Tooltip, Modal, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
  SettingTwoTone,
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/Actions';
import { deleteData } from '../../utils/fetchData';

const { Meta } = Card;
const { Text, Title } = Typography;
const { confirm } = Modal;

const ProductItem = ({ product, handleCheck }) => {
  const TitleProduct = (
    <Title className="card__title" level={4}>
      {product.title}
    </Title>
  );
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const showDeleteProductConfirm = (data, id, name) => {
    confirm({
      title: <Title level={4}>Remove Product?</Title>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <Space direction="vertical">
          <Text>Are you sure you want to remove the following product?</Text>
          <Title level={5} style={{ textTransform: 'capitalize' }}>
            {name}
          </Title>
        </Space>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatch({ type: 'NOTIFY', payload: { loading: true } });
        deleteData(`product/${id}`, auth.token).then((res) => {
          if (res.err) {
            return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
          }

          dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
          return router.push('/');
        });
      },
      onCancel() {},
    });
  };

  const ViewProduct = () => {
    router.push(`product/${product._id}`);
  };

  const EditProduct = () => {
    router.push(`create/${product._id}`);
  };

  return (
    <Card
      hoverable
      style={{ width: '18rem' }}
      cover={[
        <img key="img" src={product.images[0].url} alt={product.title} className="card__img" />,
        !auth.user || auth.user.role !== 'admin' ? null : (
          <Checkbox
            key="check"
            checked={product.checked}
            onChange={() => handleCheck(product._id)}
            style={{ position: 'absolute', top: 0, left: 2, height: 20, width: 20 }}></Checkbox>
        ),
      ]}
      className="card"
      actions={[
        <Tooltip key="view" title="View details" color="volcano">
          <EyeOutlined style={{ fontSize: 20 }} onClick={ViewProduct} />
        </Tooltip>,
        !auth.user || auth.user.role !== 'admin' ? (
          <HeartOutlined key="heart" style={{ fontSize: 20 }} />
        ) : (
          <Tooltip title="Edit item" color="volcano">
            <SettingTwoTone style={{ fontSize: 20 }} onClick={EditProduct} />
          </Tooltip>
        ),
        !auth.user || auth.user.role !== 'admin' ? (
          <ShoppingCartOutlined
            key="cart"
            style={{ fontSize: 20 }}
            onClick={() => dispatch(addToCart(product, cart))}
            disabled={product.inStock === 0 ? true : false}
          />
        ) : (
          <Tooltip title="Remove item" color="volcano">
            <DeleteTwoTone
              key="delete"
              style={{ fontSize: 20 }}
              onClick={() => showDeleteProductConfirm(product, product._id, product.title)}
              twoToneColor="#eb2f96"
            />
          </Tooltip>
        ),
      ]}>
      <Meta className="card__text" title={TitleProduct} description={product.description} />
      <Divider />
      <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text type="danger">{product.price} USD</Text>
        <Text type="danger">
          {product.inStock > 0 ? `In Stock: ${product.inStock}` : `Out Stock`}
        </Text>
      </Space>
    </Card>
  );
};

ProductItem.propTypes = {
  product: PropTypes.object,
  products: PropTypes.array,
  handleCheck: PropTypes.func,
};

export default ProductItem;
