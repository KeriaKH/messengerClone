const jwt = require("jsonwebtoken");
const User = require("../models/user");

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "email không tồn tại" });
    if (!(await user.comparePassword(password)))
      return res.status(400).json({ error: "Sai mật khẩu" });
    return res.status(200).json({ user, token: createToken(user) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  const userData = req.body;
  try {
    const check=await User.findOne({email:userData.email})
    if(check) return res.status(500).json({ error: "Email đã được đăng ký" });
    const user = await User.create(userData);
    if (!user) return res.status(400).json({ error: "Đăng ký thất bại" });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login,signup };
