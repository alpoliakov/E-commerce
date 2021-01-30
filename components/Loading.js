import React from 'react';
import { Spin, Alert } from 'antd';

const Loading = () => {
  return (
    <Spin centered tip="Loading...">
      <Alert message="Loading page" type="info" />
    </Spin>
  );
};

export default Loading;
