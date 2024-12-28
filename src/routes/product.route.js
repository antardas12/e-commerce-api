import { Router } from "express";
import { verfiyJWT } from "../milddelweres/auth.middelwere.js";
import { upload } from "../milddelweres/multer.middelwere.js";
import { createProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/product.contoller.js";


const router = Router();

router.route("/create-product").post(verfiyJWT,upload.single('image'),createProduct);
router.route("/get-product").get(verfiyJWT,getAllProduct);
router.route("/update-product/:id").patch(verfiyJWT,upload.single('image'),updateProduct);
router.route("/delete-product/:id").delete(verfiyJWT, deleteProduct)

export default router