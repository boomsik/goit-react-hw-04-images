import styled from 'styled-components';

export const ImageContainer = styled.ul`
  display: grid;
  max-width: calc(100% - 48px);
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-gap: 16px;
  margin-inline: auto;
  padding: 0;
  list-style: none;
`;
