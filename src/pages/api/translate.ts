import type { NextApiRequest, NextApiResponse } from 'next'
import { getSchemaInstructions, TextClass } from '@/lib/schemaGenerator';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Define interfaces with configurable examples
interface Meaning {
  type: "noun" | "verb" | "adjective" | "adverb" | string;
  value: string;
  [key: `example${number}`]: string; // Allows for dynamically named example properties
}

interface LanguageMeaning {
  language: string;
  textClass: TextClass;
  meaning: Meaning[];
}

function classifyText(text: string): string {
  // Trim whitespace and handle empty input
  const trimmedText = text.trim();
  if (!trimmedText) {
    return "Empty input";
  }
  // Basic checks
  const wordRegex = /^\w+$/; // Matches a single word
  const sentenceRegex = /^[A-Z].*[\.\?\!]$/; // Matches a sentence
  const paragraphRegex = /^[^\n]{50,}$/; // Matches a paragraph (50+ chars) without newlines
  const multiLineRegex = /^(.+(\n)+)+.+$/; // Matches multiple lines separated by any type of newline(s)


  if (wordRegex.test(trimmedText)) {
    return TextClass.Word;
  } else if (paragraphRegex.test(trimmedText)) {
    return TextClass.Paragraph;
  } else if (multiLineRegex.test(trimmedText)) {
    return TextClass.MultipleLines;
  } else if (sentenceRegex.test(trimmedText)) {
    return TextClass.Phrase;
  } else {
    return TextClass.Unclassified;
  }
}

async function getTextMeanings(
  word: string, 
  languages: string[] = ["English", "French"],
  exampleCount: number = 2
): Promise<{ languages: LanguageMeaning[] }> {
  
  // Create a nice comma-separated list with proper grammar
  const languageList = languages.length > 1
    ? languages.slice(0, -1).join(", ") + " and " + languages[languages.length - 1]
    : languages[0];

  const wordType = classifyText(word);
  console.log(`Classified input as: ${wordType}`);

  const schemaInstructions = await getSchemaInstructions(exampleCount, word, wordType);
  console.log(`Schema instructions: ${schemaInstructions}`);
  
  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { 
        role: "system", 
        content: `You are a multilingual assistant that provides \
                  text meanings and several examples for each meaning \
                  in case the text is provided as a word or idiom or short phrase. \
                  Always respond with a valid JSON object following the exact schema specifications.` 
      },
      { 
        role: "user", 
        content: `Provide meanings for the text "${word}" in the following languages: \
                  ${languageList}. ${schemaInstructions}`
      }
    ],
    temperature: 0.2
  });

  try {
    // Extract JSON from the response
    const text = response.choices[0].message.content || '{}';
    
    // Try to find JSON in the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                     text.match(/\{[\s\S]*\}/);
                     
    let parsedResponse: LanguageMeaning[];

    if (jsonMatch) {
      // If JSON was returned in a code block or can be identified
      parsedResponse = JSON.parse(jsonMatch[0].replace(/```json\n|```/g, ''));
    } else {
      // Fall back to trying to parse the whole response
      parsedResponse = JSON.parse(text);
    }
    
    return { languages: parsedResponse };
    
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    console.log('Raw response:', response.choices[0].message.content);
    throw new Error('Failed to parse response as JSON');
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Translate API")
  if (!openai.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const textToTranslate = req.body.textToTranslate || '';
  console.log("Text to be translated: ", textToTranslate)
  try {
    const wordData = await getTextMeanings(textToTranslate, req.body.languages, 3);
    console.log("Translated text: ", JSON.stringify(wordData, null, 2));
    
    res.status(200).json({ result: wordData });


    // Using the correct method for OpenAI client
    wordData.languages.forEach(lang => {
      console.log(`\n== ${lang.language} ==`);
      lang.meaning.forEach(m => {
        console.log(`  As ${m.type}: ${m.value}`);
        // Dynamically get all example properties
        Object.keys(m)
          .filter(key => key.startsWith('example'))
          .sort((a, b) => {
            // Sort examples by number
            const numA = parseInt(a.replace('example', ''));
            const numB = parseInt(b.replace('example', ''));
            return numA - numB;
          })
          .forEach(key => {
            console.log(`    - ${m[key]}`);
          });
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}