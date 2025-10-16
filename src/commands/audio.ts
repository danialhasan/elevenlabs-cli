import { ElevenLabsClient } from '../lib/api-client';
import * as fs from 'fs';
import * as path from 'path';

export async function audioCommand(conversationId: string, options: { download?: boolean; output?: string; apiKey: string }) {
  const client = new ElevenLabsClient(options.apiKey);

  try {
    const audioBuffer = await client.getAudio(conversationId);

    const outputPath = options.output || `./audio/${conversationId}.wav`;
    const dir = path.dirname(outputPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, audioBuffer);
    console.log(`✓ Audio saved to: ${outputPath}`);
    console.log(`  Size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error(`✗ Error downloading audio: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
