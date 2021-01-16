import React from 'react';
import {RealFunction} from "../math/function";


export type ReactStateHook<T> = [T, React.Dispatch<React.SetStateAction<T>>];


export const validateEvalExpression = (expression: string) => {
    try {
        const _ = eval(`(x: number) => ${expression}`);
        return true;
    } catch (e) {
        return false;
    }
}


export const evalExpressionAsRealFunction = (expression: string) =>
    validateEvalExpression(expression) ?
        eval(`(x: number) => ${expression}`) as RealFunction :
        undefined;


export const iota = (n: number) => <T>(i2Elem: (i: number) => T) =>
    new Array(n)
        .fill(0.0)
        .map((_, i) => i2Elem(i));
