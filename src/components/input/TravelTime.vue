<template>
  <label>
    <div ref="rail" class="rail" @click="onRailClick">
      <div
        ref="handle"
        @click.stop
        class="handle"
        :style="{ left: `calc(${handleOffsetX}% - 6px)` }"
      ></div>
    </div>
    <div class="labels">
      <span class="min">{{ minValue }}</span>
      <span class="max">{{ maxValue }}</span>
    </div>
  </label>
</template>
<style scoped lang="scss">
@import "../../style/variables";

$slider-thinkness: 4px;
$handle-height: 24px;

.rail {
  position: relative;
  z-index: 2;
  height: $slider-thinkness;
  margin: (($handle-height - $slider-thinkness) / 2) 0;
  width: 100%;
  background-color: $greyscale-2;
  border-radius: 2px;
}

.labels {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.handle {
  position: absolute;
  width: 12px;
  height: $handle-height;
  border-radius: 3px;
  background-color: $greyscale-1;
  top: -($handle-height - $slider-thinkness) / 2;
}
</style>
<script>
import Hammer from "hammerjs";

export default {
  props: {
    minValue: {
      type: Number,
      default: 5
    },
    maxValue: {
      type: Number,
      default: 90
    },
    value: Number,
    default: function() {
      return 45;
    }
  },
  computed: {
    range: function() {
      return this.maxValue - this.minValue;
    },
    handleOffsetX: function() {
      console.log(this.value);
      return (this.value * 100) / this.range;
    }
  },
  mounted() {
    const handleHammerInstance = Hammer(this.$refs.handle);

    handleHammerInstance.get("pan").set({ direction: Hammer.DIRECTION_HORIZONTAL });

    handleHammerInstance.on("panstart", this.onHandlePanStart);

    handleHammerInstance.on("pan", this.onHandlePan);

    handleHammerInstance.on("panend", this.onHandlePanEnd);
  },
  methods: {
    onHandlePanStart() {
      const handleEl = this.$refs.handle;
      const railEl = this.$refs.rail;

      this.initialOffset = handleEl.offsetLeft;
      this.minOffset = handleEl.offsetWidth / 2;
      this.maxOffset = railEl.offsetWidth - handleEl.offsetWidth / 2;
    },

    onHandlePan(event) {
      const handleEl = this.$refs.handle;
      const newOffset = this.initialOffset + event.deltaX;

      if (this.minOffset <= newOffset && newOffset <= this.maxOffset) {
        handleEl.style.left = `${newOffset}px`;
      }
    },

    onHandlePanEnd() {
      const handleEl = this.$refs.handle;
      const railEl = this.$refs.rail;

      const newValue = Math.floor(
        (this.range * (handleEl.offsetLeft + handleEl.offsetWidth / 2)) / railEl.offsetWidth
      );

      this.$emit("input", newValue);
    },

    onRailClick(event) {
      const railEl = this.$refs.rail;
      const width = railEl.offsetWidth;
      const offset = event.offsetX;

      const value = Math.round(this.range * (offset / width));

      this.$emit("input", value);
    }
  }
};
</script>
