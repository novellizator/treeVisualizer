import { IdentifiedNode, IdentifiedData } from './treeTypes'
import { Reducer } from 'redux'
import { ActionType, createAction } from 'typesafe-actions';
import { removeElementFromTree } from './utils'
import nodes from '../../mocks/data.json'
import { addIdToTree } from '../../modules/visualization/utils'

export type TreeVisualizationState = {
    tree: IdentifiedNode[]
}

const initialState: TreeVisualizationState = {
    tree: addIdToTree(nodes)
}
enum TreeVisualizationActionNames  {
    removeElement = "VIS/REMOVE_ELEMENT"
}

type ElementId = string

export const treeVisualizationAction = {
  removeElement: createAction(TreeVisualizationActionNames.removeElement, (elementId: ElementId) =>({ elementId }))()
}

export type TreeVisualizationAction = ActionType<typeof treeVisualizationAction>

export const treeVisualizationReducer: Reducer<TreeVisualizationState, TreeVisualizationAction> = (state = initialState, action) => {
  switch (action.type) {
    case TreeVisualizationActionNames.removeElement:
      const element = String(action.payload.elementId)
      return {
        ...state,
        tree: removeElementFromTree<IdentifiedData>(element)(state.tree)
      }
    default:
      return state
  }
}
