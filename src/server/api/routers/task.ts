import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  // query is only for get data, others are mutate
  getAll: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: {
          eventId: input.eventId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({ name: z.string(), content: z.string(), eventId: z.string() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: {
          name: input.name,
          content: input.content,
          eventId: input.eventId,
          isDone: false,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
