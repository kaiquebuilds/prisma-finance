import express, { Request, Response, Router } from "express";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";
import logger from "@/lib/logger";

const router: Router = express.Router();
const webhookSecret = env.CLERK_WEBHOOK_SECRET;

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string;
    last_name: string;
  };
}

router.post("/clerk", async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const headers = req.headers as Record<string, string | string[]>;

    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(payload, headers as Record<string, string>);
    const event = evt as ClerkWebhookEvent;

    if (event.type === "user.updated") {
      const {
        id: authProviderId,
        email_addresses,
        first_name,
        last_name,
      } = event.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name} ${last_name}`.trim();

      const user = await prisma.user.findUnique({
        where: { authProviderId },
      });

      if (!user) {
        return res.status(200).json({ skipped: true });
      }

      await prisma.user.update({
        where: { authProviderId },
        data: {
          ...(email && { email }),
          ...(name && { name }),
        },
      });

      return res.status(200).json({ success: true });
    }

    if (event.type === "user.deleted") {
      const { id: authProviderId } = event.data;

      await prisma.user.delete({
        where: { authProviderId },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error("Webhook error:", error);
    return res.status(400).json({ error: "Webhook verification failed" });
  }
});

export default router;
