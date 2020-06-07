import { combineReducers, Reducer } from 'redux';
import { treeVisualizationReducer, TreeVisualizationState, TreeVisualizationAction } from './visualization/reducer'

export type AppState = {
    visualizedTreeState: TreeVisualizationState
}
export type AppActions = TreeVisualizationAction
export const rootReducer: Reducer<AppState, AppActions> = combineReducers({
  visualizedTreeState: treeVisualizationReducer
})

