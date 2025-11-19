import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import ApiService, { ApiResponse } from '@/services/api.service';
import {
  buildRecipientListFromPersonnumber,
  buildRecipientsList,
  checkEligibilityKivra,
  Citizenaddress,
  fetchCitizen,
  RecipientWithAddress,
} from '@/services/recipient.service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import authMiddleware from '@middlewares/auth.middleware';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import { Body, Controller, Get, Param, Post, Req, Res, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Response } from 'express';

class RecipientBody {
  @IsString()
  personnumber: string;
}

class RequestBodyEligibility {
  @IsString()
  @IsNotEmpty({ message: 'partyId is required.' })
  partyId: string;
}

@Controller()
export class RecipientController {
  private apiService = new ApiService();

  @Post('/recipients/')
  @OpenAPI({ summary: 'Build list of recipients from CSV file' })
  @UseBefore(authMiddleware)
  async recipients(
    @Req() req: RequestWithUser,
    @Res() response: any,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
  ): Promise<{
    data: RecipientWithAddress[];
    message: string;
  }> {
    const base64String = files[0].buffer.toString('base64');
    const data = Buffer.from(base64String, 'base64').toString('utf-8');
    const recipientsWithAddresses = await buildRecipientsList(req.user, this.apiService, data).catch(e => {
      if (e.message === 'MAX_RECIPIENT_ROW_SIZE') {
        throw new HttpException(400, 'MAX_RECIPIENT_ROW_SIZE');
      }
      if (e.message === 'NO_VALID_ADDRESSES') {
        throw new HttpException(400, 'NO_VALID_ADDRESSES');
      }
    });
    return response
      .send({ data: recipientsWithAddresses, message: 'success' } as {
        data: RecipientWithAddress[];
        message: string;
      })
      .status(200);
  }

  @Post('/recipient')
  @OpenAPI({ summary: 'Build list with single recipient from personal number' })
  @UseBefore(authMiddleware)
  async recipient(
    @Req() req: RequestWithUser,
    @Body() body: RecipientBody,
    @Res() response: any,
  ): Promise<{
    data: RecipientWithAddress[];
    message: string;
  }> {
    const recipientWithAddresses = await buildRecipientListFromPersonnumber(
      req.user,
      this.apiService,
      body.personnumber,
    );
    return response
      .send({ data: recipientWithAddresses, message: 'success' } as {
        data: RecipientWithAddress[];
        message: string;
      })
      .status(200);
  }

  @Post('/eligibility-kivra')
  @OpenAPI({ summary: 'Checks if the recipients are eligible for Kivra' })
  async checkEligibilityKivra(
    @Body() body: RequestBodyEligibility,
    @Req() req: RequestWithUser,
    @Res() response: Response,
  ) {
    const requestBody = plainToInstance(RequestBodyEligibility, body);
    const errors = await validate(requestBody);

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        property: err.property,
        message: Object.values(err.constraints || {})[0],
      }));

      return response.status(400).send({
        message: 'Validation for eligibility failed',
        errors: formattedErrors,
      });
    }

    const { partyId } = body;
    const result = await checkEligibilityKivra(partyId, req.user);
    return response.status(200).send({ data: result, message: 'success' });
  }

  @Get('/citizen/:personId')
  @OpenAPI({ summary: 'Return person address by personId' })
  @UseBefore(authMiddleware)
  async getCitizen(
    @Req() req: RequestWithUser,
    @Param('personId') personId: string,
    @Res() response: Response<ApiResponse<Citizenaddress>>,
  ): Promise<Response<ApiResponse<Citizenaddress>>> {
    const citizenaddress = await fetchCitizen(req.user, this.apiService, personId);

    return response.status(200).send({
      data: citizenaddress,
      message: 'success',
    });
  }
}
