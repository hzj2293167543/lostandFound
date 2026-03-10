import { LostCreateDto } from '@lostfound/shared';

export function mapLostFormToCreateDto(formData: FormData): LostCreateDto {
  return {
    title: formData.get('title') as string,
    category: Number(formData.get('category')),
    description: formData.get('description') as string,
    time: formData.get('time') as string,
    location: formData.get('location') as string,
    image: formData.get('image') as string,
  };
}
