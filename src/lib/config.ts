import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export interface Config {
  apiKey: string;
}

export interface LoadConfigOptions {
  apiKey?: string;
  envPath?: string;
}

export function loadConfig(options: LoadConfigOptions = {}): Config {
  // Priority 1: Explicit API key passed via options
  if (options.apiKey) {
    return { apiKey: options.apiKey };
  }

  // Priority 2: Load from .env file (in project root)
  const envPath = options.envPath || path.join(__dirname, '../../.env');

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  // Priority 3: Environment variable (might be set by .env or shell)
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error(
      'ELEVENLABS_API_KEY not found. ' +
      'Set it via .env file, environment variable, or --api-key flag.'
    );
  }

  return { apiKey };
}
