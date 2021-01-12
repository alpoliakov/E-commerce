import React from 'react';
import NavBar from './NavBar';
import Head from 'next/head';
import style from '../styles/Layout.module.css';

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Cosmetic</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>
      <NavBar />
      <div className={style.container}>{children}</div>
    </div>
  );
}

export default Layout;
