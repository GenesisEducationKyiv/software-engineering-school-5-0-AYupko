import { createOutboxService } from "@/business/services/outbox-service";

const mockOutboxRepository = {
  findNotProcessed: jest.fn(),
  updateProcessed: jest.fn(),
};

const mockChannel = {
  publish: jest.fn(),
};

const mockBrokerManager = {
  getChannel: jest.fn().mockResolvedValue(mockChannel),
};

const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

const outboxService = createOutboxService({
  outboxRepository: mockOutboxRepository as any,
  brokerManager: mockBrokerManager as any,
  logger: mockLogger as any,
});

describe("Outbox Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing if there are no events to process", async () => {
    mockOutboxRepository.findNotProcessed.mockResolvedValue([]);
    await outboxService.processOutboxEvents();
    expect(mockBrokerManager.getChannel).not.toHaveBeenCalled();
  });

  it("should publish events and mark them as processed", async () => {
    const events = [
      { id: "1", topic: "t1", payload: { data: "d1" } },
      { id: "2", topic: "t2", payload: { data: "d2" } },
    ];
    mockOutboxRepository.findNotProcessed.mockResolvedValue(events);

    await outboxService.processOutboxEvents();

    expect(mockBrokerManager.getChannel).toHaveBeenCalledTimes(1);

    expect(mockChannel.publish).toHaveBeenCalledTimes(2);
    expect(mockChannel.publish).toHaveBeenCalledWith(
      expect.any(String),
      "t1",
      Buffer.from(JSON.stringify({ data: "d1" })),
      { persistent: true }
    );

    expect(mockOutboxRepository.updateProcessed).toHaveBeenCalledWith({
      id: "1",
    });
    expect(mockOutboxRepository.updateProcessed).toHaveBeenCalledWith({
      id: "2",
    });
  });
});
