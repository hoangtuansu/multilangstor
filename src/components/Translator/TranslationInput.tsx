import { Textarea } from '@chakra-ui/react';
import { useRef, useState, forwardRef, useImperativeHandle, ChangeEvent, ClipboardEvent } from 'react';

interface TranslationInputProps {
  onTranslationComplete: (result: any) => void;
  onLoadingChange: (isLoading: boolean) => void;
  selectedLanguages: string[];
}

export interface TranslationInputRef {
  transalteInputText: () => Promise<void>;
}

const TranslationInput = forwardRef<TranslationInputRef, TranslationInputProps>(({ onTranslationComplete, onLoadingChange, selectedLanguages }, ref) => {
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const timeoutId = useRef<any>(null);
  const specialKeyPressed = useRef(false);
  const spaceKeyTimeoutId = useRef<any>(null);
  const [textToTranslate, setTextToTranslate] = useState('');

  const preProcessBeforeTranslation = () => {
    // Remove extra new lines and trim the text
    const trimmedText = textToTranslate.replace(/\n\s*\n/g, '\n').trim();
    if (trimmedText !== textToTranslate) {
      setTextToTranslate(trimmedText);
    }
  };

  const postProcessBeforeTranslation = (text: any) => {
    console.log("Post-processing translation result:", text);
    return text;
  };

  const transalteInputText = async () => {
    if (!textToTranslate) return;
    
    preProcessBeforeTranslation();
    
    try {
      onLoadingChange(true);
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textToTranslate,
          languages: selectedLanguages
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Translation error:", errorData?.error?.message || 'An error occurred');
        onTranslationComplete({ languages: [] });
        return;
      }

      const data = await response.json();
      const processedResult = postProcessBeforeTranslation(data.result);
      onTranslationComplete(processedResult || { languages: [] });
    } catch (error) {
      console.error("Error processing text:", error);
      onTranslationComplete({ languages: [] });
    } finally {
      onLoadingChange(false);
    }
  };

  useImperativeHandle(ref, () => ({
    transalteInputText
  }));

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      specialKeyPressed.current = true;
      setTextToTranslate((event.currentTarget as HTMLTextAreaElement).value);
      transalteInputText();
      return;
    } 
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextToTranslate(e.target.value);
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    // Get pasted content
    const pastedText = event.clipboardData.getData('text')
    console.log('Content pasted:', pastedText);
    setTextToTranslate(pastedText);
    transalteInputText();
  };
  

  return (
    <Textarea
      ref={contentRef}
      value={textToTranslate}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder="Enter text to translate..."
      size="lg"
      minH="200px"
      resize="vertical"
    />
  );
});

TranslationInput.displayName = 'TranslationInput';

export default TranslationInput; 