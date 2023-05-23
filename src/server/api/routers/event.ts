import { Input } from "postcss";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  // query is only for get data, others are mutate
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.event.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),
});
