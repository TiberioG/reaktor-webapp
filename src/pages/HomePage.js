import React, { useEffect, useMemo, useState } from 'react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { useDispatch, useSelector } from 'react-redux';

import { availableCategories, setCategory } from '../redux/categoriesSlice';

import MyInfiniteScroll from '../components/infinite/InfiniteTable';
import {
  CategoryButton,
  ColorCellContainer,
  HeaderContainer,
  Layout,
  LoaderContainer,
} from './StyledHomePage';
import { addCurrencySymbol, capitalizeFirst } from '../common/utilities';
import ColorBadge from '../components/colorBadge/ColorBadge';
import AvailabilityBadge from '../components/availabilityBadge/AvailabilityBadge';

const HomePage = () => {
  const dispatch = useDispatch();
  const availability = useSelector(state => state.availability);
  const products = useSelector(state => state.products);
  const currentCategory = useSelector(state => state.category);

  const [lastItem, setLastItem] = useState(200);

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
      distinctManufac.forEach(manufacturer =>
        dispatch({ type: 'AVAILABILITY_REQ', payload: { manufacturer } }),
      );
    }
  }, [products]);

  const Buttons = () => {
    return (
      <HeaderContainer>
        <div>Choose a category</div>
        {availableCategories.map(cat => (
          <CategoryButton
            isCurrent={cat === currentCategory}
            key={cat}
            onClick={() => {
              dispatch(setCategory(cat));
              setLastItem(200);
            }}
          >
            {capitalizeFirst(cat)}
          </CategoryButton>
        ))}
      </HeaderContainer>
    );
  };

  const columns = useMemo(
    () => [
      {
        // eslint-disable-next-line react/display-name
        Header: () => Buttons(),
        id: 'mytable',
        // Second group columns
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Price',
            accessor: row => addCurrencySymbol(row?.price),
          },
          {
            Header: 'Color',
            accessor: 'color',
            Cell: row => {
              return (
                <ColorCellContainer>
                  {row.value.map((color, key) => (
                    <ColorBadge key={key} color={color} />
                  ))}
                </ColorCellContainer>
              );
            },
          },
          {
            Header: 'Manufacturer',
            accessor: row => capitalizeFirst(row?.manufacturer),
          },
          {
            Header: 'Availability',
            width: 300,
            accessor: row => {
              if (availability[row.manufacturer]?.ready) {
                return (
                  <AvailabilityBadge
                    info={
                      availability[row.manufacturer]?.data[row.id]?.inStockValue
                    }
                  />
                );
              }
              if (availability[row.manufacturer]?.fetching) {
                return <AvailabilityBadge fetching />;
              }

              if (availability[row.manufacturer]?.error) {
                return (
                  <AvailabilityBadge retry manufacturer={row.manufacturer} />
                );
              }
            },
          },
        ],
      },
    ],
    [availability, currentCategory],
  );

  return (
    <>
      {products[currentCategory].ready ? (
        <Layout>
          <MyInfiniteScroll
            columns={columns}
            data={products[currentCategory]?.data.slice(0, lastItem)}
            update={() => setLastItem(lastItem + 200)}
          />
        </Layout>
      ) : (
        <LoaderContainer>
          <Loader type='Grid' color='#6f4cff' height={100} width={100} />
        </LoaderContainer>
      )}
    </>
  );
};
export default HomePage;
