import React from 'react';
import { ReactStateHook, validateEvalExpression } from './utils';
import {FormLabel, Paper, TextField} from '@material-ui/core';


export interface FunctionInputParams {
    readonly name: string;
    readonly fHook: ReactStateHook<string>;
    readonly dfHook: ReactStateHook<string>;
}


export const FunctionInput = (params: FunctionInputParams) => {
    const toTextField = (stateHook: ReactStateHook<string>, label: string, idPrefix: string) => {
        const [source, setSource] = stateHook;

        return (
            <TextField id={`${idPrefix}-source-code-input`}
                   label={label}
                   error={ validateEvalExpression(source) }
                   helperText='Entered expression is not a valid JS/TS code.'
                   onChange={ (event: React.ChangeEvent<HTMLInputElement>) => setSource(event.target.value) }
                   value={source} />
        );
    };

    return (
        <Paper elevation={2}>
            <form noValidate autoComplete="off">
                <FormLabel component="legend">Custom function</FormLabel>
                {toTextField(params.fHook, 'Source code', 'function')}
                {toTextField(params.dfHook, 'Derivative source code', 'derivative')}
            </form>
        </Paper>
    );
}
