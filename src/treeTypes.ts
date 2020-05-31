export interface Node {
  data: NodeData
  kids: NodeKids
}

export interface NodeData {
  [key: string]: string;
}

export interface NodeKids {
  [key: string]: RecordedNode;
}

export interface RecordedNode {
  records: Node[]
}
