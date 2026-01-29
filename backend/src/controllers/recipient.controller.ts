import { getApiBase } from '@/config';
import { CitizenExtended } from '@/data-contracts/citizen/data-contracts';
import {
  KivraEligibilityRequest,
  PrecheckCsvResponse,
  PrecheckRequest,
  PrecheckResponse,
  RecipientDeliveryMethodEnum,
} from '@/data-contracts/postportalservice/data-contracts';
import { RecipientDto } from '@/dtos/recipient.dto';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CSVError, CSVStatus, ExtendedRecipient } from '@/interfaces/recipient.interface';
import { Csv, CsvApiResponse, RecipientApiResponse, RecipientNameApiResponse } from '@/responses/recipient.response';
import ApiService from '@/services/api.service';
import { appendCsvFile } from '@/utils/csv-service/csv-service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import { logger } from '@/utils/logger';
import authMiddleware from '@middlewares/auth.middleware';
import { Response } from 'express';
import { randomUUID } from 'node:crypto';
import { Body, Controller, Get, Param, Post, QueryParam, Req, Res, UploadedFile, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import FormData from 'form-data';
import { getMunicipalityId } from '@/utils/getMunicipalityId';

@Controller()
export class RecipientController {
  private readonly apiService = new ApiService();
  private readonly citizenApi = getApiBase('citizen');
  private readonly postportalApi = getApiBase('postportalservice');

  @Post('/recipient')
  @OpenAPI({ summary: 'Get single recipient from personal number' })
  @UseBefore(authMiddleware)
  @ResponseSchema(RecipientApiResponse)
  async recipient(
    @Req() req: RequestWithUser,
    @Body() body: RecipientDto,
    @QueryParam('force_kivra') force_kivra: boolean,
    @Res() response: Response<RecipientApiResponse>,
  ): Promise<Response<RecipientApiResponse>> {
    try {
      const municipalityId = await getMunicipalityId(req);
      const partyIdUrl = `${this.citizenApi}/${municipalityId}/${body.personNumber}/guid`;
      const { data: partyId } = await this.apiService.get<string>({ url: partyIdUrl }, req.user);
      const citizenUrl = `${this.citizenApi}/${municipalityId}/${partyId}`;
      const { data: citizen } = await this.apiService.get<CitizenExtended>({ url: citizenUrl }, req.user);

      if (!citizen) {
        throw new HttpException(404, 'Citizen not found');
      }

      const precheckUrl = `${this.postportalApi}/${municipalityId}/precheck`;
      const {
        data: { recipients },
      } = await this.apiService.post<PrecheckResponse, PrecheckRequest>(
        { url: precheckUrl, data: { partyIds: [partyId] } },
        req.user,
      );

      const recipient = recipients[0];

      if (!recipient) {
        throw new HttpException(404, 'Citizen message settings not found');
      }

      let data: ExtendedRecipient = {
        partyId,
        deliveryMethod: recipient.deliveryMethod as unknown as RecipientDeliveryMethodEnum,
        reason: recipient.reason,
        address: {
          firstName: citizen.givenname,
          lastName: citizen.lastname,
          street: citizen.addresses[0].address,
          careOf: citizen.addresses[0].co,
          zipCode: citizen.addresses[0].postalCode,
          city: citizen.addresses[0].city,
          country: citizen.addresses[0].country,
        },
        personNumber: body.personNumber,
      };

      if (force_kivra) {
        const checkKivraUrl = `${precheckUrl}/kivra`;
        const { data: validIds } = await this.apiService.post<string[], KivraEligibilityRequest>(
          { url: checkKivraUrl, data: { partyIds: [partyId] } },
          req.user,
        );
        if (!validIds.includes(partyId)) {
          data.deliveryMethod = RecipientDeliveryMethodEnum.DELIVERY_NOT_POSSIBLE;
          data.reason = 'No kivra';
        }
      }

      return response.send({ data, message: 'success' });
    } catch (error) {
      logger.error('Error getting recipient', error);
      throw new HttpException(error?.code ?? 500, error?.message ?? 'Internal server error');
    }
  }

  @Get('/recipient/:personId/name')
  @OpenAPI({ summary: 'Return person name by personId' })
  @UseBefore(authMiddleware)
  @ResponseSchema(RecipientNameApiResponse)
  async getCitizen(
    @Req() req: RequestWithUser,
    @Param('personId') personId: string,
    @Res() response: Response<RecipientNameApiResponse>,
  ): Promise<Response<RecipientNameApiResponse>> {
    try {
      const municipalityId = await getMunicipalityId(req);
      const citizenUrl = `${this.citizenApi}/${municipalityId}/${personId}`;
      const { data: citizen } = await this.apiService.get<CitizenExtended>({ url: citizenUrl }, req.user);

      return response.send({
        data: `${citizen.givenname} ${citizen.lastname}`,
        message: 'success',
      });
    } catch (error) {
      logger.error('Error getting citizen', error);
      throw new HttpException(error?.code ?? 500, error?.message ?? 'Internal server error');
    }
  }

  @Post('/recipient/csv')
  @OpenAPI({ summary: 'Check status of csv-file and save to session' })
  @UseBefore(authMiddleware)
  @ResponseSchema(CsvApiResponse)
  async getCsvStatus(
    @Req() req: RequestWithUser,
    @UploadedFile('csv', { options: fileUploadOptions, required: true }) csvFile: Express.Multer.File,
    @Res() response: Response<CsvApiResponse>,
  ): Promise<Response<CsvApiResponse>> {
    try {
      const municipalityId = await getMunicipalityId(req);
      const url = `${this.postportalApi}/${municipalityId}/precheck/csv`;
      const data = new FormData();
      appendCsvFile(csvFile, 'csv-file', data);

      const csvcheck = await this.apiService.post<PrecheckCsvResponse, FormData>(
        { url, data, headers: { 'Content-Type': 'multipart/form-data' } },
        req.user,
      );

      const id = randomUUID();
      if (csvcheck) {
        const data: Csv = {
          id,
          status: CSVStatus.Ok,
          name: csvFile.originalname,
          duplicateEntries: csvcheck?.data?.duplicateEntries,
          rejectedEntries: csvcheck?.data?.rejectedEntries,
        };
        req.session.csv = { ...data, file: csvFile };
        return response.send({ message: 'success', data });
      } else {
        const data = {
          id,
          status: CSVStatus.Bad,
          error: CSVError.Unknown,
          name: csvFile.originalname,
        };
        return response.send({ message: 'success', data });
      }
    } catch (error) {
      logger.error('Error checking csv-file', error);
      const data = {
        id: '',
        status: CSVStatus.Bad,
        error: error?.message.toLowerCase().startsWith('no valid partyids found')
          ? CSVError.MissingValidIds
          : CSVError.Unknown,
        name: csvFile.originalname,
      };
      return response.send({ message: 'success', data });
    }
  }
}
