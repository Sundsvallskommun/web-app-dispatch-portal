import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Organization } from '@/interfaces/organization.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { COMPANY_IDS, MUNICIPALITY_ID } from '@/config';
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
  private readonly apiService = new ApiService();
  SERVICE = 'company/1.0';

  @Get('/departments')
  @OpenAPI({ summary: 'Return all available departments (and companies)' })
  @UseBefore(authMiddleware)
  async getMergedDepartments(@Req() req: RequestWithUser, @Res() response: any): Promise<any> {
    try {
      const [departmentsResult, companiesResult] = await Promise.all([
        this.apiService.get<Organization>({ url: `company/1.0/${MUNICIPALITY_ID}/13/orgtree` }, req.user),
        this.apiService.get<Organization[]>({ url: `company/1.0/${MUNICIPALITY_ID}/orgnodesroot` }, req.user),
      ]);

      const departments = findDepartments(departmentsResult.data);
      const companyIds = parseEnvIds(COMPANY_IDS);
      const filteredCompanies = companiesResult.data.filter(org => companyIds.includes(org.orgId));
      const mergedSortedResult = [...departments, ...filteredCompanies].sort((a, b) =>
        a.orgName.localeCompare(b.orgName),
      );

      return response.send(mergedSortedResult);
    } catch (error) {
      throw new HttpException(500, 'Error getting departments');
    }
  }
  @Get('/my-department')
  @OpenAPI({ summary: 'Return all available departments (and companies)' })
  @UseBefore(authMiddleware)
  async getMyDepartment(@Req() req: RequestWithUser, @Res() response: any): Promise<any> {
    const user = req.user;
    const orgtree = user.orgTree ?? '';

    const SYMPOL = '\u00A4';
    const raw = orgtree?.trim() ?? '';

    if (!raw) {
      return response.send('');
    }

    const [firstEntry] = raw.split(SYMPOL);

    if (!firstEntry) {
      return response.send('');
    }

    const parts = firstEntry.split('|');

    const departmentName = parts.length === 3 ? parts[2].trim() : '';

    return response.send(departmentName);
  }
}
