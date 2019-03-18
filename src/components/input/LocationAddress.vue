<template>
  <label
    :class="{ focused: isInputFocused }"
    v-overlay-container="{ togglePropName: 'displaySuggestions' }"
    v-navigable-list="{
      focusedIndexPropName: 'focusedSuggestionIndex',
      focusedItemClassName: 'focused'
    }"
  >
    <input
      type="text"
      @input="onInputInput"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @keydown="onInputKeyDown"
      v-model="query"
      :placeholder="placeholder"
    />
    <ul v-if="displaySuggestions">
      <li
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.id"
        @click="onSuggestionClick(index)"
        :class="{ focused: index === focusedSuggestionIndex }"
      >
        <span>{{ suggestion.address }}</span>
      </li>
    </ul>
  </label>
</template>
<style scoped lang="scss">
@import "../../style/variables";

label {
  display: flex;
  flex-direction: row;
  position: relative;
  color: $greyscale-1;

  &::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 25%;
    height: calc(100% - 2px);
    background: linear-gradient(to right, rgba(255, 255, 255, 0), white);
  }

  &.focused::after {
    content: none;
  }
}

input {
  font-size: 12px;
  line-height: 1.83px;
  border-width: 0 0 2px 0;
  border-color: #4d4d4d;
  color: #4d4d4d;
  outline: none;
  flex-grow: 1;
}
ul {
  position: absolute;
  top: 100%;
  width: 100%;
  border-width: 0;
  border-style: solid;
  border-color: $greyscale-1;
  border-radius: 0 0 3px 3px;
  background-color: white;
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 2px 4px 0 $greyscale-2;

  li {
    padding: 4px 8px;
    font-size: 12px;
    line-height: 1.83;
    cursor: pointer;

    &.focused {
      background-color: $greyscale-2;
    }
  }
}
</style>
<script>
import { debounce } from "lodash";
import { mapActions } from "vuex";

import "../../directives/overlayContainer";
import "../../directives/navigableList";

export const defaultValue = {
  address: "",
  coordinates: null
};

export default {
  props: {
    placeholder: {
      type: String,
      default: "Choose an address"
    },
    value: {
      type: Object,
      default: function() {
        return { ...defaultValue };
      }
    }
  },
  data() {
    return {
      query: "",
      isInputFocused: false,
      isLoading: false,
      displaySuggestions: false,
      suggestions: [],
      focusedSuggestionIndex: -1
    };
  },

  mounted() {
    this.query = this.value.address;
  },

  watch: {
    displaySuggestions: function(value) {
      this.focusedSuggestionIndex = value ? 0 : -1;
    }
  },

  methods: {
    ...mapActions("address", ["search", "resolve"]),

    debouncedSuggest: debounce(function(query) {
      this.suggest(query);
    }, 500),

    onInputFocus() {
      this.isInputFocused = true;
    },

    onInputBlur() {
      this.isInputFocused = false;
    },

    onInputInput(event) {
      this.debouncedSuggest(event.target.value);
    },

    onInputKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();

        if (this.focusedSuggestionIndex !== -1) {
          this.select(this.focusedSuggestionIndex);
        } else if (this.value.address.length > 0 && this.value.address !== this.query) {
          this.$emit("input", { ...defaultValue });
        }
      }
    },

    onSuggestionClick(index) {
      this.select(index);
    },

    async suggest(query) {
      let suggestions = [];

      if (query.length > 2) {
        suggestions = await this.search(query);
      }

      this.suggestions = suggestions;

      this.displaySuggestions = this.suggestions.length > 0;
    },

    async select(index) {
      const suggestion = this.suggestions[index];
      const address = suggestion.address;
      const coordinates = await this.resolve(suggestion.id);

      if (coordinates) {
        const value = { address, coordinates };

        this.$emit("input", value);

        this.query = value.address;
      }

      this.displaySuggestions = false;
    }
  }
};
</script>
