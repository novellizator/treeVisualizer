import { Node } from './treeTypes'

let uniqueId = 1
export const generateUniqueId = () => String(uniqueId++)

// tree walk utils
export const visualizationTreeWalk = (transformation: (n: Node) => Node | null ) => (nodeArray: Node[]) => {
  return nodeArray
    .map(node => {
      const newNode = transformation(node)
      if (newNode == null) {
        return null
      }
      const recordedNodes = Object.values(newNode.kids)
      recordedNodes.forEach(recordedNode => {
        recordedNode.records = visualizationTreeWalk(transformation)(recordedNode.records)
      })
      return newNode
    })
    .filter(node => node != null) as Node[]
}

export const addIdToTree = visualizationTreeWalk((node) => {
  node.data._id = generateUniqueId()
  return node
})

export const removeElementFromTree = (elementId: string) =>
  visualizationTreeWalk((node) => {
    if (node.data._id === elementId) {
      return null
    }
    return node
  })

