import { CreateHostDto, UpdateHostDto } from '@/dtos/host.dto';
import { HttpException } from '@/exceptions/HttpException';
import adminMiddleware from '@/middlewares/admin.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { HostApiResponse, HostsApiResponse } from '@/responses/host.response';
import { ApiResponse } from '@/services/api.service';
import { logger } from '@/utils/logger';
import prisma from '@/utils/prisma';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
@UseBefore(authMiddleware)
@UseBefore(adminMiddleware)
export class AdminHostController {
  @Get('/admin/hosts')
  @OpenAPI({ summary: 'Get all hosts' })
  @ResponseSchema(HostsApiResponse)
  async getAll(@Res() res: Response<HostsApiResponse>): Promise<Response<HostsApiResponse>> {
    try {
      const hosts = await prisma.host.findMany({ include: { idp: true } });
      return res.send({ message: 'success', data: hosts ?? [] });
    } catch (error) {
      logger.error('Error getting hosts', error);
      throw new HttpException(500, 'Could not get hosts');
    }
  }

  @Get('/admin/hosts/:id')
  @OpenAPI({ summary: 'Get host by id' })
  @ResponseSchema(HostApiResponse)
  async getOne(@Param('id') id: number, @Res() res: Response<HostApiResponse>): Promise<Response<HostApiResponse>> {
    try {
      const host = await prisma.host.findFirst({ where: { id }, include: { idp: true } });

      if (host) {
        return res.send({ message: 'success', data: host });
      } else {
        throw new HttpException(404, 'Could not find host');
      }
    } catch (error) {
      logger.error('Error getting host', error);
      throw new HttpException(500, 'Could not get host');
    }
  }

  @Post('/admin/hosts')
  @OpenAPI({ summary: 'Create new host' })
  @ResponseSchema(HostApiResponse)
  async create(@Body() body: CreateHostDto, @Res() res: Response<HostApiResponse>): Promise<Response<HostApiResponse>> {
    try {
      const { municipalityId, name, idpId } = body;
      const host = await prisma.host.create({
        data: { municipalityId, name, idpId },
        include: { idp: true },
      });
      return res.send({ message: 'success', data: host });
    } catch (error) {
      logger.error('Error creating host', error);
      throw new HttpException(500, 'Could not create host');
    }
  }

  @Patch('/admin/hosts/:id')
  @OpenAPI({ summary: 'Update a host' })
  @ResponseSchema(HostApiResponse)
  async update(
    @Body() body: UpdateHostDto,
    @Param('id') id: number,
    @Res() res: Response<HostApiResponse>,
  ): Promise<Response<HostApiResponse>> {
    try {
      const { municipalityId, name, idpId } = body;
      const host = await prisma.host.update({
        where: { id },
        data: { municipalityId, name, idpId },
        include: { idp: true },
      });
      return res.send({ message: 'success', data: host });
    } catch (error) {
      logger.error('Error updating host', error);
      throw new HttpException(500, 'Could not updating host');
    }
  }
  @Delete('/admin/hosts/:id')
  @OpenAPI({ summary: 'Delete a host' })
  @ResponseSchema(ApiResponse<null>)
  async remove(@Param('id') id: number, @Res() res: Response<ApiResponse<null>>): Promise<Response<ApiResponse<null>>> {
    try {
      await prisma.host.delete({ where: { id } });
      return res.send({ message: 'success', data: null });
    } catch (error) {
      logger.error('Error deleting host', error);
      throw new HttpException(500, 'Could not deleting host');
    }
  }
}
