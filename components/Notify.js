import React, { useContext } from 'react';
import { DataContext } from '../store/GlobalState';
import Loading from './Loading';
import Toast from './Toast';

const Notify = () => {
  // eslint-disable-next-line no-unused-vars
  const { state, dispatch } = useContext(DataContext);
  const { notify } = state;

  return (
    <>
      {notify.loading && <Loading />}
      {notify.error && Toast('error', { msg: notify.error, title: 'Error!' })}
      {notify.success && Toast('success', { msg: notify.success, title: 'Success!' })}
    </>
  );
};

export default Notify;
