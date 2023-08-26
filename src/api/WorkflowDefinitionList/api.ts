import { httpClient } from '@/lib/http/httpClient';

export const API_NAME = 'workflow-definition-list';

export const API = async (getAccessTokenSilently: Function) => {
  const token = await getAccessTokenSilently();
  if (!token) {
    throw new Error('Unauthorized');
  }

  const response = await httpClient.get('/definition', {
    headers: {
      Authorization: ['Bearer', token].join(' '),
    },
  });

  return response.data.data;
};
