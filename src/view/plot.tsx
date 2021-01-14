import { RealFunction } from '../math/function';
import PlotlyChart from "react-plotlyjs-ts";


export interface PlotParams {
    readonly f: RealFunction;
    readonly xStart: number;
    readonly xEnd: number;
    readonly numberOfPoints: number;
}


export const Plot = (params: PlotParams) => {
    const h = (params.xEnd - params.xStart) / (params.numberOfPoints - 1);
    const xPoints = Array(params.numberOfPoints).map((_, i) => params.xStart + i * h);
    const yPoints = xPoints.map(params.f);
    const plotlyParams = [
        {
            type: 'line',
            x: xPoints,
            y: yPoints
        }
    ];

    return <PlotlyChart data={plotlyParams}/>;
}
