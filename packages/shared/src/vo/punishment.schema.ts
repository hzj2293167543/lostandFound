import z from 'zod';

export const PunishmentSchema = z.object({
  id: z.number(),
  type: z.number(),
  userId: z.number(),
  reason: z.string(),
  createdAt: z.date(),
  expireAt: z.date(),
});
export type Punishment = z.infer<typeof PunishmentSchema>;
