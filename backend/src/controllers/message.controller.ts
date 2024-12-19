import { MUNICIPALITY_ID } from '@/config';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { BatchStatus, DeliveryInformation, MessageInformation } from '@/interfaces/batch-status.interface';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import ApiService from '@/services/api.service';
import { LetterResponse, sendLetter } from '@/services/message.service';
import { Citizenaddress, RecipientWithAddress } from '@/services/recipient.service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import { logger } from '@/utils/logger';
import authMiddleware from '@middlewares/auth.middleware';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import  { Response } from 'express';
import { Body, Controller, Get, Param, Post, Req, Res, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

class RequestBodyMail {
  @IsString()
  recipients: string;
  subject: string;
  body: string;
  department: string;
}

class RequestBodySMS  {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  recipients: string[];
  @IsString()
  message: string;
}

interface smsDTO {
  sender: string;
  message: string;
  parties: { mobileNumber: string }[];
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
  SERVICE = `messaging/6.0`;

  @Post('/sms')
  @OpenAPI({ summary: 'Send SMS to recipients' })
  @UseBefore(authMiddleware, hasPermissions(['canSendSMS']))
  async sendSMS(@Body() body: RequestBodySMS, @Res() response: Response) {
    const { message, recipients } = body;
    const data = {
      message,
      parties: recipients.map(rec => ({ 'mobileNumber': rec })),
      sender: 'svallkommun',
    }
    const url = `messaging/5.4/${MUNICIPALITY_ID}/sms/batch`;
    const res = await this.apiService.post<SMSReponse, smsDTO>({ url, data }).catch(e => {
      console.log('Error when sending sms:', e);
      throw new Error('Error when sending sms');
    });

    return response
      .send({ data: res.data, message: 'success' })
      .status(200);
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
    data: { recipients: RecipientWithAddress[]; response: LetterResponse };
    message: string;
  }> {
    let recipients: RecipientWithAddress[];
    try {
      recipients = JSON.parse(body.recipients);
    } catch (error) {
      throw new Error('Could not parse recipient list');
    }

    const res = await sendLetter(req.user, this.apiService, recipients, body.subject, body.body, body.department, files)
      .then(async res => {
        // TODO do not send status email for now
        // const emailAddress = DEV ? TEST_EMAIL : req.user.email;
        // const senderPersonId = req.user.personId;
        // const emailBody = `Ett meddelande har skickats: ${process.env.SAML_SUCCESS_REDIRECT}status/${res.response.batchId}`;
        // await sendEmail(this.apiService, senderPersonId, emailAddress, emailBody);
        return res;
      })
      .catch(e => {
        console.log('Error when sending letter:', e);
        throw new Error('Error when sending message');
      });

    return response
      .send({ data: res, message: 'success' } as {
        data: { recipients: RecipientWithAddress[]; response: LetterResponse };
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
                    const citizenUrl = `citizen/2.0/${partyId}`;
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
