import { CreateIdpDto, UpdateIdpDto } from '@/dtos/idp.dto';
import { HttpException } from '@/exceptions/HttpException';
import adminMiddleware from '@/middlewares/admin.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { IDPApiResponse, IDPsApiResponse } from '@/responses/idp.response';
import { ApiResponse } from '@/services/api.service';
import { logger } from '@/utils/logger';
import prisma from '@/utils/prisma';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
@UseBefore(authMiddleware)
@UseBefore(adminMiddleware)
export class AdminIdpController {
  @Get('/admin/idps')
  @OpenAPI({ summary: 'Get all idps' })
  @ResponseSchema(IDPsApiResponse)
  async getAll(@Res() res: Response<IDPsApiResponse>): Promise<Response<IDPsApiResponse>> {
    try {
      const idps = await prisma.iDP.findMany();
      return res.send({ message: 'success', data: idps ?? [] });
    } catch (error) {
      logger.error('Error getting idps', error);
      throw new HttpException(500, 'Could not get idps');
    }
  }

  @Get('/admin/idps/:id')
  @OpenAPI({ summary: 'Get idp by id' })
  @ResponseSchema(IDPApiResponse)
  async getOne(@Param('id') id: number, @Res() res: Response<IDPApiResponse>): Promise<Response<IDPApiResponse>> {
    try {
      const idp = await prisma.iDP.findFirst({ where: { id } });

      if (idp) {
        return res.send({ message: 'success', data: idp });
      } else {
        throw new HttpException(404, 'Could not find idp');
      }
    } catch (error) {
      logger.error('Error getting idp', error);
      throw new HttpException(500, 'Could not get idp');
    }
  }

  @Post('/admin/idps')
  @OpenAPI({ summary: 'Create new idp' })
  @ResponseSchema(IDPApiResponse)
  async create(@Body() body: CreateIdpDto, @Res() res: Response<IDPApiResponse>): Promise<Response<IDPApiResponse>> {
    try {
      const { name, entryPoint, idpCert } = body;
      const idp = await prisma.iDP.create({
        data: { name, entryPoint, idpCert },
      });
      return res.send({ message: 'success', data: idp });
    } catch (error) {
      logger.error('Error creating idp', error);
      throw new HttpException(500, 'Could not create idp');
    }
  }

  @Patch('/admin/idps/:id')
  @OpenAPI({ summary: 'Update a idp' })
  @ResponseSchema(IDPApiResponse)
  async update(
    @Body() body: UpdateIdpDto,
    @Param('id') id: number,
    @Res() res: Response<IDPApiResponse>,
  ): Promise<Response<IDPApiResponse>> {
    try {
      const { name, entryPoint, idpCert } = body;
      const idp = await prisma.iDP.update({
        where: { id },
        data: { name, entryPoint, idpCert },
      });
      return res.send({ message: 'success', data: idp });
    } catch (error) {
      logger.error('Error updating idp', error);
      throw new HttpException(500, 'Could not updating idp');
    }
  }
  @Delete('/admin/idps/:id')
  @OpenAPI({ summary: 'Delete a idp' })
  @ResponseSchema(ApiResponse<null>)
  async remove(@Param('id') id: number, @Res() res: Response<ApiResponse<null>>): Promise<Response<ApiResponse<null>>> {
    try {
      await prisma.iDP.delete({ where: { id } });
      return res.send({ message: 'success', data: null });
    } catch (error) {
      logger.error('Error deleting idp', error);
      throw new HttpException(500, 'Could not deleting idp');
    }
  }
}
