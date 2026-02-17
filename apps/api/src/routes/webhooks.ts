import express, { Request, Response, Router } from "express";
import { Webhook } from "svix";
import { env } from "@/env";
import logger from "@/lib/logger";
import { UserRepository } from "../repositories/user.repository";

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

export function createWebhookRouter(userRepo: UserRepository): Router {
  const router: Router = express.Router();

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

        const user = await userRepo.findByAuthProviderId(authProviderId);

        if (!user) {
          return res.status(200).json({ skipped: true });
        }

        await userRepo.update(authProviderId, {
          ...(email && { email }),
          ...(name && { name }),
        });

        return res.status(200).json({ success: true });
      }

      if (event.type === "user.deleted") {
        const { id: authProviderId } = event.data;

        await userRepo.delete(authProviderId);

        return res.status(200).json({ success: true });
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      logger.error("Webhook error:", error);
      return res.status(400).json({ error: "Webhook verification failed" });
    }
  });

  return router;
}
