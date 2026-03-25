import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import {
  AnnouncementSchema,
  UserSchema,
  Announcement as AnnouncementDto,
  AnnouncementCreateDtoSchema,
  AnnouncementCreateDto,
  AnnouncementEditDto,
  AnnouncementEditDtoSchema,
} from '@lostfound/shared';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('lost/recent')
  getRecentLostItems() {
    return this.adminService.getRecentLostItems();
  }

  @Get('found/recent')
  getRecentFoundItems() {
    return this.adminService.getRecentFoundItems();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body('status') status: number) {
    return this.adminService.updateUserStatus(+id, status);
  }

  @Get('lost')
  getAllLostItems() {
    return this.adminService.getAllLostItems();
  }

  @Delete('lost/:id')
  deleteLostItem(@Param('id') id: string) {
    return this.adminService.deleteLostItem(+id);
  }

  @Get('found')
  getAllFoundItems() {
    return this.adminService.getAllFoundItems();
  }

  @Delete('found/:id')
  deleteFoundItem(@Param('id') id: string) {
    return this.adminService.deleteFoundItem(+id);
  }

  @Get('categories')
  getAllCategories() {
    return this.adminService.getAllCategories();
  }

  @Post('categories')
  createCategory(@Body('name') name: string) {
    return this.adminService.createCategory(name);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body('name') name: string) {
    return this.adminService.updateCategory(+id, name);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(+id);
  }

  @Get('announcements')
  getAllAnnouncements() {
    return this.adminService.getAllAnnouncements();
  }

  @Post('announcements')
  createAnnouncement(@Body() data: AnnouncementCreateDto) {
    const validData = AnnouncementCreateDtoSchema.safeParse(data);
    if (!validData.success) {
      throw new Error('Invalid data');
    }
    return this.adminService.createAnnouncement(validData.data);
  }

  @Patch('announcements/:id')
  updateAnnouncement(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: AnnouncementEditDto
  ) {
    const validData = AnnouncementEditDtoSchema.safeParse(data);
    if (!validData.success) {
      throw new Error('Invalid data');
    }
    return this.adminService.updateAnnouncement(id, validData.data);
  }

  @Delete('announcements/:id')
  deleteAnnouncement(@Param('id') id: string) {
    return this.adminService.deleteAnnouncement(+id);
  }
}
