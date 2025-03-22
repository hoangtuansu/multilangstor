import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  useDisclosure,
  VStack,
  List,
  ListItem,
  Card, CardHeader, CardBody,
  SimpleGrid
} from '@chakra-ui/react';

import { useRef, useState, useId, useEffect } from 'react';
import chroma from 'chroma-js';

interface LanguageOption {
  readonly name: string;
  readonly shortLabel?: string;
  readonly color: string;
}

const languageOptions: readonly LanguageOption[] = [
  { name: 'English', shortLabel: 'EN', color: '#00B8D9'},
  { name: 'French', shortLabel: 'FR', color: '#5243AA' },
  { name: 'Vietnamese', shortLabel: 'VI', color: '#5243AA' },
  { name: 'Chinese', shortLabel: 'CN', color: '#5243AA' },
  { name: 'Italian', shortLabel: 'IT', color: '#5243AA' },
];

const translateButton = [
  {
    name: 'Translate',
    tooltip:
      'Explain the meaning of the word or phrase and give me an example of how to use it in real life',
  }
];

const Translator = () => {
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [textToTranslate, setTextToTranslate] = useState('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [meaningResult, setMeaningResult] = useState({ languages: [] });

  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const timeoutId = useRef<any>(null);
  const specialKeyPressed = useRef(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const queryPrompt = async () => {
    setLoadingPrompt(true);
    
    try {
      const response = await fetch('/api/prompt', {
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
      
      setLoadingPrompt(false);
      
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData?.error?.message || 'An error occurred',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return '';
      }

      const data = await response.json();
      console.log("API returned data:", data);
      
      return data.result || { languages: [] };
    } catch (error) {
      setLoadingPrompt(false);
      console.error("API fetch error:", error);
      return { languages: [] };
    }
  };

  const processTextForLanguages = async () => {
    if (!textToTranslate) return;
       
    try {
      const res = await queryPrompt();
      if (res && typeof res === 'object') {
        setMeaningResult(res);
      } else {
        console.error("Invalid response format:", res);
        setMeaningResult({ languages: [] });
      }
    } catch (error) {
      console.error("Error processing text:", error);
      setMeaningResult({ languages: [] });
    }
  };

  const renderButtons = (
    buttons: any[],
    color: string,
    isDisabled: boolean
  ) => {
    return (
      <HStack gap={1} wrap="wrap" alignItems="flex-start">
        {buttons.map((btn, i) => (
          <Tooltip key={i} hasArrow label={btn.tooltip}>
            <Button
              colorScheme={color}
              variant="solid"
              width="100%"
              h="45px" // Standard Chakra button height
              minW="200px" // Match the minWidth of MenuList
              isDisabled={!textToTranslate || isDisabled}
              onClick={() => processTextForLanguages()}
            >
              {btn.name}
            </Button>
          </Tooltip>
        ))}
      </HStack>
    );
  };

  const findLanguageData = (langValue: string) => {
    if (!meaningResult || !meaningResult.languages || !Array.isArray(meaningResult.languages)) {
      return [];
    }
    
    const language = meaningResult.languages.find(
      (lang: any) => lang.language?.toLowerCase() === langValue.toLowerCase()
    );
    
    return language?.meaning || [];
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      specialKeyPressed.current = true;
      setTextToTranslate(event.currentTarget.value);
      processTextForLanguages();
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
      processTextForLanguages();
    }, 2000);
  };

  function getColorByName(languageName: string): string {
    const foundLanguage = languageOptions.find(
      (option) => option.name === languageName
    );
    return foundLanguage?.color || '#5243AA';
  }

  return (
    <div style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      {loadingPrompt && (
        <HStack
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Spinner size="lg" />
          <Text>Processing, please wait...</Text>
        </HStack>
      )}
      <VStack
        spacing={5}
        padding={5}
        style={{
          ...loadingPrompt ? { filter: 'blur(.9px)' } : {},
          height: '100%',
          width: '100%'
        }}
      >
        <VStack w="100%" spacing={2} alignItems="flex-start">
          <HStack alignItems="flex-start" w="100%" gap={2}>
            <Textarea
              ref={contentRef}
              placeholder="Enter text to translate"
              rows={4}
              w="60%"
              value={textToTranslate}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <VStack w="40%" spacing={4} alignItems="flex-start">
              <Box flex="1" w="100%">
                <Menu closeOnSelect={false} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                  <MenuButton as={Button} colorScheme="blue" height="45px" minWidth="200px">
                    Languages
                  </MenuButton>
                  <MenuList minWidth="200px">
                    <MenuOptionGroup 
                      value={selectedLanguages} 
                      onChange={(values: string | string[]) => {
                        if (Array.isArray(values)) {
                          setSelectedLanguages(values);
                        } else {
                          setSelectedLanguages([values]);
                        }
                      }}
                      type="checkbox">
                      {languageOptions.map((option) => (
                        <MenuItemOption key={option.name} value={option.name}>
                          {option.name}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </Box>
              {renderButtons(translateButton, 'cyan', !textToTranslate)}
            </VStack>
          </HStack>
        </VStack>
        
        <Box w="100%" flex="1" overflowY="auto">
          <SimpleGrid 
            columns={{ base: 1, md: 2 }}
            spacing={4}
            w="100%"
          >
            {selectedLanguages.map((lang) => {
              const meanings = findLanguageData(lang);
              return (
                <Card key={lang} w="100%">
                  <CardHeader bg={chroma(getColorByName(lang)).alpha(0.2).css()} py={2}>
                    <Heading size="sm" textTransform="uppercase">
                      {lang}
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    {meanings.length > 0 ? (
                      meanings.map((meaning: any, index: number) => (
                        <Box key={index} mb={index === meanings.length - 1 ? 0 : 4}>
                          <Box display="flex" alignItems="baseline" mb={1}>
                            <Text as="span" fontWeight="bold" fontSize="xs" color="gray.500" textTransform="uppercase" mr={2}>
                              {meaning.type}
                            </Text>
                            <Text as="span" fontWeight="medium" fontSize="md">
                              {meaning.value}
                            </Text>
                          </Box>
                          <List spacing={1} pl={4}>
                            {Object.keys(meaning)
                              .filter(key => key.startsWith('example'))
                              .sort((a, b) => parseInt(a.replace('example', '')) - parseInt(b.replace('example', '')))
                              .map(key => (
                                <ListItem key={key} fontStyle="italic" color="gray.700">
                                  "{meaning[key]}"
                                </ListItem>
                              ))}
                          </List>
                        </Box>
                      ))
                    ) : (
                      <Text>No data available yet.</Text>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        </Box>
      </VStack>
    </div>
  );
};

export default Translator;