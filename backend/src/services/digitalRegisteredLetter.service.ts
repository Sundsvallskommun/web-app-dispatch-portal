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

interface EligibilityResponseDto {
  results: EligibilityItemResponseDto[];
}

export class DigitalRegisteredletterService {
  private apiService = new ApiService();
  private SERVICE = `digitalregisteredletter/2.3`;
  private eligibilityCache: Map<string, boolean> = new Map();

  async checkEligibilityKivra(partyIds: string[], user: RequestWithUser['user']): Promise<EligibilityResponseDto> {
    const partyIdsReq: string[] = [];
    const results: EligibilityItemResponseDto[] = [];

    for (const id of partyIds) {
      const cacheKey = `${user.id}-${id}`;
      if (this.eligibilityCache.has(cacheKey)) {
        results.push({ partyId: id, hasKivra: this.eligibilityCache.get(cacheKey)! });
      } else {
        partyIdsReq.push(id);
      }
    }

    if (partyIdsReq.length > 0) {
      const data = { partyIds: partyIdsReq };
      const url = `${this.SERVICE}/${MUNICIPALITY_ID}/eligibility/kivra`;

      const res = await this.apiService.post<string[], EligibilityItemDto>({ url, data }, user).catch(e => {
        console.log('Error when checking eligibility:', e);
        throw new Error('Error when checking eligibility');
      });

      partyIdsReq.forEach(uuid => {
        results.push({ partyId: uuid, hasKivra: res.data.includes(uuid) });
        this.eligibilityCache.set(`${user.id}-${uuid}`, res.data.includes(uuid));
      });
    }

    results.sort((a, b) => partyIds.indexOf(a.partyId) - partyIds.indexOf(b.partyId));

    return { results };
  }
}
