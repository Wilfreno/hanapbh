import JSONResponse from "./lib/json-response";
import mongoDBConnection from "./database/connection";
import v1_router from "./routes/v1/v1";
import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import path from "path";
import fs from "fs";

const log_file_path = path.join(__dirname, "production.log");

const log_stream = fs.createWriteStream(log_file_path, { flags: "a" });

const fastify = Fastify({
  logger: true,
});

//middleware
fastify.register(cors, {
  origin:
    process.env.NODE_ENV === "production" ? "https://hanapbh.vercel.app/" : "*",
  methods: ["POST", "GET", "PATCH", "DELETE"],
});

//routes
fastify.register(v1_router, { prefix: "/v1" });
fastify.get("/ready", async (_, response) => {
  return response.code(200).send(JSONResponse("OK", "server running"));
});

// ensure to connect to the database before the server run
fastify.register(mongoDBConnection).then(() =>
  fastify.listen({ port: 8000 }).catch((error) => {
    fastify.log.error(error);
    process.exit(1);
  })
);
