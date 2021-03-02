import React from 'react';
import {
  AvailabilityContainer,
  LoadingContainer,
  RetryButton,
} from './StyledAvailabilityBadge';
import { useDispatch } from 'react-redux';

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
    msg: 'Please try again',
  },
};

const handleTypes = {
  get(typesObj, code) {
    return code in typesObj //check if we have this availability code
      ? typesObj[code] // if we have the code, return the content
      : typesObj.FALLBACK;
  },
};

const AvailabilityBadge = props => {
  const dispatch = useDispatch();

  //* case retry -> show button to refetch again
  //* case fetching -> show loader
  //* case ok -> show availability info
  return (
    <>
      {props.retry ? (
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
      ) : props.fetching ? (
        <LoadingContainer />
      ) : (
        <AvailabilityContainer
          color={new Proxy(types, handleTypes)[props.info].color}
        >
          {new Proxy(types, handleTypes)[props.info].msg}
        </AvailabilityContainer>
      )}
    </>
  );
};
export default AvailabilityBadge;
