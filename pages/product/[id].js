import React, { useState, useContext } from 'react';
import Head from 'next/head';
import { getData } from '../../utils/fetchData';
import PropTypes from 'prop-types';
import { Image, Row, Col, Card, Divider, Space, Typography, Tooltip } from 'antd';
import uuid from 'react-uuid';
import {
  DeleteTwoTone,
  HeartOutlined,
  SettingTwoTone,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/Actions';
import { useRouter } from 'next/router';

const { Meta } = Card;
const { Title, Text } = Typography;

const DetailProduct = (props) => {
  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const router = useRouter();

  const isActive = (index) => {
    if (tab === index) {
      return 'img__active';
    }
    return '';
  };

  const EditProduct = () => {
    router.push(`/create/${product._id}`);
  };

  return (
    <div className="container__detail">
      <Head>
        <title>Detail Product</title>
      </Head>
      <Row justify="center" align="top" gutter={[16, 16]}>
        <Col xs={24} sm={20} md={14} xl={10} xxl={8}>
          <Image
            key={uuid()}
            className="img__detail_product"
            src={product.images[tab].url}
            alt={product.title}
            height={350}
            width="100%"
          />
          <Row wrap>
            {product.images.map((img, index) => (
              <img
                key={uuid()}
                role="presentation"
                className={`img__detail_product ${isActive(index)}`}
                src={img.url}
                alt={img.url}
                style={{ height: '80px', width: '20%', margin: '5px 10px 0 0' }}
                onClick={() => setTab(index)}
              />
            ))}
          </Row>
        </Col>
        <Col xs={24} sm={20} md={10} xl={8} xxl={6}>
          <Card
            actions={[
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
                  <DeleteTwoTone key="delete" style={{ fontSize: 20 }} twoToneColor="#eb2f96" />
                </Tooltip>
              ),
            ]}>
            <Meta
              className="card__text"
              title={
                <Title level={4} className="detail__title">
                  {product.title}
                </Title>
              }
              description={<Text>{product.description}</Text>}
            />
            <Divider />
            <Text>{product.content}</Text>
            <Divider />
            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              <Title level={5} type="danger">
                {product.price} USD
              </Title>
            </Space>
            <Divider />
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Title level={5} type="danger">
                {product.inStock > 0 ? `In Stock: ${product.inStock}` : `Out Stock`}
              </Title>
              <Title level={5} type="danger">
                Sold: {product.sold}
              </Title>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`product/${id}`);
  console.log(res);

  return {
    props: { product: res.product },
  };
}

DetailProduct.propTypes = {
  props: PropTypes.object,
  product: PropTypes.object,
};

export default DetailProduct;
