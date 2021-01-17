import React from 'react';
import { ReactStateHook, validateEvalExpression } from './utils';
import {FormLabel, Paper, TextField} from '@material-ui/core';
import {FunctionSourceHook} from "./functions-list";


export interface FunctionInputParams extends FunctionSourceHook {
    readonly name: string;
}


export const FunctionInput = (params: FunctionInputParams) => {
    const toTextField = (stateHook: ReactStateHook<string>, label: string, idPrefix: string) => {
        const [source, setSource] = stateHook;
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newData = event.target.value;
            setSource(newData);
        };

        return (
            <TextField id={`${idPrefix}-source-code-input`}
                       label={label}
                       error={ !validateEvalExpression(source, params.testX) }
                       helperText='Entered expression should be a valid JS/TS code.'
                       onChange={onChange}
                       value={source}/>
        );
    };

    return (
        <Paper elevation={2}>
            <form noValidate autoComplete="off">
                <FormLabel component="legend">Custom function</FormLabel>
                {toTextField(params.functionSourceHook, 'Source code', 'function')}
                {toTextField(params.dfSourceHook, 'Derivative source code', 'derivative')}
            </form>
        </Paper>
    );
}
