import { RealFunction, Zero } from '../math/function';
import {composeReactHook, evalExpressionAsRealFunction, ReactStateHook} from './utils';
import { FunctionInput } from './function-input';
import { Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import React, { ChangeEvent } from 'react';


export interface NamedFunction {
    readonly name: string;
    readonly callable: RealFunction;
}


export interface NamedFWithDerivative {
    readonly f: NamedFunction;
    readonly df: NamedFunction;
}


const transformCustomFunction = (fHook: ReactStateHook<string>, dfHook: ReactStateHook<string>, testX: number) => {
    const callableFromHook = (hook: ReactStateHook<string>) => {
        const [code, _] = hook;
        return evalExpressionAsRealFunction(code, testX) || Zero;
    };

    return {
        f: { name: 'custom', callable: callableFromHook(fHook) },
        df: { name: 'custom', callable: callableFromHook(dfHook) }
    } as NamedFWithDerivative;
}


export interface FunctionSourceHook {
    readonly functionSourceHook: ReactStateHook<string>;
    readonly dfSourceHook: ReactStateHook<string>;
    readonly testX: number;
}


export const DefaultFunctions: Array<NamedFWithDerivative> = [
    {
        f: { name: 'sin(x)', callable: Math.sin },
        df: { name: 'cos(x)', callable: Math.cos }
    },
    {
        f: { name: 'x^2', callable: (x: number) => x * x },
        df: { name: '2x', callable: (x: number) => 2.0 * x }
    },
    {
        f: { name: 'e^x', callable: Math.exp },
        df: { name: 'e^x', callable: Math.exp }
    },
    {
        f: { name: 'ln(x)', callable: Math.log },
        df: { name: '1/|x|', callable: (x: number) => 1.0 / Math.abs(x) }
    }
];


export interface FunctionsListParams {
    selectedFHook: ReactStateHook<NamedFWithDerivative>;
}


export const FunctionsList = (params: FunctionsListParams & FunctionSourceHook) => {

    const [selectedF, setSelectedF] = params.selectedFHook;
    const [selectedFName, setSelectedFName] = React.useState(selectedF.f.name);

    const findByName = (name: string) =>
        name === 'custom' ?
            transformCustomFunction(params.functionSourceHook, params.dfSourceHook, params.testX) :
            DefaultFunctions.find((f: NamedFWithDerivative) => f.f.name === name) as NamedFWithDerivative;

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setSelectedFName(name);
        setSelectedF(findByName(name));
    }

    const functionInputAfterUpdateHook = (hookToUpdate: 'f' | 'df') => (newSource: string): void => {
        if (selectedFName === 'custom') {
            switch (hookToUpdate) {
                case 'f':
                    setSelectedF(transformCustomFunction(
                        [ newSource, params.functionSourceHook[1] ], params.dfSourceHook, params.testX
                    ));
                    break;
                case 'df':
                    setSelectedF(transformCustomFunction(
                        params.functionSourceHook, [ newSource, params.dfSourceHook[1] ], params.testX
                    ));
                    break;
            }
        }
    }

    const functionInput = selectedFName === 'custom' ?
        <FunctionInput name='Custom function'
                       functionSourceHook={
                           composeReactHook(params.functionSourceHook)(functionInputAfterUpdateHook('f'))
                       }
                       dfSourceHook={
                           composeReactHook(params.dfSourceHook)(functionInputAfterUpdateHook('df'))
                       }
                       testX={ params.testX } /> :
        null;

    return (
        <Container id='functions-list'>
            <FormControl component="fieldset">
                <FormLabel component="legend">Select function to approximate</FormLabel>
                <RadioGroup
                    aria-label="function-input"
                    name="selected-function-input"
                    value={selectedFName}
                    onChange={ onChange }>
                    { DefaultFunctions.map((fn: NamedFWithDerivative, idx) =>
                        <FormControlLabel key={idx} value={fn.f.name} control={<Radio />} label={fn.f.name} />
                    ) }
                    <FormControlLabel
                        key={DefaultFunctions.length}
                        value='custom'
                        control={ <Radio/> }
                        label='Custom function' />
                </RadioGroup>
            </FormControl>
            { functionInput }
        </Container>
    );
}
