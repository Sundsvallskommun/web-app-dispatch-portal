import { apiService } from '@services/api-service';

interface EligibilityItemResponseDto {
  results: {
    partyId: string;
    hasKivra: boolean;
  }[];
}

export const getEligibilityKivra = async (partyIds: string[]): Promise<EligibilityItemResponseDto> => {
  return apiService
    .post<{ data: EligibilityItemResponseDto }, { partyIds: string[] }>('eligibility-kivra', { partyIds })
    .then((r) => r.data.data)
    .catch((e) => {
      console.error('Something went wrong when requesting eligibilty.');
      throw e;
    });
};
