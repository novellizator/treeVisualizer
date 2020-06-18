import { Node, NodeData, IdentifiedData, IdentifiedNode } from './treeTypes'

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
        recordedNode.records = visualizationTreeWalk(transformation)(recordedNode.records as any as Node<S>[])
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

export const removeElementFromTree2 = (treeArray: IdentifiedNode[], elementId: string): [boolean, IdentifiedNode[]] => {
  const foundIndex = treeArray.findIndex(tree => tree.data._id == elementId)
  if (foundIndex != -1) {
    const newArray = [...treeArray]
    newArray.splice(foundIndex, 1)
    return [true, newArray]
  }
  let didModify = false
  const ret  = treeArray.map(tree => {
    for (const recordedNodeKey in tree.kids) {
      const nodes = tree.kids[recordedNodeKey].records
      const [didRemove, newNodes] = removeElementFromTree2(nodes, elementId)
      didModify = didRemove
      if (didRemove) {
        tree.kids[recordedNodeKey].records = newNodes
        break
      } else {
        continue
      }
    }
    return tree
  })

  return [didModify, ret]
}


