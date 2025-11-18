import { MUNICIPALITY_ID } from '@/config';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { BatchStatus, DeliveryInformation, MessageInformation } from '@/interfaces/batch-status.interface';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import ApiService from '@/services/api.service';
import { logError, MessageResponse, sendLetter, sendLetterCsv, sendRecLetter, sendSmsMessage } from '@/services/message.service';
import { Citizenaddress, RecipientWithAddress } from '@/services/recipient.service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import { logger } from '@/utils/logger';
import authMiddleware from '@middlewares/auth.middleware';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Req, Res, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

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
  private apiService = new ApiService();
  SERVICE = `messaging/7.9`;

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
  async recipients(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyMail,
    @Res() response: Response<MessageResponse>,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
  ): Promise<Response<MessageResponse>> {
    let recipients: RecipientWithAddress[];
    let addresses;
    try {
      recipients = JSON.parse(body.recipients);
      addresses = JSON.parse(body.addresses);
    } catch (error) {
      throw new Error('Could not parse recipient list');
    }

    const res = await sendLetter(req.user, this.apiService, recipients, { subject: body.subject, body: body.body, files }, addresses)
      .then(async res => {
        return res;
      })
      .catch(e => {
        logError('Error when sending letter', e);
        throw new Error('Error when sending message');
      });

    return response.status(200).send({ data: res, message: 'success' } as MessageResponse);
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

    return response.status(200).send({ data: res, message: 'success' } as MessageResponse);
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

    return response.status(200).send({ data: res, message: 'success' } as MessageResponse);
  }

  @Get('/batchstatus/:id')
  @OpenAPI({ summary: 'Return batch status' })
  async status(@Req() req: RequestWithUser, @Param('id') id: string) {
    const url = `${this.SERVICE}/${MUNICIPALITY_ID}/status/batch/${id}`;
    const res = await this.apiService.get<BatchStatus>({ url }, req.user).catch(e => {
      logger.error('Error when fetching batch status:', e);
      return e;
    });

    return res.data;
  }

  @Get('/message/:id')
  @OpenAPI({ summary: 'Return message information' })
  async messageInfo(@Req() req: RequestWithUser, @Param('id') id: string) {
    const url = `${this.SERVICE}/${MUNICIPALITY_ID}/message/${id}`;
    const res = await this.apiService.get<MessageInformation>({ url }, req.user).catch(e => {
      logger.error('Error when fetching message information:', e);
      return e;
    });

    return res.data;
  }

  @Get('/batchmessages/:id')
  @OpenAPI({ summary: 'Return messages information for batch' })
  async batchMessagesInfo(@Req() req: RequestWithUser, @Param('id') id: string) {
    const url = `${this.SERVICE}/${MUNICIPALITY_ID}/status/batch/${id}`;
    const messagePromises: Promise<MessageInformation>[] = await this.apiService
      .get<BatchStatus>({ url }, req.user)
      .then(b => {
        return b.data.messages.map(m => {
          const messageUrl = `${this.SERVICE}/${MUNICIPALITY_ID}/message/${m.messageId}`;
          return this.apiService
            .get<DeliveryInformation[]>({ url: messageUrl }, req.user)
            .then(async res => {
              const deliveryPromises = res.data.map(async delivery => {
                if (Object.keys(delivery.content).includes('party')) {
                  const partyId = delivery.content['party']['partyIds'] || delivery.content['party']['partyId'];
                  if (partyId) {
                    const citizenUrl = `citizen/3.0/${partyId}`;
                    const person = await this.apiService.get<Citizenaddress>({ url: citizenUrl }, req.user).catch(e => {
                      logError('Error when fetching recipient adress', e);
                      return undefined;
                    });
                    return { delivery, recipient: person.data };
                  } else {
                    const errorMessage = 'No partyId for reciever, cannot fetch adress.';
                    logger.error(errorMessage);
                    console.error(errorMessage);
                    return undefined;
                  }
                }
              });
              const deliveries: { delivery: DeliveryInformation; recipient: Citizenaddress }[] = await Promise.allSettled(deliveryPromises).then(s =>
                s.map(ss => (ss.status === 'fulfilled' ? ss.value : ss.reason)),
              );
              return {
                messageId: m.messageId,
                deliveries: deliveries,
              } as MessageInformation;
            })
            .catch(e => {
              logger.error('Error when fetching message information:', e);
              return e;
            });
        });
      })
      .catch(e => {
        logger.error('Error when fetching batch status:', e);
        return e;
      });

    return await Promise.all(messagePromises);
  }
}
