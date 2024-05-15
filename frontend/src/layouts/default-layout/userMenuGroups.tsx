import { Link } from '@sk-web-gui/react';
import { LogOut } from 'lucide-react';

export const userMenuGroups = [
  {
    label: 'Användaremeny',
    elements: [
      {
        label: 'Logga ut',
        element: () => (
          <Link key={'logout'} href={`${process.env.NEXT_PUBLIC_API_URL}/saml/logout`}>
            <LogOut /> Logga ut
          </Link>
        ),
      },
    ],
  },
];
