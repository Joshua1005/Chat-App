import { Router } from "express";
import {
  loginUser,
  refreshAccess,
  registerUser,
} from "../../controllers/auth.js";

const router = Router();

router
  .get("/refresh", refreshAccess)
  .post("/register", registerUser)
  .post("/login", loginUser);

export default router;
