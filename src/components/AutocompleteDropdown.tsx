import { Trans } from "@lingui/macro";
import React from "react";
import styled, { css } from "styled-components";

import { shadows } from "../constants";
import { hexColorToRGBA } from "../utils";
import { BusIcon } from "../icons";

// Styling for the autocomplete dropdown container used with the `react-places-autocomplete` package
const StyledAutocompleteDropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  min-width: 300px;
  margin-top: 1rem;
  ${shadows.normal};
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  z-index: 10;
`;

// Styling for the loader used with the `react-places-autocomplete` package
const StyledLoader = styled.div`
  padding: 10px;
`;

// Styling for the autocomplete dropdown item used with the `react-places-autocomplete` package
const StyledAutocompleteSuggestion = styled.div<{
  active: boolean;
  color: string;
}>`
  position: relative;
  cursor: pointer;
  transition: background-color 80ms;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  height: 20px;
  max-width: 280px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  p {
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    margin-right: 9px;
  }

  :before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background-color: ${(props) => props.color};
  }

  ${(props) =>
    props.active &&
    css`
      background: linear-gradient(
        to right,
        ${hexColorToRGBA(props.color, 0.25)},
        ${hexColorToRGBA(props.color, 0.1)}
      );

      :before {
        width: 2px;
      }
    `};
`;

interface Suggestion {
  active: boolean;
  description: string;
  types: string[];
}

interface Props {
  loading: boolean;
  color: string;
  getSuggestionItemProps: (arg0: any) => any;
  suggestions: Suggestion[] | any;
}

const AutocompleteDropdown = ({
  loading,
  suggestions,
  getSuggestionItemProps,
  color,
}: Props) => {
  return (
    <StyledAutocompleteDropdownContainer>
      {loading && (
        <StyledLoader>
          <Trans>Loading...</Trans>
        </StyledLoader>
      )}
      {suggestions &&
        suggestions.map((suggestion: Suggestion) => {
          return (
            <StyledAutocompleteSuggestion
              key={suggestion.description}
              {...getSuggestionItemProps(suggestion)}
              active={suggestion.active}
              color={color}
            >
              {suggestion.types.includes("transit_station") ? (
                <BusIcon />
              ) : null}
              <p>{suggestion.description}</p>
            </StyledAutocompleteSuggestion>
          );
        })}
    </StyledAutocompleteDropdownContainer>
  );
};

export { AutocompleteDropdown };
