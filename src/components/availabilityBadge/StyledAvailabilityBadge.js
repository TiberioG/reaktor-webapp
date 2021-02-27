import styled from 'styled-components';

export const AvailabilityContainer = styled.div`
  background-color: ${props => props?.color};
  box-shadow: 0 0 0.3em 0 ${props => props?.color};
  color: whitesmoke;
  padding: 0.5rem;
  min-width: 80px;
  max-width: 100px;
  text-align: center;
  border-radius: 0.5em;
  margin-right: 10px;
`;

export const RetryButton = styled.button`
  background-color: gray;
  box-shadow: 0 0 0.3em 0 gray;
  color: white;
  cursor: pointer;
  outline: none;
  padding: 0.5rem;
  min-width: 80px;
  max-width: 100px;
  text-align: center;
  border-radius: 0.5em;
  margin-right: 10px;
`;

export const LoadingContainer = styled.div`
  padding: 0.5rem;
  min-width: 80px;
  max-width: 100px;
  text-align: center;
  border-radius: 0.5em;
  margin-right: 10px;

  min-height: 16px;
  background: linear-gradient(130deg, #b5b5b5aa, #969696aa, #b5b5b5aa);
  box-shadow: 0 0 0.3em 0 #b5b5b5;
  background-size: 200% 200%;

  -webkit-animation: Animation 1s ease infinite;
  -moz-animation: Animation 1s ease infinite;
  animation: Animation 1s ease infinite;

  @-webkit-keyframes Animation {
    0% {
      background-position: 10% 0%;
    }
    50% {
      background-position: 91% 100%;
    }
    100% {
      background-position: 10% 0%;
    }
  }
  @-moz-keyframes Animation {
    0% {
      background-position: 10% 0%;
    }
    50% {
      background-position: 91% 100%;
    }
    100% {
      background-position: 10% 0%;
    }
  }
  @keyframes Animation {
    0% {
      background-position: 10% 0%;
    }
    50% {
      background-position: 91% 100%;
    }
    100% {
      background-position: 10% 0%;
    }
  }
`;
