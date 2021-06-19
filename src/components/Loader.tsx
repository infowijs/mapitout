import styled from "styled-components";
import { colorList } from "../utils";

const thickness = 4;
const size = 25;

export const Loader = styled.div`
  border: ${thickness}px solid transparent;
  border-top: ${thickness}px solid ${colorList[0]};
  border-radius: 50%;
  width: ${size}px;
  height: ${size}px;
  animation: anim 1.5s linear infinite;

  @keyframes anim {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
