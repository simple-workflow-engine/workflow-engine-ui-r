import { httpClient } from '@/lib/http/httpClient';
import { z } from 'zod';

const ResponseSchema = z.object({
  _id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  workflowStatus: z.enum(['pending', 'completed', 'failed']),
  definition: z.object({
    _id: z.string(),
    name: z.string(),
    status: z.enum(['active', 'inactive']),
  }),
  logs: z.array(z.string()),
  splittedLogs: z.array(
    z.object({
      datetime: z.string().datetime(),
      taskName: z.string(),
      log: z.string(),
    })
  ),
  tasks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      next: z.array(z.string()),
      previous: z.array(z.string()),
      params: z.record(z.string(), z.any()).optional(),
      exec: z.string().optional(),
      type: z.enum(['FUNCTION', 'WAIT', 'START', 'END', 'LISTEN', 'GUARD']),
      status: z.enum(['pending', 'completed']),
    })
  ),
});

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export const API_NAME = 'workflow-runtime-detail';

export const API = async (getAccessTokenSilently: Function, id: string) => {
  const token = await getAccessTokenSilently();
  if (!token) {
    throw new Error(`Unauthorized`);
  }

  const response = await httpClient
    .get(`/runtime/${id}`, {
      headers: {
        Authorization: ['Bearer', token].join(' '),
      },
    })
    .then((res) => res.data);

  return ResponseSchema.parse(response.data);
};
