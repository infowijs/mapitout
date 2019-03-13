<template>
  <label ref="rootEl">
    <transition name="minimize">
      <div v-if="isDirty">{{ label }}</div>
    </transition>
    <input type="text" :value="value" @input="onInput" :placeholder="isDirty ? '' : label" />
  </label>
</template>
<style scoped lang="scss">
@import "../../style/variables.scss";

label {
  display: block;
  position: relative;
  padding-top: 12px;
}

div {
  position: absolute;
  z-index: 1;
  font-size: 10px;
  padding: 2px 0 4px 0;
  transform: translateY(-12px);
  color: $greyscale-2;

  &.minimize-enter-active,
  &.minimize-leave-active {
    transition: transform 0.2s ease-in-out, font-size 0.2s ease-in-out;
  }

  &.minimize-enter,
  &.minimize-leave-to {
    font-size: 12px;
    transform: translateY(0);
  }
}

input {
  font-size: 12px;
  padding: 3px 0;
  border-width: 0 0 1px 0;
  color: $greyscale-2;
}
</style>
<script>
export default {
  props: ["label", "value"],
  data() {
    return {
      isDirty: false
    };
  },
  methods: {
    onInput(event) {
      const value = event.target.value;

      this.isDirty = value.length > 0;
    }
  }
};
</script>
