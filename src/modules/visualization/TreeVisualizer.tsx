import React, { FC } from "react";
import {
  Collapse,
  makeStyles,
  IconButton,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableCell,
  Paper,
  Box,
  Typography
} from '@material-ui/core';

import { IdentifiedNode, IdentifiedData, NodeKids, NodeData } from './treeTypes'

import { KeyboardArrowUp, KeyboardArrowDown, Delete } from '@material-ui/icons'

import { isObjectEmpty } from '../../utils'
import { connect } from 'react-redux'

import { treeVisualizationAction } from './reducer'
import { AppState } from "../rootReducer";

// Design stolen from https://codesandbox.io/s/kbcee?file=/demo.js
interface StateProps {
  nodes: IdentifiedNode[]
}
interface DispatchProps {
  removeElement: typeof treeVisualizationAction.removeElement
}

type Props = StateProps & DispatchProps
export const TreeVisualizer: FC<Props> = ({ nodes, removeElement }) => {
  // we're working with the assumption that every node on the same level
  // has the same attributes in the same order
  if (nodes.length === 0) {
    return null
  }
  const attributes = Object.keys(nodes[0].data)
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <NodeAttributesVisualizer attributes={ attributes }/>
        </TableHead>
        <TableBody>
          {nodes.map((node) => (
            <NodeRowVisualizer key={Object.entries(node.data).toString()} node={node} deleteSelf={() =>  removeElement(node.data._id) } />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface TableHeadProps {
  attributes: NodeData[keyof NodeData][]
}

const NodeAttributesVisualizer: FC<TableHeadProps> = ({ attributes }) => {
  return (
    <TableRow>
      {/* empty cell for the expand/collapse button */}
      <TableCell />
      {attributes.map((attribute, index) =>
        <TableCell align="right" key={index}>{attribute}</TableCell>
      )}
      <TableCell />
    </TableRow>
  )
}

interface RowProps {
  node: IdentifiedNode
  deleteSelf: () => void
}

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const NodeRowVisualizer: FC<RowProps> = ({ node: {data, kids}, deleteSelf }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const dataValues = Object.values(data)
  const numberOfColumns = dataValues.length + 1 // expand icon
  const hasKids = !isObjectEmpty(kids)

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
        { hasKids && (
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
        { dataValues.map((datum, index) => <TableCell key={index} align="right">{datum}</TableCell>) }

        <TableCell>
          <IconButton aria-label="delete subtree" size="small" onClick={ deleteSelf }>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={numberOfColumns}>
        <Collapse in={open} timeout="auto">
          <Box margin={1}>
            <KidTables kids={kids} />
          </Box>
        </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

interface KidsProps {
  kids: NodeKids<IdentifiedData>
}

const KidTables: FC<KidsProps> = ({ kids }) => {
  const entries = Object.entries(kids)
  return (
    <>
      { entries.map(([kidName, {records: kidsNodes}]) =>
        <React.Fragment key={kidName}>
          <Typography variant="h6" gutterBottom component="div">
            {kidName}
          </Typography>

          <DispatchingTreeVisualizer nodes={kidsNodes} />
        </React.Fragment>
      )}
    </>
  );
}

const DispatchingTreeVisualizer = connect<unknown, DispatchProps, unknown, AppState>(
  null,
  {
    removeElement: treeVisualizationAction.removeElement
  }
)(TreeVisualizer)

export const ConnectedTreeVisualizer = connect<StateProps, unknown, unknown, AppState>(
  (state) => ({
    nodes: state.visualizedTreeState.tree
  })
)(DispatchingTreeVisualizer)
