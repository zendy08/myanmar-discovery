import { limiter } from "@/lib/rateLimit";
import { methodNotAllowed, processContactPost } from "@/lib/contact";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return processContactPost(request, limiter, {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  });
}

export function GET(): Response {
  return methodNotAllowed();
}
