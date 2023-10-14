import { httpClient } from '@/lib/http/httpClient';
import { z } from 'zod';

const ResponseSchema = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.enum(['active', 'inactive']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export const API_NAME = 'workflow-definition-list';

export const API = async (getAccessTokenSilently: Function) => {
  const token = await getAccessTokenSilently();
  if (!token) {
    throw new Error('Unauthorized');
  }

  const response = await httpClient.get('/definition/list', {
    headers: {
      Authorization: ['Bearer', token].join(' '),
    },
  });

  return ResponseSchema.parse(response.data.data);
};
