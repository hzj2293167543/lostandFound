import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { CreateReportDto, TReportTargetType, User } from '@lostfound/shared';
import { CurrentUser } from '@/common/decorators/currentUser.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@CurrentUser() user: User, @Body() dto: CreateReportDto) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('请先登录');
    }

    const hasExisting = await this.reportsService.hasExistingReport(
      userId,
      dto.targetType,
      dto.targetId
    );
    if (hasExisting) {
      throw new Error('您已在30天内举报过该内容，请勿重复提交');
    }

    return this.reportsService.create(userId, dto);
  }

  @Get('reasons')
  async getReportReasons(@Query('targetType') targetType?: TReportTargetType) {
    return await this.reportsService.getReportReasons(targetType);
  }
}
