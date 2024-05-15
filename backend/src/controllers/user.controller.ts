import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Permissions } from '@/interfaces/users.interface';
import ApiService from '@/services/api.service';
import authMiddleware from '@middlewares/auth.middleware';
import { Controller, Get, Header, QueryParam, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

interface UserData {
  name: string;
  givenName: string;
  surname: string;
  username: string;
  permissions: Permissions;
  email: string;
  avatar?: any;
  orgTree?: any;
}

@Controller()
export class UserController {
  apiService = new ApiService();

  @Get('/me')
  @OpenAPI({ summary: 'Return current user' })
  @UseBefore(authMiddleware)
  async getUser(@Req() req: RequestWithUser, @Res() response: any): Promise<UserData> {
    const { name, username, givenName, surname, permissions, email, orgTree } = req.user;

    if (!name) {
      throw new HttpException(400, 'Bad Request');
    }
    const userData: UserData = {
      name,
      username,
      givenName,
      surname,
      permissions,
      email,
      orgTree,
    };

    return response.send({ data: userData, message: 'success' });
  }

  @Get('/user/avatar')
  @OpenAPI({ summary: 'Return logged in person image' })
  @UseBefore(authMiddleware)
  @Header('Content-Type', 'image/jpeg')
  @Header('Cross-Origin-Embedder-Policy', 'require-corp')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  async getMyEmployeeImage(@Req() req: RequestWithUser, @QueryParam('width') width): Promise<any> {
    const { personId } = req.user;

    if (!personId) {
      throw new HttpException(400, 'Bad Request');
    }

    const url = `employee/1.0/${personId}/personimage`;
    const res = await this.apiService.get<any>({
      url,
      responseType: 'arraybuffer',
      params: {
        width: width,
      },
    });
    return res.data;
  }
}
