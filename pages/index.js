import React, { useState } from 'react';
import { getData } from '../utils/fetchData';
import PropTypes from 'prop-types';
import Head from 'next/head';
import ProductItem from '../components/product/ProductItem';

const Home = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState(props.products);

  return (
    <div className="products">
      <Head>
        <title>Home page</title>
      </Head>
      {products.length === 0 ? (
        <h1>No Products</h1>
      ) : (
        products.map((product) => <ProductItem key={product._id} product={product} />)
      )}
    </div>
  );
};

Home.propTypes = {
  props: PropTypes.object,
  products: PropTypes.array,
};

export async function getServerSideProps() {
  const res = await getData('product');

  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}

export default Home;
