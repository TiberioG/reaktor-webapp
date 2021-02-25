import React, { useEffect, useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { Column, Table } from 'react-virtualized';

import MyTable from './components/table/Table';
import { availableCategories, setCategory } from './redux/categoriesSlice';

const GlobalStyle = createGlobalStyle`
  body {
    color: red;
  }
`;

const App = () => {
  let string = 'hello';

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: 'PRODUCTS_REQ', category: 'gloves' });
    dispatch({ type: 'PRODUCTS_REQ', category: 'facemasks' });
    dispatch({ type: 'PRODUCTS_REQ', category: 'beanies' });
  }, []);

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
        ],
      },
    ],
    [],
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
