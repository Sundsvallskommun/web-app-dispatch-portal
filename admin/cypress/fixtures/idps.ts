import { IDP } from '@data-contracts/backend/data-contracts';

export const idp1: IDP = {
  id: 1,
  name: 'testidp 1',
  entryPoint: 'https://testidp1.com/sso',
  idpCert: '123-234-345-456-567',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};
export const idp2: IDP = {
  id: 2,
  name: 'testidp 2',
  entryPoint: 'https://testidp2.com/sso',
  idpCert: '123-234-345-456-567',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};
export const newIdp: IDP = {
  id: 3,
  name: 'ny idp',
  entryPoint: 'https://nyidp.com/',
  idpCert: '123',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};
