import { env } from "./env";
import cors from "cors";

import { app } from "./app";
import { prisma } from "./lib/prisma";

// TODO: Only allow localhost and frontend origins
app.use(cors());

const port = env.PORT;

await prisma.$connect();
try {
  app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
  });
} catch (error) {
  console.error(`Error when starting server: ${error}`);
} finally {
  await prisma.$disconnect();
}
