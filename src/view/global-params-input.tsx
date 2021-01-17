import { PlotParams, PlotParamsInput } from './plot-params-input';
import { Grid, Paper } from '@material-ui/core';
import {FunctionsList, FunctionsListParams, FunctionSourceHook} from './functions-list';


export const GlobalParamsInput = (params: FunctionSourceHook & FunctionsListParams & PlotParams) => {
    return (
        <Grid container spacing={3}>
            <Grid item id='plot-params' xs={6}>
                <Paper>
                    <PlotParamsInput
                        xStartHook={params.xStartHook}
                        xEndHook={params.xEndHook}
                        hermitPointsCountHook={params.hermitPointsCountHook}
                        numberOfPlotPoints={params.numberOfPlotPoints} />
                </Paper>
            </Grid>
            <Grid item id='function-selector' xs={6}>
                <Paper>
                    <FunctionsList
                        selectedFHook={params.selectedFHook}
                        functionSourceHook={params.functionSourceHook}
                        dfSourceHook={params.dfSourceHook}
                        testX={params.testX} />
                </Paper>
            </Grid>
        </Grid>
    );
}
