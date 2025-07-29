import { SendConfirmationEmail } from "./types";
import { InternalServerError } from "../error";
import { config } from "@/config";

export const sendConfirmationEmail: SendConfirmationEmail = async ({
  to,
  token,
}) => {
  const confirmationLink = `${config.baseApiUrl}/api/confirm/${token}`;

  const res = await fetch(config.resendApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
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
