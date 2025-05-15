import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { username, password, firstname, lastname } = req.body;

    // Validate required fields
    if (!username || !password || !firstname || !lastname) {
      return res.status(400).json({ 
        message: "All fields are required (username, password, firstname, lastname)" 
      });
    }

    // Check if user exists
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      firstname,
      lastname,
      isAdmin: false,
      profilePicture: "",
      coverPicture: "",
      followers: [],
      following: []
    });

    // Save user and generate token
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ 
      user: userWithoutPassword,
      token 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || "Error creating user" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ 
      user: userWithoutPassword,
      token 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || "Error during login" });
  }
};
