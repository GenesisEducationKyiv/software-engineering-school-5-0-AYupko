// import { sendConfirmationEmail } from "@/business/lib/emails";
// import { InternalServerError } from "@/business/lib/error";

// describe("sendConfirmationEmail", () => {
//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   it("sends confirmation email with correct headers and body", async () => {
//     const mockFetch = jest.fn().mockResolvedValueOnce({ ok: true });
//     global.fetch = mockFetch;

//     await sendConfirmationEmail({
//       to: "user@example.com",
//       token: "abc123",
//     });

//     expect(mockFetch).toHaveBeenCalledWith(
//       expect.any(String),
//       expect.objectContaining({
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: expect.stringContaining("abc123"),
//       })
//     );
//   });

//   it("throws InternalServerError if resend API returns failure", async () => {
//     global.fetch = jest.fn().mockResolvedValueOnce({
//       ok: false,
//       text: async () => "some error",
//     });

//     await expect(
//       sendConfirmationEmail({
//         to: "user@example.com",
//         token: "error-token",
//       })
//     ).rejects.toThrow(
//       new InternalServerError("Failed to send email: some error")
//     );
//   });
// });
