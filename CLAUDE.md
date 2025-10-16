# Claude Code - Project Instructions

## Project Context

**Name:** ElevenLabs CLI
**Purpose:** Professional CLI tool for analyzing ElevenLabs Conversational AI calls
**Status:** Production-ready (v1.0.0)
**Test Coverage:** 4/4 tests passing
**Development Methodology:** TDD + Squad Pattern

## Quick Reference

### Project Structure

```
elevenlabs-cli/
├── src/
│   ├── commands/              # CLI commands (get, list, analyze, audio)
│   ├── lib/api-client.ts      # API client (TDD-tested)
│   ├── types/elevenlabs.ts    # TypeScript types
│   └── index.ts               # Main entry point
├── dist/                       # Built JavaScript (gitignored)
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .env.example
├── .gitignore
├── README.md                   # User documentation
├── AGENTS.md                   # Development protocols
└── CLAUDE.md                   # This file
```

### Common Commands

```bash
# Development
npm install          # Install dependencies
npm run build        # Build TypeScript
npm test             # Run tests
npm run test:watch   # Watch mode
npm run dev          # Run without building

# Usage
elevenlabs-cli list --recent 10
elevenlabs-cli get <conv-id> --save
elevenlabs-cli analyze <conv-id>
elevenlabs-cli audio <conv-id> --download
```

## Development Guidelines

### TDD Workflow (Squad Pattern)

**ALWAYS follow this sequence when adding features:**

1. **RED** - Write failing test first
2. **GREEN** - Minimal implementation to pass
3. **REFACTOR** - Clean up while keeping tests green
4. **INTEGRATE** - Build and verify globally
5. **FIRE** - Live test with real API

See `AGENTS.md` for detailed workflow.

### Code Standards

**TypeScript:**
- Strict mode enabled
- No `any` types (use specific types or `unknown`)
- Explicit return types on all functions
- Use interfaces for object shapes

**Testing:**
- All API client methods must have tests
- Mock external dependencies (axios)
- Use Vitest for testing
- Structure: Arrange-Act-Assert

**Error Handling:**
- Catch specific error types
- Provide actionable error messages
- Exit with code 1 on failure
- Log errors to stderr

### File Modifications

**When modifying existing files:**
1. Read the file first with Read tool
2. Understand existing patterns
3. Make minimal changes
4. Run tests to verify (`npm test`)
5. Build to check TypeScript (`npm run build`)

**When adding new features:**
1. Write test first (RED)
2. Implement minimal code (GREEN)
3. Refactor for quality
4. Update documentation

## Key Design Decisions

### API Endpoints

**Correct v1 endpoints (currently used):**
```typescript
// List conversations
GET /v1/convai/conversations

// Get single conversation
GET /v1/convai/conversations/:id

// Get audio
GET /v1/convai/conversations/:id/audio
```

**Old endpoints (deprecated - don't use):**
```
❌ /conversationalAi/conversations.list
❌ /conversationalAi/conversations.get
❌ /conversationalAi/conversations/audio.get
```

### Architecture Principles

1. **Single Responsibility** - Each command file does one thing
2. **Composition over Inheritance** - Functions > Classes where possible
3. **Type Safety** - Let TypeScript catch errors at compile time
4. **Error First** - Handle errors explicitly, don't let them bubble silently

### Environment Variables

**API Key Resolution (in order of priority):**
1. `--api-key` flag (highest priority)
2. `ELEVENLABS_API_KEY` environment variable
3. `.env` file in project root

## Common Tasks

### Adding a New Command

**Example: Adding a `search` command**

1. **RED - Write test:**
```bash
# Create test file
touch src/commands/search.test.ts
```

```typescript
// src/commands/search.test.ts
import { describe, it, expect } from 'vitest';
import { searchCommand } from './search';

describe('searchCommand', () => {
  it('should search conversations by keyword', async () => {
    // Arrange, Act, Assert
  });
});
```

2. **GREEN - Implement:**
```bash
# Create command file
touch src/commands/search.ts
```

```typescript
// src/commands/search.ts
export async function searchCommand(keyword: string, options: { apiKey: string }) {
  // Minimal implementation
}
```

3. **INTEGRATE - Add to CLI:**
```typescript
// src/index.ts
import { searchCommand } from './commands/search';

program
  .command('search <keyword>')
  .description('Search conversations by keyword')
  .option('--api-key <key>', 'ElevenLabs API key')
  .action(async (keyword, options) => {
    await searchCommand(keyword, {
      apiKey: getApiKey(options.apiKey)
    });
  });
```

4. **REFACTOR & FIRE - Test:**
```bash
npm run build
elevenlabs-cli search "error" --api-key $ELEVENLABS_API_KEY
```

### Adding a New API Method

**Example: Adding conversation deletion**

1. **RED - Test first:**
```typescript
// src/lib/api-client.test.ts
describe('deleteConversation', () => {
  it('should delete a conversation by ID', async () => {
    const mockConversationId = 'conv_abc123';
    mockDelete.mockResolvedValueOnce({ data: { success: true } });

    const result = await client.deleteConversation(mockConversationId);

    expect(mockDelete).toHaveBeenCalledWith(`/v1/convai/conversations/${mockConversationId}`);
    expect(result.success).toBe(true);
  });
});
```

2. **GREEN - Implement:**
```typescript
// src/lib/api-client.ts
async deleteConversation(conversationId: string): Promise<{ success: boolean }> {
  try {
    const response = await this.client.delete(`/v1/convai/conversations/${conversationId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} ${error.response.statusText}`);
    }
    throw error;
  }
}
```

3. **FIRE - Test with real API:**
```bash
npm test                    # Verify tests pass
npm run build               # Build TypeScript
# Test with real API (optional)
```

## Debugging

### Enable Verbose Output

Add debug logging:
```typescript
console.log('[DEBUG]', { conversationId, options });
```

### Test API Client Directly

```bash
# Create test script
cat > test-api.ts << 'EOF'
import { ElevenLabsClient } from './src/lib/api-client';
const client = new ElevenLabsClient(process.env.ELEVENLABS_API_KEY!);
client.listConversations({ limit: 1 }).then(console.log);
EOF

npx ts-node test-api.ts
```

### Check Compiled Output

```bash
# See what's actually built
cat dist/lib/api-client.js | head -100
```

## Error Messages & Troubleshooting

### Common Errors

**1. "ELEVENLABS_API_KEY not found"**
```bash
# Solution:
export ELEVENLABS_API_KEY="sk_your_key_here"
```

**2. "Command not found: elevenlabs-cli"**
```bash
# Solution:
npm link
which elevenlabs-cli  # Verify it's in PATH
```

**3. "API Error: 404 Not Found"**
```bash
# Solution: Check endpoint paths match v1 spec
# Correct: /v1/convai/conversations
# Wrong: /conversationalAi/conversations.list
```

**4. TypeScript errors on build**
```bash
# Solution:
npm run clean
npm install
npm run build
```

## Best Practices

### When Adding Features
- [ ] Write test first (TDD)
- [ ] Keep changes minimal
- [ ] Update types if API changes
- [ ] Update README if user-facing
- [ ] Run tests before committing
- [ ] Build successfully

### When Fixing Bugs
- [ ] Write test that reproduces bug
- [ ] Fix the bug (test should pass)
- [ ] Check no regressions (all tests pass)
- [ ] Document the fix in commit message

### When Refactoring
- [ ] Ensure tests still pass
- [ ] No behavior changes
- [ ] Improve code quality/readability
- [ ] Remove dead code

## Testing Guidelines

### Running Tests

```bash
# All tests
npm test

# Specific file
npm test src/lib/api-client.test.ts

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

### Writing Tests

**Good test structure:**
```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup mocks
  });

  describe('methodName', () => {
    it('should <specific behavior>', async () => {
      // Arrange
      const input = 'test';

      // Act
      const result = await method(input);

      // Assert
      expect(result).toBe('expected');
    });

    it('should handle errors gracefully', async () => {
      // Test error cases
    });
  });
});
```

## Dependencies

### Core Dependencies
- `commander` - CLI framework
- `axios` - HTTP client
- `dotenv` - Environment variables

### Dev Dependencies
- `typescript` - Type safety
- `vitest` - Testing framework
- `ts-node` - TypeScript execution

### Adding New Dependencies

```bash
# Production dependency
npm install <package>

# Dev dependency
npm install -D <package>

# Update package.json, rebuild, test
npm run build
npm test
```

## Release Process

### Version Bump

```bash
# Patch (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# Minor (new features): 1.0.0 -> 1.1.0
npm version minor

# Major (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

### Pre-Release Checklist
- [ ] All tests passing
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] Version bumped in package.json
- [ ] Build succeeds
- [ ] Manual testing with real API

## Support & Resources

**Documentation:**
- README.md - User documentation
- AGENTS.md - Development protocols
- CLAUDE.md - This file (Claude instructions)

**External Resources:**
- ElevenLabs API: https://elevenlabs.io/docs/api-reference
- Commander.js: https://github.com/tj/commander.js
- Vitest: https://vitest.dev

## Notes for Claude

### When User Asks to Add Feature
1. Confirm feature requirements
2. Write test first (show user the test)
3. Implement minimal code
4. Run tests to verify
5. Update documentation if needed

### When User Reports Bug
1. Ask for reproduction steps
2. Write test that fails
3. Fix bug to make test pass
4. Verify no regressions
5. Document fix

### When User Wants to Refactor
1. Ensure tests exist and pass
2. Make changes incrementally
3. Keep tests green
4. Improve code quality
5. No behavior changes

---

**Last Updated:** 2025-10-16
**Maintained By:** Development Team
