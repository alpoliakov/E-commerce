import { notification } from 'antd';

const Toast = (type, msg) => {
  notification[type]({
    message: msg.title,
    description: msg.msg,
  });
};

export default Toast;
