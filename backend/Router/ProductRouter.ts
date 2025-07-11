import {Router} from "../Dependences/Dependencias.ts"
import { getProducts,postProducts,putProducts,deleteProducts } from "../Controller/ProductController.ts";

const ProductRouter = new Router();

ProductRouter
    .get("/products",getProducts)
    .post("/products",postProducts)
    .put("/products",putProducts)
    .delete("/products/:id/:codigo", deleteProducts);

export default ProductRouter