import { Textarea } from '@chakra-ui/react';
import { useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface TranslationInputProps {
  onTranslationComplete: (result: any) => void;
  onLoadingChange: (isLoading: boolean) => void;
  selectedLanguages: string[];
}

export interface TranslationInputRef {
  processTextForLanguages: () => Promise<void>;
}

const TranslationInput = forwardRef<TranslationInputRef, TranslationInputProps>(({ onTranslationComplete, onLoadingChange, selectedLanguages }, ref) => {
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const timeoutId = useRef<any>(null);
  const specialKeyPressed = useRef(false);
  const spaceKeyTimeoutId = useRef<any>(null);
  const [textToTranslate, setTextToTranslate] = useState('');

  const processTextForLanguages = async () => {
    if (!textToTranslate) return;
       
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
      console.log('Translation response:', data);
      onTranslationComplete(data.result || { languages: [] });
    } catch (error) {
      console.error("Error processing text:", error);
      onTranslationComplete({ languages: [] });
    } finally {
      onLoadingChange(false);
    }
  };

  useImperativeHandle(ref, () => ({
    processTextForLanguages
  }));

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      specialKeyPressed.current = true;
      setTextToTranslate((event.currentTarget as HTMLTextAreaElement).value);
      processTextForLanguages();
      return;
    } 
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (specialKeyPressed.current) {
      specialKeyPressed.current = false;
      setTextToTranslate(e.target.value);
      return;
    }

    setTextToTranslate(e.target.value);
    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      if (e.target.value) {
        processTextForLanguages();
      }
    }, 2000);
  };

  return (
    <Textarea
      ref={contentRef}
      value={textToTranslate}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Enter text to translate..."
      size="lg"
      minH="200px"
      resize="vertical"
    />
  );
});

TranslationInput.displayName = 'TranslationInput';

export default TranslationInput; 