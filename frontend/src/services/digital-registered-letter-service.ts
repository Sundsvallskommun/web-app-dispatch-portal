import { apiService } from '@services/api-service';

interface EligibilityItemResponseDto {
  partyId: string;
  hasKivra: boolean;
}

export const getEligibilityKivra = async (partyId: string): Promise<EligibilityItemResponseDto> => {
  return apiService
    .post<{ data: EligibilityItemResponseDto }, { partyId: string }>('eligibility-kivra', { partyId })
    .then((r) => r.data.data)
    .catch((e) => {
      console.error('Something went wrong when requesting eligibilty.');
      throw e;
    });
};
