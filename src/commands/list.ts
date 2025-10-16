import { ElevenLabsClient } from '../lib/api-client';

export async function listCommand(options: { recent?: number; apiKey: string }) {
  const client = new ElevenLabsClient(options.apiKey);

  try {
    const limit = options.recent || 10;
    const result = await client.listConversations({ limit, offset: 0 });

    console.log(`\n📋 Recent Conversations (showing ${result.conversations.length}):\n`);

    result.conversations.forEach((conv, index) => {
      console.log(`${index + 1}. ${conv.conversation_id}`);
      console.log(`   Agent: ${conv.agent_id}`);
      console.log(`   Created: ${conv.created_at}`);
      console.log('');
    });
  } catch (error) {
    console.error(`✗ Error listing conversations: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
