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

import { Node, NodeKids, NodeData } from './treeTypes'

import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons'

import { isObjectEmpty } from './utils'

// https://codesandbox.io/s/kbcee?file=/demo.js

interface TreeProps {
  nodes: Node[]
}

export const TreeVisualizer: FC<TreeProps> = ({ nodes}) => {
  // we're workig under the assumption that every node on the same level
  // has the same attributes in the same order
  const attributes = Object.keys(nodes[0].data)
  return (
    <TableContainer component={Paper}>
    <Table aria-label="collapsible table" size="small">
      <TableHead>
        <NodeAttributesVisualizer attributes={ attributes }/>
      </TableHead>
      <TableBody>
        {nodes.map((node) => (
            <NodeRowVisualizer node={node} />
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
      {attributes.map(attribute =>
          <TableCell align="right">{attribute}</TableCell>
      )}
    </TableRow>
  )
}

interface RowProps {
  node: Node
}

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const NodeRowVisualizer: FC<RowProps> = ({ node: {data, kids} }) => {
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
        { dataValues.map(datum => <TableCell align="right">{datum}</TableCell>) }
      </TableRow>

      <TableRow>
        <TableCell colSpan={numberOfColumns}>
        <Collapse in={open} timeout="auto"> {/* unmountOnExit */}
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
  kids: NodeKids
}

const KidTables: FC<KidsProps> = ({ kids }) => {
  const entries = Object.entries(kids)
  return (
    <>
      { entries.map(([kidName, {records: kidsNodes}]) =>
        <>
          <Typography variant="h6" gutterBottom component="div">
            {kidName}
          </Typography>

          <TreeVisualizer nodes={kidsNodes} />
        </>
      )}
    </>
  );
}
