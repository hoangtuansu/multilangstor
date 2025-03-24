import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Heading,
  Grid,
  GridItem,
  Text,
  Button,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

function FrenchContent({ isOpen, conjugationData, onClose }: { isOpen: boolean; conjugationData: Object, onClose: () => void }) {
  
  const indicative = conjugationData['indicative'];
  const subjonctif = conjugationData['subjonctif'];

  return (
    <Modal isOpen={isOpen} closeOnOverlayClick={false} onClose={onClose} size="2xl"> {/* Adjust size as needed */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verb Conjugation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Section 1 */}
          <Box mb={6}>
            <Heading size="md" mb={2}>
              Indicative
            </Heading>
            <Grid templateColumns="repeat(5, 1fr)" gap={4}>
              <GridItem colSpan={1}><Heading size="sm">Tense</Heading></GridItem>
              <GridItem><Heading size="sm">Je</Heading></GridItem>
              <GridItem><Heading size="sm">Tu</Heading></GridItem>
              <GridItem><Heading size="sm">Il/Elle</Heading></GridItem>
              <GridItem><Heading size="sm">Nous</Heading></GridItem>
              <GridItem><Heading size="sm">Vous</Heading></GridItem>
              <GridItem><Heading size="sm">Ils/Elles</Heading></GridItem>

              <GridItem><Text fontWeight="bold">Présent</Text></GridItem>
              <GridItem><Text>{indicative['présent'].je}</Text></GridItem>
              <GridItem><Text>{indicative['présent'].tu}</Text></GridItem>
              <GridItem><Text>{indicative['présent']['il/elle']}</Text></GridItem>
              <GridItem><Text>{indicative['présent'].nous}</Text></GridItem>
              <GridItem><Text>{indicative['présent'].vous}</Text></GridItem>
              <GridItem><Text>{indicative['présent']['ils/elles']}</Text></GridItem>

              <GridItem><Text fontWeight="bold">Passé Composé</Text></GridItem>
              <GridItem><Text>{indicative['passé composé'].je}</Text></GridItem>
              <GridItem><Text>{indicative['passé composé'].tu}</Text></GridItem>
              <GridItem><Text>{indicative['passé composé']['il/elle']}</Text></GridItem>
              <GridItem><Text>{indicative['passé composé'].nous}</Text></GridItem>
              <GridItem><Text>{indicative['passé composé'].vous}</Text></GridItem>
              <GridItem><Text>{indicative['passé composé']['ils/elles']}</Text></GridItem>

              <GridItem><Text fontWeight="bold">Imparfait</Text></GridItem>
              <GridItem><Text>{indicative.imparfait.je}</Text></GridItem>
              <GridItem><Text>{indicative.imparfait.tu}</Text></GridItem>
              <GridItem><Text>{indicative.imparfait['il/elle']}</Text></GridItem>
              <GridItem><Text>{indicative.imparfait.nous}</Text></GridItem>
              <GridItem><Text>{indicative.imparfait.vous}</Text></GridItem>
              <GridItem><Text>{indicative.imparfait['ils/elles']}</Text></GridItem>

              <GridItem><Text fontWeight="bold">Futur Simple</Text></GridItem>
              <GridItem><Text>{indicative['futur simple'].je}</Text></GridItem>
              <GridItem><Text>{indicative['futur simple'].tu}</Text></GridItem>
              <GridItem><Text>{indicative['futur simple']['il/elle']}</Text></GridItem>
              <GridItem><Text>{indicative['futur simple'].nous}</Text></GridItem>
              <GridItem><Text>{indicative['futur simple'].vous}</Text></GridItem>
              <GridItem><Text>{indicative['futur simple']['ils/elles']}</Text></GridItem>
            </Grid>
          </Box>

          {/* Section 2 */}
          <Box mb={6}>
            <Heading size="md" mb={2}>
              Subjunctive
            </Heading>
            <Grid templateColumns="repeat(5, 1fr)" gap={4}>
              <GridItem colSpan={1}><Heading size="sm">Tense</Heading></GridItem>
              <GridItem><Heading size="sm">Je</Heading></GridItem>
              <GridItem><Heading size="sm">Tu</Heading></GridItem>
              <GridItem><Heading size="sm">Il/Elle</Heading></GridItem>
              <GridItem><Heading size="sm">Nous</Heading></GridItem>
              <GridItem><Heading size="sm">Vous</Heading></GridItem>
              <GridItem><Heading size="sm">Ils/Elles</Heading></GridItem>

              <GridItem><Text fontWeight="bold">Présent</Text></GridItem>
              <GridItem><Text>{subjonctif["présent"].je}</Text></GridItem>
              <GridItem><Text>{subjonctif["présent"].tu}</Text></GridItem>
              <GridItem><Text>{subjonctif["présent"]['il/elle']}</Text></GridItem>
              <GridItem><Text>{subjonctif["présent"].nous}</Text></GridItem>
              <GridItem><Text>{subjonctif["présent"].vous}</Text></GridItem>
              <GridItem><Text>{subjonctif["présent"]['ils/elles']}</Text></GridItem>

              <GridItem><Text fontWeight="bold">Passé</Text></GridItem>
              <GridItem><Text>{subjonctif['passé'].je}</Text></GridItem>
              <GridItem><Text>{subjonctif['passé'].tu}</Text></GridItem>
              <GridItem><Text>{subjonctif['passé']['il/elle']}</Text></GridItem>
              <GridItem><Text>{subjonctif['passé'].nous}</Text></GridItem>
              <GridItem><Text>{subjonctif['passé'].vous}</Text></GridItem>
              <GridItem><Text>{subjonctif['passé']['ils/elles']}</Text></GridItem>

              <GridItem><Text fontWeight="bold">Imparfait</Text></GridItem>
              <GridItem><Text>{subjonctif.imparfait.je}</Text></GridItem>
              <GridItem><Text>{subjonctif.imparfait.tu}</Text></GridItem>
              <GridItem><Text>{subjonctif.imparfait['il/elle']}</Text></GridItem>
              <GridItem><Text>{subjonctif.imparfait.nous}</Text></GridItem>
              <GridItem><Text>{subjonctif.imparfait.vous}</Text></GridItem>
              <GridItem><Text>{subjonctif.imparfait['ils/elles']}</Text></GridItem>

              <GridItem><Text fontWeight="bold">Plus Que Parfait</Text></GridItem>
              <GridItem><Text>{subjonctif['plus-que-parfait'].je}</Text></GridItem>
              <GridItem><Text>{subjonctif['plus-que-parfait'].tu}</Text></GridItem>
              <GridItem><Text>{subjonctif['plus-que-parfait']['il/elle']}</Text></GridItem>
              <GridItem><Text>{subjonctif['plus-que-parfait'].nous}</Text></GridItem>
              <GridItem><Text>{subjonctif['plus-que-parfait'].vous}</Text></GridItem>
              <GridItem><Text>{subjonctif['plus-que-parfait']['ils/elles']}</Text></GridItem>
            </Grid>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FrenchContent;