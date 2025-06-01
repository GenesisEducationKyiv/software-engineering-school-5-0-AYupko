import { InternalServerError } from "../error";

const BASE_API_URL = process.env.BASE_API_URL;
const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const sendConfirmationEmail = async ({
  to,
  token,
}: {
  to: string;
  token: string;
}) => {
   if (!RESEND_API_KEY) {
    return;
   }

  const confirmationLink = `${BASE_API_URL}/api/confirm/${token}`;

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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
