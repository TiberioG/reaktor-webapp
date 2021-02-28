import React from 'react';
import { ColorBadgeContainer } from './StyledColorBadge';

//return a colored div according to props
//todo add a check if color is not a html color
const ColorBadge = props => {
  return (
    <ColorBadgeContainer color={props.color}>{props.color}</ColorBadgeContainer>
  );
};

export default ColorBadge;
