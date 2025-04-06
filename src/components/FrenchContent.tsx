import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Heading,
  Grid,
  GridItem,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  VStack,
} from '@chakra-ui/react';

function FrenchContent({ isOpen, conjugationData, onClose }: { isOpen: boolean, conjugationData: any, onClose: () => void }) {
  const conjugationModes = {
    indicative: "Indicative",
    subjonctif: "Subjunctive",
    conditionnel: "Conditional",
    impératif: "Imperative",
    participe: "Participle",
    gérondif: "Gerund",
    infinitif: "Infinitive"
  };

  const renderParticipeTable = (data: any) => {
    if (!data || typeof data !== 'object') return null;

    return (
      <Box mb={6} p={4} borderRadius="md" borderWidth="1px" borderColor="gray.200">
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {Object.entries(data).map(([form, value]: [string, any]) => {
            if (form === 'passé') {
              return Object.entries(value).map(([gender, conjugation]) => (
                <React.Fragment key={gender}>
                  <GridItem><Text fontWeight="bold">{gender}</Text></GridItem>
                  <GridItem><Text>{conjugation || '-'}</Text></GridItem>
                </React.Fragment>
              ));
            }
            return (
              <React.Fragment key={form}>
                <GridItem><Text fontWeight="bold">{form}</Text></GridItem>
                <GridItem><Text>{value || '-'}</Text></GridItem>
              </React.Fragment>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const renderSimpleTable = (data: any) => {
    if (!data || typeof data !== 'object') return null;

    return (
      <Box mb={6} p={4} borderRadius="md" borderWidth="1px" borderColor="gray.200">
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {Object.entries(data).map(([form, value]: [string, any]) => (
            <React.Fragment key={form}>
              <GridItem><Text fontWeight="bold">{form}</Text></GridItem>
              <GridItem><Text>{value || '-'}</Text></GridItem>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderConjugationTable = (data: any) => {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return null;
    }

    // Group tenses into rows of 4
    const tenses = Object.entries(data);
    const rows = [];
    for (let i = 0; i < tenses.length; i += 4) {
      rows.push(tenses.slice(i, i + 4));
    }

    return (
      <Box mb={6} p={4}>
        {rows.map((row, rowIndex) => (
          <Box key={rowIndex} mb={6}>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              {row.map(([tense, forms]) => (
                <Box key={tense} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.200">
                  <Text fontWeight="bold" mb={2}>{tense}</Text>
                  <VStack spacing={2} align="stretch">
                    <Text><strong>Je:</strong> {forms?.je || '-'}</Text>
                    <Text><strong>Tu:</strong> {forms?.tu || '-'}</Text>
                    <Text><strong>Il/Elle:</strong> {forms?.['il/elle'] || '-'}</Text>
                    <Text><strong>Nous:</strong> {forms?.nous || '-'}</Text>
                    <Text><strong>Vous:</strong> {forms?.vous || '-'}</Text>
                    <Text><strong>Ils/Elles:</strong> {forms?.['ils/elles'] || '-'}</Text>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    );
  };

  const renderImperativeTable = (data: any) => {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return null;
    }

    // Group tenses into rows of 4
    const tenses = Object.entries(data);
    const rows = [];
    for (let i = 0; i < tenses.length; i += 4) {
      rows.push(tenses.slice(i, i + 4));
    }

    return (
      <Box mb={6} p={4}>
        {rows.map((row, rowIndex) => (
          <Box key={rowIndex} mb={6}>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              {row.map(([tense, forms]) => (
                <Box key={tense} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.200">
                  <Text fontWeight="bold" mb={2}>{tense}</Text>
                  <VStack spacing={2} align="stretch">
                    <Text><strong>Tu:</strong> {forms?.tu || '-'}</Text>
                    <Text><strong>Nous:</strong> {forms?.nous || '-'}</Text>
                    <Text><strong>Vous:</strong> {forms?.vous || '-'}</Text>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent h="600px">
        <ModalHeader>Verb Conjugation</ModalHeader>
        <ModalCloseButton />
        <ModalBody h="calc(600px - 120px)">
          {conjugationData ? (
            <Tabs isFitted variant="enclosed" h="100%">
              <TabList mb="1em">
                {Object.entries(conjugationModes).map(([key, label]) => (
                  conjugationData?.[key] && Object.keys(conjugationData[key]).length > 0 && (
                    <Tab key={key}>{label}</Tab>
                  )
                ))}
              </TabList>
              <TabPanels h="calc(100% - 50px)">
                {conjugationData?.indicative && Object.keys(conjugationData.indicative).length > 0 && (
                  <TabPanel h="100%">
                    {renderConjugationTable(conjugationData.indicative)}
                  </TabPanel>
                )}
                {conjugationData?.subjonctif && Object.keys(conjugationData.subjonctif).length > 0 && (
                  <TabPanel h="100%">
                    {renderConjugationTable(conjugationData.subjonctif)}
                  </TabPanel>
                )}
                {conjugationData?.conditionnel && Object.keys(conjugationData.conditionnel).length > 0 && (
                  <TabPanel h="100%">
                    {renderConjugationTable(conjugationData.conditionnel)}
                  </TabPanel>
                )}
                {conjugationData?.impératif && Object.keys(conjugationData.impératif).length > 0 && (
                  <TabPanel h="100%">
                    {renderImperativeTable(conjugationData.impératif)}
                  </TabPanel>
                )}
                {conjugationData?.participe && Object.keys(conjugationData.participe).length > 0 && (
                  <TabPanel h="100%">
                    {renderParticipeTable(conjugationData.participe)}
                  </TabPanel>
                )}
                {conjugationData?.gérondif && Object.keys(conjugationData.gérondif).length > 0 && (
                  <TabPanel h="100%">
                    {renderSimpleTable(conjugationData.gérondif)}
                  </TabPanel>
                )}
                {conjugationData?.infinitif && Object.keys(conjugationData.infinitif).length > 0 && (
                  <TabPanel h="100%">
                    {renderSimpleTable(conjugationData.infinitif)}
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          ) : (
            <Text>No conjugation data available.</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default FrenchContent;