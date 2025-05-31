import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface MenuGenerationParams {
  budget: number;
  carbs: number;
  protein: number;
  fat: number;
  distance: number;
  season: string;
  month: string;
  province: string;
}

interface DailyMenu {
  date: number;
  menu_name: string;
  price_per_portion: number;
}

interface MonthlySummary {
  total_monthly_budget: number;
  average_daily_calories: number;
}

interface MenuResponse {
  daily_menus: DailyMenu[];
  monthly_summary: MonthlySummary;
}

const SYSTEM_PROMPT = `You are an AI assistant specialized in generating monthly food menus for Indonesia's "Makan Bergizi Gratis" (Free Nutritious Meals) program under President Prabowo's administration. Your task is to create nutritionally balanced, culturally appropriate, and budget-conscious meal plans for school children aged 7-9 years. Here are the details:

## INSTRUCTIONS:
Based on your knowledge (and/or search the internet if you need to), you must generate a 28-31 days menu plan for the Makan Bergizi Gratis program with the following parameters:

### MENU GENERATION PROCESS:
1. Generate daily menus for each day of the specified month with realistic pricing
  Note: The menu name format SHOULD BE LIKE THIS: "Nasi Bakar Ayam + Sambal Terasi"; "Nasi Padang + Rendang + Sayur Singkong"; "Nasi Kuning + Ayam Goreng + Sayur Asem"; etc.
2. Calculate total monthly budget and average daily calories
3. Ensure cultural appropriateness and child-friendly recipes
4. Balance nutrition according to specified macronutrient targets

### KEY REQUIREMENTS:
1. **Regional Adaptation**: Use knowledge of Indonesian regional cuisines and typical food prices by province
2. **Budget Compliance**: Stay *AROUND* the specified budget per portion using realistic Indonesian market prices. It *DOES NOT* have to be exactly the same, it wouldn't be realistic. For example, if the budget is Rp 10,000, the price per portion could be in the range of Rp 9,000-11,000.
3. **Local Dishes**: Focus on traditional Indonesian dishes popular in the specified province
4. **Nutritional Guidelines**: Follow AKG (Angka Kecukupan Gizi) for Indonesian children aged 7-9 years
5. **Seasonal Considerations**: Account for seasonal ingredient availability (rainy season: Nov-Mar, dry season: Apr-Oct)
6. **Language**: *ALWAYS* use Indonesian language for the menu names.

### BASIC INGREDIENT PRICING GUIDELINES (2024-2025):
- Basic ingredients: Rice (Rp 12,000-15,000/kg), Chicken (Rp 30,000-35,000/kg), Fish (Rp 25,000-40,000/kg)
- Vegetables: Rp 5,000-15,000/kg depending on season and region
- Tempeh/Tofu: Rp 8,000-12,000/kg
- Eggs: Rp 25,000-30,000/kg
- Regional price variations: Jakarta/Java higher, Sumatra/Kalimantan moderate, Eastern Indonesia variable

The output should provide practical menu planning data: daily menus with realistic pricing, total monthly costs, nutritional estimates, and supply chain requirements.

The language of the output *SHOULD* be Indonesian. Also, remember to follow the menu name format.`;

export async function generateMonthlyMenu(
  params: MenuGenerationParams
): Promise<MenuResponse> {
  const { budget, carbs, protein, fat, distance, season, month, province } =
    params;

  const daysInMonth = new Date(2025, getMonthNumber(month), 0).getDate();

  const seasonText =
    season === 'hujan'
      ? 'Musim Hujan (Nov - Mar)'
      : season === 'kemarau'
      ? 'Musim Kemarau (Apr - Oct)'
      : 'Sepanjang Tahun';

  const userPrompt = `Generate a monthly menu plan for the Makan Bergizi Gratis program with the following parameters:

**Budget & Nutrition:**
- Budget per portion: Rp ${budget.toLocaleString('id-ID')}
- Target macronutrients per day:
  - Carbohydrates: ${carbs}%
  - Protein: ${protein}%
  - Fat: ${fat}%

**Location & Distribution:**
- Province: ${province}
- Month: ${month} 2025
- Maximum distribution distance: ${distance} km
- Seasonal availability: ${seasonText}

**Required Output:**
1. Daily menus for all ${daysInMonth} days in ${month} with realistic pricing based on typical Indonesian market prices
2. Total monthly budget calculation
3. Average daily calories estimation
4. Number of vendors needed for ingredient supply

Focus on traditional Indonesian dishes that are practical for school meal programs and appropriate for children aged 7-9 years. Consider regional food preferences and seasonal ingredient availability for ${province} during ${month}.

Remember to use Indonesian language for the menu names.`;

  try {
    const response = await openai.responses.create({
      model: 'gpt-4.1',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: SYSTEM_PROMPT,
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
          name: 'monthly_menu_preview',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              daily_menus: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    date: {
                      type: 'number',
                    },
                    menu_name: {
                      type: 'string',
                    },
                    price_per_portion: {
                      type: 'number',
                    },
                  },
                  required: ['date', 'menu_name', 'price_per_portion'],
                  additionalProperties: false,
                },
              },
              monthly_summary: {
                type: 'object',
                properties: {
                  total_monthly_budget: {
                    type: 'number',
                  },
                  average_daily_calories: {
                    type: 'number',
                  },
                },
                required: ['total_monthly_budget', 'average_daily_calories'],
                additionalProperties: false,
              },
            },
            required: ['daily_menus', 'monthly_summary'],
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
      const output = response.output?.[0] as any;
      if (output?.content?.[0]?.text) {
        return JSON.parse(output.content[0].text) as MenuResponse;
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('Error generating menu:', error);
    throw new Error(
      `Failed to generate menu: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

function getMonthNumber(monthName: string): number {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return months.indexOf(monthName);
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
