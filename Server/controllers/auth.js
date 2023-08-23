import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  // console.log("============+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",req)
  console.log("=====body====================>>>>",req.body)
  console.log("========file1===================>>>",req.file)
  console.log("========file2===================>>>",req.files)
  console.log("========file3===================>>>",req.files[0].path)
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    console.log("first", req.file);

    // const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath : req.files[0].filename,
      // picturePath,

      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User not Found!!!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect Password!!!" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


        // const savedUserResponse = await axios.post(
        //     "http://192.168.1.21:5000/auth/register",values,
        //     {
        //         headers: { "Content-Type": "multipart/form-data" },
        //     }
        // ).then(