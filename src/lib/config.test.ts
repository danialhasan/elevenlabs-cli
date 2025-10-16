import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

describe('Config - API Key Loading', () => {
  const testEnvPath = path.join(__dirname, '../../.env.test');
  const originalEnv = process.env.ELEVENLABS_API_KEY;

  beforeEach(() => {
    // Clear environment
    delete process.env.ELEVENLABS_API_KEY;
  });

  afterEach(() => {
    // Restore original
    if (originalEnv) {
      process.env.ELEVENLABS_API_KEY = originalEnv;
    } else {
      delete process.env.ELEVENLABS_API_KEY;
    }
    // Clean up test file
    if (fs.existsSync(testEnvPath)) {
      fs.unlinkSync(testEnvPath);
    }
  });

  it('should load API key from .env file in project root', async () => {
    // Arrange - Create test .env file
    const testApiKey = 'sk_test_from_env_file';
    fs.writeFileSync(testEnvPath, `ELEVENLABS_API_KEY=${testApiKey}\n`);

    // Act - Dynamically import config to trigger .env loading
    const { loadConfig } = await import('./config');
    const config = loadConfig({ envPath: testEnvPath });

    // Assert
    expect(config.apiKey).toBe(testApiKey);
  });

  it('should prefer environment variable over .env file', async () => {
    // Arrange
    const envVarKey = 'sk_from_env_var';
    const fileKey = 'sk_from_file';

    process.env.ELEVENLABS_API_KEY = envVarKey;
    fs.writeFileSync(testEnvPath, `ELEVENLABS_API_KEY=${fileKey}\n`);

    // Act
    const { loadConfig } = await import('./config');
    const config = loadConfig({ envPath: testEnvPath });

    // Assert
    expect(config.apiKey).toBe(envVarKey);
  });

  it('should throw error when no API key is available', async () => {
    // Arrange - No env var, no .env file
    delete process.env.ELEVENLABS_API_KEY;

    // Act & Assert
    const { loadConfig } = await import('./config');
    expect(() => loadConfig({ envPath: '/nonexistent/.env' })).toThrow('ELEVENLABS_API_KEY not found');
  });

  it('should allow override via options parameter', async () => {
    // Arrange
    const overrideKey = 'sk_override_key';
    process.env.ELEVENLABS_API_KEY = 'sk_env_key';

    // Act
    const { loadConfig } = await import('./config');
    const config = loadConfig({ apiKey: overrideKey });

    // Assert
    expect(config.apiKey).toBe(overrideKey);
  });
});
