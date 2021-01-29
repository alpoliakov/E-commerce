import React, { useContext } from 'react';
import { Card, Divider, Typography, Space } from 'antd';
import PropTypes from 'prop-types';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
  SettingTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/Actions';

const { Meta } = Card;
const { Text, Title } = Typography;

const ProductItem = ({ product }) => {
  const TitleProduct = (
    <Title className="card__title" level={4}>
      {product.title}
    </Title>
  );
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

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
      cover={<img src={product.images[0].url} alt={product.title} className="card__img" />}
      className="card"
      actions={[
        <EyeOutlined key="view" style={{ fontSize: 20 }} onClick={ViewProduct} />,
        !auth.user || auth.user.role !== 'admin' ? (
          <HeartOutlined key="heart" style={{ fontSize: 20 }} />
        ) : (
          <SettingTwoTone style={{ fontSize: 20 }} onClick={EditProduct} />
        ),
        !auth.user || auth.user.role !== 'admin' ? (
          <ShoppingCartOutlined
            key="cart"
            style={{ fontSize: 20 }}
            onClick={() => dispatch(addToCart(product, cart))}
            disabled={product.inStock === 0 ? true : false}
          />
        ) : (
          <DeleteTwoTone key="delete" style={{ fontSize: 20 }} twoToneColor="#eb2f96" />
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
};

export default ProductItem;
