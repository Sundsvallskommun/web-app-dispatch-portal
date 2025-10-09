import { RequestWithUser } from '@/interfaces/auth.interface';
import { DigitalRegisteredLetterService } from '@/services/digitalRegisteredLetter.service';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import { Response } from 'express';
import { Body, Controller, Post, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

class RequestBodyEligibility {
  @IsString()
  @IsNotEmpty({ message: 'partyId is required.' })
  partyId: string;
}

@Controller()
export class DigitalRegisteredletterController {
  private readonly service = new DigitalRegisteredLetterService();

  @Post('/eligibility-kivra')
  @OpenAPI({ summary: 'Checks if the recipients are eligible for Kivra' })
  async checkEligibilityKivra(@Body() body: RequestBodyEligibility, @Req() req: RequestWithUser, @Res() response: Response) {
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
    const result = await this.service.checkEligibilityKivra(partyId, req.user);
    return response.status(200).send({ data: result, message: 'success' });
  }
}
