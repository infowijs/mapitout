<template>
  <div class="filter" @click="$emit('click')">
    <component :is="filter.icon" class="icon" />
    <span class="name">{{ filter.name }}</span>
    <button class="toggle" :class="{ selected: filter.selected }" @click="onClickToggle"></button>
  </div>
</template>
<style lang="scss" scoped>
@import "../../style/variables.scss";

.filter {
  display: flex;
  align-items: center;
}

.icon {
  width: 28px;
  height: 28px;
  margin-right: 16px;
}

.name {
  flex-grow: 1;
  font-size: 14px;
}

.toggle {
  position: relative;
  height: 28px;
  width: 50px;
  border: 0 none;
  background-color: rgba($greyscale-1, 0.2);
  outline: none;
  cursor: pointer;
  border-radius: 14px;
  transition: background-color 0.1s ease-in-out;

  &::after {
    content: " ";
    display: block;
    background-color: white;
    width: 22px;
    height: 22px;
    border-radius: 11px;
    position: absolute;
    left: 3px;
    top: 3px;
    transition: transform 0.1s ease-in-out;
  }

  &.selected {
    background-color: $greyscale-1;

    &::after {
      transform: translateX(22px);
    }
  }
}
</style>
<script>
import IconBus from "@/assets/icons/IconBus.svg?inline";
import IconTrain from "@/assets/icons/IconTrain.svg?inline";
import IconTram from "@/assets/icons/IconTram.svg?inline";
import IconSubway from "@/assets/icons/IconSubway.svg?inline";
import IconEducation from "@/assets/icons/IconEducation.svg?inline";

export default {
  components: {
    IconBus,
    IconTrain,
    IconTram,
    IconSubway,
    IconEducation
  },

  props: {
    filter: Object
  },

  methods: {
    onClickToggle(event) {
      event.stopPropagation();

      this.$emit("toggle", this.filter, !this.filter.selected);
    }
  }
};
</script>
