const AZURE_OPENAI_CONFIG = {
  baseURL:
    'https://ai-hadiwijayachristian70430ai861360787903.openai.azure.com/openai/deployments/gpt-4o/chat/completions',
  apiVersion: '2024-12-01-preview',
  apiKey:
    'FYxfYqsGMw0kh2iNwUFDSLtaNGSoXR2J1m17YG4mDNoJjfLKuLxSJQQJ99BEACHYHv6XJ3w3AAAAACOGUO6X',
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export async function sendChatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const response = await fetch(
      `${AZURE_OPENAI_CONFIG.baseURL}?api-version=${AZURE_OPENAI_CONFIG.apiVersion}`,
      {
        method: 'POST',
        headers: {
          'api-key': AZURE_OPENAI_CONFIG.apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'SatuGizi/1.0.0',
        },
        body: JSON.stringify({
          messages,
        } as ChatCompletionRequest),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Azure OpenAI API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response received';
  } catch (error) {
    console.error('Error calling Azure OpenAI API:', error);
    throw error;
  }
}

export async function sendHelloRequest(): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' },
  ];

  return await sendChatCompletion(messages);
}
