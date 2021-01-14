export type RealFunction = (x: number) => number;


export class FunctionOps {
    static readonly combine = (l: RealFunction, r: RealFunction) => (combOp: (xl: number, xr: number) => number) => {
        return (x: number) => combOp(l(x), r(x));
    }
    static readonly add = (l: RealFunction, r: RealFunction): RealFunction =>
        FunctionOps.combine(l, r)((a, b) => a + b);
    static readonly subtract = (l: RealFunction, r: RealFunction): RealFunction =>
        FunctionOps.combine(l, r)((a, b) => a - b);
}
