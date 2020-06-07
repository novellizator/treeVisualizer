export interface Node<TData = NodeData> {
  data: TData
  kids: NodeKids<TData>
}

export type IdentifiedData = NodeData & {_id: string}
export type IdentifiedNode = Node<IdentifiedData>
export interface NodeData {
  [key: string]: string
}

export interface NodeKids<TData = NodeData> {
  [key: string]: RecordedNode<TData>
}

export interface RecordedNode<TData = NodeData> {
  records: Node<TData>[]
}
