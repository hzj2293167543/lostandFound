import { lostApi } from '@/api';
import { LostCreateDto, LostCreateDtoSchema } from '@lostfound/shared';

export async function CreateLost(lostCreateDto: LostCreateDto) {
  const result = LostCreateDtoSchema.safeParse(lostCreateDto);
  if (!result.success) {
    throw new Error(result.error.errors.map((e) => e.message).join('\n'));
  }
  return await lostApi.createLost(result.data);
}
