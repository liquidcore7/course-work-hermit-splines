import React, {ChangeEvent} from 'react';
import { ReactStateHook } from './utils';
import { TextField } from '@material-ui/core';


export interface PlotParams {
    readonly xStartHook: ReactStateHook<number>;
    readonly xEndHook: ReactStateHook<number>;
    readonly hermitPointsCountHook: ReactStateHook<number>;
    readonly numberOfPlotPoints: number;
}


export const PlotParamsInput = (params: PlotParams) => {
    const onChange = (hook: ReactStateHook<number>) => (event: ChangeEvent<HTMLInputElement>) => {
        const [_, setter] = hook;
        try {
            setter(Number.parseFloat(event.target.value));
        } catch (e) {
            console.error(e);
        }
    };
    const [xStartGetter, _] = params.xStartHook;
    const [xEndGetter, _1] = params.xEndHook;
    const leftLTERight = () => xStartGetter > xEndGetter;
    const helperText = 'Interval start should be less than or equal to interval end';

    const [hermitPointsCountGetter, _2] = params.hermitPointsCountHook;
    const hermitPointsCountBad =
        (hermitPointsCountGetter <= 1) || (hermitPointsCountGetter > params.numberOfPlotPoints);

    return (
        <form id='plot-params'
              autoComplete='off'
              style={{display: 'flex', flexDirection: 'column'}}  >
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
            <TextField required
                       id='hermit-points-count-input'
                       error={ hermitPointsCountBad }
                       helperText={`Should be between 2 and ${params.numberOfPlotPoints}`}
                       label='Cubic spline points count'
                       type='number'
                       value={ hermitPointsCountGetter }
                       onChange={ onChange(params.hermitPointsCountHook) } />
        </form>
    );
}
