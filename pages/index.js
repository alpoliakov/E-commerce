import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../store/GlobalState';
import { deleteData, getData } from '../utils/fetchData';
import PropTypes from 'prop-types';
import Head from 'next/head';
import ProductItem from '../components/product/ProductItem';
import { Switch, Button, Space, Tooltip, Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Filter from '../components/Filter';
import filterSearch from '../utils/filterSearch';

const { confirm } = Modal;
const { Title, Text } = Typography;

const Home = (props) => {
  const [products, setProducts] = useState(props.products);
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);

  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
    filterSearch({ router, page: page });
  }, [router.query]);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) {
        product.checked = !product.checked;
      }
    });

    setProducts([...products]);
  };

  const handleCheckAll = () => {
    products.forEach((product) => (product.checked = !isCheck));

    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteProduct = (item) => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    deleteData(`product/${item._id}`, auth.token).then((res) => {
      if (res.err) {
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      }

      dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
      return router.push('/');
    });
  };

  const handleDeleteAll = () => {
    confirm({
      title: <Title level={4}>Delete all selected items?</Title>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <Space direction="vertical">
          <Text>Are you sure you want to delete all selected items?</Text>
        </Space>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        products.forEach((product) => {
          if (product.checked) {
            deleteProduct(product);
          }
        });
      },
      onCancel() {},
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <Head>
        <title>Home page</title>
      </Head>
      <Filter state={state} />
      {auth.user && auth.user.role === 'admin' && (
        <Space style={{ margin: '20px 0 0 20px' }}>
          <Switch onChange={handleCheckAll} checked={isCheck}></Switch>
          <Tooltip key="view" title={isCheck && 'Remove selected items'} color="volcano">
            <Button type="danger" disabled={!isCheck} onClick={() => handleDeleteAll()}>
              DELETE ALL
            </Button>
          </Tooltip>
        </Space>
      )}
      <div className="products">
        {products.length === 0 ? (
          <h1>No Products</h1>
        ) : (
          products.map((product) => (
            <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
          ))
        )}
      </div>
    </div>
  );
};

Home.propTypes = {
  props: PropTypes.object,
  products: PropTypes.array,
};

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || 'all';
  const sort = query.sort || '';
  const search = query.search || 'all';

  const res = await getData(
    `product?limit=${page}&category=${category}&sort=${sort}&title=${search}`,
  );

  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}

export default Home;
