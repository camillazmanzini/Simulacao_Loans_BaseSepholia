import Fastify from "fastify";
import { registerBorrowRoutes } from "./routes.js";

const app = Fastify({ logger: true });

app.register(registerBorrowRoutes);

const PORT = Number(process.env.PORT || 5044);
const HOST = "0.0.0.0";

app
  .listen({ host: HOST, port: PORT })
  .then(() => {
    app.log.info(`🚀 API running on http://${HOST}:${PORT}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  app.log.info("🛑 Shutting down server...");
  await app.close();
  process.exit(0);
});