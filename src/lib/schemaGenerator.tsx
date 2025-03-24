export async function getSchemaInstructions(
    exampleCount: number = 2,
    wordType: string
  ): Promise<string> {

    const conditionaledFrenchConjugation = `
                ... if language is "French" and its type is a "verb", include:
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

    const conditionalIdioms = `
                ... if ${wordType} is a "Phrase/Sentence" and contains idioms, include:
                "idioms": {
                    "idiom1": "meaning",
                    "idiom2": "meaning",
                    "idiom3": "meaning"
                }`

    const schemaInstructions = `
      Return the response as a valid JSON object with exactly this structure:
      {
        "languages": [
          {
            "language": "LanguageName",
            "meaning": [
              {
                "value": "meaning-in-this-language",
                ${Array.from({ length: exampleCount }, (_, i) => 
                  `"example${i + 1}": "example sentence ${i + 1}"`).join(',\n          ')}
                ${
                    `
                    ... if ${wordType} is a "Word", include:
                        "type": "part-of-speech",
                    `
                }
                ${conditionalIdioms}
                ${conditionaledFrenchConjugation}
              }
            ]
          }
        ]
      }
      
      Do not include any explanation, just return valid JSON that can be parsed directly.
      `;
      return schemaInstructions;
  }

  