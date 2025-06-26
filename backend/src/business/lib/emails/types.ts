export type SendConfirmationEmail = (payload: {
  to: string;
  token: string;
}) => Promise<void>;
