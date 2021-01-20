import React, { useContext } from 'react';
import { Card, Divider, Typography, Space } from 'antd';
import PropTypes from 'prop-types';
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined } from '@ant-design/icons';
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
  const { cart } = state;

  const ViewProduct = () => {
    router.push(`product/${product._id}`);
  };

  return (
    <Card
      hoverable
      style={{ width: '18rem' }}
      cover={<img src={product.images[0].url} alt={product.title} className="card__img" />}
      className="card"
      actions={[
        <EyeOutlined key="view" style={{ fontSize: 18 }} onClick={ViewProduct} />,
        <HeartOutlined key="heart" style={{ fontSize: 18 }} />,
        <ShoppingCartOutlined
          key="cart"
          style={{ fontSize: 18 }}
          onClick={() => dispatch(addToCart(product, cart))}
          disabled={product.inStock === 0 ? true : false}
        />,
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
