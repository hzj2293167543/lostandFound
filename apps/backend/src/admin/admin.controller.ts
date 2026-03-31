import { CurrentUser } from '@/common/decorators/currentUser.decorator';
import { ZodValidationPipe } from '@/common/pipe';
import {
  AnnouncementCreateDto,
  AnnouncementCreateDtoSchema,
  AnnouncementEditDto,
  AnnouncementEditDtoSchema,
  HandleReportDto,
  HandleReportDtoSchema,
  ReportPaginationParams,
  ReportPaginationParamsSchema,
} from '@lostfound/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { AdminService } from './admin.service';
import { AnnouncementService } from './announcement.service';
import { CategoryService } from './category.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(
    private adminService: AdminService,
    private announcementService: AnnouncementService,
    private categoryService: CategoryService
  ) {}

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

  @Get('users/paginated')
  getUsersPaginated(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    return this.adminService.getUsersPaginated(+page, +pageSize);
  }

  @Put('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body('status') status: number) {
    return this.adminService.updateUserStatus(+id, status);
  }

  @Delete('users/:id')
  softDeleteUser(@Param('id') id: string) {
    return this.adminService.softDeleteUser(+id);
  }

  @Post('users/:id/restore')
  restoreUser(@Param('id') id: string) {
    return this.adminService.restoreUser(+id);
  }

  @Get('lost')
  getAllLostItems() {
    return this.adminService.getAllLostItems();
  }

  @Get('lost/paginated')
  getLostItemsPaginated(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    return this.adminService.getLostItemsPaginated(+page, +pageSize);
  }

  @Delete('lost/:id')
  softDeleteLostItem(@Param('id') id: string) {
    return this.adminService.softDeleteLostItem(+id);
  }

  @Post('lost/:id/restore')
  restoreLostItem(@Param('id') id: string) {
    return this.adminService.restoreLostItem(+id);
  }

  @Get('found')
  getAllFoundItems() {
    return this.adminService.getAllFoundItems();
  }

  @Get('found/paginated')
  getFoundItemsPaginated(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    return this.adminService.getFoundItemsPaginated(+page, +pageSize);
  }

  @Delete('found/:id')
  softDeleteFoundItem(@Param('id') id: string) {
    return this.adminService.softDeleteFoundItem(+id);
  }

  @Post('found/:id/restore')
  restoreFoundItem(@Param('id') id: string) {
    return this.adminService.restoreFoundItem(+id);
  }

  @Get('categories')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Post('categories')
  createCategory(@Body('name') name: string) {
    return this.categoryService.createCategory(name);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body('name') name: string) {
    return this.categoryService.updateCategory(+id, name);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(+id);
  }

  @Get('announcements')
  getAllAnnouncements() {
    return this.announcementService.getAllAnnouncements();
  }

  @Get('announcements/paginated')
  getAnnouncementsPaginated(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    return this.announcementService.getAnnouncementsPaginated(+page, +pageSize);
  }

  @Post('announcements')
  createAnnouncement(@Body() data: AnnouncementCreateDto) {
    const validData = AnnouncementCreateDtoSchema.safeParse(data);
    if (!validData.success) {
      throw new Error('Invalid data');
    }
    return this.announcementService.createAnnouncement(validData.data);
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
    return this.announcementService.updateAnnouncement(id, validData.data);
  }

  @Delete('announcements/:id')
  deleteAnnouncement(@Param('id') id: string) {
    return this.announcementService.deleteAnnouncement(+id);
  }

  @Get('reports/stats')
  getReportStats() {
    return this.adminService.getReportStats();
  }

  @Get('reports/paginated')
  getReportsPaginated(
    @Query(new ZodValidationPipe(ReportPaginationParamsSchema)) query: ReportPaginationParams
  ) {
    return this.adminService.getReportsPaginated(query);
  }

  @Post('reports/user/:id/handle')
  handleUserReport(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(HandleReportDtoSchema)) data: HandleReportDto,
    @CurrentUser() user: User
  ) {
    return this.adminService.handleUserReport(+id, user.id, data);
  }

  @Post('reports/comment/:id/handle')
  handleCommentReport(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(HandleReportDtoSchema)) data: HandleReportDto,
    @CurrentUser() user: User
  ) {
    return this.adminService.handleCommentReport(+id, user.id, data);
  }

  @Post('reports/lost/:id/handle')
  handleLostReport(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(HandleReportDtoSchema)) data: HandleReportDto,
    @CurrentUser() user: User
  ) {
    return this.adminService.handleLostReport(+id, user.id, data);
  }

  @Post('reports/found/:id/handle')
  handleFoundReport(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(HandleReportDtoSchema)) data: HandleReportDto,
    @CurrentUser() user: User
  ) {
    return this.adminService.handleFoundReport(+id, user.id, data);
  }

  @Delete('punishments/:id')
  revokePunishment(@Param('id') id: string) {
    return this.adminService.revokePunishment(+id);
  }

  @Get('users/:userId/punishments')
  getUserPunishments(@Param('userId') userId: string) {
    return this.adminService.getUserPunishments(+userId);
  }
}
