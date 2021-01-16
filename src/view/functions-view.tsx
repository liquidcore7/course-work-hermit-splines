import {Plot, PlotParams} from "./plot";
import {FunctionOps} from "../math/function";
import {AppBar, Tab, Tabs} from "@material-ui/core";
import React from 'react';


interface ApproximatedFunctionParams {
    originalFParams: PlotParams;
    approximateFParams: PlotParams;
}


export const FunctionsView = (params: ApproximatedFunctionParams) => {
    const errFParams = {
        f: FunctionOps.combine(params.originalFParams.f, params.approximateFParams.f)(
            (l, r) => Math.abs(l - r)
        ),
        xStart: Math.max(params.originalFParams.xStart, params.approximateFParams.xStart),
        xEnd: Math.min(params.originalFParams.xEnd, params.approximateFParams.xEnd),
        numberOfPoints: Math.min(params.originalFParams.numberOfPoints, params.approximateFParams.numberOfPoints)
    } as PlotParams;

    const [selectedPlotIdx, setSelectedPlotIdx] = React.useState(0);

    const paramsArray = [
        params.originalFParams,
        params.approximateFParams,
        errFParams
    ];

    return (
        <>
            <AppBar position="static">
                <Tabs value={selectedPlotIdx} onChange={ (_, newValue) => setSelectedPlotIdx(newValue) } >
                    <Tab id='original-plot' label="Original function" />
                    <Tab id='approximate-plot' label="Approximate function" />
                    <Tab id='error-plot' label="Error plot" />
                </Tabs>
            </AppBar>
            <Plot {...paramsArray[selectedPlotIdx]} />
        </>
    );
}
