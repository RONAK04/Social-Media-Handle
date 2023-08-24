import express from "express";
import { login, register } from "../controllers/auth.js";
import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
 
const upload = multer({ storage });

const router = express.Router();
router.post("/login", login);
router.post("/register", upload.any(), register);

export default router;
