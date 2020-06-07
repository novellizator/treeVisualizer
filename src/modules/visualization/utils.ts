import { Node, NodeData, IdentifiedData, RecordedNode, NodeKids, IdentifiedNode } from './treeTypes'

let uniqueId = 1
export const generateUniqueId = () => String(uniqueId++)

// tree walk utils
export const visualizationTreeWalk = <S extends NodeData, T extends NodeData>(transformation: (n: Node<S>) => Node<T> | null ) => (nodeArray: Node<S>[]): Node<T>[]  => {
  return nodeArray
    .map(node => {
      const newNode = transformation(node)
      if (newNode == null) {
        return null
      }
      const recordedNodes = Object.values(newNode.kids)
      recordedNodes.forEach((recordedNode) => {
        recordedNode.records = visualizationTreeWalk(transformation)(recordedNode.records as any as Node<S>[]) as any as Node<T>[]
      })
      return newNode
    })
    .filter(node => node != null) as Node<T>[]
}

export const addIdToTree = visualizationTreeWalk<NodeData, IdentifiedData>((node) => {
  node.data._id = generateUniqueId()
  return node as IdentifiedNode
})

export const removeElementFromTree = <S extends NodeData>(elementId: string) =>
  visualizationTreeWalk((node: Node<S>) => {
    if (node.data._id === elementId) {
      return null
    }
    return node
  })

