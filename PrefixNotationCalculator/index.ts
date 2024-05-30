enum Operator  {
    Addition = "+",
    Subtraction = "-",
    Multiplication = "*",
    Division = "/",
}

function* makeSequence(arr: string[]) : Generator<string, string>{
    for (const v of arr) { yield v }
    return "" 
}

function parseExpression(expression: string) {
    return makeSequence(
        expression.trim().split(" ")
    );
}

type ExpressionItemType = 
| ['operator', Operator]
| ['operand', number]

function getExpressionItemType(expressionItem: string) : ExpressionItemType {
    switch (expressionItem) {
        case Operator.Addition:
        case Operator.Subtraction:
        case Operator.Multiplication:
        case Operator.Division:
            return ['operator', expressionItem];
        default:
            break;
    }

    const operand = parseFloat(expressionItem);
    if (Number.isNaN(operand)) {
        throw new Error(`Unsupported operand ${expressionItem}`)
    }
    return ['operand', operand];
}

function runOperation(operator: Operator, operandA: number, operandB: number) {
    switch (operator) {
        case Operator.Addition:
            return operandA + operandB;
        case Operator.Subtraction:
            return operandA - operandB;
        case Operator.Multiplication:
            return operandA * operandB;
        case Operator.Division:
            return operandA / operandB;
        default:
            throw new Error("Invalid operation");
    }
}

type ExpressionItem<T> =
| IteratorYieldResult<T>
| IteratorReturnResult<T>

function evaluatePrefixNotationExpression(expressionItem: ExpressionItem<string>, expressionSequence: Generator<string>) {
    if (expressionItem.done) {
        return expressionItem.value;
    }

    const [expressionItemType, expressionItemValue] = getExpressionItemType(expressionItem.value);

    console.log(expressionItemValue, expressionItemType)

    if (expressionItemType === 'operand') {
        return expressionItemValue;
    }

    if (expressionItemType === 'operator') {
        const operandA: number = evaluatePrefixNotationExpression(expressionSequence.next(), expressionSequence) as number;
        const operandB: number = evaluatePrefixNotationExpression(expressionSequence.next(), expressionSequence) as number;

        return runOperation(expressionItemValue, operandA, operandB);
    }

}

export default function prefixNotationCalculator(expression: string) {
    if (typeof expression !== 'string') {
        throw new Error("Unexpected expression type");
    }

    const parsedExpression = parseExpression(expression);

    const result = evaluatePrefixNotationExpression(parsedExpression.next(), parsedExpression);

    return result ?? 0;
}

