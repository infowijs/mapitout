<template>
  <label
    ref="rootEl"
    @keydown="onKeyDown"
    v-toggle-prop-on-document-click="{ propName: 'displaySuggestions' }"
  >
    <input
      type="text"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :value="query"
      :placeholder="placeholder"
    />
    <div v-if="!isFocused" class="mask"></div>
    <ul v-if="displaySuggestions" @mouseover="onListMouseOver">
      <li v-for="(suggestion, index) in suggestions" :key="suggestion.id" @click="select(index)">
        <span>{{ suggestion.weergavenaam }}</span>
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
  position: relative;
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

import "../../directives/togglePropOnDocumentClick";

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
      isFocused: false,
      isDirty: false,
      isLoading: false,
      displaySuggestions: false,
      suggestions: []
    };
  },

  mounted() {
    this.query = this.value.value;
  },

  methods: {
    ...mapActions(["reportError"]),

    ...mapActions("address", ["search", "resolve"]),

    onFocus() {
      this.isFocused = true;
    },

    onBlur() {
      this.isFocused = false;
    },

    onListMouseOver(event) {
      const listEl = event.target.closest("li");

      if (listEl && !listEl.classList.contains("focused")) {
        this.$refs.rootEl.querySelectorAll("ul li").forEach(listEl => {
          listEl.classList.remove("focused");
        });

        listEl.classList.add("focused");
      }
    },

    onKeyDown(event) {
      if (!["ArrowUp", "ArrowDown", "Enter", "Esc"].includes(event.key)) {
        return;
      }

      event.preventDefault();

      const suggestionEls = this.$refs.rootEl.querySelectorAll("ul li");

      const currentIndex = Array.prototype.indexOf.call(
        suggestionEls,
        this.$refs.rootEl.querySelector("li.focused")
      );

      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        const minIndex = 0;
        const maxIndex = suggestionEls.length - 1;
        let nextIndex;

        switch (event.key) {
          case "ArrowUp":
            nextIndex =
              currentIndex === -1
                ? minIndex
                : currentIndex - 1 < minIndex
                ? minIndex
                : currentIndex - 1;
            break;
          case "ArrowDown":
            nextIndex =
              currentIndex === -1
                ? minIndex
                : currentIndex + 1 > maxIndex
                ? maxIndex
                : currentIndex + 1;
            break;
        }

        if (currentIndex !== nextIndex) {
          if (currentIndex !== -1) {
            suggestionEls.item(currentIndex).classList.remove("focused");
          }
          suggestionEls.item(nextIndex).classList.add("focused");
        }
      }

      if (event.key === "Enter") {
        if (currentIndex !== -1) {
          this.select(currentIndex);
        } else if (this.query !== this.value.value) {
          this.$emit("input", { value: "", coordinates: null });
        }
      }

      if (event.key === "Esc") {
        this.displaySuggestions = false;
      }
    },

    onInput(event) {
      const value = event.target.value;

      this.isDirty = value.length > 0;

      this.query = value;

      if (value.length > 2) {
        this.suggest(value);
      } else {
        this.suggestions = [];
        this.displaySuggestions = false;
      }
    },

    suggest: debounce(async function(query) {
      this.isLoading = true;

      this.suggestions = await this.search(query);

      this.isLoading = false;

      if (this.suggestions.length > 0) {
        this.displaySuggestions = true;
      }
    }, 500),

    async select(index) {
      const address = this.suggestions[index];
      const coords = await this.resolve(address.id);

      if (coords) {
        const value = {
          value: address.weergavenaam,
          coordinates: coords
        };

        this.query = value.value;

        this.$emit("input", value);
      }

      this.displaySuggestions = false;
    }
  }
};
</script>
