import React, { useEffect, useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { Column, Table } from 'react-virtualized';

import MyTable from './components/table/Table';
import { availableCategories, setCategory } from './redux/categoriesSlice';
import InfiniteTable from './components/infinite/InfiniteTable';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: "Helvetica Neue", sans-serif;
    color: whitesmoke;
    background: #0f0c29; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #24243e, #302b63, #0f0c29); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #24243e, #302b63, #0f0c29); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  }
`;

const App = () => {
  const dispatch = useDispatch();
  const availability = useSelector(state => state.availability);
  const products = useSelector(state => state.products);
  const currentCategory = useSelector(state => state.category);
  const manufacturers = ['umpante', 'okkau', 'ippal'];

  useEffect(() => {
    availableCategories.forEach(cat => {
      dispatch({ type: 'PRODUCTS_REQ', payload: { category: cat } });
    });
  }, []);

  useEffect(() => {
    if (
      Object.values(products)
        .map(cat => cat.ready)
        .every(item => item === true)
    ) {
      const distinctManufac = [
        ...new Set(
          Object.values(products)
            .map(cat => cat?.data)
            .reduce((acc, cur) => acc.concat(cur))
            .map(product => product?.manufacturer),
        ),
      ];
      distinctManufac.forEach(manufacturer => dispatch({ type: 'AVAILABILITY_REQ', payload: { manufacturer } }));
    }
  }, [products]);

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
              //console.log(availability[row.manufacturer]);

              if (availability[row.manufacturer]?.ready) {
                return availability[row.manufacturer]?.data[row.id]?.inStockValue;
              }
              //console.log(availability[row.manufacturer].data[row.id]);
              else return 'fetching';
            },
          },
        ],
      },
    ],
    [availability],
  );

  return (
    <>
      <GlobalStyle />
      <div>{currentCategory}</div>

      {availableCategories.map(c => (
        <button key={c} onClick={() => dispatch(setCategory(c))}>
          {c}
        </button>
      ))}

      {products[currentCategory].ready ? (
        <>
          <MyTable columns={columns} data={products[currentCategory]?.data} />
        </>
      ) : null}
    </>
  );
};

export default App;
