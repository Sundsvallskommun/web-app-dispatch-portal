import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Organization } from '@/interfaces/organization.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

const findDepartments = (org: Organization) => {
  const allDeps = [];
  if (org.treeLevel === 2) {
    const neworg = { ...org };
    if (neworg.organizations) {
      delete neworg.organizations;
    }
    allDeps.push(neworg);
  } else {
    if (org.organizations.length > 0) {
      for (let index = 0; index < org.organizations.length; index++) {
        const subDeps = findDepartments(org.organizations[index]);
        allDeps.push(...subDeps);
      }
    }
  }
  return allDeps;
};

@Controller()
export class DepartmentsController {
  apiService = new ApiService();

  @Get('/departments')
  @OpenAPI({ summary: 'Return all available departments' })
  @UseBefore(authMiddleware)
  async getDepartments(@Req() req: RequestWithUser, @Res() response: any): Promise<any> {
    try {
      const orgtree = await this.apiService.get<Organization>({ url: 'mdviewer/1.0/13/orgtree' });
      const departments = findDepartments(orgtree.data);

      return response.send(departments);
    } catch (error) {
      throw new HttpException(500, 'Error getting org tree');
    }
  }
}
