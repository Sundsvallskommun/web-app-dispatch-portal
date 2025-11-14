import { UpdateLogotypeDto } from '@/dtos/logotype.dto';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import adminMiddleware from '@/middlewares/admin.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import formDataMiddleware from '@/middlewares/formdata.middleware';
import { LogotypeApiResponse, LogotypesApiResponse } from '@/responses/logotype.response';
import { ApiResponse } from '@/services/api.service';
import { imageUploadOptions } from '@/utils/imageUploadOptions';
import { logger } from '@/utils/logger';
import prisma from '@/utils/prisma';
import { dataDir, dataPath } from '@/utils/util';
import { Response } from 'express';
import { unlink } from 'node:fs';
import multer from 'multer';
import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
@UseBefore(authMiddleware)
@UseBefore(adminMiddleware)
export class AdminLogotypeController {
  @Get('/admin/logotypes')
  @OpenAPI({ summary: 'Get all logotypes' })
  @ResponseSchema(LogotypesApiResponse)
  async getLogotypes(@Req() req: RequestWithUser, @Res() response: Response<LogotypesApiResponse>): Promise<Response<LogotypesApiResponse>> {
    if (!req.user) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      const data = await prisma.logotype.findMany();

      return response.send({ data, message: 'success' });
    } catch (error) {
      logger.error('Error getting logotypes', error);

      throw new HttpException(error?.status ?? 500, error?.message ?? 'Could not get logotypes');
    }
  }

  @Get('/admin/logotypes/:id')
  @ResponseSchema(LogotypeApiResponse)
  @OpenAPI({ summary: 'Get logotype by id' })
  async getLogotype(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Res() response: Response<LogotypeApiResponse>,
  ): Promise<Response<LogotypeApiResponse>> {
    if (!req.user) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      const data = await prisma.logotype.findFirst({
        where: { id },
        include: { municipalities: true, organizations: true },
      });

      return response.send({ data, message: 'success' });
    } catch (error) {
      logger.error('Error getting logotype', error);

      throw new HttpException(error?.status ?? 500, error?.message ?? 'Could not get logotype');
    }
  }

  // NOTE: @UploadedFile can't handle multiple fields.
  @Post('/admin/logotypes')
  @ResponseSchema(LogotypeApiResponse)
  @OpenAPI({ summary: 'Create logotype' })
  @UseBefore(
    multer(imageUploadOptions).fields([
      { name: 'logotypeLightMode', maxCount: 1 },
      { name: 'logotypeDarkMode', maxCount: 1 },
    ]),
  )
  @UseBefore(formDataMiddleware)
  @Header('Content-Type', 'multi-part/')
  async createLogotype(@Req() req: RequestWithUser, @Res() response: Response<LogotypeApiResponse>): Promise<Response<LogotypeApiResponse>> {
    if (!req.user) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      const logotypeLightMode: Express.Multer.File = req.files['logotypeLightMode'][0];
      const logotypeDarkMode: Express.Multer.File = req.files?.['logotypeDarkMode']?.[0];
      const logotypeResponse = await prisma.logotype.create({
        data: {
          name: logotypeLightMode.originalname,
          filenameLightMode: logotypeLightMode.filename,
          urlLightMode: `${dataPath(logotypeLightMode.filename)}`,
          filenameDarkMode: logotypeDarkMode?.filename ? logotypeDarkMode.filename : undefined,
          urlDarkMode: logotypeDarkMode?.filename ? `${dataPath(logotypeDarkMode.filename)}` : undefined,
        },
      });
      return response.send({ message: 'success', data: logotypeResponse });
    } catch (error) {
      logger.error('Error saving logotype', error);
      throw new HttpException(error?.status ?? 500, error?.message ?? 'Could not create logotype');
    }
  }

  // NOTE: @UploadedFile can't handle multiple fields.
  @Patch('/admin/logotypes/:id')
  @ResponseSchema(LogotypeApiResponse)
  @OpenAPI({ summary: 'Update logotype' })
  @UseBefore(formDataMiddleware)
  @UseBefore(
    multer(imageUploadOptions).fields([
      { name: 'logotypeLightMode', maxCount: 1 },
      { name: 'logotypeDarkMode', maxCount: 1 },
    ]),
  )
  async updateLogotype(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() body: UpdateLogotypeDto,
    @Res() response: Response<LogotypeApiResponse>,
  ): Promise<Response<LogotypeApiResponse>> {
    if (!req.user) {
      throw new HttpException(400, 'Bad Request');
    }
    const { removeDarkMode, name } = body;

    try {
      const logotypeLightMode: Express.Multer.File = req.files?.['logotypeLightMode']?.[0];
      const logotypeDarkMode: Express.Multer.File = req.files?.['logotypeDarkMode']?.[0];

      const oldData = await prisma.logotype.findFirst({ where: { id } });
      const urlDarkMode = logotypeDarkMode?.filename ? `${dataPath(logotypeDarkMode?.filename)}` : undefined;
      const data = await prisma.logotype.update({
        where: { id },
        data: {
          name,
          filenameLightMode: logotypeLightMode?.filename,
          urlLightMode: logotypeLightMode?.filename ? `${dataPath(logotypeLightMode?.filename)}` : undefined,
          filenameDarkMode: removeDarkMode ? null : logotypeDarkMode?.filename,
          urlDarkMode: removeDarkMode ? null : urlDarkMode,
        },
      });

      if (logotypeLightMode) {
        unlink(`${dataDir('uploads')}/${oldData.filenameLightMode}`, err => {
          if (err) {
            logger.error('Error deleting old lightmode logotype', err);
            throw new HttpException(500, 'Internal Server Error');
          }
        });
      }

      if ((logotypeDarkMode || removeDarkMode) && oldData.filenameDarkMode) {
        unlink(`${dataDir('uploads')}/${oldData.filenameDarkMode}`, err => {
          if (err) {
            logger.error('Error deleting old lightmode logotype', err);
            throw new HttpException(500, 'Internal Server Error');
          }
        });
      }

      return response.send({ message: 'success', data });
    } catch (error) {
      logger.error('Error updating logotype', error);
      throw new HttpException(error?.status ?? 500, error?.message ?? 'Could not update logotype');
    }
  }

  @Delete('/admin/logotypes/:id')
  @ResponseSchema(ApiResponse<null>)
  @OpenAPI({ summary: 'Update logotype' })
  async deleteLogotype(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Res() response: Response<ApiResponse<null>>,
  ): Promise<Response<ApiResponse<null>>> {
    if (!req.user) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      const logotype = await prisma.logotype.findFirst({
        where: { id },
        include: { municipalities: true, organizations: true },
      });

      if (logotype.municipalities && logotype.municipalities.length > 0) {
        throw new HttpException(409, 'Logotype is in use');
      }
      if (logotype.organizations && logotype.organizations.length > 0) {
        throw new HttpException(409, 'Logotype is in use');
      }

      await prisma.logotype.delete({
        where: { id },
      });

      unlink(`${dataDir('uploads')}/${logotype.filenameLightMode}`, err => {
        if (err) {
          logger.error('Error deleting lightmode logotype', err);
          throw new HttpException(500, 'Internal Server Error');
        }
      });
      if (logotype.filenameDarkMode) {
        unlink(`${dataDir('uploads')}/${logotype.filenameDarkMode}`, err => {
          if (err) {
            logger.error('Error deleting darkmode logotype', err);
            throw new HttpException(500, 'Internal Server Error');
          }
        });
      }

      return response.send({ data: null, message: 'success' });
    } catch (error) {
      logger.error('Error deleting logotype', error);
      throw new HttpException(error?.status ?? 500, error?.message ?? 'Could not delete logotype');
    }
  }
}
