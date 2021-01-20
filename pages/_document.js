import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="HandheldFriendly" content="true" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no"
          />
          <meta name="keywords" content="e-commerce, app, cosmetic" />
          <meta name="description" content="E-commerce website with Next.js" />
          <script
            src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
