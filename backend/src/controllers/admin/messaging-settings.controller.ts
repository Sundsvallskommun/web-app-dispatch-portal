import { HttpException } from '@/exceptions/HttpException';
import adminMiddleware from '@/middlewares/admin.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService, { ApiResponse } from '@/services/api.service';
import { logger } from '@/utils/logger';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { getApiBase, MUNICIPALITY_ID } from '@config';
import { MessagingSettings, MessagingSettingsRequest } from '@/data-contracts/messaging-settings/data-contracts';
import { RequestWithUser } from '@interfaces/auth.interface';
import { MessagingSettingsApiResponse, MessagingSettingApiResponse } from '@/responses/messaging-settings.response';
import { Logotype } from '@interfaces/logotypes.interface';

const LOGOTYPE_KEYS = ['host', 'display_name', 'logotype_lightmode', 'logotype_darkmode'] as const;
type LogotypeKey = (typeof LOGOTYPE_KEYS)[number];

const structureLogotype = (d: MessagingSettings): Logotype => {
  const fields = d.values.reduce<Partial<Record<LogotypeKey, string>>>((acc, v) => {
    if ((LOGOTYPE_KEYS as readonly string[]).includes(v.key)) {
      acc[v.key as LogotypeKey] = v.value;
    }
    return acc;
  }, {});

  return {
    id: d.id,
    host: fields.host ?? '',
    display_name: fields.display_name ?? '',
    logotype_lightmode: fields.logotype_lightmode,
    logotype_darkmode: fields.logotype_darkmode,
    createdAt: d.created,
    updatedAt: d.updated,
  };
};

const structureLogotypeData = (data: MessagingSettings[]): Logotype[] => data.map(structureLogotype);

@Controller()
@UseBefore(authMiddleware)
@UseBefore(adminMiddleware)
export class AdminMessagingSettingsController {
  private readonly apiService = new ApiService();
  private readonly apiBase = getApiBase('messaging-settings');
  private readonly baseUrl = `${this.apiBase}/${MUNICIPALITY_ID}`;

  @Get('/admin/logotypes')
  @OpenAPI({ summary: 'Get all logotypes' })
  async getAll(
    @Req() req: RequestWithUser,
    @Res() res: Response<ApiResponse<Logotype[]>>,
  ): Promise<Response<ApiResponse<Logotype[]>>> {
    try {
      const filter = "values.type = 'WEB'";
      const url = `${this.baseUrl}?filter=${encodeURIComponent(filter)}`;
      const result = await this.apiService.get<MessagingSettings[]>({ url }, req.user);

      return res.send({ message: 'success', data: structureLogotypeData(result.data) });
    } catch (error) {
      logger.error('Error getting all logotypes', error);
      throw new HttpException(500, 'Could not get all logotypes');
    }
  }

  @Get('/admin/logotypes/:id')
  @OpenAPI({ summary: 'Get logotype by id' })
  @ResponseSchema(MessagingSettingsApiResponse)
  async getOne(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Res() res: Response<MessagingSettingApiResponse>,
  ): Promise<Response<MessagingSettingApiResponse>> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const result = await this.apiService.get<MessagingSettings>({ url }, req.user);

      if (result) {
        return res.send({ message: 'success', data: structureLogotype(result.data) });
      }
    } catch (error) {
      logger.error('Error getting host', error);
      throw new HttpException(500, 'Could not get logotype');
    }
  }

  @Post('/admin/logotypes')
  @OpenAPI({ summary: 'Create new logotype' })
  @ResponseSchema(ApiResponse<null>)
  async create(
    @Req() req: RequestWithUser,
    @Body() body: MessagingSettingsRequest,
    @Res() res: Response<MessagingSettingApiResponse>,
  ): Promise<Response<MessagingSettingApiResponse>> {
    try {
      const url = `${this.baseUrl}`;
      await this.apiService.post<MessagingSettings, MessagingSettingsRequest>({ url, data: body }, req.user);
      return res.send({ message: 'success', data: null });
    } catch (error) {
      logger.error('Error creating logotype', error);
      throw new HttpException(500, 'Could not create logotype');
    }
  }

  @Patch('/admin/logotypes/:id')
  @OpenAPI({ summary: 'Update a logotype' })
  @ResponseSchema(MessagingSettingApiResponse)
  async update(
    @Req() req: RequestWithUser,
    @Body() body: MessagingSettingsRequest,
    @Param('id') id: string,
    @Res() res: Response<MessagingSettingApiResponse>,
  ): Promise<Response<MessagingSettingApiResponse>> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const result = await this.apiService.patch<MessagingSettings, MessagingSettingsRequest>(
        { url, data: body },
        req.user,
      );
      return res.send({ message: 'success', data: result.data });
    } catch (error) {
      logger.error('Error updating logotype', error);
      throw new HttpException(500, 'Could not update logotype');
    }
  }

  @Delete('/admin/logotypes/:id')
  @OpenAPI({ summary: 'Delete a logotype' })
  @ResponseSchema(ApiResponse<null>)
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Res() res: Response<ApiResponse<null>>,
  ): Promise<Response<ApiResponse<null>>> {
    try {
      const url = `${this.baseUrl}/${id}`;
      await this.apiService.delete<MessagingSettings[]>({ url }, req.user);
      return res.send({ message: 'success', data: null });
    } catch (error) {
      logger.error('Error deleting logotype', error);
      throw new HttpException(500, 'Could not delete logotype');
    }
  }
}
