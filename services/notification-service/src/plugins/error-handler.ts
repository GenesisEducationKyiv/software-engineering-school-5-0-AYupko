import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "@/business/lib";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof ConflictError) {
    return reply.status(409).send({ message: error.message });
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  if (error instanceof InternalServerError) {
    return reply.status(500).send({ message: error.message });
  }

  request.log.error("Unhandled error:", error);
  return reply.status(500).send({ message: "Internal Server Error" });
};
