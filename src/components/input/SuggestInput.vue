<template>
  <div
    :class="{ focused: isInputFocused, disabled: isDisabled }"
    v-overlay-container="{ togglePropName: 'areSuggestionsVisible' }"
    v-navigable-container="{ cursorPropName: 'cursorIndex' }"
  >
    <input
      type="text"
      class="input"
      @input="onInputInput"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @keydown="onInputKeyDown"
      v-model="query"
      :disabled="isDisabled"
      :placeholder="placeholder"
    />
    <transition name="fade">
      <ul class="dropdown" v-if="areSuggestionsVisible">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.id"
          @click="onSuggestionClick(index)"
          :class="{ cursor: index === cursorIndex }"
        >
          <span>{{ suggestion.label }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

div {
  position: relative;
  align-items: stretch;
  color: $greyscale-1;

  .disabled & {
    &::before {
      content: " ";
      display: block;
      width: 100%;
      height: 100%;
      background-color: transparent;
      position: absolute;
      z-index: 1;
    }
  }
}

.input {
  border-color: $greyscale-1;
  border-width: 1px;
  color: $greyscale-1;
  outline: none;
  padding: 4px 0;
  width: 100%;
  line-height: 1;
  font-size: unset;
  background: transparent;

  .disabled & {
    z-index: -1;
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
  box-shadow: 0 2px 4px 0 $greyscale-2;
  margin: 4px 0 0 0;

  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.2s ease-in-out, margin-top 0.2s ease-in-out;
  }

  &.fade-enter,
  &.fade-leave-to {
    margin-top: 8px;
    opacity: 0;
  }

  li {
    padding: 4px 8px;
    cursor: pointer;

    &.cursor {
      background-color: $greyscale-2;
    }
  }
}
</style>
<script>
import { debounce, isEqual } from "lodash";

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
          id: undefined,
          label: "",
          value: null
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
    },
    resolve: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      query: this.value.label,
      isInputFocused: false,
      areSuggestionsVisible: false,
      suggestions: [],
      cursorIndex: -1
    };
  },

  watch: {
    areSuggestionsVisible: function(value) {
      this.cursorIndex = value ? 0 : -1;
    }
  },

  methods: {
    debouncedSuggest: debounce(function(query) {
      this.suggest(query);
    }, 500),

    onInputFocus() {
      this.isInputFocused = true;

      this.areSuggestionsVisible = this.suggestions.length > 0;

      this.$emit("focus");
    },

    onInputBlur() {
      this.isInputFocused = false;
    },

    onInputInput(event) {
      this.debouncedSuggest(event.target.value);
    },

    onSuggestionClick(index) {
      this.select(index);
    },

    onInputKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();

        this.select(this.cursorIndex);
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
      let value = { ...this.value };

      if (suggestion) {
        value = await this.resolve(suggestion.id);
      } else if (this.value.label !== this.query || !this.query) {
        value = {
          id: undefined,
          label: "",
          value: null
        };
      }

      if (this.value.label !== this.query) {
        this.query = value.label;
      }

      this.areSuggestionsVisible = false;

      if (!isEqual(value, { ...this.value })) {
        this.$emit("input", value);
      }
    }
  }
};
</script>
