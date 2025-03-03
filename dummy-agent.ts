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
async function askClaude(prompt: string): Promise<string> {
  try {
    const resp = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt,
        }
      ]
    });

    // Handle the content block correctly
    const contentBlock = resp.content[0];
    if (contentBlock.type === 'text') {
      return contentBlock.text;
    } else {
      return "Could not extract response";
    }
  } catch (error) {
    console.error('Error getting responce:', error);
    return 'TRY AGAIN.';
  }
}

/**
 * Send the motivational quote via email
 */
async function printResponse(quote: string): Promise<void> {
  // Log the quote to console
  console.log('\n=== Response ===');
  console.log(quote);
  console.log('==============================\n');
}

/**
 * Main function to run the motivational agent
 */
async function runAgent(): Promise<void> {
  console.log('Dummy Agent started!');
  // Create readline interface for user input
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Function to get user input
  function getUserInput(): Promise<string> {
    return new Promise((resolve) => {
      rl.question('Enter your question for Claude: ', (input: string) => {
        resolve(input);
      });
    });
  }

  // Main interaction loop
  while (true) {
    try {
      // Get user input
      const userInput = await getUserInput();
      
      // Exit condition
      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
        console.log('Exiting Dummy Agent. Goodbye!');
        rl.close();
        break;
      }
      
      // Forward user input to Claude
      console.log('Asking Claude...');
      const response = await askClaude(userInput);
      
      // Display the response
      await printResponse(response);
    } catch (error) {
      console.error('Error in interaction loop:', error);
    }
  }

}

// Start the agent
runAgent().catch(console.error); 