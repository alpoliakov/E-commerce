import React from 'react';
import { Spin, Alert } from 'antd';

const Loading = () => {
  return (
    <Spin tip="Loading...">
      <Alert message="Loading..." type="info" />
    </Spin>
  );
};

export default Loading;
