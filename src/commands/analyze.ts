import { ElevenLabsClient } from '../lib/api-client';
import { Conversation } from '../types/elevenlabs';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function analyzeToolCalls(conversation: Conversation): string {
  let output = '\n## Tool Calls Analysis\n\n';

  const toolCallTurns = conversation.transcript?.filter(turn => turn.tool_calls && turn.tool_calls.length > 0) || [];

  if (toolCallTurns.length === 0) {
    output += '_No tool calls detected_\n';
    return output;
  }

  toolCallTurns.forEach((turn, index) => {
    output += `### Turn ${index + 1} (${turn.time_in_call_secs}s into call)\n\n`;

    turn.tool_calls?.forEach(toolCall => {
      output += `- **${toolCall.name}**\n`;
      output += `  - ID: \`${toolCall.tool_call_id}\`\n`;
      output += `  - Parameters: \`${JSON.stringify(toolCall.parameters)}\`\n`;
    });

    if (turn.tool_results && turn.tool_results.length > 0) {
      output += '\n  **Results:**\n';
      turn.tool_results.forEach(result => {
        const status = result.error ? '❌ Failed' : '✅ Success';
        output += `  - ${status}: \`${result.tool_call_id}\`\n`;
        if (result.error) {
          output += `    Error: ${result.error}\n`;
        }
      });
    }

    output += '\n';
  });

  return output;
}

function analyzeMetrics(conversation: Conversation): string {
  let output = '\n## Performance Metrics\n\n';

  const turnsWithMetrics = conversation.transcript?.filter(turn => turn.conversation_turn_metrics) || [];

  if (turnsWithMetrics.length === 0) {
    output += '_No metrics available_\n';
    return output;
  }

  output += '| Turn | TTFB (s) | TTF Sentence (s) |\n';
  output += '|------|----------|------------------|\n';

  turnsWithMetrics.forEach((turn, index) => {
    const ttfb = turn.conversation_turn_metrics?.convai_llm_service_ttfb?.elapsed_time.toFixed(3) || 'N/A';
    const ttfs = turn.conversation_turn_metrics?.convai_llm_service_ttf_sentence?.elapsed_time.toFixed(3) || 'N/A';
    output += `| ${index + 1} | ${ttfb} | ${ttfs} |\n`;
  });

  return output;
}

export async function analyzeCommand(conversationId: string, options: { apiKey: string }) {
  const client = new ElevenLabsClient(options.apiKey);

  try {
    const conversation = await client.getConversation(conversationId);

    let markdown = `# Conversation Analysis: ${conversationId}\n\n`;

    markdown += `## Summary\n\n`;
    markdown += `- **Agent ID:** ${conversation.agent_id}\n`;
    markdown += `- **Status:** ${conversation.status}\n`;
    markdown += `- **Duration:** ${formatDuration(conversation.metadata.call_duration_secs)}\n`;
    markdown += `- **Cost:** ${conversation.metadata.cost} credits\n`;
    if (conversation.analysis?.call_successful) {
      markdown += `- **Call Success:** ${conversation.analysis.call_successful}\n`;
    }
    markdown += `\n`;

    if (conversation.analysis?.transcript_summary) {
      markdown += `## Transcript Summary\n\n`;
      markdown += `${conversation.analysis.transcript_summary}\n`;
    }

    markdown += analyzeToolCalls(conversation);
    markdown += analyzeMetrics(conversation);

    markdown += `\n## Full Transcript\n\n`;
    conversation.transcript?.forEach((turn, index) => {
      const role = turn.role === 'agent' ? '🤖 Agent' : '👤 User';
      markdown += `### ${role} (${turn.time_in_call_secs}s)\n\n`;
      markdown += `${turn.message}\n\n`;
    });

    console.log(markdown);
  } catch (error) {
    console.error(`✗ Error analyzing conversation: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
