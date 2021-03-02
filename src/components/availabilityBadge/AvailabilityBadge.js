import React from 'react';
import {
  AvailabilityContainer,
  LoadingContainer,
  RetryButton,
} from './StyledAvailabilityBadge';
import { useDispatch, useSelector } from 'react-redux';

//here i save the pretty name to show and the color for each availability status
const types = {
  INSTOCK: {
    color: 'green',
    msg: 'In stock',
  },
  OUTOFSTOCK: {
    color: 'red',
    msg: 'Out of stock',
  },
  LESSTHAN10: {
    color: 'orange',
    msg: 'Less than 10',
  },
  FALLBACK: {
    color: 'grey',
    msg: 'Not found',
  },
};

const handleTypes = {
  get(typesObj, code) {
    return code in typesObj //check if we have this availability code
      ? typesObj[code] // if we have the code, return the content
      : typesObj.FALLBACK; // this means the product was not found
  },
};

const AvailabilityBadge = props => {
  const dispatch = useDispatch();

  const availability = useSelector(state => state.availability);

  //case ok
  if (availability[props.manufacturer]?.ready) {
    const inStockValue =
      availability[props.manufacturer]?.data[props.id]?.inStockValue;
    return (
      <AvailabilityContainer
        color={new Proxy(types, handleTypes)[inStockValue].color}
      >
        {new Proxy(types, handleTypes)[inStockValue].msg}
      </AvailabilityContainer>
    );
  } else {
    //case availability was not available
    if (availability[props.manufacturer]?.error) {
      return (
        <RetryButton
          onClick={() =>
            dispatch({
              type: 'AVAILABILITY_REQ',
              payload: { manufacturer: props.manufacturer },
            })
          }
        >
          Click to retry
        </RetryButton>
      );
    } else return <LoadingContainer />;
  }
};
export default AvailabilityBadge;
