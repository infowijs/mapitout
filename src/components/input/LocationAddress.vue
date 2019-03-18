<template>
  <label
    ref="rootEl"
    @keydown="onKeyDown"
    v-toggle-prop="{ propName: 'displaySuggestions' }"
    v-navigable-list="{
      focusedIndexPropName: 'focusedListIndex',
      focusedItemClassName: 'focused'
    }"
  >
    <input
      type="text"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :value="query"
      :placeholder="placeholder"
    />
    <div v-if="!isInputFocused" class="mask"></div>
    <ul v-if="displaySuggestions">
      <li
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.id"
        @click="select(index)"
        :class="{ focused: index === focusedListIndex }"
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
}

.mask {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 25%;
  height: calc(100% - 2px);
  background: linear-gradient(to right, rgba(255, 255, 255, 0), white);
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

import "../../directives/toggleProp";
import "../../directives/navigableList";

export default {
  props: {
    placeholder: {
      type: String,
      default: "Choose an address"
    },
    value: {
      type: Object,
      default: function() {
        return {
          value: "",
          coordinates: {
            lat: 0,
            lng: 0
          }
        };
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
      focusedListIndex: -1
    };
  },

  mounted() {
    this.query = this.value.value;
  },

  watch: {
    displaySuggestions: function(value) {
      this.focusedListIndex = value ? 0 : -1;
    }
  },

  methods: {
    ...mapActions(["reportError"]),

    ...mapActions("address", ["search", "resolve"]),

    onFocus() {
      this.isInputFocused = true;
    },

    onBlur() {
      this.isInputFocused = false;
    },

    onKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();

        if (this.focusedListIndex !== -1) {
          this.select(this.focusedListIndex);
        } else if (this.value.value.length > 0 && this.query !== this.value.value) {
          this.$emit("input", { value: "", coordinates: { lat: 0, lng: 0 } });
        }
      }
    },

    onInput(event) {
      this.suggest(event.target.value);
    },

    suggest: debounce(async function(query) {
      if (query !== this.query) {
        if (query.length > 2) {
          this.suggestions = await this.search(query);
        } else {
          this.suggestions = [];
        }

        this.query = query;

        this.displaySuggestions = this.suggestions.length > 0;
      }
    }, 500),

    async select(index) {
      const suggestion = this.suggestions[index];
      const coords = await this.resolve(suggestion.id);

      if (coords) {
        const value = {
          value: suggestion.address,
          coordinates: coords
        };

        this.$emit("input", value);

        this.query = value.value;
      }

      this.displaySuggestions = false;
    }
  }
};
</script>
