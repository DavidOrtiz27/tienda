import { Application, oakCors } from "./Dependences/Dependencias.ts";
import ProductRouter from "./Router/ProductRouter.ts";
import { send } from "https://deno.land/x/oak@v17.1.4/mod.ts";

const app = new Application();

app.use(oakCors())

app.use(async (ctx, next) => {
  if (ctx.request.url.pathname.startsWith("/uploads")) {
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(), // o la ruta absoluta a tu proyecto
    });
  } else {
    await next();
  }
});

const rutas = [ProductRouter]

rutas.forEach((element)=>{
    app.use(element.routes())
    app.use(element.allowedMethods())
})

console.log("App listen in port 8000")

app.listen({ hostname: "0.0.0.0", port: 8000 })