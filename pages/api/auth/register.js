import connectDB from '../../../utils/connectDB';
import Users from '../../../models/modelUser';
import valid from '../../../utils/validation';
import bcrypt from 'bcrypt';

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case 'POST':
      await register(req, res);
      break;
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, confirm } = req.body;
    const errMessage = valid(name, email, password, confirm);

    if (errMessage) {
      return res.status(400).json({ err: errMessage });
    }

    const user = await Users.findOne({ email });

    if (user) {
      return res.status(400).json({ err: 'This email already exists!' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new Users({ name, email, password: passwordHash, confirm });
    await newUser.save();
    res.json({ msg: 'Registration successful!' });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
