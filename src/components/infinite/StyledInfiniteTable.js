import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  text-align: left;
  th {
    position: sticky;
    top: 0;
  }
`;

export const Head = styled.thead`
  text-align: left;
  position: sticky;
  tr {
    height: 50px;
  }
`;

export const Body = styled.tbody`
  tr {
    height: 50px;
    border-bottom: 1px solid #6d6875;
  }

  tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
