import React, { useEffect, useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { Column, Table } from 'react-virtualized';

import MyTable from './components/table/Table';
import { availableCategories, setCategory } from './redux/categoriesSlice';

const GlobalStyle = createGlobalStyle`
  body {
    color: black;
  }
`;

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: 'PRODUCTS_REQ', payload: { category: 'gloves' } });
    dispatch({ type: 'PRODUCTS_REQ', payload: { category: 'facemasks' } });
    dispatch({ type: 'PRODUCTS_REQ', payload: { category: 'beanies' } });
    dispatch({ type: 'AVAILABILITY_REQ', payload: { manufacturer: 'okkau' } });
  }, []);

  const availability = useSelector(state => state.availability);

  const columns = useMemo(
    () => [
      {
        // Second group - Details
        Header: 'Details',
        // Second group columns
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Price',
            accessor: 'price',
          },
          {
            Header: 'Color',
            accessor: 'color',
          },
          {
            Header: 'Manufacturer',
            accessor: 'manufacturer',
          },
          {
            Header: 'Availability',
            accessor: row => {
              if (!availability.initial) {
                //console.log(availability[row.manufacturer]);
                if (availability[row.manufacturer]) {
                  if (!availability[row.manufacturer].fetching) {
                    return availability[row.manufacturer]?.data[row.id].inStockValue;
                  }
                  //console.log(availability[row.manufacturer].data[row.id]);
                  else return 'fetching';
                }
              } else return 'waiting';
            },
          },
        ],
      },
    ],
    [availability],
  );

  const products = useSelector(state => state.products);
  const currentCategory = useSelector(state => state.category);

  return (
    <>
      <GlobalStyle />
      <div>{currentCategory}</div>

      {availableCategories.map(c => (
        <button key={c} onClick={() => dispatch(setCategory(c))}>
          {c}
        </button>
      ))}

      {!products[currentCategory].initial ? (
        <>
          <MyTable columns={columns} data={products[currentCategory]?.data} />
        </>
      ) : null}
    </>
  );
};

export default App;
