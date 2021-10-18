import { StringReader } from './utils/StringReader';
import { VariableCollection } from './variables/variable-context';

/**
 * @param input The unparsed response string.
 * @param variables The variable context to evaluate values from.
 * @returns The parsed response with variables evaluated and replaced.
 */
export async function parseResponse(
  input: string,
  variables: VariableCollection
): Promise<string> {
  const tokens = tokenize(input);
  return await parseTokens(tokens, variables);
}

/**
 * Evaluate each variable token and append the values to each other.
 * @returns The evaluated string of variable and text tokens.
 */
async function parseTokens(
  tokens: Token[],
  variables: VariableCollection
): Promise<string> {
  let output = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.kind === 'text') {
      output += token.text;
    } else if (token.kind === 'variable') {
      const key = await parseTokens(token.tokens, variables);
      const value = await variables.valueOf(key.toLowerCase());
      if (value !== undefined) {
        output += value;
      } else {
        output += 'undefined';
      }
    }
  }

  return output;
}

/**
 * @returns An array of tokens representing the variables and text segments of
 *  the input.
 */
function tokenize(input: string): Token[] {
  const reader = new StringReader(input);
  const tokens: Token[] = [];

  while (reader.remaining > 0) {
    const next = reader.peek(1);

    if (next === '{') {
      tokens.push(consumeVariable(reader));
    } else {
      tokens.push(consumeText(reader));
    }
  }

  return tokens;
}

/**
 * @returns The text token that can be evaluated later.
 */
function consumeText(reader: StringReader): TextToken {
  let text = '';
  while (
    reader.remaining > 0 &&
    reader.peek(1) !== '{' &&
    reader.peek(1) !== '}'
  ) {
    text += reader.consume(1);
  }
  return { kind: 'text', text };
}

/**
 * @returns A variable token that can be evaluated later.
 */
function consumeVariable(reader: StringReader): VariableToken {
  const tokens: Token[] = [];

  // Consume the opening brace '{'
  reader.consume(1);

  while (reader.remaining > 0 && reader.peek(1) !== '}') {
    if (reader.peek(1) === '{') {
      tokens.push(consumeVariable(reader));
    } else {
      tokens.push(consumeText(reader));
    }
  }

  // Consume the closing brace '}'
  reader.consume(1);

  return { kind: 'variable', tokens };
}

interface TextToken {
  kind: 'text';
  text: string;
}

interface VariableToken {
  kind: 'variable';
  tokens: Token[];
}

type Token = TextToken | VariableToken;
