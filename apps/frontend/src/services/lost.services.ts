import { lostApi } from '@/api';
import { LostCreateDto, LostCreateDtoSchema } from '@lostfound/shared';

export async function CreateLost(lostCreateDto: FormData) {
  const 
  return await lostApi.createLost(result.data);
}
