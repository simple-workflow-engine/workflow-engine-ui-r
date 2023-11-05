import EndTask from '@/components/Tasks/End';
import FunctionTask from '@/components/Tasks/Function';
import GuardTask from '@/components/Tasks/Guard';
import ListenTask from '@/components/Tasks/Listen';
import StartTask from '@/components/Tasks/Start';
import WaitTask from '@/components/Tasks/Wait';
import type { NodeTypes, Node } from 'reactflow';

export const nodeTypes: NodeTypes = {
  function: FunctionTask,
  start: StartTask,
  end: EndTask,
  guard: GuardTask,
  wait: WaitTask,
  listen: ListenTask,
} as const;

export const taskCreator: Record<'function' | 'start' | 'end' | 'guard' | 'wait' | 'listen', () => Node> = {
  function: () => ({
    id: crypto.randomUUID(),
    data: {
      label: ['Function', crypto.randomUUID()].join(' '),
      inputBoundId: crypto.randomUUID(),
      outputBoundId: crypto.randomUUID(),
      execTs: `
        /**
         * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/function_task}
        */
        async function handler() {
          return {"hello":"world"};
        }
              `,
      exec: `
              /**
               * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/function_task}
               */
              async function handler() {
                return {"hello":"world"};
              }
              `,
      params: {},
    },

    position: { x: 100, y: 100 },
    type: 'function',
  }),
  guard: () => ({
    id: crypto.randomUUID(),
    data: {
      label: ['Guard', crypto.randomUUID()].join(' '),
      inputBoundId: crypto.randomUUID(),
      outputBoundId: crypto.randomUUID(),
      execTs: `
        /**
         * @returns {Promise<boolean>} Return Boolean output
         * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/guard_task}
        */
        async function handler(): Promise<boolean> {
          return true;
        }
              `,
      exec: `
        /**
         * @returns {Promise<boolean>} Return Boolean output
         * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/guard_task}
        */
        async function handler() {
          return true;
        }
              `,
      params: {},
    },

    position: { x: 100, y: 100 },
    type: 'guard',
  }),
  wait: () => ({
    id: crypto.randomUUID(),
    data: {
      label: ['Wait', crypto.randomUUID()].join(' '),
      inputBoundId: crypto.randomUUID(),
      outputBoundId: crypto.randomUUID(),
      params: {
        taskNames: [],
      },
    },
    position: { x: 100, y: 100 },
    type: 'wait',
  }),
  start: () => ({
    id: crypto.randomUUID(),
    data: {
      label: ['Start', crypto.randomUUID()].join(' '),
      outputBoundId: crypto.randomUUID(),
      params: {},
    },
    position: { x: 100, y: 100 },
    type: 'start',
  }),
  end: () => ({
    id: crypto.randomUUID(),
    data: {
      label: ['End', crypto.randomUUID()].join(' '),
      inputBoundId: crypto.randomUUID(),
      params: {},
    },
    position: { x: 100, y: 100 },
    type: 'end',
  }),
  listen: () => ({
    id: crypto.randomUUID(),
    data: {
      params: {
        apiKey: crypto.randomUUID(),
      },
      label: ['Listen', crypto.randomUUID()].join(' '),
      inputBoundId: crypto.randomUUID(),
    },
    position: { x: 100, y: 100 },
    type: 'listen',
  }),
};
