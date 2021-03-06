import React from 'react';
import { useTable } from 'react-table';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Table, Head, Body } from './StyledInfiniteTableScroll';

const InfiniteTableScroll = ({ columns, data, update, isEnded }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  //todo add sticky header
  return (
    <InfiniteScroll
      dataLength={rows.length}
      next={update}
      hasMore={!isEnded}
      loader={<h2>Loading more items...</h2>}
    >
      <Table {...getTableProps()}>
        <Head>
          {headerGroups.map(headerGroup => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map(column => (
                <th
                  key={column.getHeaderProps().key}
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </Head>

        <Body {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td key={cell.getCellProps()?.key} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </Body>
      </Table>
    </InfiniteScroll>
  );
};

export default InfiniteTableScroll;
