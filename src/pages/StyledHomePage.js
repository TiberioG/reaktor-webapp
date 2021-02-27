import styled from 'styled-components';

export const CategoryButton = styled.button`
  padding: 15px 25px;
  margin: 10px;
  color: ${props => (props?.isCurrent ? '#d3c7f6' : '#2f2e34')};
  border-radius: 4px;
  background-color: ${props => (props?.isCurrent ? '#6f4cff' : '#d3c7f6aa')};
  cursor: pointer;
  outline: none;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1rem;
  letter-spacing: 0.4px;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  box-shadow: 0 0 1em 0 ${props => (props?.isCurrent ? '#6f4cff' : '#6d6875')};
  pointer-events: all;
  opacity: 1;
  border: 2px solid ${props => (props?.isCurrent ? '#403d45' : '#6d6875')};

  ${props =>
    props?.isCurrent
      ? ''
      : `&:hover {
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
    -webkit-transform: scale(1.02);
    -ms-transform: scale(1.02);
    transform: scale(1.02);
    border: 2px solid #6f4cff;
    box-shadow: 0 0 1em 0 #6f4cff;
  }`}
`;

export const ColorCellContainer = styled.div`
  display: flex;
`;

export const HeaderContainer = styled.div`
  display: flex;
  margin-top: 2%;
  align-items: center;
  justify-content: flex-start;
`;

export const Layout = styled.div`
  max-width: 1320px;
  margin: auto;
  padding: 0 20px;
`;

export const LoaderContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
