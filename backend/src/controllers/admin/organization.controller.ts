import { CreateOrganizationDto, UpdateOrganizationDto } from '@/dtos/organization.dto';
import { HttpException } from '@/exceptions/HttpException';
import adminMiddleware from '@/middlewares/admin.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { OrganizationApiResponse, OrganizationsApiResponse } from '@/responses/organization.response';
import { ApiResponse } from '@/services/api.service';
import { logger } from '@/utils/logger';
import prisma from '@/utils/prisma';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
@UseBefore(authMiddleware)
@UseBefore(adminMiddleware)
export class AdminOrganizationController {
  @Get('/admin/organizations')
  @OpenAPI({ summary: 'Get all organizations' })
  @ResponseSchema(OrganizationsApiResponse)
  async getOrganizations(@Res() res: Response<OrganizationsApiResponse>): Promise<Response<OrganizationsApiResponse>> {
    try {
      const organizations = await prisma.organization.findMany({ include: { logotype: true, municipality: true } });
      return res.send({ message: 'success', data: organizations ?? [] });
    } catch (error) {
      logger.error('Error getting organizations', error);
      throw new HttpException(500, 'Could not get organizations');
    }
  }

  @Get('/admin/organizations/:id')
  @OpenAPI({ summary: 'Get organization by id' })
  @ResponseSchema(OrganizationApiResponse)
  async getOrganization(@Param('id') id: number, @Res() res: Response<OrganizationApiResponse>): Promise<Response<OrganizationApiResponse>> {
    try {
      const organization = await prisma.organization.findFirst({ where: { id }, include: { logotype: true, municipality: true } });

      if (organization) {
        return res.send({ message: 'success', data: organization });
      } else {
        throw new HttpException(404, 'Could not find organization');
      }
    } catch (error) {
      logger.error('Error getting organization', error);
      throw new HttpException(500, 'Could not get organization');
    }
  }

  @Post('/admin/organizations')
  @OpenAPI({ summary: 'Create new organization' })
  @ResponseSchema(OrganizationApiResponse)
  async createOrganization(
    @Body() body: CreateOrganizationDto,
    @Res() res: Response<OrganizationApiResponse>,
  ): Promise<Response<OrganizationApiResponse>> {
    try {
      const organization = await prisma.organization.create({ data: body, include: { logotype: true, municipality: true } });
      return res.send({ message: 'success', data: organization });
    } catch (error) {
      logger.error('Error creating organization', error);
      throw new HttpException(500, 'Could not create organization');
    }
  }

  @Patch('/admin/organizations/:id')
  @OpenAPI({ summary: 'Update a organization' })
  @ResponseSchema(OrganizationApiResponse)
  async updateOrganization(
    @Body() body: UpdateOrganizationDto,
    @Param('id') id: number,
    @Res() res: Response<OrganizationApiResponse>,
  ): Promise<Response<OrganizationApiResponse>> {
    try {
      const organization = await prisma.organization.update({ where: { id }, data: body, include: { logotype: true, municipality: true } });
      return res.send({ message: 'success', data: organization });
    } catch (error) {
      logger.error('Error updating organization', error);
      throw new HttpException(500, 'Could not updating organization');
    }
  }

  @Delete('/admin/organizations/:id')
  @OpenAPI({ summary: 'Delete a organization' })
  @ResponseSchema(ApiResponse<null>)
  async deleteOrganization(@Param('id') id: number, @Res() res: Response<ApiResponse<null>>): Promise<Response<ApiResponse<null>>> {
    try {
      await prisma.organization.delete({ where: { id } });
      return res.send({ message: 'success', data: null });
    } catch (error) {
      logger.error('Error deleting organization', error);
      throw new HttpException(500, 'Could not deleting organization');
    }
  }
}
