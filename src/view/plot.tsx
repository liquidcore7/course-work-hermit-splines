import { RealFunction } from '../math/function';
import PlotlyChart from "react-plotlyjs-ts";
import { iota } from './utils';


export interface PlotParams {
    readonly f: RealFunction;
    readonly xStart: number;
    readonly xEnd: number;
    readonly numberOfPoints: number;
}


export const Plot = (params: PlotParams) => {
    const h = (params.xEnd - params.xStart) / (params.numberOfPoints - 1);
    const xPoints = iota(params.numberOfPoints)((i) => params.xStart + i * h);
    const yPoints = xPoints.map(params.f);
    const plotlyParams = [
        {
            type: 'scatter',
            mode: 'lines',
            x: xPoints,
            y: yPoints
        }
    ];

    return <PlotlyChart data={plotlyParams} />;
}
