import { httpClient } from '@/lib/http/httpClient';
import { z } from 'zod';

const ResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  runtimes: z.array(
    z.object({
      _id: z.string(),
      workflowStatus: z.enum(['pending', 'completed']),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
  ),
});

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export const API_NAME = 'workflow-definition-detail';

export const API = async (getAccessTokenSilently: Function, id: string) => {
  const token = await getAccessTokenSilently();
  if (!token) {
    throw new Error(`Unauthorized`);
  }

  const response = await httpClient
    .get(`/definition/${id}`, {
      headers: {
        Authorization: ['Bearer', token].join(' '),
      },
    })
    .then((res) => res.data);

  return ResponseSchema.parse(response.data);
};
