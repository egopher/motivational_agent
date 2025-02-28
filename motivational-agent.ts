import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});


// Configuration
const config = {
  frequency: process.env.FREQUENCY_MINUTES ? parseInt(process.env.FREQUENCY_MINUTES) : 60, // minutes
};

/**
 * Generate a motivational quote using Claude
 */
async function generateMotivationalQuote(): Promise<string> {
  try {
    const resp = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: 'Get me a random inspiring motivational quote that will help someone stay positive and motivated. Add an author to the quote. Don\'t send steve jobs.'
        }
      ]
    });

    // Handle the content block correctly
    const contentBlock = resp.content[0];
    if (contentBlock.type === 'text') {
      return contentBlock.text;
    } else {
      return "Could not extract quote from response";
    }
  } catch (error) {
    console.error('Error generating quote:', error);
    return 'The greatest glory in living lies not in never falling, but in rising every time we fall.';
  }
}

/**
 * Send the motivational quote via email
 */
async function sendQuoteEmail(quote: string): Promise<void> {
  // Log the quote to console
  console.log('\n=== New Motivational Quote ===');
  console.log(quote);
  console.log('==============================\n');

}

/**
 * Main function to run the motivational agent
 */
async function runMotivationalAgent(): Promise<void> {
  console.log('Motivational Agent started!');
  console.log(`Frequency: Every ${config.frequency} minutes`);

  // Send first quote immediately
  const quote = await generateMotivationalQuote();
  await sendQuoteEmail(quote);

  // Schedule regular quotes
  setInterval(async () => {
    const quote = await generateMotivationalQuote();
    await sendQuoteEmail(quote);
  }, config.frequency * 60 * 1000);
}

// Start the agent
runMotivationalAgent().catch(console.error); 