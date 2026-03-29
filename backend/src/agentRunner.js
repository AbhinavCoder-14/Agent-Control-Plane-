const fs = require('fs');
const path = require('path');
const geminiClient = require('./geminiClient');

const ROOT = path.join(__dirname, '..', '..');
const TRACE_PATH = path.join(ROOT, 'traces', 'session_log', 'agent_trace.txt');

function readSafe(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return '';
    }
}

function appendTrace(message) {
    const line = `[${new Date().toISOString()}] ${message}`;
    const previous = readSafe(TRACE_PATH);
    fs.mkdirSync(path.dirname(TRACE_PATH), { recursive: true });
    const tmpPath = `${TRACE_PATH}.tmp-${process.pid}-${Date.now()}`;
    fs.writeFileSync(tmpPath, previous + line + '\n', 'utf8');
    fs.renameSync(tmpPath, TRACE_PATH);
    console.log(line);
}

function safeWrite(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
    fs.writeFileSync(tmpPath, content, 'utf8');
    fs.renameSync(tmpPath, filePath);
}

function parseInstructions(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    return lines.filter(line => /^\d+\.|^-|^•/.test(line.trim()));
}

function parseAIResponse(response) {
    const files = [];
    const lines = response.split(/\r?\n/);
    let currentFile = null;
    let currentCode = [];
    let inCode = false;

    for (const line of lines) {
        if (line.startsWith('FILE:')) {
            if (currentFile && currentCode.length > 0) {
                files.push({
                    name: currentFile,
                    content: currentCode.join('\n')
                });
                currentCode = [];
            }
            currentFile = line.replace('FILE:', '').trim();
            inCode = false;
        } else if (line.startsWith('CODE:')) {
            inCode = true;
        } else if (inCode && currentFile) {
            currentCode.push(line);
        }
    }

    if (currentFile && currentCode.length > 0) {
        files.push({
            name: currentFile,
            content: currentCode.join('\n')
        });
    }

    return files;
}

async function buildAgentPrompt() {
    const context = readSafe(path.join(ROOT, 'CONTEXT.md'));
    const instructions = readSafe(path.join(ROOT, 'instructions.md'));

    return [
        'You are a code generation agent.',
        '',
        'CONTEXT:',
        context,
        '',
        'INSTRUCTIONS:',
        instructions,
        '',
        'TASK: Generate code files to implement the instructions above.',
        '',
        'Output format:',
        'FILE: path/to/file.js',
        'CODE:',
        'function example() { /* code */ }',
        '',
        'FILE: path/to/other.js',
        'CODE:',
        'const value = 42;',
        '',
        'Generate 2-3 key files only. Be concise.'
    ].join('\n');
}

async function runAgent() {
    try {
        appendTrace('AGENT_START: Reading instructions');

        const instructions = readSafe(path.join(ROOT, 'instructions.md'));
        if (!instructions) {
            appendTrace('AGENT_ERROR: instructions.md not found');
            return;
        }

        const steps = parseInstructions(instructions);
        appendTrace(`AGENT_PARSE: Found ${steps.length} instruction steps`);

        appendTrace('AGENT_PROMPT: Building AI request');
        const prompt = await buildAgentPrompt();

        appendTrace('AGENT_AI_CALL: Sending to Gemini');
        const response = await new Promise((resolve) => {
            geminiClient.sendPrompt(prompt).then(() => {
                const output = readSafe(path.join(ROOT, 'GEMINI', 'src', 'output.md'));
                resolve(output);
            }).catch((err) => {
                appendTrace(`AGENT_AI_ERROR: ${err.message}`);
                resolve('');
            });
        });

        if (!response) {
            appendTrace('AGENT_ERROR: No AI response received');
            return;
        }

        appendTrace('AGENT_PARSE: Extracting file blocks from AI response');
        const files = parseAIResponse(response);

        if (files.length === 0) {
            appendTrace('AGENT_WARN: No files parsed from AI response');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = path.join(ROOT, file.name);

            await new Promise((resolve) => setTimeout(resolve, 500));

            try {
                safeWrite(filePath, file.content);
                appendTrace(`AGENT_WRITE: Created ${file.name}`);
            } catch (error) {
                appendTrace(`AGENT_WRITE_ERROR: ${file.name} - ${error.message}`);
            }
        }

        appendTrace('AGENT_SUCCESS: File generation complete');
        appendTrace('AGENT_TRIGGER: Watcher will pick up agent_trace.txt update');
    } catch (error) {
        appendTrace(`AGENT_FATAL: ${error.message}`);
    }
}

if (require.main === module) {
    runAgent().catch((err) => {
        console.error('Fatal agent error:', err);
        process.exit(1);
    });
}

module.exports = { runAgent, parseAIResponse };
