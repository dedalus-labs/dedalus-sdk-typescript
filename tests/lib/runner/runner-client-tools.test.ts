import { DedalusRunner, RunResult } from '../../../src/lib/runner/runner';
import type { ToolDefinition } from '../../../src/lib/runner/types/tools';
import { createMockClient } from '../../utils/mock-client';

describe('DedalusRunner client-side tools', () => {
  describe('non-streaming mode', () => {
    it('executes server tools and continues loop', async () => {
      const serverTool: ToolDefinition = {
        name: 'getTime',
        execute: async () => '12:00 PM',
      };

      const mockClient = createMockClient([
        // First response: tool call
        {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: null,
                refusal: null,
                tool_calls: [
                  { id: 'call_1', type: 'function', function: { name: 'getTime', arguments: '{}' } },
                ],
              },
              finish_reason: 'tool_calls',
            },
          ],
        },
        // Second response: final answer
        {
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'The time is 12:00 PM', refusal: null },
              finish_reason: 'stop',
            },
          ],
        },
      ] as any);

      const runner = new DedalusRunner(mockClient);
      const result = (await runner.run({
        model: 'test-model',
        input: 'What time is it?',
        tools: [serverTool],
      })) as RunResult;

      expect(result.finalOutput).toBe('The time is 12:00 PM');
      expect(result.toolsCalled).toContain('getTime');
      expect(mockClient.chat.completions.create).toHaveBeenCalledTimes(2);
    });

    it('pauses on client tools without executing them', async () => {
      const clientTool: ToolDefinition = {
        name: 'askConfirmation',
        description: 'Ask user to confirm',
        parameters: { type: 'object', properties: { message: { type: 'string' } } },
        // No execute - client-side
      };

      const mockClient = createMockClient([
        {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: null,
                refusal: null,
                tool_calls: [
                  {
                    id: 'call_1',
                    type: 'function',
                    function: { name: 'askConfirmation', arguments: '{"message":"Proceed?"}' },
                  },
                ],
              },
              finish_reason: 'tool_calls',
            },
          ],
        },
      ] as any);

      const runner = new DedalusRunner(mockClient);
      const result = (await runner.run({
        model: 'test-model',
        input: 'Do something',
        tools: [clientTool],
      })) as RunResult;

      // Should stop after first call - no tool execution, no continuation
      expect(mockClient.chat.completions.create).toHaveBeenCalledTimes(1);
      expect(result.toolsCalled).toContain('askConfirmation');

      // Conversation history should have assistant message with tool_calls
      const lastMsg = result.conversationHistory[result.conversationHistory.length - 1] as any;
      expect(lastMsg.role).toBe('assistant');
      expect(lastMsg.tool_calls).toHaveLength(1);
    });

    it('executes server tools first, then pauses on client tools', async () => {
      const serverTool: ToolDefinition = {
        name: 'getWeather',
        execute: async ({ city }) => ({ temp: 72, city }),
      };

      const clientTool: ToolDefinition = {
        name: 'notifyUser',
        // No execute
      };

      const mockClient = createMockClient([
        {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: null,
                refusal: null,
                tool_calls: [
                  {
                    id: 'call_1',
                    type: 'function',
                    function: { name: 'getWeather', arguments: '{"city":"NYC"}' },
                  },
                  {
                    id: 'call_2',
                    type: 'function',
                    function: { name: 'notifyUser', arguments: '{"msg":"Done"}' },
                  },
                ],
              },
              finish_reason: 'tool_calls',
            },
          ],
        },
      ] as any);

      const runner = new DedalusRunner(mockClient);
      const result = (await runner.run({
        model: 'test-model',
        input: 'Check weather and notify me',
        tools: [serverTool, clientTool],
      })) as RunResult;

      // Should call API once, execute server tool, then pause
      expect(mockClient.chat.completions.create).toHaveBeenCalledTimes(1);

      // Both tools should be in toolsCalled
      expect(result.toolsCalled).toContain('getWeather');
      expect(result.toolsCalled).toContain('notifyUser');

      // History should have:
      // 1. User message
      // 2. Assistant message with both tool_calls
      // 3. Tool result for getWeather (server tool executed)
      // No tool result for notifyUser (client tool)
      const history = result.conversationHistory;
      const toolMessages = history.filter((m: any) => m.role === 'tool');
      expect(toolMessages).toHaveLength(1);
      expect((toolMessages[0] as any).tool_call_id).toBe('call_1');
    });

    it('only executes server tools in mixed parallel calls', async () => {
      const serverTool1: ToolDefinition = {
        name: 'serverTool1',
        execute: async () => 'result1',
      };

      const serverTool2: ToolDefinition = {
        name: 'serverTool2',
        execute: async () => 'result2',
      };

      const clientTool: ToolDefinition = {
        name: 'clientTool',
        // No execute
      };

      const mockClient = createMockClient([
        {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: null,
                refusal: null,
                tool_calls: [
                  { id: 'call_1', type: 'function', function: { name: 'serverTool1', arguments: '{}' } },
                  { id: 'call_2', type: 'function', function: { name: 'clientTool', arguments: '{}' } },
                  { id: 'call_3', type: 'function', function: { name: 'serverTool2', arguments: '{}' } },
                ],
              },
              finish_reason: 'tool_calls',
            },
          ],
        },
      ] as any);

      const runner = new DedalusRunner(mockClient);
      const result = (await runner.run({
        model: 'test-model',
        input: 'Do all things',
        tools: [serverTool1, serverTool2, clientTool],
      })) as RunResult;

      // All tools should be tracked
      expect(result.toolsCalled).toContain('serverTool1');
      expect(result.toolsCalled).toContain('serverTool2');
      expect(result.toolsCalled).toContain('clientTool');

      // Only server tools should have results in history
      const history = result.conversationHistory;
      const toolMessages = history.filter((m: any) => m.role === 'tool');
      expect(toolMessages).toHaveLength(2);

      const toolCallIds = toolMessages.map((m: any) => m.tool_call_id);
      expect(toolCallIds).toContain('call_1');
      expect(toolCallIds).toContain('call_3');
      expect(toolCallIds).not.toContain('call_2');
    });
  });

  describe('continuation after client tool results', () => {
    it('continues when messages include tool results', async () => {
      const clientTool: ToolDefinition = {
        name: 'getLocation',
        // No execute
      };

      const mockClient = createMockClient([
        // This simulates the continuation call after client adds tool result
        {
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'Your location is San Francisco!', refusal: null },
              finish_reason: 'stop',
            },
          ],
        },
      ] as any);

      const runner = new DedalusRunner(mockClient);

      // Simulate continuation with tool result already in messages
      const result = (await runner.run({
        model: 'test-model',
        messages: [
          { role: 'user', content: 'Where am I?' },
          {
            role: 'assistant',
            tool_calls: [
              { id: 'call_1', type: 'function', function: { name: 'getLocation', arguments: '{}' } },
            ],
          },
          { role: 'tool', tool_call_id: 'call_1', content: 'San Francisco, CA' },
        ] as any,
        tools: [clientTool],
      })) as RunResult;

      expect(result.finalOutput).toBe('Your location is San Francisco!');
    });
  });

  describe('autoExecuteTools=false', () => {
    it('breaks immediately without executing any tools', async () => {
      const serverTool: ToolDefinition = {
        name: 'serverTool',
        execute: async () => 'should not run',
      };

      const mockClient = createMockClient([
        {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: null,
                refusal: null,
                tool_calls: [
                  { id: 'call_1', type: 'function', function: { name: 'serverTool', arguments: '{}' } },
                ],
              },
              finish_reason: 'tool_calls',
            },
          ],
        },
      ] as any);

      const runner = new DedalusRunner(mockClient);
      const result = (await runner.run({
        model: 'test-model',
        input: 'Do something',
        tools: [serverTool],
        autoExecuteTools: false,
      })) as RunResult;

      // Should stop after first call
      expect(mockClient.chat.completions.create).toHaveBeenCalledTimes(1);

      // No tool results in history (tool not executed)
      const history = result.conversationHistory;
      const toolMessages = history.filter((m: any) => m.role === 'tool');
      expect(toolMessages).toHaveLength(0);

      // But tool call should still be tracked
      expect(result.toolsCalled).toContain('serverTool');
    });
  });

  describe('server-only tools continue loop', () => {
    it('loops until final response when only server tools', async () => {
      const serverTool: ToolDefinition = {
        name: 'step',
        execute: async ({ n }) => `step ${n} done`,
      };

      const mockClient = createMockClient([
        {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: null,
                refusal: null,
                tool_calls: [
                  { id: 'call_1', type: 'function', function: { name: 'step', arguments: '{"n":1}' } },
                ],
              },
              finish_reason: 'tool_calls',
            },
          ],
        },
        {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: null,
                refusal: null,
                tool_calls: [
                  { id: 'call_2', type: 'function', function: { name: 'step', arguments: '{"n":2}' } },
                ],
              },
              finish_reason: 'tool_calls',
            },
          ],
        },
        {
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'All steps complete!', refusal: null },
              finish_reason: 'stop',
            },
          ],
        },
      ] as any);

      const runner = new DedalusRunner(mockClient);
      const result = (await runner.run({
        model: 'test-model',
        input: 'Run steps',
        tools: [serverTool],
      })) as RunResult;

      expect(result.finalOutput).toBe('All steps complete!');
      expect(mockClient.chat.completions.create).toHaveBeenCalledTimes(3);
      expect(result.stepsUsed).toBe(3);
    });
  });
});
