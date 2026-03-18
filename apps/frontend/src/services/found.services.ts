import { foundApi } from '@/api';
import { FoundCreateDto, FoundCreateDtoSchema } from '@lostfound/shared';

export async function CreateFound(foundCreateDto: FoundCreateDto) {
  const result = FoundCreateDtoSchema.safeParse(foundCreateDto);
  if (!result.success) {
    throw new Error(result.error.issues.map((e) => e.message).join('\n'));
  }
  return await foundApi.createFoundItem(result.data);
}
