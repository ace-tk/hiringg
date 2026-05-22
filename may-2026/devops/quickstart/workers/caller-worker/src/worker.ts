import { Logger, registerWorker } from 'iii-sdk';

const iii = registerWorker(process.env.III_URL ?? 'ws://localhost:49134');
const logger = new Logger();

/* Removed wrapper; HTTP handler will directly trigger inference::run_inference */

// --- Uncomment after: iii worker add iii-http ---
iii.registerFunction(
  'http::run_inference_over_http',
  async (payload: { body: { messages: Record<string, any> } & Record<string, any> }) => {
    // Directly invoke the inference function
    logger.info('Invoking inference::run_inference');
    const inferenceResult = await iii.trigger({
      function_id: 'inference::run_inference',
      payload: payload.body,
    });
    logger.info('Inference result received', inferenceResult);
    const content = typeof inferenceResult === 'object' && inferenceResult !== null && 'result' in inferenceResult ? inferenceResult.result : inferenceResult;;
    // Wrap result into OpenAI chat completion format
    const responseBody = {
      choices: [
        {
          message: {
            role: 'assistant',
            content: content,
          },
        },
      ],
    };
    return {
      status_code: 200,
      body: responseBody,
      headers: { 'Content-Type': 'application/json' },
    };
  },
);

iii.registerTrigger({
  type: 'http',
  function_id: 'http::run_inference_over_http',
  config: { api_path: '/v1/chat/completions', http_method: 'POST' },
});

logger.info('Caller worker started - listening for calls');
