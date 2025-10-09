import { RecipientHandlerSendType } from '@components/recipient-handler/recipient-handler';
import { getEligibilityKivra } from '@services/digital-registered-letter-service';
import { useEffect, useState } from 'react';
import { formSendType } from 'src/constants';

interface UseKivraEligibilityResult {
  isEligible: boolean;
  isLoading: boolean;
}

export const useKivraEligibility = (
  personId: string | null | undefined,
  sendType: RecipientHandlerSendType
): UseKivraEligibilityResult => {
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!personId || sendType !== formSendType.REK_MAIL) {
      setIsEligible(false);
      return;
    }

    setIsLoading(true);

    getEligibilityKivra(personId)
      .then((res) => {
        setIsEligible(res.hasKivra);
      })
      .catch((e) => {
        console.error('Something went wrong when requesting eligibility.', e);
        setIsEligible(false);
      })
      .finally(() => setIsLoading(false));
  }, [personId, sendType]);

  return { isEligible, isLoading };
};
