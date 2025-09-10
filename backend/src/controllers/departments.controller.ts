import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Organization } from '@/interfaces/organization.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { DEPARTMENT_IDS, MUNICIPALITY_ID } from '@/config';
import { parseEnvIds } from '@/utils/parseEnvIds';

const findDepartments = (org: Organization): Organization[] => {
  if (org.treeLevel === 2) {
    const { organizations, ...department } = org;
    return [department];
  }

  return (org.organizations ?? []).flatMap(findDepartments);
};

@Controller()
export class DepartmentsController {
  apiService = new ApiService();

  @Get('/departments')
  @OpenAPI({ summary: 'Return all available departments (and organizations)' })
  @UseBefore(authMiddleware)
  async getMergedDepartments(@Req() req: RequestWithUser, @Res() response: any): Promise<any> {
    try {
      const [orgtreeResult, orgnodesResultResult] = await Promise.all([
        this.apiService.get<Organization>({ url: `company/1.0/${MUNICIPALITY_ID}/13/orgtree` }, req.user),
        this.apiService.get<Organization[]>({ url: `company/1.0/${MUNICIPALITY_ID}/orgnodesroot` }, req.user),
      ]);

      const departments = findDepartments(orgtreeResult.data);
      const organizationIds = parseEnvIds(DEPARTMENT_IDS);
      const filteredOrgnodes = orgnodesResultResult.data.filter(org => organizationIds.includes(org.orgId));
      const mergedResult = [...departments, ...filteredOrgnodes];

      return response.send(mergedResult);
    } catch (error) {
      throw new HttpException(500, 'Error getting departments');
    }
  }
}
