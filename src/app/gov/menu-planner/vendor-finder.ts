import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface VendorFinderParams {
  province: string;
  budget: number;
  distance: number;
}

interface Vendor {
  name: string;
  location: string;
  specialties: string[];
  capacity_per_day: number;
  estimated_cost_per_portion: number;
  contact_info: string;
  rating: number;
  certification: string[];
}

export interface VendorResponse {
  vendors: Vendor[];
  search_summary: {
    total_found: number;
    search_criteria: string;
    last_updated: string;
  };
}

const VENDOR_SYSTEM_PROMPT = `You are an AI assistant specialized in finding and evaluating commercial kitchen vendors and catering services for Indonesia's "Makan Bergizi Gratis" (Free Nutritious Meals) program. Your task is to search the internet and identify the top 5 most suitable vendors/kitchens that can supply nutritious meals for school children.

## INSTRUCTIONS:
Search the internet for commercial kitchens, catering services, and food vendors in the specified Indonesian province that can potentially supply meals for the MBG program. Focus on:

### VENDOR CRITERIA:
1. **Scale & Capacity**: Able to produce large quantities of meals daily (minimum 1000-5000 portions/day)
2. **Food Safety**: Proper BPOM certification, halal certification, and food safety standards
3. **Experience**: Previous experience with government programs, school catering, or institutional food services
4. **Regional Presence**: Located within the specified province or nearby areas
5. **Cost Effectiveness**: Competitive pricing that fits within government budget constraints

### SEARCH FOCUS:
- Commercial catering companies
- Industrial kitchens
- Food service contractors
- School meal providers
- Government-approved food vendors
- Large-scale food production facilities

### REQUIRED OUTPUT:
1. Top 5 vendors with detailed information including name, location, specialties, capacity, estimated costs
2. Contact information and certifications
3. Brief summary of search methodology and criteria

Use current internet data to find real, operating businesses in Indonesia. Prioritize vendors with proven track records in institutional food service.

The output language should be in Indonesian for vendor names and locations, but you can use English for technical terms and certifications.`;

export async function findTopVendors(
  params: VendorFinderParams
): Promise<VendorResponse> {
  const { province, budget, distance } = params;

  const userPrompt = `Find the top 5 commercial kitchen vendors and catering services in ${province}, Indonesia that would be suitable for the Makan Bergizi Gratis (MBG) program with the following requirements:

**Program Requirements:**
- Province: ${province}
- Budget per portion: Rp ${budget.toLocaleString('id-ID')}
- Maximum distribution distance: ${distance} km
- Target: School children aged 7-9 years
- Required capacity: 1000-5000 portions per day minimum
- Must meet government food safety standards

**Search for vendors that have:**
1. Commercial kitchen facilities with large-scale production capacity
2. Food safety certifications (BPOM, Halal, etc.)
3. Experience with institutional or government catering
4. Competitive pricing within the specified budget range
5. Located within or can serve the specified province

Please search the internet for current, operating businesses and provide comprehensive information about each vendor including their specialties, capacity, estimated costs, contact details, and relevant certifications.

Focus on finding real, verifiable businesses that are currently operating in Indonesia.`;

  try {
    const response = await openai.responses.create({
      model: 'gpt-4.1',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: VENDOR_SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: userPrompt,
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'vendor_search_results',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              vendors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    location: {
                      type: 'string',
                    },
                    specialties: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    capacity_per_day: {
                      type: 'number',
                    },
                    estimated_cost_per_portion: {
                      type: 'number',
                    },
                    contact_info: {
                      type: 'string',
                    },
                    rating: {
                      type: 'number',
                    },
                    certification: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                  required: [
                    'name',
                    'location',
                    'specialties',
                    'capacity_per_day',
                    'estimated_cost_per_portion',
                    'contact_info',
                    'rating',
                    'certification',
                  ],
                  additionalProperties: false,
                },
              },
              search_summary: {
                type: 'object',
                properties: {
                  total_found: {
                    type: 'number',
                  },
                  search_criteria: {
                    type: 'string',
                  },
                  last_updated: {
                    type: 'string',
                  },
                },
                required: ['total_found', 'search_criteria', 'last_updated'],
                additionalProperties: false,
              },
            },
            required: ['vendors', 'search_summary'],
            additionalProperties: false,
          },
        },
      },
      reasoning: {},
      tools: [
        {
          type: 'web_search_preview',
          user_location: {
            type: 'approximate',
            country: 'ID',
            city: getMainCityFromProvince(province),
            region: getRegionFromProvince(province),
          },
          search_context_size: 'high',
        },
      ],
      temperature: 1,
      max_output_tokens: 32768,
      top_p: 1,
      store: true,
    });

    try {
      // Log the entire response structure for debugging
      console.log(
        'Full response structure:',
        JSON.stringify(response, null, 2)
      );

      const responseData = response as any;

      // Try parsing from all possible response formats

      // Method 1: Try output_text (where the data actually is!)
      if (responseData.output_text) {
        console.log('Found data in output_text');
        return JSON.parse(responseData.output_text) as VendorResponse;
      }

      // Method 2: Try assistant.content[0].text
      if (responseData.assistant?.content?.[0]?.text) {
        console.log('Found data in assistant.content[0].text');
        return JSON.parse(
          responseData.assistant.content[0].text
        ) as VendorResponse;
      }

      // Method 3: Try output[0].content[0].text
      if (responseData.output?.[0]?.content?.[0]?.text) {
        console.log('Found data in output[0].content[0].text');
        return JSON.parse(
          responseData.output[0].content[0].text
        ) as VendorResponse;
      }

      // Method 4: Try direct text property
      if (responseData.text) {
        console.log('Found data in direct text property');
        return JSON.parse(responseData.text) as VendorResponse;
      }

      // Method 5: Try message content
      if (responseData.message?.content) {
        console.log('Found data in message.content');
        return JSON.parse(responseData.message.content) as VendorResponse;
      }

      // Method 6: Try choices format
      if (responseData.choices?.[0]?.message?.content) {
        console.log('Found data in choices[0].message.content');
        return JSON.parse(
          responseData.choices[0].message.content
        ) as VendorResponse;
      }

      // Method 7: Try content directly
      if (responseData.content) {
        console.log('Found data in direct content property');
        return JSON.parse(responseData.content) as VendorResponse;
      }

      // Method 8: Try nested response
      if (responseData.response?.text) {
        console.log('Found data in response.text');
        return JSON.parse(responseData.response.text) as VendorResponse;
      }

      // Method 9: Check if response itself is the data
      if (typeof responseData === 'object' && responseData.vendors) {
        console.log('Response itself contains vendor data');
        return responseData as VendorResponse;
      }

      console.log('No valid data found in any known response format');
    } catch (parseError) {
      console.error('Error parsing vendor response:', parseError);
      console.error('Response data:', response);
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('Error finding vendors:', error);
    throw new Error(
      `Failed to find vendors: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

function getRegionFromProvince(province: string): string {
  const regionMap: Record<string, string> = {
    'DKI Jakarta': 'Jakarta',
    'Jawa Barat': 'West Java',
    'Jawa Tengah': 'Central Java',
    'Jawa Timur': 'East Java',
    'DI Yogyakarta': 'Yogyakarta',
    Banten: 'Banten',
    'Sumatera Utara': 'North Sumatra',
    'Sumatera Barat': 'West Sumatra',
    'Sumatera Selatan': 'South Sumatra',
    Bali: 'Bali',
    'Kalimantan Timur': 'East Kalimantan',
    'Sulawesi Selatan': 'South Sulawesi',
    Papua: 'Papua',
  };
  return regionMap[province] || province;
}

function getMainCityFromProvince(province: string): string {
  const cityMap: Record<string, string> = {
    'DKI Jakarta': 'Jakarta',
    'Jawa Barat': 'Bandung',
    'Jawa Tengah': 'Semarang',
    'Jawa Timur': 'Surabaya',
    'DI Yogyakarta': 'Yogyakarta',
    Banten: 'Serang',
    'Sumatera Utara': 'Medan',
    'Sumatera Barat': 'Padang',
    'Sumatera Selatan': 'Palembang',
    Bali: 'Denpasar',
    'Kalimantan Timur': 'Samarinda',
    'Sulawesi Selatan': 'Makassar',
    Papua: 'Jayapura',
  };
  return cityMap[province] || 'Jakarta';
}
