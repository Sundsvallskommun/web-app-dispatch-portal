import { HttpException } from '@/exceptions/HttpException';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { Response } from 'express';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { getApiBase, MUNICIPALITY_ID } from '@config';
import { MessagingSettings } from '@/data-contracts/messaging-settings/data-contracts';
import { RequestWithUser } from '@interfaces/auth.interface';
import { MessagingSettingsApiResponse } from '@/responses/messaging-settings.response';
import { Logotype } from '@interfaces/logotypes.interface';

@Controller()
@UseBefore(authMiddleware)
export class MessagingSettingsController {
  private readonly apiService = new ApiService();
  private readonly apiBase = getApiBase('messaging-settings');
  private readonly baseUrl = `${this.apiBase}/${MUNICIPALITY_ID}`;

  @Get('/logotypes')
  @OpenAPI({ summary: 'Get host logotypes' })
  @ResponseSchema(MessagingSettingsApiResponse)
  async getHostLogotypes(
    @Req() req: RequestWithUser,
    @Res() res: Response<MessagingSettingsApiResponse>,
  ): Promise<Response<MessagingSettingsApiResponse>> {
    const { host } = req.session;

    if (!host) {
      throw new HttpException(400, 'Bad request: missing host');
    }

    const splitHost = host.split('.')[0];
    const hostName = splitHost === 'localhost' ? 'sundsvall' : splitHost;

    try {
      const filter = `values.key = 'host' and values.value = '${hostName}'`;
      const url = `${this.baseUrl}?filter=${encodeURIComponent(filter)}`;
      const result = await this.apiService.get<MessagingSettings[]>({ url }, req.user);

      const LOGOTYPE_KEYS = ['host', 'display_name', 'logotype_lightmode', 'logotype_darkmode'] as const;
      type LogotypeKey = (typeof LOGOTYPE_KEYS)[number];

      const hostLogotype: Logotype[] = result.data.map(d => {
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
        };
      });

      return res.send({ message: 'success', data: hostLogotype ?? [] });
    } catch (error) {
      logger.error('Error getting host logotypes', error);
      throw new HttpException(500, 'Could not get host logotypes');
    }
  }
}
