import { Client } from "../Dependences/Dependencias.ts";

const Conexion = await new Client().connect({
  hostname: "localhost",
  username: "root",
  db: "uploads",
  password: ""
});

export default Conexion