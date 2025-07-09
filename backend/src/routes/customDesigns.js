import express from "express";
import {
  getCustomDesigns,
  getCustomDesignById,
  createCustomDesign,
  updateCustomDesign,
  deleteCustomDesign
} from "../controllers/customDesignsController.js";

const router = express.Router();

router.get("/", getCustomDesigns);
router.get("/:id", getCustomDesignById);
router.post("/", createCustomDesign);
router.put("/:id", updateCustomDesign);
router.delete("/:id", deleteCustomDesign);

export default router;
