#!/usr/bin/env node

import { Command } from 'commander';
import { getCommand } from './commands/get';
import { listCommand } from './commands/list';
import { analyzeCommand } from './commands/analyze';
import { audioCommand } from './commands/audio';
import { loadConfig } from './lib/config';

const program = new Command();

program
  .name('elevenlabs-cli')
  .description('CLI tool for analyzing ElevenLabs conversational AI calls')
  .version('1.0.0');

// Helper to get API key with automatic .env loading
function getApiKey(cmdApiKey?: string): string {
  try {
    const config = loadConfig({ apiKey: cmdApiKey });
    return config.apiKey;
  } catch (error) {
    console.error(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Get command
program
  .command('get <conversation-id>')
  .description('Fetch and display a conversation by ID')
  .option('--save', 'Save conversation to file')
  .option('--output <path>', 'Custom output path')
  .option('--api-key <key>', 'ElevenLabs API key')
  .action(async (conversationId, options) => {
    await getCommand(conversationId, {
      ...options,
      apiKey: getApiKey(options.apiKey)
    });
  });

// List command
program
  .command('list')
  .description('List recent conversations')
  .option('--recent <number>', 'Number of conversations to show', '10')
  .option('--api-key <key>', 'ElevenLabs API key')
  .action(async (options) => {
    await listCommand({
      recent: parseInt(options.recent, 10),
      apiKey: getApiKey(options.apiKey)
    });
  });

// Analyze command
program
  .command('analyze <conversation-id>')
  .description('Analyze conversation with tool calls, failures, and metrics')
  .option('--api-key <key>', 'ElevenLabs API key')
  .action(async (conversationId, options) => {
    await analyzeCommand(conversationId, {
      apiKey: getApiKey(options.apiKey)
    });
  });

// Audio command
program
  .command('audio <conversation-id>')
  .description('Download audio recording of a conversation')
  .option('--download', 'Download audio file')
  .option('--output <path>', 'Custom output path')
  .option('--api-key <key>', 'ElevenLabs API key')
  .action(async (conversationId, options) => {
    await audioCommand(conversationId, {
      ...options,
      apiKey: getApiKey(options.apiKey)
    });
  });

program.parse();
