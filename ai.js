
/*
 * Lumen Free Core — Optional browser-local AI
 * One shared question box: #question
 * Reviewed lessons remain handled by app.js.
 * AI loads only after the user explicitly requests it.
 */
(() => {
  'use strict';

  const loadButton = document.getElementById('ai-load');
  const askButton = document.getElementById('ai-ask');
  const clearButton = document.getElementById('ai-clear');
  const status = document.getElementById('ai-status');
  const output = document.getElementById('ai-output');
  const question = document.getElementById('question');

  if (!loadButton || !askButton || !status || !output || !question) {
    console.warn('Lumen AI: Required interface elements are missing.');
    return;
  }

  let engine = null;
  let history = [];
  let busy = false;

  const preferredModel = 'SmolLM2-360M-Instruct-q4f16_1-MLC';

  const system = `
You are Lumen, a compassionate educational assistant.

Answer questions clearly and concisely.
Distinguish established facts, interpretations, and analogies.
Never invent Bible verses, sources, or verification.
When uncertain, acknowledge uncertainty.

The four optional teaching levels are:
BLUE — Explain Like I'm Five.
GREEN — A Child Explaining to Their Parent.
GOLD — Kingdom Analogy.
PURPLE — Tech + Family.

Respect freedom of belief and thought.
Do not claim to know the user's spiritual condition.
Encourage learners to verify important information.
Follow-up questions may refer to earlier AI responses.
`;

  function setStatus(message) {
    status.textContent = message;
  }

  function setOutput(message) {
    output.textContent = message;
  }

  function updateButtons() {
    loadButton.disabled = busy || Boolean(engine);
    askButton.disabled = busy || !engine;
  }

  loadButton.addEventListener('click', async () => {
    if (busy || engine) return;

    if (!navigator.gpu) {
      setStatus(
        'WebGPU is unavailable in this browser. Reviewed lessons still work.'
      );
      return;
    }

    busy = true;
    updateButtons();

    setStatus(
      'Loading optional local AI. This may download a large model.'
    );

    try {
      const mod = await import('https://esm.run/@mlc-ai/web-llm');

      const available = mod.prebuiltAppConfig?.model_list || [];

      const choice =
        available.find(item => item.model_id === preferredModel) ||
        available.find(item =>
          /SmolLM2-360M|Qwen2\.5-0\.5B/i.test(item.model_id)
        );

      if (!choice) {
        throw new Error('No compatible small model was found.');
      }

      engine = await mod.CreateMLCEngine(choice.model_id, {
        initProgressCallback(progress) {
          setStatus(progress.text || 'Preparing the local AI model...');
        }
      });

      setStatus(
        'Experimental local AI ready: ' + choice.model_id +
        '. Enter a question in Ask Lumen above.'
      );

      setOutput(
        'AI is ready. Your question stays in the single Ask Lumen box. ' +
        'Press "Ask experimental AI using my question" to generate ' +
        'an unverified response.'
      );

    } catch (error) {
      engine = null;
      setStatus('Local AI could not start: ' + error.message);
    } finally {
      busy = false;
      updateButtons();
    }
  });

  askButton.addEventListener('click', async () => {
    if (!engine || busy) return;

    const text = question.value.trim();

    if (!text) {
      setOutput(
        'Enter a question in the Ask Lumen box above first.'
      );
      question.focus();
      return;
    }

    busy = true;
    updateButtons();

    setOutput('Generating an experimental answer on this device...');

    try {
      const messages = [
        { role: 'system', content: system },
        ...history.slice(-8),
        { role: 'user', content: text }
      ];

      const result = await engine.chat.completions.create({
        messages,
        temperature: 0.4,
        max_tokens: 600
      });

      const answer =
        result.choices?.[0]?.message?.content ||
        'No answer was generated.';

      history.push({ role: 'user', content: text });
      history.push({ role: 'assistant', content: answer });

      setOutput(
        'EXPERIMENTAL AI — NOT A REVIEWED LESSON\n\n' +
        answer +
        '\n\nThis answer may contain errors. Verify technical ' +
        'information and read Scripture in context.'
      );

    } catch (error) {
      setOutput('Experimental AI error: ' + error.message);
    } finally {
      busy = false;
      updateButtons();
    }
  });

  clearButton?.addEventListener('click', () => {
    history = [];
    setOutput(
      'Experimental AI conversation cleared from this tab. ' +
      'The Ask Lumen question box was not changed.'
    );
  });

  updateButtons();
})();
