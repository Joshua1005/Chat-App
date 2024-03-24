const authHandler = async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader) throw new Error("No headers.");
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) throw new Error("No access tokens.");
    const decoded = jwt.verify(accessToken, secretTokens.accessTokenSecret);

    const foundUser = await User.findOne({ email: decoded.email });
    if (!foundUser) throw new Error("Unathorized.");

    socket.user = foundUser;
    next();
  } catch (error) {
    console.error(error);
  }
};
