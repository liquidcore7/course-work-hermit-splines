import React, {ChangeEvent} from 'react';
import { ReactStateHook } from './utils';
import { TextField } from '@material-ui/core';


export interface PlotParams {
    readonly xStartHook: ReactStateHook<number>;
    readonly xEndHook: ReactStateHook<number>;
}


export const PlotParamsInput = (params: PlotParams) => {
    const onChange = (hook: ReactStateHook<number>) => (event: ChangeEvent<HTMLInputElement>) => {
        const [_, setter] = hook;
        setter(Number.parseFloat(event.target.value));
    };
    const [xStartGetter, _] = params.xStartHook;
    const [xEndGetter, _1] = params.xEndHook;
    const leftLTERight = () => xStartGetter > xEndGetter;
    const helperText = 'Interval start should be less than or equal to interval end';

    return (
        <form id='plot-params' noValidate autoComplete='off'>
            <TextField required
                       id='x-start-input'
                       error={ leftLTERight() }
                       helperText={helperText}
                       label='Interval start'
                       type='number'
                       value={xStartGetter}
                       onChange={ onChange(params.xStartHook) } />
            <TextField required
                       id='x-end-input'
                       error={ leftLTERight() }
                       helperText={helperText}
                       label='Interval end'
                       type='number'
                       value={xEndGetter}
                       onChange={ onChange(params.xEndHook) } />
        </form>
    );
}
