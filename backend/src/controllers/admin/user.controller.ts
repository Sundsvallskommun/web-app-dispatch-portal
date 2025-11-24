import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { AdminUserData } from '@/interfaces/user.interface';
import adminMiddleware from '@/middlewares/admin.middleware';
import { AdminUserApiResponse } from '@/responses/user.response';
import authMiddleware from '@middlewares/auth.middleware';
import { Response } from 'express';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
@UseBefore(authMiddleware)
@UseBefore(adminMiddleware)
export class AdminUserController {
  @Get('/admin/me')
  @OpenAPI({ summary: 'Return current admin user' })
  @ResponseSchema(AdminUserApiResponse)
  async getUser(
    @Req() req: RequestWithUser,
    @Res() response: Response<AdminUserApiResponse>,
  ): Promise<Response<AdminUserApiResponse>> {
    const { name, username, givenName, surname } = req.user;

    if (!name) {
      throw new HttpException(400, 'Bad Request');
    }
    const userData: AdminUserData = {
      name,
      username,
      givenName,
      surname,
    };

    return response.send({ data: userData, message: 'success' });
  }
}
