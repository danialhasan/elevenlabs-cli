# ElevenLabs CLI

> **Professional CLI tool for analyzing ElevenLabs Conversational AI calls**
> Built with Test-Driven Development (TDD) and TypeScript for production debugging workflows.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-4%2F4%20Passing-success)](#testing)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🎯 Purpose

Debug and analyze ElevenLabs Conversational AI calls with detailed insights into:
- 📝 **Full transcripts** with timestamps
- 🔧 **Tool calls** (parameters, results, failures)
- ⚡ **Performance metrics** (TTFB, TTF sentence, LLM latency)
- 💰 **Cost breakdowns** (token usage, cache hits)
- 🎙️ **Audio recordings** download capability

**Built for:** Engineers debugging voice AI pipelines, QA teams validating conversation flows, and product teams analyzing call quality.

## ✨ Features

- ✅ **Fetch conversations** - Get complete conversation data with full transcripts
- ✅ **List recent calls** - View conversation history with pagination
- ✅ **Deep analysis** - Markdown reports with tool calls, failures, and performance metrics
- ✅ **Download audio** - Retrieve audio recordings of conversations
- ✅ **TDD-tested** - Core API client has 100% test coverage (4/4 passing)
- ✅ **Type-safe** - Full TypeScript with strict mode
- ✅ **Fast** - Minimal dependencies, quick startup

## 📦 Installation

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **pnpm**
- **ElevenLabs API Key** - Get yours at [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/elevenlabs-cli.git
cd elevenlabs-cli

# Install dependencies
npm install

# Build TypeScript
npm run build

# Link globally (makes 'elevenlabs-cli' available everywhere)
npm link

# Verify installation
elevenlabs-cli --version
```

### Configuration

Set your ElevenLabs API key using one of these methods:

```bash
# Option 1: Environment variable (recommended)
export ELEVENLABS_API_KEY="your_api_key_here"

# Option 2: .env file
cp .env.example .env
# Edit .env and add your API key

# Option 3: Pass via --api-key flag on each command
elevenlabs-cli list --api-key "your_key"
```

## 🚀 Usage

### List Recent Conversations

```bash
# Show 10 most recent conversations
elevenlabs-cli list --recent 10

# Output:
# 📋 Recent Conversations (showing 10):
#
# 1. conv_abc123...
#    Agent: agent_xyz789
#    Created: 2025-10-16T03:30:13Z
```

### Get Conversation Details

```bash
# Print full JSON to stdout
elevenlabs-cli get conv_abc123

# Save to file
elevenlabs-cli get conv_abc123 --save
# Saves to: ./conversations/conv_abc123.json

# Custom output path
elevenlabs-cli get conv_abc123 --output ./my-data/call.json
```

### Analyze Conversation

Generate a comprehensive Markdown analysis report:

```bash
elevenlabs-cli analyze conv_abc123

# Save to file
elevenlabs-cli analyze conv_abc123 > analysis.md
```

**Report includes:**
- Call summary (duration, cost, success status)
- Transcript summary
- Tool calls analysis (parameters, results, failures)
- Performance metrics table (TTFB, TTF sentence)
- Full transcript with emoji indicators (🤖 Agent / 👤 User)

**Example output:**

```markdown
# Conversation Analysis: conv_abc123

## Summary
- **Agent ID:** agent_xyz789
- **Status:** done
- **Duration:** 1m 45s
- **Cost:** 125 credits
- **Call Success:** success

## Tool Calls Analysis

### Turn 3 (15s into call)
- **schedule_appointment**
  - ID: `tool_call_123`
  - Parameters: `{"date": "2025-10-20", "time": "14:00"}`
  - Result: ✅ Success

## Performance Metrics
| Turn | TTFB (s) | TTF Sentence (s) |
|------|----------|------------------|
| 1    | 0.372    | 0.555            |
| 2    | 0.420    | 0.601            |
```

### Download Audio

```bash
# Download to default location (./audio/<conversation-id>.wav)
elevenlabs-cli audio conv_abc123 --download

# Custom output path
elevenlabs-cli audio conv_abc123 --output ./recordings/important-call.wav

# Output:
# ✓ Audio saved to: ./audio/conv_abc123.wav
#   Size: 245.32 KB
```

## 🏗️ Architecture

```
elevenlabs-cli/
├── src/
│   ├── commands/              # CLI command implementations
│   │   ├── get.ts            # Fetch conversation data
│   │   ├── list.ts           # List conversations
│   │   ├── analyze.ts        # Generate analysis reports
│   │   └── audio.ts          # Download audio
│   ├── lib/
│   │   ├── api-client.ts     # ElevenLabs API client (TDD-tested)
│   │   └── api-client.test.ts
│   ├── types/
│   │   └── elevenlabs.ts     # TypeScript type definitions
│   └── index.ts              # Main CLI entry point
├── dist/                      # Compiled JavaScript (gitignored)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### Design Principles

1. **TDD-First** - All core logic is test-driven
2. **Type Safety** - Strict TypeScript with no `any` types
3. **Single Responsibility** - Each command does one thing well
4. **Composability** - Easy to pipe output to other tools
5. **Error Handling** - Clear error messages with exit codes

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# Current coverage: 4/4 tests passing
```

### Test Structure

```typescript
// Example: api-client.test.ts
describe('ElevenLabsClient', () => {
  describe('getConversation', () => {
    it('should fetch a conversation by ID', async () => {
      // Arrange
      const mockConversationId = 'conv_abc123';

      // Act
      const result = await client.getConversation(mockConversationId);

      // Assert
      expect(result.conversation_id).toBe(mockConversationId);
    });
  });
});
```

## 🔧 Development

### Build Commands

```bash
# Clean build directory
npm run clean

# Build TypeScript
npm run build

# Watch mode (rebuild on changes)
npm run watch

# Development mode (run without building)
npm run dev -- list --recent 5
```

### Development Workflow

This project was built using the **Squad Pattern** (TDD + Demo Mode):

1. **RED** - Write failing tests
2. **GREEN** - Implement minimal code to pass
3. **REFACTOR** - Clean up and optimize
4. **INTEGRATE** - Build and verify globally
5. **FIRE** - Live testing with real API

See [AGENTS.md](AGENTS.md) for full development protocols.

## 📊 Example: Analyzing Call Failures

**Scenario:** Debug why tool calls are failing in production calls.

```bash
# Step 1: List recent calls
elevenlabs-cli list --recent 20 > recent-calls.txt

# Step 2: Analyze each call for tool failures
for conv_id in $(cat recent-calls.txt | grep conv_ | cut -d' ' -f2); do
  elevenlabs-cli analyze $conv_id | grep -A 5 "❌ Failed" >> failures.md
done

# Step 3: Review aggregated failures
cat failures.md
```

## 🤝 Contributing

Contributions welcome! Please follow TDD workflow:

1. Write failing tests first (`*.test.ts`)
2. Implement minimal code to pass
3. Refactor and add types
4. Update documentation

See [AGENTS.md](AGENTS.md) for full development guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **ElevenLabs Docs:** [elevenlabs.io/docs](https://elevenlabs.io/docs)
- **API Reference:** [elevenlabs.io/docs/api-reference](https://elevenlabs.io/docs/api-reference)
- **Get API Key:** [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys)

## 💡 Troubleshooting

### "ELEVENLABS_API_KEY not found"

**Solution:** Set your API key via environment variable, `.env` file, or `--api-key` flag.

```bash
# Check if key is set
echo $ELEVENLABS_API_KEY

# Set for current session
export ELEVENLABS_API_KEY="sk_your_key_here"

# Set permanently (add to ~/.zshrc or ~/.bashrc)
echo 'export ELEVENLABS_API_KEY="sk_your_key_here"' >> ~/.zshrc
```

### "Command not found: elevenlabs-cli"

**Solution:** Run `npm link` from the project directory to make it globally available.

```bash
cd /path/to/elevenlabs-cli
npm link

# Verify
which elevenlabs-cli
elevenlabs-cli --version
```

### Build errors

**Solution:** Clean and reinstall dependencies.

```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API 404 errors

**Issue:** Old documentation endpoint paths may not work.

**Solution:** This CLI uses the correct v1 endpoints:
- `GET /v1/convai/conversations` (list)
- `GET /v1/convai/conversations/:id` (get)
- `GET /v1/convai/conversations/:id/audio` (audio)

If you encounter 404s, verify your API key is valid and you have access to the Conversational AI feature.

## 📈 Roadmap

- [ ] Add conversation filtering (by date, agent, status)
- [ ] Export to CSV/JSON for bulk analysis
- [ ] Cost tracking and reporting
- [ ] Integration with CI/CD for automated call quality checks
- [ ] WebSocket support for real-time call monitoring
- [ ] Dashboard web interface

---

**Built with ❤️ using TDD and TypeScript**
