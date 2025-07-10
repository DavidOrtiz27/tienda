import { Application, oakCors } from "./Dependences/Dependencias.ts";
import ProductRouter from "./Router/ProductRouter.ts";

const app = new Application();

app.use(oakCors())

const rutas = [ProductRouter]

rutas.forEach((element)=>{
    app.use(element.routes())
    app.use(element.allowedMethods())
})

console.log("App listen in port 8000")

app.listen({ hostname: "0.0.0.0", port: 8000 })