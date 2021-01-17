import React from 'react';
import {RealFunction} from "../math/function";


export type ReactStateHook<T> = [T, React.Dispatch<React.SetStateAction<T>>];


export const validateEvalExpression = (expression: string, testPnt: number) => {
    try {
        const f = eval(`(x) => ${expression}`) as RealFunction;
        f(testPnt);
        return true;
    } catch (e) {
        return false;
    }
}


export const evalExpressionAsRealFunction = (expression: string, testPnt: number) => {
    try {
        const expr = eval(`(x) => ${expression}`) as RealFunction;
        expr(testPnt);
        return expr;
    } catch (e) {
        console.log(expression);
        console.error(e);
        return undefined;
    }
}


export const iota = (n: number) => <T>(i2Elem: (i: number) => T) =>
    new Array(n)
        .fill(0.0)
        .map((_, i) => i2Elem(i));


export const composeReactHook = <T>(hook: ReactStateHook<T>) => (actionAfter: (t: T) => void ) => {
    const [getter, setter] = hook;
    const composedSetter = (t: T) => {
        setter(t);
        actionAfter(t);
    };
    return [ getter, composedSetter ] as ReactStateHook<T>;
}
