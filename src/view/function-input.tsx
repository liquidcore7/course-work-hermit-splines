import React from 'react';
import { TextField } from 'material-ui';
import Either from 'either-ts';
import { ReactStateHook } from './utils';


export interface FunctionSource {
    readonly name: string;
    readonly sourceState: Either<string, ReactStateHook<string>>;
}

export const FunctionInput = (params: FunctionSource) => {
    // @ts-ignore
    const textField = params.sourceState
        .map(( [source, setSource] ) => (
            <TextField id='function-source'
                       label='Source code'
                       onChange={ (event: React.ChangeEvent<HTMLInputElement>) => setSource(event.target.value) }
                       value={source} />
        ))
        .rightOrElse((unmodifiableValue) => (
            <TextField disabled id='function-source'
                                label='Source code'
                                defaultValue={unmodifiableValue}
                                InputProps={{
                                    readOnly: true,
                                }} />
        ));

    return (
        <form noValidate autoComplete="off">
            <div className='function-name'>{params.name}</div>
            {textField}
        </form>
    );
}
