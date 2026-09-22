import { Address, ESigningSignatory, Recipient } from '@/data-contracts/postportalservice/data-contracts';
import {
  EsigningSignatoryList,
  RequestBodyCsvMail,
  RequestBodyCsvSMS,
  RequestBodyEsigning,
  RequestBodyMail,
  RequestBodyRecMail,
  RequestBodySMS,
} from '@/dtos/message.dto';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { MessageResponse } from '@/interfaces/message.interface';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import { MessageApiResponse } from '@/responses/message.response';
import ApiService from '@/services/api.service';
import {
  logError,
  sendEsigning,
  sendLetter,
  sendLetterCsv,
  sendRecLetter,
  sendSmsMessage,
  sendSmsMessageCsv,
} from '@/services/message.service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import { logger } from '@/utils/logger';
import { validateRequestBody } from '@/utils/validate';
import authMiddleware from '@middlewares/auth.middleware';
import { Response } from 'express';
import { Body, Controller, Post, Req, Res, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
export class MessageController {
  private readonly apiService = new ApiService();

  @Post('/sms')
  @OpenAPI({ summary: 'Send SMS to recipients' })
  @UseBefore(authMiddleware, hasPermissions(['canSendSMS']))
  async sendSMS(@Body() body: RequestBodySMS, @Req() req: RequestWithUser, @Res() response: Response) {
    const { message, recipients } = body;
    const res = await sendSmsMessage(req, this.apiService, recipients, message).catch(e => {
      logError('Error when sending sms', e);
      throw new Error('Error when sending sms');
    });

    return response.send({ data: res, message: 'success' }).status(200);
  }

  @Post('/csv-sms/')
  @OpenAPI({ summary: 'Send sms to recipients from csv file' })
  @UseBefore(authMiddleware, hasPermissions(['canSendSMS']))
  async sendCsvSMS(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyCsvSMS,
    @Res() response: Response<MessageResponse>,
  ): Promise<Response<MessageResponse>> {
    try {
      const csvFile = req.session.csv.id === body.csvId ? req.session.csv.file : null;

      if (!csvFile) {
        throw new HttpException(400, 'Csv file missing');
      }

      const res = await sendSmsMessageCsv(req, this.apiService, {
        message: body.message,
        csvFile,
      });

      return response.send({ data: res, message: 'success' });
    } catch (error) {
      logger.error('Error sending csv sms message', error);
      throw new HttpException(500, 'Internal server error');
    }
  }

  @Post('/message/')
  @OpenAPI({ summary: 'Send attachment to recipients' })
  @UseBefore(authMiddleware, hasPermissions(['canSendLetter']))
  @ResponseSchema(MessageApiResponse)
  async recipients(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyMail,
    @Res() response: Response<MessageResponse>,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
  ): Promise<Response<MessageResponse>> {
    let recipients: Recipient[];
    let addresses: Address[];
    try {
      recipients = JSON.parse(body.recipients);
      addresses = JSON.parse(body.addresses);
    } catch (error) {
      throw new Error('Could not parse recipient list');
    }

    const res = await sendLetter(
      req,
      this.apiService,
      recipients,
      { subject: body.subject, body: body.body, files },
      addresses,
    )
      .then(async res => {
        return res;
      })
      .catch(e => {
        logError('Error when sending letter', e);
        throw e;
      });

    return response.send({ data: res, message: 'success' });
  }

  @Post('/rec-message/')
  @OpenAPI({ summary: 'Send attachment as registered letter to recipients' })
  @UseBefore(authMiddleware, hasPermissions(['canSendRegisteredLetter']))
  async sendRecMessage(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyRecMail,
    @Res() response: Response<MessageResponse>,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
  ): Promise<Response<MessageResponse>> {
    const res = await sendRecLetter(req, this.apiService, {
      recipientPersonId: body.recipientPersonId,
      subject: body.subject,
      body: body.body,
      files,
    })
      .then(async res => {
        return res;
      })
      .catch(e => {
        logError('Error when sending letter', e);
        throw new Error('Error when sending message');
      });

    return response.status(200).send({ data: res, message: 'success' });
  }

  /* Add canSendEsigning permission check when it's available */
  @Post('/e-signing/')
  @OpenAPI({ summary: 'Send documents for signing to signatories' })
  @UseBefore(authMiddleware)
  @ResponseSchema(MessageApiResponse)
  async sendEsigningMessage(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyEsigning,
    @Res() response: Response<MessageResponse>,
    @UploadedFiles('files', { options: fileUploadOptions, required: true }) files: Express.Multer.File[],
  ): Promise<Response<MessageResponse>> {
    let signatories: ESigningSignatory[];
    try {
      signatories = JSON.parse(body.signatories);
    } catch (error) {
      throw new HttpException(400, 'Could not parse signatory list');
    }

    await validateRequestBody(EsigningSignatoryList, { signatories });

    const document = files.find(file => file.originalname === body.document);

    if (!document) {
      throw new HttpException(400, 'Signing document missing');
    }

    const attachments = files.filter(file => file !== document);

    const res = await sendEsigning(req, this.apiService, signatories, {
      subject: body.subject,
      document,
      attachments,
    });

    return response.send({ data: res, message: 'success' });
  }

  @Post('/csv-message/')
  @OpenAPI({ summary: 'Send attachment to recipients from csv file' })
  @UseBefore(authMiddleware, hasPermissions(['canSendLetter']))
  async sendCsvMessage(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyCsvMail,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
    @Res() response: Response<MessageResponse>,
  ): Promise<Response<MessageResponse>> {
    try {
      const csvFile = req.session.csv.id === body.csvId ? req.session.csv.file : null;

      if (!csvFile) {
        throw new HttpException(400, 'Csv file missing');
      }

      const res = await sendLetterCsv(req, this.apiService, {
        subject: body.subject,
        body: body.body,
        files,
        csvFile,
      });

      return response.send({ data: res, message: 'success' });
    } catch (error) {
      logger.error('Error sending csv message', error);
      throw new HttpException(500, 'Internal server error');
    }
  }
}
