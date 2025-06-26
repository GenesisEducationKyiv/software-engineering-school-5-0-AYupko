import { env } from "@/config";
import { InternalServerError } from "../error";
import { SendConfirmationEmail } from "./types";

const RESEND_API_KEY = env.RESEND_API_KEY;

export const sendConfirmationEmail: SendConfirmationEmail = async ({
  to,
  token,
}) => {
  if (!RESEND_API_KEY) {
    return;
  }

  const confirmationLink = `${env.BASE_API_URL}/api/confirm/${token}`;

  const res = await fetch(env.RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Weather App <onboarding@resend.dev>",
      to,
      subject: "Confirm your weather subscription",
      html: `
        <h1>Confirm your subscription</h1>
        <p>Click the link below to confirm:</p>
        <a href="${confirmationLink}">${confirmationLink}</a>
      `,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new InternalServerError(`Failed to send email: ${error}`);
  }
};
