import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import ApiService from '@/services/api.service';
import { buildRecipientListFromPersonnumber, buildRecipientsList, RecipientWithAddress } from '@/services/recipient.service';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import authMiddleware from '@middlewares/auth.middleware';
import { IsString } from 'class-validator';
import { Body, Controller, Post, Req, Res, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
class RecipientBody {
  @IsString()
  personnumber: string;
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
    const recipientsWithAddresses = await buildRecipientsList(this.apiService, data).catch(e => {
      if (e.message === 'MAX_RECIPIENT_ROW_SIZE') {
        throw new HttpException(400, 'MAX_RECIPIENT_ROW_SIZE');
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
    const recipientWithAddresses = await buildRecipientListFromPersonnumber(this.apiService, body.personnumber);
    return response
      .send({ data: recipientWithAddresses, message: 'success' } as {
        data: RecipientWithAddress[];
        message: string;
      })
      .status(200);
  }
}
