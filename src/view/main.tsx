import { GlobalParamsInput } from './global-params-input';
import { Container } from '@material-ui/core';
import { FunctionsView } from './functions-view';
import React from 'react';
import { PlotParams } from './plot';
import { HermitCubicSpline, HermitSplineParams, IntervalSplitter } from '../math/hermit';
import { DefaultFunctions } from './functions-list';
import {iota} from "./utils";


export interface MainParams {
    readonly numberOfPoints: number;
}


const uniformSplitter = (numberOfPoints: number) => ({
    splitInterval: (wholeInterval: HermitSplineParams) => {
        const h = (wholeInterval.xEnd - wholeInterval.xStart) / (numberOfPoints - 1);

        return iota(numberOfPoints)(
            (idx) => ({
                xStart: wholeInterval.xStart + idx * h,
                xEnd: wholeInterval.xStart + (idx + 1) * h,
                f: wholeInterval.f,
                df: wholeInterval.df
            } as HermitSplineParams)
        );
    }
}) as IntervalSplitter


const approximateUsingCubicSpline = (splineParams: HermitSplineParams, numberOfPoints: number) => {
    const cubicApproximator = new HermitCubicSpline(uniformSplitter(numberOfPoints));

    return {
        xStart: splineParams.xStart,
        xEnd: splineParams.xEnd,
        f: cubicApproximator.approximate(splineParams)
    } as PlotParams;
}


export const Main = (params: MainParams) => {

    const customFHook = React.useState('');
    const customDFHook = React.useState('');
    const xStartHook = React.useState(1.0);
    const xEndHook = React.useState(4.0);
    const selectedFHook = React.useState(DefaultFunctions[0]);

    const originalFParams = () => ({
        xStart: xStartHook[0],
        xEnd: xEndHook[0],
        f: selectedFHook[0].f.callable,
        numberOfPoints: params.numberOfPoints
    } as PlotParams);

    const approximateFParams = () => ({
        xStart: xStartHook[0],
        xEnd: xEndHook[0],
        f: approximateUsingCubicSpline({
            ...originalFParams(),
            df: selectedFHook[0].df.callable
        }, params.numberOfPoints).f,
        numberOfPoints: params.numberOfPoints
    } as PlotParams);

    return (
        <Container>
            <GlobalParamsInput
                selectedFHook={selectedFHook}
                functionSourceHook={customFHook}
                dfSourceHook={customDFHook}
                xStartHook={xStartHook}
                xEndHook={xEndHook} />
            <FunctionsView originalFParams={ originalFParams() }
                           approximateFParams={ approximateFParams() } />
        </Container>
    );
}
