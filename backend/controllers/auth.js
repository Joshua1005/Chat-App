import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { secretTokens } from "../config/keys.js";

const registerUser = async (request, response) => {
  const { name, email, password } = request.body;
  try {
    if (!name)
      return response.status(400).json({ message: "Name is required." });

    if (!email)
      return response.status(400).json({ message: "Email is required." });

    if (!password)
      return response.status(400).json({ message: "Password is required." });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return response
        .status(409)
        .json({ message: "Email is already registered." });

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    await User.create({ name, email, password: hashedPassword });

    return response
      .status(201)
      .json({ message: "Successfully created an account." });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: error.message });
  }
};

const loginUser = async (request, response) => {
  const { email, password } = request.body;
  try {
    if (!email)
      return response.status(400).json({ message: "Email is required." });

    if (!password)
      return response.status(400).json({ message: "Password is required." });

    const foundUser = await User.findOne({ email });

    if (!foundUser)
      return response
        .status(404)
        .json({ message: "Email is not registered yet." });

    const authorized = await bcrypt.compare(password, foundUser.password);

    if (!authorized)
      return response.status(403).json({ message: "Wrong password." });

    const options = { expiresIn: "10s" };
    const accessTokenSecret = secretTokens.accessTokenSecret;
    const refreshTokenSecret = secretTokens.refreshTokenSecret;
    const payload = {
      email: foundUser.email,
    };

    const accessToken = jwt.sign(payload, accessTokenSecret, options);
    const refreshToken = jwt.sign(payload, refreshTokenSecret);

    await User.findByIdAndUpdate(
      { _id: foundUser._id },
      { $set: { refreshToken } }
    );

    return response
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: true,
      })
      .status(200)
      .json({ message: "Successfully logged in.", accessToken });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: error.message });
  }
};

const refreshAccess = async (request, response) => {
  try {
    const cookies = request.cookies;

    if (!cookies)
      return response.status(401).json({ message: "No cookies found." });

    const refreshToken = cookies.refreshToken;

    if (!refreshToken)
      return response.status(404).json({ message: "No refresh tokens found." });

    const decoded = jwt.verify(refreshToken, secretTokens.refreshTokenSecret);

    const foundUser = await User.findOne({ email: decoded.email });

    if (!foundUser)
      return response.status(404).json({ message: "Unathorized." });

    const payload = { email: foundUser.email };
    const options = { expiresIn: "10m" };
    const accessToken = jwt.sign(
      payload,
      secretTokens.accessTokenSecret,
      options
    );

    return response.json({ accessToken });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, refreshAccess };
