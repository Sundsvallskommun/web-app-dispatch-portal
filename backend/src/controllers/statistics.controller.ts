import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { HttpException } from '@exceptions/HttpException';
import ApiService from '@services/api.service';
import authMiddleware from '@middlewares/auth.middleware';
import { DepartmentStatistics } from '@interfaces/statistics.interface';
import { MUNICIPALITY_ID } from '@/config';

@Controller()
export class StatisticsController {
  apiService = new ApiService();
  @Get('/statistics/departments')
  @OpenAPI({ summary: 'Return department statistics' })
  @UseBefore(authMiddleware)
  async getStatistics(@Res() response: any, @Req() request: any): Promise<DepartmentStatistics> {
    try {
      const { from, to } = request.query;
      const url = `messaging/5.4/${MUNICIPALITY_ID}/statistics/departments`;
      const result = await this.apiService.get<DepartmentStatistics[]>({ url, params: { from, to } });
      const statistics = [];

      result.data?.forEach(dep => {
        dep.DEPARTMENT_STATISTICS.map(stats => {
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
      throw new HttpException(500, 'Error getting statistics');
    }
  }
}
