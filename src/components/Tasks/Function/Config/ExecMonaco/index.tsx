import type { OnChange, OnMount } from '@monaco-editor/react';
import { Editor } from '@monaco-editor/react';
import { useTheme } from '@mui/material';
import type { ElementRef, FC } from 'react';
import { useRef } from 'react';
import { transpile, ScriptTarget, ModuleKind } from 'typescript';
import JsonToTS from 'json-to-ts';
import { useWorkflowDefinitionContext } from '@/contexts/WorkflowDefinitionContext';

interface Props {
  initialValue: string;
  setError: Function;
  setValue: Function;
  params: Record<string, any>;
}

const ExecMonaco: FC<Props> = ({ initialValue, setError, setValue, params }) => {
  const theme = useTheme();
  const editorRef = useRef<ElementRef<typeof Editor>>();
  const { config } = useWorkflowDefinitionContext();

  const handleChange: OnChange = (value) => {
    if (value) {
      try {
        const jsCode = transpile(value, {
          target: ScriptTarget.ESNext,
          module: ModuleKind.CommonJS,
          strict: true,
          sourceMap: false,
        });

        setValue('exec', jsCode);
        setValue('execTs', value);
      } catch (_error) {
        setError('Unable to transpile current code');
      }
    }
  };

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    const GlobalMap = JsonToTS(config, {
      rootName: 'GlobalMap',
    }).join('\n');

    const ParamMap = JsonToTS(params, {
      rootName: 'ParamMap',
    }).join('\n');

    monaco?.languages?.typescript?.typescriptDefaults?.addExtraLib(
      `
${GlobalMap}
declare function getWorkflowGlobal(): GlobalMap;
${ParamMap}
declare function getWorkflowParams(): ParamMap;
declare function getWorkflowResults(): Record<string,any>;
/**
* Logger 
*/
declare function logger(...args: any[]): void;

function httpClient(params: {
  url: string;
  payload?: any;
  headers: Record<string, any>;
  method:
    | "get"
    | "GET"
    | "delete"
    | "DELETE"
    | "head"
    | "HEAD"
    | "options"
    | "OPTIONS"
    | "post"
    | "POST"
    | "put"
    | "PUT"
    | "patch"
    | "PATCH"
    | "purge"
    | "PURGE"
    | "link"
    | "LINK"
    | "unlink"
    | "UNLINK";
  queryParams?: Record<string, any>;
}): Promise<{ success: true; data: any } | { success: false; error: any }>;

/**
* Http Client
*/
declare function getHttpClient(): httpClient;

      `,
      'global.d.ts'
    );
  };

  return (
    <Editor
      defaultValue={initialValue}
      onMount={onMount}
      onChange={handleChange}
      language="typescript"
      height={'50vh'}
      theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
    />
  );
};

export default ExecMonaco;
