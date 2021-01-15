import React from 'react';
import '../styles/globals.css';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';
import { DataProvider } from '../store/GlobalState';

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataProvider>
  );
}

export default MyApp;
