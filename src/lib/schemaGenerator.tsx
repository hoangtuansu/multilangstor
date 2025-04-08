export async function getSchemaInstructions(
    exampleCount: number = 2,
    word: string,
    wordType: string
  ): Promise<string> {

    const conditionaledFrenchConjugation = `
                ... if language is "French" and any meaning as a "verb", include:
                "conjugation": {
                 "indicative": {
                    "présent": {
                        "je": "conjugated form",
                        "tu": "conjugated form",
                        "il/elle": "conjugated form", 
                        "nous": "conjugated form",
                        "vous": "conjugated form",
                        "ils/elles": "conjugated form"
                    },
                    "passé composé": {
                        "je": "conjugated form",
                        "tu": "conjugated form", 
                        "il/elle": "conjugated form",
                        "nous": "conjugated form",
                        "vous": "conjugated form",
                        "ils/elles": "conjugated form"
                    },
                    "imparfait": {
                        "je": "conjugated form",
                        "tu": "conjugated form",
                        "il/elle": "conjugated form",
                        "nous": "conjugated form", 
                        "vous": "conjugated form",
                        "ils/elles": "conjugated form"
                    },
                    "futur simple": {
                        "je": "conjugated form",
                        "tu": "conjugated form",
                        "il/elle": "conjugated form", 
                        "nous": "conjugated form",
                        "vous": "conjugated form",
                        "ils/elles": "conjugated form"
                    },
                  },
                  "subjonctif": {
                    "présent": {
                      "je": "conjugated form",
                      "tu": "conjugated form",
                      "il/elle": "conjugated form", 
                      "nous": "conjugated form",
                      "vous": "conjugated form",
                      "ils/elles": "conjugated form"
                    },
                    "imparfait": {
                      "je": "conjugated form",
                      "tu": "conjugated form",
                      "il/elle": "conjugated form", 
                      "nous": "conjugated form",
                      "vous": "conjugated form",
                      "ils/elles": "conjugated form"
                    },
                    "passé": {
                      "je": "conjugated form",
                      "tu": "conjugated form",
                      "il/elle": "conjugated form", 
                      "nous": "conjugated form",
                      "vous": "conjugated form",
                      "ils/elles": "conjugated form"
                    },
                    "plus-que-parfait": {
                      "je": "conjugated form",
                      "tu": "conjugated form",
                      "il/elle": "conjugated form", 
                      "nous": "conjugated form",
                      "vous": "conjugated form",
                      "ils/elles": "conjugated form"
                    }
                  },
                  "conditionnel": {
                    "présent": {
                      "je": "conjugated form",
                      "tu": "conjugated form",
                      "il/elle": "conjugated form", 
                      "nous": "conjugated form",
                      "vous": "conjugated form",
                      "ils/elles": "conjugated form"
                    },
                    "passé": {
                      "je": "conjugated form",
                      "tu": "conjugated form",
                      "il/elle": "conjugated form", 
                      "nous": "conjugated form",
                      "vous": "conjugated form",
                      "ils/elles": "conjugated form"
                    }
                  },
                  "impératif": {
                    "présent": {
                      "tu": "conjugated form",
                      "nous": "conjugated form",
                      "vous": "conjugated form"
                    },
                    "passé": {
                      "tu": "conjugated form",
                      "nous": "conjugated form",
                      "vous": "conjugated form"
                    }
                  },
                  "participe": {
                    "présent": "conjugated form",
                    "passé": {
                      "masculin singulier": "conjugated form",
                      "masculin pluriel": "conjugated form",
                      "féminin singulier": "conjugated form",
                      "féminin pluriel": "conjugated form"
                    }
                  },
                  "gérondif": {
                    "présent": "conjugated form",
                    "passé": "conjugated form",
                    "composé": "conjugated form"
                  },
                  "infinitif": {
                    "présent": "conjugated form",
                    "passé": "conjugated form"
                  }
                }`

    const conditionalWord = `
                ... if ${wordType} is a "Word", include:
                "{
                  "language": "LanguageName",
                  "meaning": [
                    {
                      "value": "meaning-in-this-language",
                      "type": "part-of-speech",
                      ${Array.from({ length: exampleCount }, (_, i) => 
                        `"example${i + 1}": "example sentence ${i + 1}"`).join(',\n          ')}
                    }
                  ],
                  ${conditionaledFrenchConjugation}
                }
                ... if ${wordType} is a "Phrase or Sentence" or a "Paragraph", do not include examples, only include:
                "{
                  "language": "LanguageName",
                  "meaning": [
                    {
                      "value": "meaning-in-this-language",
                    }
                  ]
                }
                ... if ${wordType} is a "Multiple lines", do not include examples, only include:
                "{
                  "language": "LanguageName",
                  "meaning": [
                    ...${word.split('\n').map(line => `{
                      "value": "meaning-of-'${line.trim()}'-in-this-language"
                    }`).join(',\n                    ')}
                  ]
                }`

    const schemaInstructions = `
      Return the response as a valid JSON object with exactly this structure, note that the conjugation part should be outside the meaning:
      [
        ${conditionalWord}
      ]
      
      Do not include any explanation, just return valid JSON that can be parsed directly.
      `;
      return schemaInstructions;
  }

  