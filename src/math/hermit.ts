import { RealFunction } from './function';


export interface HermitSplineParams {
    readonly xStart: number;
    readonly xEnd: number;
    readonly f: RealFunction;
    readonly df: RealFunction;
}


export interface IntervalSplitter {
    readonly splitInterval: (wholeInterval: HermitSplineParams) => [HermitSplineParams];
}


export abstract class HermitSpline {
    private readonly intervalSplitter!: IntervalSplitter;
    protected abstract readonly approximateInterval: (params: HermitSplineParams) => RealFunction;

    protected constructor(splitter: IntervalSplitter) {
        this.intervalSplitter = splitter;
    }

    public readonly approximate = (wh: HermitSplineParams): RealFunction => {
        const intervals = this
            .intervalSplitter
            .splitInterval(wh)
            .map((params) => [params, this.approximateInterval(params)])
        return (x: number) => {
            const matchingInterval = intervals.find((i) => {
                const [p, _] = i;
                return (p as HermitSplineParams).xEnd > x;
            });
            const intervalF: HermitSplineParams | RealFunction = matchingInterval ?
                matchingInterval[1] :
                (x < wh.xStart) ? intervals[0][1] : intervals[intervals.length - 1][1];
            return (intervalF as RealFunction)(x);
        }
    };
}


export class Hermit4thOrderSpline extends HermitSpline {

    constructor(intervalSplitter: IntervalSplitter) {
        super(intervalSplitter)
    }

    protected readonly approximateInterval = (params: HermitSplineParams): RealFunction => {
        const midX = (params.xStart + params.xEnd) / 2.0;
        const h = params.xEnd - params.xStart;
        const halfH = midX - params.xStart;

        const a1 = (params.f(params.xEnd) - params.f(params.xStart)) / h -
            (params.f(midX) - params.f(params.xStart)) / halfH;
        const a2 = (params.f(midX) - params.f(params.xStart)) / halfH - params.df(params.xStart);
        const a3 = (params.f(midX) - params.f(params.xStart)) / halfH - params.df(params.xEnd);

        const b1 = (params.xStart + params.xEnd) * (params.xStart * params.xStart * params.xEnd * params.xEnd) -
            (midX + params.xStart) * (midX * midX * params.xStart * params.xStart);
        const b2 = Math.pow(midX, 3) + params.xStart * midX * (params.xStart + midX) -
            3 * Math.pow(params.xStart, 3);
        const b3 = (params.xStart + midX) * (midX * midX * params.xStart * params.xStart) -
            4 * Math.pow(params.xEnd, 3);

        const z1 = params.xEnd * params.xEnd + params.xEnd * params.xStart - midX * midX - midX * params.xStart;
        const z2 = midX * midX + midX * params.xStart - 2 * params.xStart * params.xStart;
        const z3 = midX * midX + midX * params.xStart + params.xStart * params.xStart -
            3 * params.xEnd * params.xEnd;

        const g1 = params.xEnd - midX;
        const g2 = midX - params.xStart;
        const g3 = midX + params.xStart - 2 * params.xEnd;

        const C3 = ((a2 * b1 - a1 * b2) * (z3 * b1 - z1 * b3) - (z2 * b1 - z1 * b2)
            * (a3 * b1 - a1 * b3)) / ((g1 * b2 - g2 * b1) * (z1 * b3 - z3 * b1)
            + (z2 * b1 - z1 * b2) * (g1 * b3 - g3 * b1));
        const C4 = (a2 * b1 - a1 * b2 + (g1 * b2 - b1 * g2) * C3) / (b1 * z2 - z1 * b2);
        const C5 = (a1 - z1 * C4 - g1 * C3) / b1;
        const C2 = (params.f(midX) - params.f(params.xStart)) / halfH -
            C3 * (midX + params.xStart) - C4 * (midX * midX + midX * params.xStart + params.xStart * params.xStart) -
            C5 * (midX + params.xStart) * (midX * midX + params.xStart * params.xStart);
        const C1 = params.f(params.xStart) - C2 * params.xStart - C3 * params.xStart * params.xStart -
            C4 * Math.pow(params.xStart, 3) - C5 * Math.pow(params.xStart, 4);

        const coefficients = [C1, C2, C3, C4, C5];

        return (x: number) =>
            coefficients
                .map((c, i) => c * Math.pow(x, i))
                .reduce((l, r) => l + r, 0.0);
    }
}


export class HermitCubicSpline extends HermitSpline {

    constructor(splitter: IntervalSplitter) {
        super(splitter);
    }

    protected readonly approximateInterval = (params: HermitSplineParams): RealFunction => {
        const h = params.xEnd - params.xStart;

        const C3 = 2 * (
            (params.df(params.xStart) + params.df(params.xEnd)) / 2.0 -
            (params.f(params.xEnd) - params.f(params.xStart)) / h
        ) / (h * h);
        const C2 = (
            (params.df(params.xStart) + params.df(params.xEnd)) / h -
            3 * C3 * (params.xStart + params.xEnd)
        ) / 2.0;
        const C1 = params.df(params.xEnd) - 2 * C2 * params.xEnd - 3 * C3 * params.xEnd * params.xEnd;
        const C0 = (
            params.f(params.xEnd) + params.f(params.xStart) -
            C3 * (Math.pow(params.xStart, 3) + Math.pow(params.xEnd, 3)) -
            C2 * (params.xStart * params.xStart + params.xEnd * params.xEnd) -
            C1 * (params.xStart + params.xEnd)
        ) / 2.0;

        const coefficients = [C0, C1, C2, C3];

        return (x: number) => coefficients
            .map((c, i) => c * Math.pow(x, i))
            .reduce((l, r) => l + r, 0.0);
    }
}
