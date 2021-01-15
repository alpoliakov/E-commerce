import { connections, connect } from 'mongoose';

const connectDB = () => {
  const MONGO_URL = process.env.MONGO_URL || '';

  if (!MONGO_URL) {
    throw new Error('Missing MONGO_URL');
  }

  if (connections[0].readyState) {
    console.log('Connected to DB.');
    return;
  }

  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };

  connect(MONGO_URL, options);
};

export default connectDB;
