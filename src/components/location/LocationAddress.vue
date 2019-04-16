<template>
  <div
    :class="['location-address', { focused: isInputFocused, disabled: isDisabled }]"
    v-overlay-container="{ togglePropName: 'areSuggestionsVisible' }"
    v-navigable-container="{ cursorPropName: 'cursorIndex' }"
  >
    <label>
      <input
        tabindex="0"
        type="text"
        class="input"
        autocomplete="false"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        @input="onInputInput"
        @focus="onInputFocus"
        @blur="onInputBlur"
        @keydown="onInputKeyDown"
        v-model="query"
        :disabled="isDisabled"
        :placeholder="placeholder"
      />
    </label>
    <transition name="fade">
      <ul class="dropdown" v-if="areSuggestionsVisible">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.id"
          @click="onSuggestionClick(index)"
          :class="['item', { cursor: index === cursorIndex }]"
        >
          <button class="option">{{ suggestion.address }}</button>
        </li>
      </ul>
    </transition>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.location-address {
  position: relative;
  align-items: stretch;
  color: $greyscale-1;

  &::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 25%;
    height: calc(100% - 2px);
    background: linear-gradient(to right, rgba(255, 255, 255, 0), $greyscale-2);
  }

  &.focused {
    &::after {
      content: none;
    }
  }

  &.disabled {
    &::before {
      content: " ";
      display: block;
      width: 100%;
      height: 100%;
      background-color: transparent;
      position: absolute;
      z-index: 1;
    }

    &::after {
      width: 40%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), white);
    }
  }
}

.input {
  border-style: solid;
  border-color: $greyscale-1;
  border-width: 0 0 2px 0;
  border-radius: 0;
  color: $greyscale-1;
  outline: none;
  padding: 4px 0;
  width: 100%;
  line-height: 1;
  font-size: 16px;
  background: transparent;
  transition: padding 0.1s ease-in-out;

  @media (min-width: $breakpoint-tablet-portrait) {
    font-size: 13px;
  }

  .disabled & {
    z-index: -1;
    border-width: 0;
    padding: 0;
  }

  &:focus {
    background-color: white;
    padding: 4px 0 4px 4px;
  }
}

.dropdown {
  position: absolute;
  top: 100%;
  width: 100%;
  border-radius: 0 0 3px 3px;
  background-color: white;
  padding: 0;
  list-style: none;
  box-shadow: 0 2px 4px 0 $greyscale-1;
  margin: 4px 0 0 0;

  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.2s ease-in-out, margin-top 0.2s ease-in-out;
  }

  &.fade-enter,
  &.fade-leave-to {
    margin-top: 0;
    opacity: 0;
  }
}

.item {
  padding: 4px 8px;
  cursor: pointer;

  &.cursor {
    background-color: $greyscale-2;
  }
}

.option {
  border: 0 none;
  background-color: transparent;
  outline: 0 none;
  padding: 0;
  text-align: left;
}
</style>
<script>
import { debounce, isEqual } from "lodash-es";

import "../../directives/overlayContainer";
import "../../directives/navigableContainer";

export default {
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default() {
        return {
          id: "",
          address: ""
        };
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    search: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      query: this.value.address,
      isInputFocused: false,
      areSuggestionsVisible: false,
      suggestions: [],
      cursorIndex: -1
    };
  },

  watch: {
    areSuggestionsVisible: function(value) {
      this.cursorIndex = value ? 0 : -1;
    },

    value: function(value) {
      this.query = value.address;
    }
  },

  methods: {
    debouncedSuggest: debounce(function(query) {
      this.suggest(query);
    }, 500),

    onInputFocus() {
      this.isInputFocused = true;

      this.areSuggestionsVisible = this.suggestions.length > 0;
    },

    onInputBlur() {
      this.isInputFocused = false;
    },

    onInputInput(event) {
      this.debouncedSuggest(event.target.value);
    },

    onSuggestionClick(index) {
      this.select(index);
      this.areSuggestionsVisible = false;
    },

    onInputKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();

        if (this.query !== this.value.address) {
          this.select(this.cursorIndex);
        }

        this.areSuggestionsVisible = false;
      }
    },

    async suggest(query) {
      let suggestions = [];

      if (query.length > 2) {
        suggestions = await this.search(query);
      }

      this.suggestions = suggestions;

      this.areSuggestionsVisible = suggestions.length > 0;
    },

    async select(index) {
      const suggestion = this.suggestions[index];

      let newValue = {
        id: "",
        address: ""
      };

      if (suggestion) {
        newValue = { ...suggestion };
      }

      if (!isEqual(newValue, this.value)) {
        this.query = newValue.address;

        this.$emit("input", newValue);
      }
    }
  }
};
</script>
