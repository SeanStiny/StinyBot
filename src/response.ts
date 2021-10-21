import { StringReader } from './utils/StringReader';
import { Variable } from './variables';

/**
 * @param input The unparsed response string.
 * @param vars The variable context to evaluate values from.
 * @returns The parsed response with variables evaluated and replaced.
 */
export async function parseResponse(
  input: string,
  vars: Record<string, Variable>
): Promise<string> {
  const tokens = tokenize(input);
  return await parseTokens(tokens, vars);
}

/**
 * Evaluate each variable token and append the values to each other.
 * @returns The evaluated string of variable and text tokens.
 */
async function parseTokens(
  tokens: Token[],
  vars: Record<string, Variable>
): Promise<string> {
  let output = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let value = undefined;

    if (token.kind === 'text') {
      value = token.text;
    } else if (token.kind === 'variable') {
      const key = (await parseTokens(token.tokens, vars)).toLowerCase();
      const args = key.split(' ');

      let variable = vars[key];
      if (!variable) {
        variable = vars[args[0]];
      }

      if (variable) {
        value = await variable.fetchValue(args);
      }
    } else if (token.kind === 'conditional') {
      const operandOne = await parseTokens(token.operandOne, vars);
      const operandTwo = await parseTokens(token.operandTwo, vars);
      const resultTrue = await parseTokens(token.resultTrue, vars);
      const resultFalse = await parseTokens(token.resultFalse, vars);
      if (operandOne.toLowerCase() === operandTwo.toLowerCase()) {
        value = resultTrue;
      } else {
        value = resultFalse;
      }
    }

    output += value;
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
      if (reader.peek(2, 4) === 'if ') {
        tokens.push(consumeCondition(reader));
      } else {
        tokens.push(consumeVariable(reader));
      }
    } else {
      tokens.push(consumeText(reader));
    }
  }

  return tokens;
}

/**
 * @returns The text token that can be evaluated later.
 */
function consumeText(reader: StringReader, until?: string): TextToken {
  let text = '';
  while (
    reader.remaining > 0 &&
    reader.peek(1) !== '{' &&
    reader.peek(1) !== until
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
      tokens.push(consumeText(reader, '}'));
    }
  }

  // Consume the closing brace '}'
  reader.consume(1);

  return { kind: 'variable', tokens };
}

/**
 * @returns A condition token to be evaluated later.
 */
function consumeCondition(reader: StringReader): ConditionToken {
  // '{if '
  reader.consume(4);
  const operandOne = consumeOperand(reader);

  let operandTwo: Token[];
  if (reader.peek(1, 4) === ' is ') {
    reader.consume(4);
    operandTwo = consumeOperand(reader);
  } else {
    operandTwo = [];
  }

  let resultTrue: Token[];
  if (reader.peek(1, 6) === ' then ') {
    reader.consume(6);
    resultTrue = consumeOperand(reader);
  } else {
    resultTrue = [];
  }

  let resultFalse: Token[];
  if (reader.peek(1, 6) === ' else ') {
    reader.consume(6);
    resultFalse = consumeOperand(reader);
  } else {
    resultFalse = [];
  }

  // Consume the closing brace '}'
  reader.consume(1);

  return {
    kind: 'conditional',
    operandOne,
    operandTwo,
    resultTrue,
    resultFalse,
  };
}

/**
 * @returns The tokens contained in the operand, to be evaluated later.
 */
function consumeOperand(reader: StringReader): Token[] {
  let operand: Token[];
  if (reader.peek(1) === '{') {
    if (reader.peek(2, 4) === 'if ') {
      operand = [consumeCondition(reader)];
    } else {
      operand = [consumeVariable(reader)];
    }
  } else if (reader.peek(1) === '"' || reader.peek(1) === "'") {
    const quote = reader.consume(1);
    const input = consumeUntil(reader, quote);
    operand = tokenize(input);
    reader.consume(1);
  } else {
    const input = consumeUntil(reader, ' ');
    operand = tokenize(input);
  }
  return operand;
}

/**
 * Consume characters until a specific character is reached.
 */
function consumeUntil(reader: StringReader, until: string) {
  let output = '';
  while (reader.remaining > 0 && reader.peek(1) !== until) {
    output += reader.consume(1);
  }
  return output;
}

interface TextToken {
  kind: 'text';
  text: string;
}

interface VariableToken {
  kind: 'variable';
  tokens: Token[];
}

interface ConditionToken {
  kind: 'conditional';
  operandOne: Token[];
  operandTwo: Token[];
  resultTrue: Token[];
  resultFalse: Token[];
}

type Token = TextToken | VariableToken | ConditionToken;
