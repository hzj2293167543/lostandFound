import { CommentCreateDto, LostCreateDto } from '@lostfound/shared';

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

export function mapLostDetailFormToCommentDto(formData: FormData): CommentCreateDto {
  return {
    parentId: formData.get('parentId') ? Number(formData.get('parentId')) : null,
    itemId: Number(formData.get('itemId')),
    itemType: Number(formData.get('itemType')),
    content: formData.get('content') as string,
  };
}
