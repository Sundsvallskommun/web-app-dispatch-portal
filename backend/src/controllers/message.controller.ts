import { Address, Recipient } from '@/data-contracts/postportalservice/data-contracts';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { MessageResponse } from '@/interfaces/message.interface';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import { MessageApiResponse } from '@/responses/message.response';
import ApiService from '@/services/api.service';
import { logError, sendLetter, sendLetterCsv, sendRecLetter, sendSmsMessage } from '@/services/message.service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import authMiddleware from '@middlewares/auth.middleware';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import { Response } from 'express';
import { Body, Controller, Post, Req, Res, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

class RequestBodyMail {
  @IsString()
  recipients: string;
  @IsString()
  addresses: string;
  subject: string;
  body: string;
}
class RequestBodyRecMail {
  @IsString()
  recipientPersonId: string;
  @IsString()
  subject: string;
  body: string;
}

class RequestBodySMS {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  recipients: string[];
  @IsString()
  message: string;
}

@Controller()
export class MessageController {
  private readonly apiService = new ApiService();

  @Post('/sms')
  @OpenAPI({ summary: 'Send SMS to recipients' })
  @UseBefore(authMiddleware, hasPermissions(['canSendSMS']))
  async sendSMS(@Body() body: RequestBodySMS, @Req() req: RequestWithUser, @Res() response: Response) {
    const { message, recipients } = body;
    const res = await sendSmsMessage(req.user, this.apiService, recipients, message).catch(e => {
      logError('Error when sending sms', e);
      throw new Error('Error when sending sms');
    });

    return response.send({ data: res, message: 'success' }).status(200);
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
      req.user,
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
        throw new Error('Error when sending message');
      });

    return response.send({ data: res, message: 'success' });
  }

  @Post('/rec-message/')
  @OpenAPI({ summary: 'Send attachment to recipients' })
  @UseBefore(authMiddleware, hasPermissions(['canSendRegisteredLetter']))
  async sendRecMessage(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyRecMail,
    @Res() response: Response<MessageResponse>,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
  ): Promise<Response<MessageResponse>> {
    const res = await sendRecLetter(req.user, this.apiService, {
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

  @Post('/csv-message/')
  @OpenAPI({ summary: 'Send attachment to recipients' })
  @UseBefore(authMiddleware)
  async sendCsvMessage(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyRecMail,
    @Res() response: Response<MessageResponse>,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
    @UploadedFiles('csv-file', { options: fileUploadOptions, required: false }) csvFile: Express.Multer.File,
  ): Promise<Response<MessageResponse>> {
    const res = await sendLetterCsv(req.user, this.apiService, {
      subject: body.subject,
      body: body.body,
      files,
      csvFile,
    })
      .then(async res => {
        return res;
      })
      .catch(e => {
        logError('Error when sending csv letter', e);
        throw new Error('Error when sending csv message');
      });

    return response.status(200).send({ data: res, message: 'success' });
  }
}
