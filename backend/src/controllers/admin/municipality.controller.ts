import { CreateMunicipalityDto, UpdateMunicipalityDto } from '@/dtos/municipality.dto';
import { HttpException } from '@/exceptions/HttpException';
import adminMiddleware from '@/middlewares/admin.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { MunicipalitiesApiResponse, MunicipalityApiResponse } from '@/responses/municipality.response';
import { ApiResponse } from '@/services/api.service';
import { logger } from '@/utils/logger';
import prisma from '@/utils/prisma';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
@UseBefore(authMiddleware)
@UseBefore(adminMiddleware)
export class AdminMunicipalityController {
  @Get('/admin/municipalities')
  @OpenAPI({ summary: 'Get all municipalities' })
  @ResponseSchema(MunicipalitiesApiResponse)
  async getMunicipalities(@Res() res: Response<MunicipalitiesApiResponse>): Promise<Response<MunicipalitiesApiResponse>> {
    try {
      const municipalities = await prisma.municipality.findMany({ include: { logotype: true } });
      return res.send({ message: 'success', data: municipalities ?? [] });
    } catch (error) {
      logger.error('Error getting municipalities', error);
      throw new HttpException(500, 'Could not get municipalities');
    }
  }

  @Get('/admin/municipalities/:id')
  @OpenAPI({ summary: 'Get municipality by id' })
  @ResponseSchema(MunicipalityApiResponse)
  async getMunicipality(@Param('id') id: number, @Res() res: Response<MunicipalityApiResponse>): Promise<Response<MunicipalityApiResponse>> {
    try {
      const municipality = await prisma.municipality.findFirst({ where: { id }, include: { logotype: true } });

      if (municipality) {
        return res.send({ message: 'success', data: municipality });
      } else {
        throw new HttpException(404, 'Could not find municipality');
      }
    } catch (error) {
      logger.error('Error getting municipality', error);
      throw new HttpException(500, 'Could not get municipality');
    }
  }

  @Post('/admin/municipalities')
  @OpenAPI({ summary: 'Create new municipality' })
  @ResponseSchema(MunicipalityApiResponse)
  async createMunicipality(
    @Body() body: CreateMunicipalityDto,
    @Res() res: Response<MunicipalityApiResponse>,
  ): Promise<Response<MunicipalityApiResponse>> {
    try {
      const municipality = await prisma.municipality.create({ data: body, include: { logotype: true } });
      return res.send({ message: 'success', data: municipality });
    } catch (error) {
      logger.error('Error creating municipality', error);
      throw new HttpException(500, 'Could not create municipality');
    }
  }

  @Patch('/admin/municipalities/:id')
  @OpenAPI({ summary: 'Update a municipality' })
  @ResponseSchema(MunicipalityApiResponse)
  async updateMunicipality(
    @Body() body: UpdateMunicipalityDto,
    @Param('id') id: number,
    @Res() res: Response<MunicipalityApiResponse>,
  ): Promise<Response<MunicipalityApiResponse>> {
    try {
      const municipality = await prisma.municipality.update({ where: { id }, data: body, include: { logotype: true } });
      return res.send({ message: 'success', data: municipality });
    } catch (error) {
      logger.error('Error updating municipality', error);
      throw new HttpException(500, 'Could not updating municipality');
    }
  }
  @Delete('/admin/municipalities/:id')
  @OpenAPI({ summary: 'Delete a municipality' })
  @ResponseSchema(ApiResponse<null>)
  async deleteMunicipality(@Param('id') id: number, @Res() res: Response<ApiResponse<null>>): Promise<Response<ApiResponse<null>>> {
    try {
      await prisma.municipality.delete({ where: { id } });
      return res.send({ message: 'success', data: null });
    } catch (error) {
      logger.error('Error deleting municipality', error);
      throw new HttpException(500, 'Could not deleting municipality');
    }
  }
}
