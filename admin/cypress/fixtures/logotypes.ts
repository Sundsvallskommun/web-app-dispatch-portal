import { Logotype, LogotypeApiResponse, LogotypesApiResponse } from '@data-contracts/backend/data-contracts';

export const logotype1: Logotype = {
  id: 1,
  name: 'image1.png',
  filenameLightMode: 'image1.png',
  filenameDarkMode: 'image2.png',
  urlLightMode: '/files/image1.png',
  urlDarkMode: '/files/image2.png',
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};
export const logotype2: Logotype = {
  id: 2,
  name: 'image3.png',
  filenameLightMode: 'image3.png',
  filenameDarkMode: 'image4.png',
  urlLightMode: '/files/image3.png',
  urlDarkMode: '/files/image4.png',
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};
export const logotype3: Logotype = {
  id: 3,
  name: 'image5.png',
  filenameLightMode: 'image5.png',
  filenameDarkMode: 'image6.png',
  urlLightMode: '/files/image5.png',
  urlDarkMode: '/files/image6.png',
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};
export const logotype4: Logotype = {
  id: 4,
  name: 'image7.png',
  filenameLightMode: 'image7.png',
  filenameDarkMode: 'image8.png',
  urlLightMode: '/files/image7.png',
  urlDarkMode: '/files/image8.png',
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};

export const logotype: LogotypeApiResponse = {
  message: 'success',
  data: logotype1,
};

export const newLogotype: LogotypeApiResponse = {
  message: 'success',
  data: logotype4,
};

export const logotypes: LogotypesApiResponse = {
  data: [logotype1, logotype2, logotype3],
  message: 'success',
};

export const logotypesWithNew: LogotypesApiResponse = {
  data: [logotype1, logotype2, logotype3, logotype4],
  message: 'success',
};
