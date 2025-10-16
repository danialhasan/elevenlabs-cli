import { ElevenLabsClient } from '../lib/api-client';
import * as fs from 'fs';
import * as path from 'path';

export async function getCommand(conversationId: string, options: { save?: boolean; output?: string; apiKey: string }) {
  const client = new ElevenLabsClient(options.apiKey);

  try {
    const conversation = await client.getConversation(conversationId);

    const output = JSON.stringify(conversation, null, 2);

    if (options.save || options.output) {
      const outputPath = options.output || `./conversations/${conversationId}.json`;
      const dir = path.dirname(outputPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, output);
      console.log(`✓ Conversation saved to: ${outputPath}`);
    } else {
      console.log(output);
    }
  } catch (error) {
    console.error(`✗ Error fetching conversation: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
