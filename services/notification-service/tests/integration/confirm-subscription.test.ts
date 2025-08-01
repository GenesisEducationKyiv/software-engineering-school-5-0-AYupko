
// import { prisma } from "@/database/prisma";
// import supertest from "supertest";
// import { createApp } from "@/app";
// import { faker } from "@faker-js/faker";

// let app: Awaited<ReturnType<typeof createApp>>;
// let baseUrl: string;

// beforeEach(async () => {
//   app = await createApp();
//   await app.start();
//   baseUrl = app.address + "/api";
// });

// afterEach(async () => {
//   await app.stop();
//   await prisma.subscription.deleteMany();
// });

// describe("GET /confirm/:token", () => {
//   it("confirms subscription with valid token", async () => {
//     const email = faker.internet.email();
//     const city = "Lviv";
//     const token = faker.string.uuid();

//     await prisma.subscription.create({
//       data: {
//         email,
//         city,
//         frequency: "Daily",
//         token,
//         confirmed: false,
//       },
//     });

//     await supertest(baseUrl).get(`/confirm/${token}`).expect(200);

//     const updated = await prisma.subscription.findFirst({ where: { token } });
//     expect(updated?.confirmed).toBe(true);
//   });

//   it("returns 404 when token is not found", async () => {
//     const token = faker.string.uuid();

//     const response = await supertest(baseUrl)
//       .get(`/confirm/${token}`)
//       .expect(404);

//     expect(response.body.message).toBe("Token not found");
//   });
// });
