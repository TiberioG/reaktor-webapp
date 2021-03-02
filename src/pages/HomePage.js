import React, { useEffect, useMemo, useState } from 'react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { useDispatch, useSelector } from 'react-redux';

import { availableCategories, setCategory } from '../redux/categoriesSlice';

import InfiniteTableScroll from '../components/infiniteTableScroll/InfiniteTableScroll';
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

  //effect to fetch all products
  useEffect(() => {
    availableCategories.forEach(cat => {
      dispatch({ type: 'PRODUCTS_REQ', payload: { category: cat } });
    });
  }, []);

  //effect to fetch availability of manufacturers
  useEffect(() => {
    //check if we have done to fetch every product
    if (
      Object.values(products)
        .map(cat => cat.ready)
        .every(item => item === true)
    ) {
      //use a set to have distinct values of manufacturers
      const distinctManufac = [
        ...new Set(
          Object.values(products)
            .map(cat => cat?.data) //extract data for every category
            .reduce((acc, cur) => acc.concat(cur)) //merge all categories in one
            .map(product => product?.manufacturer), // extract all manufacturers
        ),
      ];
      distinctManufac.forEach(manufacturer =>
        dispatch({ type: 'AVAILABILITY_REQ', payload: { manufacturer } }),
      );
    }
  }, [products]);

  //utility component to render buttons to choose the category
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

  const columns = [
    {
      Header: () => Buttons(),
      id: 'mytable',
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
          //extract the array of colors and map to a component
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
            return (
              <AvailabilityBadge id={row.id} manufacturer={row?.manufacturer} />
            );
          },
        },
      ],
    },
  ];

  return (
    <>
      {products[currentCategory].ready ? (
        <Layout>
          <InfiniteTableScroll
            columns={columns}
            data={products[currentCategory]?.data.slice(0, lastItem)}
            update={() => setLastItem(lastItem + 200)}
            isEnded={lastItem > products[currentCategory]?.data.length}
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
