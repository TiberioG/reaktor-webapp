import React from 'react';
import { ColorBadgeContainer } from './StyledColorBadge';

const ColorBadge = props => {
  return <ColorBadgeContainer color={props.color}>{props.color}</ColorBadgeContainer>;
};

export default ColorBadge;
