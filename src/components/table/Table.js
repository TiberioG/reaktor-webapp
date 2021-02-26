import React from 'react';
import styled from 'styled-components';
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList } from 'react-window';

const Tr = styled.div`
  vertical-align: center;
  :last-child {
    .td {
      border-bottom: 0;
    }
  }
`;

const Table = styled.div`
  border-color: rgb(128, 128, 128);
  box-sizing: border-box;
  display: table-row-group;
`;

const Th = styled.div`
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid rgb(128, 128, 128);
  border-right: 1px solid rgb(128, 128, 128);

  :last-child {
    border-right: 1px solid rgb(128, 128, 128);
  }
`;

const Td = styled.div`
  margin: 0;
  padding: 0.5rem;
  border-bottom: 1px solid rgb(128, 128, 128);
  border-right: 1px solid rgb(128, 128, 128);

  :last-child {
    border-right: 1px solid black;
  }
`;

// eslint-disable-next-line react/prop-types
const MyTable = ({ columns, data }) => {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      width: 300,
    }),
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, totalColumnsWidth, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
  );

  const RenderRow = React.useCallback(
    ({ index, isScrolling, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <Tr
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map(cell => {
            return (
              <Td key={cell.getCellProps().key} {...cell.getCellProps()}>
                {cell.render('Cell')}
              </Td>
            );
          })}
        </Tr>
      );
    },
    [prepareRow, rows],
  );

  // Render the UI for your table
  return (
    <Table {...getTableProps()}>
      <div>
        {headerGroups.map(headerGroup => (
          <Tr key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <Th key={column.getHeaderProps().key} {...column.getHeaderProps()}>
                {column.render('Header')}
              </Th>
            ))}
          </Tr>
        ))}
      </div>

      <div {...getTableBodyProps()}>
        <FixedSizeList height={700} itemCount={rows.length} itemSize={35} width={totalColumnsWidth} useIsScrolling>
          {RenderRow}
        </FixedSizeList>
      </div>
    </Table>
  );
};

export default MyTable;
