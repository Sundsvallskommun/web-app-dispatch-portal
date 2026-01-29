import { getApiBase } from '@/config';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { SigningInfo, UserLetters, UserMessage } from '@/interfaces/my-statistics.interface';
import { getMunicipalityId } from '@/utils/getMunicipalityId';
import { logger } from '@/utils/logger';
import { HttpException } from '@exceptions/HttpException';
import { DepartmentStatistics } from '@interfaces/statistics.interface';
import authMiddleware from '@middlewares/auth.middleware';
import ApiService from '@services/api.service';
import { Response } from 'express';
import { Controller, Get, Header, HttpError, Param, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
export class StatisticsController {
  private readonly apiService = new ApiService();
  POSTPORTALSERVICE_PATH = getApiBase('postportalservice');

  @Get('/statistics/departments')
  @OpenAPI({ summary: 'Return department statistics' })
  @UseBefore(authMiddleware)
  async getStatistics(@Req() req: RequestWithUser, @Res() response: any): Promise<DepartmentStatistics> {
    try {
      const municipalityId = await getMunicipalityId(req);
      const { year, month } = req.query;
      const url = `${this.POSTPORTALSERVICE_PATH}/${municipalityId}/statistics/departments`;
      const result = await this.apiService.get<DepartmentStatistics[]>({ url, params: { year, month } }, req.user);
      const statistics = [];

      result.data?.forEach(dep => {
        statistics.push({
          department: dep.name,
          snailMail: dep.snailMail,
          digitalMail: dep.digitalMail,
          registeredMail: dep.digitalRegisteredLetter,
          sms: dep.sms,
        });
      });

      return response.send(statistics);
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }

  @Get('/my-statistics')
  @OpenAPI({ summary: 'Return my statistics' })
  @UseBefore(authMiddleware)
  async getMyStatistics(
    @Req() req: RequestWithUser,
    @Res() response: Response<UserLetters>,
  ): Promise<Response<UserLetters>> {
    try {
      const municipalityId = await getMunicipalityId(req);
      const { username } = req.user;
      const url = `${this.POSTPORTALSERVICE_PATH}/${municipalityId}/history/users/${username}/messages`;
      const params = { page: 0, size: 9000, sort: 'subject' };
      const result = await this.apiService.get<UserLetters>({ url, params }, req.user);

      return response.send(result.data);
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }

  @Get('/my-statistics/:id')
  @OpenAPI({ summary: 'Return my statistics message' })
  @UseBefore(authMiddleware)
  async getMyStatisticsMessage(
    @Req() req: RequestWithUser,
    @Res() response: any,
    @Param('id') id: string,
  ): Promise<UserMessage> {
    try {
      const municipalityId = await getMunicipalityId(req);
      const { username } = req.user;
      const url = `${this.POSTPORTALSERVICE_PATH}/${municipalityId}/history/users/${username}/messages/${id}`;
      const result = await this.apiService.get<UserMessage>({ url }, req.user);

      const message = result.data;

      return response.send(message);
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }

  @Get('/signing-info/:id')
  @OpenAPI({ summary: 'Return signing info' })
  @UseBefore(authMiddleware)
  async getSigningInfo(
    @Req() req: RequestWithUser,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    const municipalityId = await getMunicipalityId(req);
    try {
      const url = `${this.POSTPORTALSERVICE_PATH}/${municipalityId}/history/messages/${id}/signinginfo`;
      const params = { limit: 9000 };
      const result = await this.apiService.get<SigningInfo>({ url, params }, req.user);

      return response.status(200).json(result.data);
    } catch (error) {
      if (response.status(502)) {
        return response.status(404).json({
          message: `Signing information belonging to letter with id '${id}' and municipalityId '${municipalityId}' not found`,
        });
      }
      logger.error('Error getting signing info: ', error);
      return response.status(500).json({ message: 'Error getting signing info' });
    }
  }

  @Get('/receipt/:id')
  @OpenAPI({ summary: 'Return receipt PDF' })
  @UseBefore(authMiddleware)
  async getReceipt(@Req() req: RequestWithUser, @Res() res: Response, @Param('id') id: string): Promise<any> {
    try {
      const municipalityId = await getMunicipalityId(req);
      const url = `${this.POSTPORTALSERVICE_PATH}/${municipalityId}/history/messages/${id}/receipt`;

      const result = await this.apiService.get(
        {
          url,
          responseType: 'arraybuffer',
        },
        req.user,
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="receipt-${id}.pdf"`);

      return res.status(200).send(result.data);
    } catch (error) {
      const err = error as HttpError;
      logger.error('Error receipt: ', error);
      return res.status(err.httpCode).json({ message: `Error downloading receipt: ${err.message}` });
    }
  }

  @Get('/my-statistics/attachment/:attachmentId')
  @Header('Cross-Origin-Embedder-Policy', 'require-corp')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  @Header('Content-Type', 'application/pdf')
  @OpenAPI({ summary: 'Return the attachment' })
  @UseBefore(authMiddleware)
  async getAttachment(@Req() req: RequestWithUser, @Param('attachmentId') attachmentId: string): Promise<any> {
    try {
      const municipalityId = await getMunicipalityId(req);
      const url = `${this.POSTPORTALSERVICE_PATH}/${municipalityId}/attachments/${attachmentId}`;
      const result = await this.apiService.get({ url, responseType: 'arraybuffer' }, req.user);
      // NOTE: send the raw file
      return result.data;
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }
}
