import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
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
  SimpleGrid,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  Flex
} from '@chakra-ui/react';
import { FaLanguage, FaBook } from 'react-icons/fa';

import { useState, useEffect, useRef } from 'react';
import chroma from 'chroma-js';
import ConjugationModal from './ConjugationModal';
import TranslationInput, { TranslationInputRef } from './TranslationInput';
import LanguageCard from './LanguageCard';

interface LanguageOption {
  readonly name: string;
  readonly shortLabel?: string;
  readonly color: string;
}

const languageOptions: readonly LanguageOption[] = [
  { name: 'English', shortLabel: 'EN', color: '#00B8D9' },
  { name: 'French', shortLabel: 'FR', color: '#5243AA' },
  { name: 'Vietnamese', shortLabel: 'VI', color: '#66BB6A' },
  { name: 'Chinese', shortLabel: 'CN', color: '#EF5350' },
  { name: 'Italian', shortLabel: 'IT', color: '#FFCA28' }
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
  const [sourceLanguage, setSourceLanguage] = useState<string>('');
  const [destinationLanguages, setDestinationLanguages] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [meaningResult, setMeaningResult] = useState({ languages: [] });
  const [activeTab, setActiveTab] = useState(0);
  const translationInputRef = useRef<TranslationInputRef>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
              h="45px"
              minW="200px"
              isDisabled={isDisabled}
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
      console.log('No meaning result or invalid data structure:', meaningResult);
      return {};
    }
    
    const language = meaningResult.languages.find(
      (lang: any) => lang.language?.toLowerCase() === langValue.toLowerCase()
    );
    
    console.log('Found language data for', langValue, ':', language);
    return language || {};
  };

  function getColorByName(languageName: string): string {
    const foundLanguage = languageOptions.find(
      (option) => option.name === languageName
    );
    return foundLanguage?.color || '#5243AA';
  }

  const renderLanguageSelectors = () => {
    return (
      <VStack w="30%" spacing={4} alignItems="flex-start">
        <HStack spacing={4} w="100%" alignItems="flex-start">
          <Box flex="1">
            <Menu closeOnSelect={true}>
              <MenuButton as={Button} colorScheme="blue" height="45px" minWidth="200px" width="100%">
                Source: {sourceLanguage || 'Select'}
              </MenuButton>
              <MenuList minWidth="200px">
                <MenuOptionGroup 
                  value={sourceLanguage} 
                  onChange={(value) => {
                    setSourceLanguage(value as string);
                    setActiveTab(0);
                  }}
                  type="radio">
                  {languageOptions.map((option) => (
                    <MenuItemOption key={option.name} value={option.name}>
                      {option.name}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Box>
        </HStack>
        <HStack spacing={4} w="100%" alignItems="flex-start">
          <Box flex="1">
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} colorScheme="blue" height="45px" minWidth="200px" width="100%">
                Destination
              </MenuButton>
              <MenuList minWidth="200px">
                <MenuOptionGroup 
                  value={destinationLanguages} 
                  onChange={(values) => {
                    if (Array.isArray(values)) {
                      setDestinationLanguages(values);
                      setActiveTab(0);
                    } else {
                      setDestinationLanguages([values]);
                      setActiveTab(0);
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
        </HStack>
        <HStack spacing={4} w="100%" alignItems="flex-start">
          <Box flex="1">
            {translateButton.map((btn, i) => (
              <Tooltip key={i} hasArrow label={btn.tooltip}>
                <Button
                  colorScheme="cyan"
                  variant="solid"
                  width="100%"
                  height="45px"
                  minWidth="200px"
                  isDisabled={!sourceLanguage || !destinationLanguages.length}
                  onClick={() => {
                    translationInputRef.current?.processTextForLanguages();
                  }}
                >
                  {btn.name}
                </Button>
              </Tooltip>
            ))}
          </Box>
        </HStack>
      </VStack>
    );
  };

  return (
    <div style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
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
          width: '80%',
          maxWidth: '1200px',
          overflow: 'hidden'
        }}
      >
        <VStack w="100%" spacing={2} alignItems="flex-start" flexShrink={0}>
          <HStack alignItems="flex-start" w="100%" gap={2}>
            <TranslationInput
              ref={translationInputRef}
              onTranslationComplete={(result) => {
                setMeaningResult(result);
              }}
              onLoadingChange={setLoadingPrompt}
              selectedLanguages={destinationLanguages}
            />
            {renderLanguageSelectors()}
          </HStack>
        </VStack>
        
        <HStack w="100%" flex="1" spacing={4} alignItems="flex-start" overflow="hidden">
          <Box w="150px" h="100%" overflowY="auto" css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.300',
              borderRadius: '24px',
            },
          }}>
            <Tabs 
              orientation="vertical" 
              variant="unstyled"
              index={activeTab}
              onChange={setActiveTab}
            >
              <TabList gap={2}>
                {destinationLanguages.map((lang) => {
                  const color = getColorByName(lang);
                  return (
                    <Tab 
                      key={lang} 
                      justifyContent="flex-start"
                      position="relative"
                      _selected={{
                        color: 'white',
                        bg: color,
                        _before: {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '4px',
                          height: '60%',
                          bg: color,
                          borderRadius: '0 4px 4px 0',
                        }
                      }}
                      _hover={{
                        bg: `${color}20`,
                        color: color,
                      }}
                      transition="all 0.2s ease-in-out"
                      borderRadius="md"
                      px={4}
                      py={2}
                      fontWeight="medium"
                    >
                      {lang}
                    </Tab>
                  );
                })}
              </TabList>
            </Tabs>
          </Box>
          
          <Box 
            flex="1" 
            h="100%" 
            overflowY="auto" 
            pr={4}
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray.300',
                borderRadius: '24px',
              },
            }}
          >
            {destinationLanguages.map((lang, index) => {
              const languageTranslation = findLanguageData(lang);
              const meanings = languageTranslation?.meaning || [];
              console.log('Rendering card for', lang, 'with meanings:', meanings);
              return (
                <Box 
                  key={lang} 
                  display={activeTab === index ? 'block' : 'none'}
                >
                  <LanguageCard
                    lang={lang}
                    languageTranslation={languageTranslation}
                    onConjugationClick={onOpen}
                    onIdiomClick={() => {}}
                  />
                </Box>
              );
            })}
          </Box>
        </HStack>
        <ConjugationModal
          isOpen={isOpen}
          conjugationData={findLanguageData('French')?.conjugation}
          onClose={onClose}
        />
      </VStack>
    </div>
  );
};

export default Translator;