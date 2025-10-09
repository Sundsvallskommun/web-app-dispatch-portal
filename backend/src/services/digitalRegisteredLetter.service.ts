import ApiService from '@/services/api.service';
import { MUNICIPALITY_ID } from '@/config';
import { RequestWithUser } from '@/interfaces/auth.interface';

interface EligibilityItemDto {
  partyIds: string[];
}

interface EligibilityItemResponseDto {
  partyId: string;
  hasKivra: boolean;
}

export class DigitalRegisteredLetterService {
  private readonly apiService = new ApiService();
  private readonly SERVICE = `digitalregisteredletter/2.3`;

  async checkEligibilityKivra(partyId: string, user: RequestWithUser['user']): Promise<EligibilityItemResponseDto> {
    const data: EligibilityItemDto = { partyIds: [partyId] };
    const url = `${this.SERVICE}/${MUNICIPALITY_ID}/eligibility/kivra`;

    try {
      const res = await this.apiService.post<string[], EligibilityItemDto>({ url, data }, user);
      const hasKivra = res.data.includes(partyId);
      return { partyId, hasKivra };
    } catch (e) {
      console.error('Error when checking eligibility:', e);
      throw new Error('Error when checking eligibility');
    }
  }
}
