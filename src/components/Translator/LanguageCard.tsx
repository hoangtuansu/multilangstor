import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  IconButton,
  Tooltip,
  Flex,
  SimpleGrid,
  Box,
  Text,
  List,
  ListItem,
} from '@chakra-ui/react';
import { FaLanguage, FaBook } from 'react-icons/fa';
import chroma from 'chroma-js';

interface LanguageCardProps {
  lang: string;
  languageTranslation: any;
  onConjugationClick: () => void;
  onIdiomClick: () => void;
}

const LanguageCard = ({ lang, languageTranslation, onConjugationClick, onIdiomClick }: LanguageCardProps) => {
  const getColorByName = (languageName: string): string => {
    const languageOptions = [
      { name: 'English', color: '#00B8D9' },
      { name: 'French', color: '#5243AA' },
      { name: 'Vietnamese', color: '#66BB6A' },
      { name: 'Chinese', color: '#EF5350' },
      { name: 'Italian', color: '#FFCA28' }
    ];
    const foundLanguage = languageOptions.find(
      (option) => option.name === languageName
    );
    return foundLanguage?.color || '#5243AA';
  };

  const meanings = languageTranslation?.meaning || [];

  return (
    <Card w="100%">
      <CardHeader 
        bg={chroma(getColorByName(lang)).alpha(0.2).css()} 
        py={1}
        h="48px"
        display="flex"
        alignItems="center"
      >
        <Flex justify="space-between" align="center" gap={2}>
          <Heading size="sm" textTransform="uppercase">
            {lang}
          </Heading>
          <HStack spacing={2}>
            <Tooltip label="Show idioms">
              <IconButton
                aria-label="Show idioms"
                icon={<FaBook size={22} />}
                size="md"
                colorScheme="blue"
                variant="ghost"
                onClick={onIdiomClick}
              />
            </Tooltip>
            {lang === 'French' && languageTranslation?.conjugation && Object.keys(languageTranslation.conjugation).length > 0 && (
              <Tooltip label="Show conjugation">
                <IconButton
                  aria-label="Show conjugation"
                  icon={<FaLanguage size={32} />}
                  size="md"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={onConjugationClick}
                />
              </Tooltip>
            )}
          </HStack>
        </Flex>
      </CardHeader>
      <CardBody>
        {meanings.length > 0 ? (
          <>
            <SimpleGrid columns={meanings.length > 1 ? 2 : 1} spacing={4}>
              {meanings.map((meaning: any, index: number) => (
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
              ))}
            </SimpleGrid>
          </>
        ) : (
          <Text>No data available yet.</Text>
        )}
      </CardBody>
    </Card>
  );
};

export default LanguageCard; 