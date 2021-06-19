import styled from "styled-components";

export const StyledContentSegment = styled.div`
  margin-bottom: 2rem;

  h1 {
    margin-bottom: 1rem;
    font-weight: bold;
  }
  p,
  ul {
    color: rgba(0, 0, 0, 0.45);
    line-height: 1.5rem;
  }
  p {
    margin-bottom: 1rem;
  }
  li {
    margin: 0.25rem 0;
  }
  a,
  span.link {
    color: rgba(0, 0, 0, 0.75);

    :hover {
      color: #000;
    }
  }
`;
