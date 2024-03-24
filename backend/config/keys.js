import { config } from "dotenv";

config();

const keys = {
  port: process.env.PORT,
  secretTokens: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
};

export const { port, secretTokens, database } = keys;
