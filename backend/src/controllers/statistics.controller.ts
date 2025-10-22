import { Controller, Get, Header, Param, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { HttpException } from '@exceptions/HttpException';
import ApiService from '@services/api.service';
import authMiddleware from '@middlewares/auth.middleware';
import { DepartmentStatistics } from '@interfaces/statistics.interface';
import { MUNICIPALITY_ID } from '@/config';
import { RecLetter, SigningInfo, UserBatches, UserMessage, UserMessages, UserRecLetters } from '@/interfaces/my-statistics.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { logger } from '@/utils/logger';

@Controller()
export class StatisticsController {
  apiService = new ApiService();
  SERVICE = `messaging/7.7`;
  REC_SERVICE = `digitalregisteredletter/2.4`;

  @Get('/statistics/departments')
  @OpenAPI({ summary: 'Return department statistics' })
  @UseBefore(authMiddleware)
  async getStatistics(@Req() req: RequestWithUser, @Res() response: any): Promise<DepartmentStatistics> {
    try {
      const { from, to } = req.query;
      const url = `${this.SERVICE}/${MUNICIPALITY_ID}/statistics/departments`;
      const result = await this.apiService.get<DepartmentStatistics[]>({ url, params: { from, to } }, req.user);
      const statistics = [];

      result.data?.forEach(dep => {
        dep.DEPARTMENT_STATISTICS.forEach(stats => {
          statistics.push({
            department: stats.DEPARTMENT,
            snailMail: {
              sent: stats.SNAIL_MAIL?.sent,
              failed: stats.SNAIL_MAIL?.failed,
            },
            digitalMail: {
              sent: stats.DIGITAL_MAIL?.sent,
              failed: stats.DIGITAL_MAIL?.failed,
            },
          });
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
  async getMyStatistics(@Req() req: RequestWithUser, @Res() response: any): Promise<UserBatches> {
    try {
      const { username } = req.user;
      const url = `${this.SERVICE}/${MUNICIPALITY_ID}/users/${username}/batches`;
      const params = { limit: 9000 };
      const result = await this.apiService.get<UserBatches>({ url, params }, req.user);

      return response.send(result.data);
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }

  @Get('/my-rec-letters')
  @OpenAPI({ summary: 'Return my rec letters array' })
  @UseBefore(authMiddleware)
  async getMyRecLetters(@Req() req: RequestWithUser, @Res() response: any): Promise<UserRecLetters> {
    try {
      const url = `${this.REC_SERVICE}/${MUNICIPALITY_ID}/letters`;
      const params = { limit: 9000 };
      const result = await this.apiService.get<UserRecLetters>({ url, params }, req.user);

      return response.send(result.data);
    } catch (error) {
      logger.error('Error getting statistics of rec letters: ', error);
      throw new HttpException(500, 'Error getting statistics of rec letters');
    }
  }

  @Get('/my-statistics/:id')
  @OpenAPI({ summary: 'Return my statistics' })
  @UseBefore(authMiddleware)
  async getMyStatisticsMessage(@Req() req: RequestWithUser, @Res() response: any, @Param('id') id: string): Promise<UserMessage> {
    try {
      const { username } = req.user;
      const url = `${this.SERVICE}/${MUNICIPALITY_ID}/users/${username}/messages`;
      const params = { limit: 9000, batchId: id };
      const result = await this.apiService.get<UserMessages>({ url, params }, req.user);

      return response.send(result.data.messages);
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }

  @Get('/my-rec-letters/:id')
  @OpenAPI({ summary: 'Return my rec letter' })
  @UseBefore(authMiddleware)
  async getMyRecLetter(@Req() req: RequestWithUser, @Res() response: any, @Param('id') id: string): Promise<RecLetter> {
    try {
      const url = `${this.REC_SERVICE}/${MUNICIPALITY_ID}/letters/${id}`;
      const params = { limit: 9000 };
      const result = await this.apiService.get<RecLetter>({ url, params }, req.user);

      return response.send(result.data);
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }

  @Get('/signing-info/:id')
  @OpenAPI({ summary: 'Return signing info' })
  @UseBefore(authMiddleware)
  async getSigningInfo(@Req() req: RequestWithUser, @Res() response: any, @Param('id') id: string): Promise<SigningInfo> {
    try {
      const url = `${this.REC_SERVICE}/${MUNICIPALITY_ID}/letters/${id}/signinginfo`;
      const params = { limit: 9000 };
      const result = await this.apiService.get<SigningInfo>({ url, params }, req.user);

      return response.send(result.data);
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }

  @Get('/my-statistics/attachment/:messageId/:fileName')
  @Header('Cross-Origin-Embedder-Policy', 'require-corp')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  @Header('Content-Type', 'application/pdf')
  @OpenAPI({ summary: 'Return the attachment' })
  @UseBefore(authMiddleware)
  async getAttachment(
    @Req() req: RequestWithUser,
    @Param('messageId') messageId: string,
    @Param('fileName') fileName: string,
    @Res() response: any,
  ): Promise<any> {
    try {
      const url = `${this.SERVICE}/${MUNICIPALITY_ID}/messages/${messageId}/attachments/${fileName}`;
      const result = await this.apiService.get({ url, responseType: 'arraybuffer' }, req.user);
      // NOTE: send the raw file
      return result.data;
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }

  @Get('/my-rec-letters/attachment/:letterId/:attachmentId')
  @Header('Cross-Origin-Embedder-Policy', 'require-corp')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  @Header('Content-Type', 'application/pdf')
  @OpenAPI({ summary: 'Return the attachment' })
  @UseBefore(authMiddleware)
  async getRecAttachment(
    @Req() req: RequestWithUser,
    @Param('letterId') letterId: string,
    @Param('attachmentId') attachmentId: string,
    @Res() response: any,
  ): Promise<any> {
    try {
      const url = `${this.REC_SERVICE}/${MUNICIPALITY_ID}/letters/${letterId}/attachments/${attachmentId}`;
      const result = await this.apiService.get({ url, responseType: 'arraybuffer' }, req.user);
      // NOTE: send the raw file
      return result.data;
    } catch (error) {
      logger.error('Error getting statistics: ', error);
      throw new HttpException(500, 'Error getting statistics');
    }
  }
}
