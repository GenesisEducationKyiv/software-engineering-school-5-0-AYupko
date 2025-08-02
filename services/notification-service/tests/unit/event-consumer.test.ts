jest.mock("@/business/lib/emails", () => ({
  sendConfirmationEmail: jest.fn().mockResolvedValue(undefined),
}));

import { sendConfirmationEmail } from "@/business/lib/emails";

import { createEventService } from "@/business/services/event/event.service";
import { ConsumeMessage } from "amqplib";

const eventHandler = createEventService({
  sendConfirmationEmail,
});

describe("Event Service (Consumer Logic)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call sendConfirmationEmail for SUBSCRIPTION_CREATED event", async () => {
    const eventPayload = {
      type: "SUBSCRIPTION_CREATED",
      recipientEmail: "test@example.com",
      confirmationToken: "some-token-123",
    };
    const fakeMessage = {
      content: Buffer.from(JSON.stringify(eventPayload)),
    } as ConsumeMessage;

    await eventHandler(fakeMessage);

    expect(sendConfirmationEmail).toHaveBeenCalledTimes(1);
    expect(sendConfirmationEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      token: "some-token-123",
    });
  });

  it("should not call email service for unknown event type", async () => {
    const eventPayload = { type: "UNKNOWN_EVENT" };
    const fakeMessage = {
      content: Buffer.from(JSON.stringify(eventPayload)),
    } as ConsumeMessage;

    await eventHandler(fakeMessage);

    expect(sendConfirmationEmail).not.toHaveBeenCalled();
  });
});
