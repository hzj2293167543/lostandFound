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
import { ItemManagementService } from './item-management.service';
import { ReportService } from './report.service';
import { StatisticsService } from './statistics.service';
import { UserManagementService } from './user-management.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(
    private statisticsService: StatisticsService,
    private userManagementService: UserManagementService,
    private itemManagementService: ItemManagementService,
    private announcementService: AnnouncementService,
    private categoryService: CategoryService,
    private reportService: ReportService,
    private adminService: AdminService
  ) {}

  @Get('stats')
  getStats() {
    return this.statisticsService.getOverviewStats();
  }

  @Get('stats/locations/:type')
  getTopLocations(@Param('type') type: string, @Query('limit') limit: string) {
    const validType = type === 'lost' || type === 'found' ? type : 'lost';
    return this.statisticsService.getTopLocations(validType, limit ? +limit : 10);
  }

  @Get('stats/hourly/:type')
  getHourlyDistribution(@Param('type') type: string, @Query('days') days: string) {
    const validType = type === 'lost' || type === 'found' ? type : 'lost';
    return this.statisticsService.getHourlyDistribution(validType, days ? +days : 30);
  }

  @Get('stats/weekly')
  getWeeklyDistribution(@Query('days') days: string) {
    return this.statisticsService.getWeeklyDistribution(days ? +days : 30);
  }

  @Get('stats/monthly')
  getMonthlyDistribution(@Query('months') months: string) {
    return this.statisticsService.getMonthlyDistribution(months ? +months : 12);
  }

  @Get('stats/user-activity/:type')
  getUserActivityRanking(@Param('type') type: string, @Query('limit') limit: string) {
    const validType = ['lost', 'found', 'comment'].includes(type)
      ? (type as 'lost' | 'found' | 'comment')
      : 'lost';
    return this.statisticsService.getUserActivityRanking(validType, limit ? +limit : 10);
  }

  @Get('stats/comment-trend')
  getCommentTrend(@Query('days') days: string) {
    return this.statisticsService.getCommentTrend(days ? +days : 30);
  }

  @Get('stats/report-handling')
  getReportHandlingStats() {
    return this.statisticsService.getReportHandlingStats();
  }

  @Get('stats/funnel')
  getFunnelData() {
    return this.statisticsService.getFunnelData();
  }

  @Get('stats/wordcloud')
  getWordCloudData(@Query('limit') limit: string) {
    return this.statisticsService.getWordCloudData(limit ? +limit : 20);
  }

  @Get('lost/recent')
  getRecentLostItems() {
    return this.itemManagementService.getRecentLostItems();
  }

  @Get('found/recent')
  getRecentFoundItems() {
    return this.itemManagementService.getRecentFoundItems();
  }

  @Get('users')
  getAllUsers() {
    return this.userManagementService.getAllUsers();
  }

  @Get('users/paginated')
  getUsersPaginated(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    return this.userManagementService.getUsersPaginated(+page, +pageSize);
  }

  @Put('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body('status') status: number) {
    return this.userManagementService.updateUserStatus(+id, status);
  }

  @Delete('users/:id')
  softDeleteUser(@Param('id') id: string) {
    return this.userManagementService.softDeleteUser(+id);
  }

  @Post('users/:id/restore')
  restoreUser(@Param('id') id: string) {
    return this.userManagementService.restoreUser(+id);
  }

  @Get('lost')
  getAllLostItems() {
    return this.itemManagementService.getAllLostItems();
  }

  @Get('lost/paginated')
  getLostItemsPaginated(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    return this.itemManagementService.getLostItemsPaginated(+page, +pageSize);
  }

  @Delete('lost/:id')
  softDeleteLostItem(@Param('id') id: string) {
    return this.itemManagementService.softDeleteLostItem(+id);
  }

  @Post('lost/:id/restore')
  restoreLostItem(@Param('id') id: string) {
    return this.itemManagementService.restoreLostItem(+id);
  }

  @Get('found')
  getAllFoundItems() {
    return this.itemManagementService.getAllFoundItems();
  }

  @Get('found/paginated')
  getFoundItemsPaginated(@Query('page') page: string, @Query('pageSize') pageSize: string) {
    return this.itemManagementService.getFoundItemsPaginated(+page, +pageSize);
  }

  @Delete('found/:id')
  softDeleteFoundItem(@Param('id') id: string) {
    return this.itemManagementService.softDeleteFoundItem(+id);
  }

  @Post('found/:id/restore')
  restoreFoundItem(@Param('id') id: string) {
    return this.itemManagementService.restoreFoundItem(+id);
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
    return this.reportService.getReportStats();
  }

  @Get('reports/paginated')
  getReportsPaginated(
    @Query(new ZodValidationPipe(ReportPaginationParamsSchema)) query: ReportPaginationParams
  ) {
    return this.reportService.getReportsPaginated(query);
  }

  @Post('reports/user/:id/handle')
  handleUserReport(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(HandleReportDtoSchema)) data: HandleReportDto,
    @CurrentUser() user: User
  ) {
    return this.reportService.handleUserReport(+id, user.id, data);
  }

  @Post('reports/comment/:id/handle')
  handleCommentReport(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(HandleReportDtoSchema)) data: HandleReportDto,
    @CurrentUser() user: User
  ) {
    return this.reportService.handleCommentReport(+id, user.id, data);
  }

  @Post('reports/lost/:id/handle')
  handleLostReport(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(HandleReportDtoSchema)) data: HandleReportDto,
    @CurrentUser() user: User
  ) {
    return this.reportService.handleLostReport(+id, user.id, data);
  }

  @Post('reports/found/:id/handle')
  handleFoundReport(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(HandleReportDtoSchema)) data: HandleReportDto,
    @CurrentUser() user: User
  ) {
    return this.reportService.handleFoundReport(+id, user.id, data);
  }

  @Delete('punishments/:id')
  revokePunishment(@Param('id') id: string) {
    return this.reportService.revokePunishment(+id);
  }

  @Get('users/:userId/punishments')
  getUserPunishments(@Param('userId') userId: string) {
    return this.reportService.getUserPunishments(+userId);
  }
}
