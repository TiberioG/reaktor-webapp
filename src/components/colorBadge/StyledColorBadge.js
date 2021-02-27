import styled from 'styled-components';

export const ColorBadgeContainer = styled.div`
  background-color: ${props => props?.color};
  padding: 0.5rem;
  min-width: 50px;
  text-align: center;
  border-radius: 2rem;
  margin-right: 10px;
  color: ${props => (props.color === 'white' || props.color == 'yellow' ? '#2d2d2d' : '#eae7e7')};
  box-shadow: 0 0 0.3em 0 ${props => props?.color};
`;
