import React from 'react';
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// eslint-disable-next-line react/prop-types
const MyTable = ({ columns, data }) => {
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    totalColumnsWidth,
  } = useTable(
    {
      columns,
      data,
    },
    useBlockLayout,
  );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
    }),
    [],
  );

  const [tableHeight, setTableHeight] = React.useState(700);

  React.useEffect(() => {
    console.log(tableHeight);
    setTableHeight(window.innerHeight - 270);
    window.addEventListener('resize', updateHeightCallback);
    return () => {
      window.removeEventListener('resize', updateHeightCallback);
    };
  }, []);

  const updateHeightCallback = () => {
    setTableHeight(window.innerHeight - 270);
  };

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <tr
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map(cell => {
            return (
              <td key={cell.getCellProps().key} {...cell.getCellProps()}>
                {cell.render('Cell')}
              </td>
            );
          })}
        </tr>
      );
    },
    [prepareRow, rows],
  );

  /*
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
  return (
    <AutoSizer>
      {({ height, width }) => {
        console.log('height' + height);
        return (
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr key={'hello'} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => {
                    const { key, ...restColumnProps } = column.getHeaderProps();
                    return (
                      <th key={key} {...restColumnProps}>
                        {column.render('Header')}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              <FixedSizeList height={1000} itemCount={rows.length} itemSize={35} width={totalColumnsWidth}>
                {RenderRow}
              </FixedSizeList>
            </tbody>
          </table>
        );
      }}
    </AutoSizer>
  );
};

export default MyTable;
