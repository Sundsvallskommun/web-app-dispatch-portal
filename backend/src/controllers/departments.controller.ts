import { RequestWithUser } from '@/interfaces/auth.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
export class DepartmentsController {
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
