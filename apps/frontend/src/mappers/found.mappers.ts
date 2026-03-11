import { FoundCreateDto } from '@lostfound/shared';

export function mapFoundFormToCreateDto(formData: FormData): FoundCreateDto {
  return {
    title: formData.get('title') as string,
    category: Number(formData.get('category')),
    description: formData.get('description') as string,
    time: formData.get('time') as string,
    location: formData.get('location') as string,
    storageLocation: formData.get('storage_location') as string,
    image: formData.get('image') as string,
    contactPhone: formData.get('contact_phone') as string,
  };
}
