import React from 'react';
import { AvailabilityContainer, LoadingContainer, RetryButton } from './StyledAvailabilityBadge';
import { useDispatch } from 'react-redux';

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

//todo refactor here the double if with a switch or use a different component
const AvailabilityBadge = props => {
  const dispatch = useDispatch();

  return (
    <>
      {props.retry ? (
        <RetryButton
          onClick={() => dispatch({ type: 'AVAILABILITY_REQ', payload: { manufacturer: props.manufacturer } })}
        >
          Click to retry
        </RetryButton>
      ) : props.fetching ? (
        <LoadingContainer />
      ) : (
        <AvailabilityContainer color={types[props.info].color}>{types[props.info].msg}</AvailabilityContainer>
      )}
    </>
  );
};
export default AvailabilityBadge;
