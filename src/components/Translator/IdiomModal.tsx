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
  Text,
  VStack,
  List,
  ListItem,
} from '@chakra-ui/react';

interface IdiomModalProps {
  isOpen: boolean;
  idioms: any;
  onClose: () => void;
}

function IdiomModal({ isOpen, idioms, onClose }: IdiomModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>French Idioms</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {idioms && Object.keys(idioms).length > 0 ? (
            <VStack spacing={4} align="stretch">
              {Object.entries(idioms).map(([idiom, meaning]: [string, any]) => (
                <Box key={idiom} p={4} borderRadius="md" borderWidth="1px" borderColor="gray.200">
                  <Heading size="md" mb={2}>{idiom}</Heading>
                  <Text mb={2}>{meaning.meaning}</Text>
                  {meaning.examples && (
                    <List spacing={2}>
                      {Object.keys(meaning.examples)
                        .filter(key => key.startsWith('example'))
                        .sort((a, b) => parseInt(a.replace('example', '')) - parseInt(b.replace('example', '')))
                        .map(key => (
                          <ListItem key={key} fontStyle="italic" color="gray.700">
                            "{meaning.examples[key]}"
                          </ListItem>
                        ))}
                    </List>
                  )}
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>No idioms available.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Box />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default IdiomModal; 