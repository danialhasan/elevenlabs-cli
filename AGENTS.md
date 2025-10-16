# Agent Development Protocols - ElevenLabs CLI

## Project Overview

**Project:** ElevenLabs CLI - Professional tool for analyzing Conversational AI calls

**Status:** Production-ready

**Test Coverage:** 4/4 API client tests passing

**Development Methodology:** TDD + Squad Pattern

## Development Workflow (Squad Pattern)

This project follows the **Squad Pattern** - a test-driven development methodology with distinct phases:

### Phase 1: RED (Write Failing Tests)

**Objective:** Define expected behavior through failing tests.

```typescript
// Example: src/lib/api-client.test.ts
describe('ElevenLabsClient', () => {
  describe('getConversation', () => {
    it('should fetch a conversation by ID', async () => {
      const mockConversationId = 'conv_abc123';
      const mockResponse = { /* ... */ };

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.getConversation(mockConversationId);

      expect(result).toEqual(mockResponse.data);
    });
  });
});
```

**RED Phase Checklist:**
- [ ] Write test that defines expected API behavior
- [ ] Mock external dependencies (axios, API responses)
- [ ] Define expected output structure
- [ ] Run tests - they should FAIL
- [ ] Commit failing tests before implementing

### Phase 2: GREEN (Minimal Implementation)

**Objective:** Write minimum code to make tests pass.

```typescript
// Example: src/lib/api-client.ts
export class ElevenLabsClient {
  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response = await this.client.get(`/v1/convai/conversations/${conversationId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} ${error.response.statusText}`);
      }
      throw error;
    }
  }
}
```

**GREEN Phase Checklist:**
- [ ] Implement minimal code to pass tests
- [ ] No premature optimization
- [ ] No extra features beyond test requirements
- [ ] Run tests - they should PASS
- [ ] Commit passing implementation

### Phase 3: REFACTOR (Clean Up)

**Objective:** Improve code quality without breaking tests.

**Refactoring Guidelines:**
- Extract repeated logic into helper functions
- Improve naming for clarity
- Add error handling edge cases
- Optimize performance if needed
- Remove dead code

**REFACTOR Phase Checklist:**
- [ ] Tests still passing after each change
- [ ] Code follows TypeScript best practices
- [ ] No `any` types (use specific types)
- [ ] Error messages are clear and actionable
- [ ] Functions have single responsibility

### Phase 4: INTEGRATE (Build & Deploy)

**Objective:** Verify the CLI works in production environment.

```bash
# Build TypeScript
npm run build

# Link globally
npm link

# Verify it works
elevenlabs-cli --version
elevenlabs-cli --help
```

**INTEGRATE Phase Checklist:**
- [ ] TypeScript compiles without errors
- [ ] CLI is globally accessible
- [ ] All commands show help text correctly
- [ ] No runtime errors on basic commands

### Phase 5: FIRE (Live Testing)

**Objective:** Test with real ElevenLabs API.

```bash
# Set real API key
export ELEVENLABS_API_KEY="sk_real_key"

# Test with real data
elevenlabs-cli list --recent 5
elevenlabs-cli get <real-conversation-id>
elevenlabs-cli analyze <real-conversation-id>
```

**FIRE Phase Checklist:**
- [ ] List command works with real API
- [ ] Get command retrieves real conversation data
- [ ] Analyze command generates valid reports
- [ ] Audio command downloads real audio files
- [ ] Capture receipts (conversation IDs, outputs)
- [ ] Document any API issues discovered

## Code Standards

### TypeScript Guidelines

1. **Use strict mode** - `tsconfig.json` has `strict: true`
2. **No `any` types** - Use specific types or `unknown`
3. **Explicit return types** - Always specify function return types
4. **Interface over type** - Use interfaces for object shapes

**Good:**
```typescript
interface ConversationMetadata {
  start_time_unix_secs: number;
  call_duration_secs: number;
  cost: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  return `${mins}m ${seconds % 60}s`;
}
```

**Bad:**
```typescript
function formatDuration(seconds: any) {  // ❌ No any
  return seconds;  // ❌ No return type
}
```

### Error Handling

**Always:**
- Catch API errors specifically
- Provide actionable error messages
- Exit with non-zero code on failure
- Log errors to stderr

**Example:**
```typescript
try {
  const result = await client.getConversation(conversationId);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(`✗ Error fetching conversation: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
```

### Testing Standards

1. **Test file naming:** `<filename>.test.ts`
2. **Use Vitest** - Fast, modern testing framework
3. **Mock external dependencies** - Never hit real APIs in unit tests
4. **Arrange-Act-Assert** - Structure tests clearly

**Test Template:**
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  describe('methodName', () => {
    it('should <expected behavior>', async () => {
      // Arrange
      const input = 'test';

      // Act
      const result = await component.method(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## File Structure Conventions

```
src/
├── commands/          # One file per CLI command
│   ├── get.ts        # elevenlabs-cli get
│   ├── list.ts       # elevenlabs-cli list
│   ├── analyze.ts    # elevenlabs-cli analyze
│   └── audio.ts      # elevenlabs-cli audio
├── lib/              # Shared logic
│   ├── api-client.ts          # ElevenLabs API wrapper
│   └── api-client.test.ts     # Tests for API client
├── types/            # TypeScript type definitions
│   └── elevenlabs.ts # API response types
└── index.ts          # CLI entry point (commander.js)
```

### Naming Conventions

- **Files:** kebab-case (`api-client.ts`)
- **Classes:** PascalCase (`ElevenLabsClient`)
- **Functions:** camelCase (`getConversation`)
- **Constants:** UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Types/Interfaces:** PascalCase (`Conversation`, `ToolCall`)

## Git Workflow

### Commit Message Format

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `test:` Adding tests
- `refactor:` Code restructuring
- `docs:` Documentation only
- `chore:` Build/tooling changes

**Examples:**
```bash
git commit -m "feat: add audio download command"
git commit -m "fix: correct API endpoint for list conversations"
git commit -m "test: add error handling tests for API client"
```

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/<name>` - New features
- `fix/<name>` - Bug fixes

## Debugging

### Enable Verbose Logging

```bash
# Add to commands for debugging
console.log('[DEBUG]', { conversationId, options });
```

### Test API Endpoints

```bash
# Test raw API calls
curl -H "xi-api-key: $ELEVENLABS_API_KEY" \
  https://api.elevenlabs.io/v1/convai/conversations
```

### Check Build Output

```bash
# Inspect compiled JavaScript
cat dist/index.js | head -50
```

## Common Issues & Solutions

### Issue: Tests failing with "Cannot read properties of undefined"

**Cause:** Axios mock not properly configured
**Solution:** Ensure axios.create returns a mock instance

```typescript
const mockGet = vi.fn();
const mockAxiosInstance = {
  get: mockGet,
  post: vi.fn(),
};
(axios.create as any) = vi.fn(() => mockAxiosInstance);
```

### Issue: CLI not found after npm link

**Cause:** npm bin directory not in PATH
**Solution:** Add npm global bin to PATH

```bash
echo 'export PATH="$PATH:$(npm bin -g)"' >> ~/.zshrc
source ~/.zshrc
```

### Issue: API 404 errors

**Cause:** Using old documentation endpoint paths
**Solution:** Use v1 endpoints:

- ✅ `/v1/convai/conversations`
- ❌ `/conversationalAi/conversations.list`

## Performance Considerations

1. **Minimal dependencies** - Only essential packages
2. **Fast startup** - No heavy initialization
3. **Streaming for large files** - Use streams for audio downloads
4. **Parallel requests** - Batch when possible

## Security

1. **Never commit API keys** - Use .env and .gitignore
2. **Validate user input** - Sanitize conversation IDs
3. **HTTPS only** - All API calls over HTTPS
4. **Error messages** - Don't leak sensitive info

## Deployment Checklist

Before releasing a new version:

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] CLI commands work (`elevenlabs-cli --help`)
- [ ] README is up-to-date
- [ ] Version bumped in package.json
- [ ] CHANGELOG updated
- [ ] Git tag created

## Resources

- **ElevenLabs API Docs:** https://elevenlabs.io/docs/api-reference
- **Commander.js Docs:** https://github.com/tj/commander.js
- **Vitest Docs:** https://vitest.dev
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

---

**Last Updated:** 2025-10-16
**Maintained By:** Development Team
