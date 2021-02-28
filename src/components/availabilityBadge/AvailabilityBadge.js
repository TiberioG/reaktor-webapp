import React from 'react';
import {
  AvailabilityContainer,
  LoadingContainer,
  RetryButton,
} from './StyledAvailabilityBadge';
import { useDispatch } from 'react-redux';

//todo add a fallback in case we have more types than those
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
        <AvailabilityContainer color={types[props.info].color}>
          {types[props.info].msg}
        </AvailabilityContainer>
      )}
    </>
  );
};
export default AvailabilityBadge;
