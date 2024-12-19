import { Card } from '@sk-web-gui/react';
import NextLink from 'next/link';

import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if(!user.permissions.canSendSMS) {
      router.push('send/mail');
      return;
    }
    setIsCheckingPermissions(false);
  }, [user.permissions.canSendSMS, router]);

  return (
    <DefaultLayout title={`Postportalen`}>
      {!isCheckingPermissions && <><h1 className="sr-only">Skicka post.</h1>
      <div className="flex self-center flex-col text-lg mb-11 pt-48 max-w-max">
        <div className="text-center">
          <p className="text-base mb-16">Skicka meddelande till invånare med vår postportal</p>
          <h1 className="text-display-3-lg mb-40">Vad vill du skicka idag?</h1>
        </div>
        <div className="md:flex flex-1 basis-0 gap-24">
          <NextLink href="/send/mail" legacyBehavior passHref>
            <Card className="flex-1 mb-32" color="vattjom" invert={true} useHoverEffect={true}>
              <Card.Body>
                <Card.Header>
                  <h2 className="text-h3-md">Skicka digitalt brev</h2>
                </Card.Header>
                <Card.Text>
                  <p className="text-small">Någon text som beskriver vad skicka digitalt brev innebär</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </NextLink>
          {user.permissions.canSendSMS && <NextLink href="/send/sms" legacyBehavior passHref>
            <Card className="flex-1 mb-32" color="vattjom" invert={true} useHoverEffect={true}>
              <Card.Body className="">
                <Card.Header>
                  <h2 className="text-h3-md">Skicka sms</h2>
                </Card.Header>
                <Card.Text>
                  <p className="text-small">Någon text som beskriver vad skicka sms innebär</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </NextLink>}
        </div>
      </div></>}
    </DefaultLayout>
  );
}
