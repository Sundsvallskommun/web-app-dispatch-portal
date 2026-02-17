import Link from 'next/link';
import { LogOut } from 'lucide-react';

export const userMenuGroups = [
  {
    label: 'Användaremeny',
    elements: [
      {
        label: 'Logga ut',
        element: () => (
          <Link key={'logout'} href="/logout">
            <LogOut /> Logga ut
          </Link>
        ),
      },
    ],
  },
];
