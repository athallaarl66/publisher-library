import { Router } from "express";
import {
  getPublishers,
  getPublisher,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../controllers/publisherController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getPublishers);
router.get("/:id", getPublisher);
router.post("/", createPublisher);
router.put("/:id", updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
