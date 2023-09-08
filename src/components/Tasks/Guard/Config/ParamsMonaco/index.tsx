import type { OnChange, OnMount } from '@monaco-editor/react';
import { Editor } from '@monaco-editor/react';
import { useTheme } from '@mui/material';
import type { ElementRef, FC } from 'react';
import { useRef } from 'react';

interface Props {
  initialValue: string;
  setError: Function;
  setValue: Function;
}

const ParamsMonaco: FC<Props> = ({ initialValue, setError, setValue }) => {
  const theme = useTheme();
  const editorRef = useRef<ElementRef<typeof Editor>>();

  const handleChange: OnChange = (value) => {
    if (value) {
      try {
        const parsedObject = JSON.parse(value);

        if (
          Object.keys(parsedObject)
            .map((k) => k?.trim())
            .includes('')
        ) {
          setError('No empty keys');
        } else {
          setValue('params', parsedObject);
          setError(null);
        }
      } catch (_error) {
        setError('Error parsing JSON');
      }
    }
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      defaultValue={initialValue}
      onMount={onMount}
      onChange={handleChange}
      language="json"
      height={'50vh'}
      theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
    />
  );
};

export default ParamsMonaco;
