import type { NextApiRequest, NextApiResponse } from 'next'
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
  meaning: Meaning[];
}


// Function to create schema with configurable number of examples
function createSchema(exampleCount: number) {
  // Create properties object for the examples
  const exampleProperties: Record<string, { type: string }> = {};
  for (let i = 1; i <= exampleCount; i++) {
    exampleProperties[`example${i}`] = { type: "string" };
  }
  
  // Create required array for examples
  const exampleRequired = Array.from(
    { length: exampleCount }, 
    (_, i) => `example${i + 1}`
  );
  
  return {
    type: "object",
    properties: {
      languages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            language: { type: "string" },
            meaning: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  value: { type: "string" },
                  ...exampleProperties
                },
                required: ["type", "value", ...exampleRequired]
              }
            }
          },
          required: ["language", "meaning"]
        }
      }
    },
    required: ["languages"]
  };
}

async function getWordMeanings(
  word: string, 
  languages: string[] = ["English", "French"],
  exampleCount: number = 2
): Promise<{ languages: LanguageMeaning[] }> {
  
  // Create a nice comma-separated list with proper grammar
  const languageList = languages.length > 1
    ? languages.slice(0, -1).join(", ") + " and " + languages[languages.length - 1]
    : languages[0];

    const schemaInstructions = `
    Return the response as a valid JSON object with exactly this structure:
    {
      "languages": [
        {
          "language": "LanguageName",
          "meaning": [
            {
              "type": "part-of-speech",
              "value": "meaning-in-this-language",
              ${Array.from({ length: exampleCount }, (_, i) => 
                `"example${i + 1}": "example sentence ${i + 1}"`).join(',\n          ')}
            }
          ]
        }
      ]
    }
    
    Do not include any explanation, just return valid JSON that can be parsed directly.
    `;
  
  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { 
        role: "system", 
        content: `You are a multilingual assistant that provides word meanings with ${exampleCount} examples for each meaning. Always respond with a valid JSON object following the exact schema specifications.` 
      },
      { 
        role: "user", 
        content: `Provide meanings and ${exampleCount} usage examples for the word "${word}" in the following languages: ${languageList}. ${schemaInstructions}` 
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
                     
    let parsedResponse: { languages: LanguageMeaning[] };
    
    if (jsonMatch) {
      // If JSON was returned in a code block or can be identified
      parsedResponse = JSON.parse(jsonMatch[0].replace(/```json\n|```/g, ''));
    } else {
      // Fall back to trying to parse the whole response
      parsedResponse = JSON.parse(text);
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    console.log('Raw response:', response.choices[0].message.content);
    throw new Error('Failed to parse response as JSON');
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Prompt API")
  if (!openai.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const textToTranslate = req.body.textToTranslate || '';
  console.log("Text to be translated:", textToTranslate)
  try {
    const wordData = await getWordMeanings(textToTranslate, req.body.languages, 3);
    console.log(JSON.stringify(wordData, null, 2));
    
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