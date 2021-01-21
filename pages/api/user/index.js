import connectDB from '../../../utils/connectDB';
import Users from '../../../models/modelUser';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case 'PATCH':
      await uploadInfo(req, res);
      break;
  }
};

const uploadInfo = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { name } = req.body;

    const newUser = await Users.findOneAndUpdate({ _id: result.id }, { name });
    res.json({
      msg: 'Update Success!',
      user: {
        name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
