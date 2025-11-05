import { MUNICIPALITY_ID, SMS_SENDER } from '@/config';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { BatchStatus, DeliveryInformation, MessageInformation } from '@/interfaces/batch-status.interface';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import ApiService from '@/services/api.service';
import { MessageResponse, sendLetter, sendRecLetter } from '@/services/message.service';
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

interface SMSDTO {
  sender: string;
  message: string;
  parties: { mobileNumber: string }[];
  priority: 'NORMAL' | 'HIGH';
}

interface SMSReponse {
  batchId: string;
  messages: {
    messageId: string;
    deliveries: {
      deliveryId: string;
      messageType: string;
    }[];
  }[];
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
    const data: SMSDTO = {
      message,
      parties: recipients.map(rec => ({ mobileNumber: rec })),
      sender: SMS_SENDER,
      priority: 'HIGH',
    };
    const url = `${this.SERVICE}/${MUNICIPALITY_ID}/sms/batch`;
    const res = await this.apiService.post<SMSReponse, SMSDTO>({ url, data }, req.user).catch(e => {
      console.log('Error when sending sms:', e);
      throw new Error('Error when sending sms');
    });

    return response.send({ data: res.data, message: 'success' }).status(200);
  }

  @Post('/message/')
  @OpenAPI({ summary: 'Send attachment to recipients' })
  @UseBefore(authMiddleware)
  async recipients(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyMail,
    @Res() response: any,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
  ): Promise<{
    data: MessageResponse;
    message: string;
  }> {
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
        console.log('Error when sending letter:', e);
        throw new Error('Error when sending message');
      });

    return response
      .send({ data: res, message: 'success' } as {
        data: MessageResponse;
        message: string;
      })
      .status(200);
  }

  @Post('/rec-message/')
  @OpenAPI({ summary: 'Send attachment to recipients' })
  @UseBefore(authMiddleware)
  async sendRecMessage(
    @Req() req: RequestWithUser,
    @Body() body: RequestBodyRecMail,
    @Res() response: any,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
  ): Promise<{
    data: MessageResponse;
    message: string;
  }> {
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
        console.log('Error when sending letter:', e);
        throw new Error('Error when sending message');
      });

    return response
      .send({ data: res, message: 'success' } as {
        data: MessageResponse;
        message: string;
      })
      .status(200);
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
                      logger.error('Error when fetching recipient adress:', e);
                      console.log('Error when fetching recipient adress:', e);
                      return undefined;
                    });
                    return { delivery, recipient: person.data };
                  } else {
                    logger.error('No partyId for reciever, cannot fetch adress.');
                    console.log('No partyId for reciever, cannot fetch adress.');
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
