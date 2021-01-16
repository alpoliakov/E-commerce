import React, { useState } from 'react';
import Head from 'next/head';
import { getData } from '../../utils/fetchData';
import PropTypes from 'prop-types';
import { Image, Row, Col } from 'antd';

const DetailProduct = (props) => {
  const [product] = useState(props.product);

  return (
    <div className="container__detail">
      <Head>
        <title>Detail Product</title>
      </Head>
      <Row justify="center" align="top" gutter={[16, 16]}>
        <Col span={8}>
          <Image src={product.images[0].url} alt={product.title} height={350} />
          <Row wrap>
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={img.url}
                style={{ height: '80px', width: '20%', margin: '5px 10px 0 0' }}
              />
            ))}
          </Row>
        </Col>
        <Col span={6}>col-6 col-offset-6</Col>
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
