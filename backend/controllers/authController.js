import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// ✅ REGISTER (fixed version)
export const register = async (req, res) => {
  try {
    const { name, email, password, role, class: className, section, teacherId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let teacherObjectId = null;

    if (role === 'student' && teacherId) {
      const teacher = await User.findOne({ email: teacherId });

      if (!teacher) {
        return res.status(400).json({ message: "Teacher not found" });
      }

      teacherObjectId = teacher._id;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      class: className,
      section,
      teacherId: teacherObjectId
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      class: user.class,
      section: user.section,
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN (restore this)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      class: user.class,
      section: user.section,
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ME (restore this)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};