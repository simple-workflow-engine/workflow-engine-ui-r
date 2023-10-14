import { httpClient } from '@/lib/http/httpClient';
import { z } from 'zod';

const ResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  global: z.record(z.string(), z.any()).optional(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  uiObject: z.object({
    react: z.object({
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
    }),
  }),
});

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export const API_NAME = 'workflow-definition-single';

export const API = async (getAccessTokenSilently: Function, id: string) => {
  const token = await getAccessTokenSilently();
  if (!token) {
    throw new Error('Unauthorized');
  }

  const response = await httpClient.get(`/definition/${id}`, {
    headers: {
      Authorization: ['Bearer', token].join(' '),
    },
  });

  return ResponseSchema.parse(response.data.data);
};
