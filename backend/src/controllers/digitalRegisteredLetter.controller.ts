import { RequestWithUser } from '@/interfaces/auth.interface';
import { DigitalRegisteredLetterService } from '@/services/digitalRegisteredLetter.service';
import { IsArray, IsString } from 'class-validator';
import { Response } from 'express';
import { Body, Controller, Post, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

class RequestBodyEligibility {
  @IsArray()
  @IsString({ each: true })
  partyIds: string[];
}

@Controller()
export class DigitalRegisteredletterController {
  private readonly service = new DigitalRegisteredLetterService();

  @Post('/eligibility-kivra')
  @OpenAPI({ summary: 'Checks if the recipients are eligible for Kivra' })
  async checkEligibilityKivra(@Body() body: RequestBodyEligibility, @Req() req: RequestWithUser, @Res() response: Response) {
    const { partyIds } = body;

    if (!partyIds || partyIds.length === 0) {
      return response.status(400).send({
        message: 'At least one partyId is required.',
        code: 'EMPTY_PARTY_IDS',
      });
    }

    if (partyIds.length > 1) {
      return response.status(400).send({
        message: 'Only one partyId can be checked at a time.',
        code: 'MULTIPLE_PARTY_IDS_NOT_ALLOWED',
      });
    }

    const result = await this.service.checkEligibilityKivra(partyIds, req.user);
    return response.status(200).send({ data: result, message: 'success' });
  }
}
