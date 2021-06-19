import React from "react";

export const Flag = ({ language }: any) => (
  <svg
    width="30px"
    height="22px"
    viewBox="0 0 22 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g>
        <path
          d="M8,16 C5.9,16 1.9,15 1.8,15 C1.3,14.9 0.9,14.3 1.1,13.8 C1.2,13.3 0.9,2.3 1,1.8 C1.2,1.2 1.7,0.9 2.2,1 C2.2,1 6.1,2 8,2 C8.9,2 10.4,1.8 11.8,1.5 C13.4,1.2 14.9,1 16,1 C18.1,1 21.2,2 21.3,2.1 C21.7,2.2 22,2.6 22,3 L22,15 C22,15.3 21.8,15.6 21.6,15.8 C21.3,16 21,16 20.7,15.9 C20.7,15.9 17.8,15 16,15 C15.1,15 13.6,15.2 12.2,15.5 C10.6,15.8 9.1,16 8,16 Z"
          fill="#000000"
          fillRule="nonzero"
        />
        <text
          fontFamily="Helvetica-Bold, Helvetica, Arial, sans-serif"
          fontSize="9"
          fontWeight="bold"
          fill="#FFFFFF"
        >
          <tspan x="5.4" y="12">
            {language.toUpperCase()}
          </tspan>
        </text>
      </g>
    </g>
  </svg>
);
