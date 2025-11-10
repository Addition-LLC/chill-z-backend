import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"

export default async function resetPasswordTokenHandler({
  event: { data: {
    entity_id: email, 
    token,
    actor_type,
  } },
  container,
}: SubscriberArgs<{ entity_id: string, token: string, actor_type: string }>) {
  
  if (actor_type !== "customer") {
    console.log(`Ignoring password reset for actor_type: ${actor_type}`);
    return;
  }

  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const config = container.resolve("configModule")

  const storefrontUrl = config.admin.storefrontUrl || "http://localhost:3000"
  const reset_link = `${storefrontUrl}/reset-password?token=${token}&email=${email}`
  
  console.log(`Sending password reset to ${email} with URL: ${reset_link}`);

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: "reset-password", 
    data: {
      // Pass the data with the corrected key
      reset_link: reset_link, 
      email: email,
      token: token,
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}