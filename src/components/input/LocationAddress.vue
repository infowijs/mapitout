<template>
  <label ref="rootEl" v-on:keyup="onKeyUp">
    <div class="label" :class="{ dirty: isDirty }">{{ isDirty ? label : placeholder }}</div>
    <input ref="input" type="text" :value="query" @input="onInput" />
    <ul v-if="suggestions.length > 0">
      <li v-for="suggestion in suggestions" v-bind:key="suggestion.id">
        <span>{{ suggestion.weergavenaam }}</span>
      </li>
    </ul>
  </label>
</template>
<style scoped lang="scss">
@import "../../style/variables";

$reserved-label: 16px;

label {
  display: block;
  position: relative;
  padding-top: $reserved-label;
  margin-bottom: $reserved-label;
  color: $greyscale-1;
}

div {
  position: absolute;
  top: $reserved-label + 1px;
  z-index: 1;
  font-size: 16px;
  line-height: 22px;
  padding: 3px 4px;
  color: $greyscale-2;
  transition: transform 0.1s ease-in-out, font-size 0.1s ease-in-out, color 0.1s ease-in-out;

  &.dirty {
    font-size: 12px;
    line-height: $reserved-label;
    color: $greyscale-1;
    transform: translateY(-$reserved-label);
  }
}

input {
  font-size: 16px;
  line-height: 22px;
  padding: 3px 4px;
  border-width: 0 0 1px 0;
  border-color: $greyscale-1;
  color: $greyscale-1;
  width: calc(100% - 8px);
}
ul {
  position: absolute;
  top: 100%;
  width: calc(100% - 2px);
  border-width: 0 1px 1px 1px;
  border-style: solid;
  border-color: $greyscale-1;
  background-color: white;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 4px 8px;

    &.focused {
      background-color: $greyscale-2;
    }
  }
}
</style>
<script>
import { debounce } from "lodash";

export default {
  props: {
    label: {
      type: String,
      default: "Address"
    },
    placeholder: {
      type: String,
      default: "Choose an address"
    },
    datasource: {
      type: String,
      default: "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest"
    },
    value: String
  },
  data() {
    return {
      query: "",
      isDirty: false,
      isLoading: false,
      suggestions: []
    };
  },
  methods: {
    onInput(event) {
      const value = event.target.value;

      this.isDirty = value.length > 0;

      this.$refs.input.focus();

      if (value.length === 0) {
        this.$emit("input", value);
      } else if (value.length >= 3) {
        this.query = value;
      }
    },

    onKeyUp(event) {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          break;
        case "ArrowDown":
          event.preventDefault();
          break;
        case "Enter":
          event.preventDefault();
          break;
      }
    },

    async suggest(query) {
      this.suggestions = await this.fetchSuggestions(query);

      console.log(this.suggestions);
    },

    async fetchSuggestions(query) {
      const url = new URL(this.datasource);

      url.searchParams.append("fq", "type:adres");
      url.searchParams.append("q", query);
      url.searchParams.append("rows", 5);

      const request = {
        method: "GET"
      };

      this.isLoading = true;
      const response = await fetch(url, request);

      if (!response.ok) {
        this.isLoading = false;
        throw new Error(response.statusText);
      }

      try {
        const result = await response.json();
        return result.response.docs;
      } catch (error) {
        throw new Error("Invalid response format");
      } finally {
        this.isLoading = false;
      }
    }
  },
  watch: {
    query: debounce(function(query) {
      this.suggest(query);
    }, 500)
  }
};
</script>
