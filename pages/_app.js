import React from 'react';
import '../styles/globals.css';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
