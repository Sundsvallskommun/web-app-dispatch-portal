import ApiService from '@/services/api.service';
import { MUNICIPALITY_ID } from '@/config';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { logger } from '@/utils/logger';

interface EligibilityItemDto {
  partyIds: string[];
}

interface EligibilityItemResponseDto {
  partyId: string;
  hasKivra: boolean;
}

export class DigitalRegisteredLetterService {
  private readonly apiService = new ApiService();
  private readonly SERVICE = `digitalregisteredletter/2.4`;

  async checkEligibilityKivra(partyId: string, user: RequestWithUser['user']): Promise<EligibilityItemResponseDto> {
    const data: EligibilityItemDto = { partyIds: [partyId] };
    const url = `${this.SERVICE}/${MUNICIPALITY_ID}/eligibility/kivra`;

    try {
      const res = await this.apiService.post<string[], EligibilityItemDto>({ url, data }, user);
      const hasKivra = res.data.includes(partyId);
      return { partyId, hasKivra };
    } catch (e) {
      const errorMessage = 'Error when checking eligibility';
      console.error(`${errorMessage}:`, e);
      logger.error(`${errorMessage}:`, e);
      throw new Error(errorMessage);
    }
  }
}
