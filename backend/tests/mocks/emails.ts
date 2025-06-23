jest.mock("@/business/lib/emails/emails", () => ({
  sendConfirmationEmail: jest.fn().mockResolvedValue(undefined),
}));
