import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { ZodValidationPipe } from '@/common/pipe';
import {
  CreateUserReportDtoSchema,
  CreateCommentReportDtoSchema,
  CreateLostReportDtoSchema,
  CreateFoundReportDtoSchema,
  TReportTargetType,
  User,
  ReportTargetType,
  CreateUserReportDto,
  CreateCommentReportDto,
  CreateLostReportDto,
  CreateFoundReportDto,
} from '@lostfound/shared';
import { CurrentUser } from '@/common/decorators/currentUser.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('user')
  async createUserReport(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(CreateUserReportDtoSchema)) dto: CreateUserReportDto
  ) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('请先登录');
    }

    const hasExisting = await this.reportsService.hasExistingReport(
      userId,
      ReportTargetType.User,
      dto.targetId
    );
    if (hasExisting) {
      throw new Error('您已在30天内举报过该内容，请勿重复提交');
    }

    return this.reportsService.create(userId, {
      ...dto,
      targetType: ReportTargetType.User,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('comment')
  async createCommentReport(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(CreateCommentReportDtoSchema)) dto: CreateCommentReportDto
  ) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('请先登录');
    }

    const hasExisting = await this.reportsService.hasExistingReport(
      userId,
      ReportTargetType.Comment,
      dto.targetId
    );
    if (hasExisting) {
      throw new Error('您已在30天内举报过该内容，请勿重复提交');
    }

    return this.reportsService.create(userId, {
      ...dto,
      targetType: ReportTargetType.Comment,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('lost')
  async createLostReport(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(CreateLostReportDtoSchema)) dto: CreateLostReportDto
  ) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('请先登录');
    }

    const hasExisting = await this.reportsService.hasExistingReport(
      userId,
      ReportTargetType.LostItem,
      dto.targetId
    );
    if (hasExisting) {
      throw new Error('您已在30天内举报过该内容，请勿重复提交');
    }

    return this.reportsService.create(userId, {
      ...dto,
      targetType: ReportTargetType.LostItem,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('found')
  async createFoundReport(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(CreateFoundReportDtoSchema)) dto: CreateFoundReportDto
  ) {
    const userId = user?.id;
    if (!userId) {
      throw new Error('请先登录');
    }

    const hasExisting = await this.reportsService.hasExistingReport(
      userId,
      ReportTargetType.FoundItem,
      dto.targetId
    );
    if (hasExisting) {
      throw new Error('您已在30天内举报过该内容，请勿重复提交');
    }

    return this.reportsService.create(userId, {
      ...dto,
      targetType: ReportTargetType.FoundItem,
    });
  }

  @Get('reasons')
  async getReportReasons(@Query('targetType') targetType?: TReportTargetType) {
    return await this.reportsService.getReportReasons(targetType);
  }
}
