<template>
  <label>
    <icon class="icon" name="icon-time" />
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

label {
  position: relative;
  padding: 0 0 12px 32px;
  display: flex;
  flex-direction: row;
}

.icon {
  position: absolute;
  left: 0;
  top: 0;
}

.rail {
  position: relative;
  z-index: 2;
  height: $slider-thinkness;
  margin: (($handle-height - $slider-thinkness) / 2) 0 (($handle-height - $slider-thinkness) / 2)
    24px;
  width: 100%;
  background-color: $greyscale-2;
  border-radius: 2px;
}

.labels {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 52px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  color: $greyscale-2;
  line-height: 1;
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
import Icon from "../Icon";

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
      return ((this.value - this.minValue) * 100) / this.range;
    }
  },
  data() {
    return {
      initialOffset: undefined,
      minOffset: undefined,
      maxOffset: undefined
    };
  },
  components: {
    Icon
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
      this.minOffset = -handleEl.offsetWidth / 2;
      this.maxOffset = railEl.offsetWidth - handleEl.offsetWidth / 2;
    },

    onHandlePan(event) {
      const handleEl = this.$refs.handle;
      let newOffset = this.initialOffset + event.deltaX;

      if (newOffset < this.minOffset) {
        newOffset = this.minOffset;
      }

      if (this.maxOffset < newOffset) {
        newOffset = this.maxOffset;
      }

      handleEl.style.left = `${newOffset}px`;
    },

    onHandlePanEnd() {
      const handleEl = this.$refs.handle;
      const railEl = this.$refs.rail;

      const newValue =
        this.minValue +
        Math.floor(
          (this.range * (handleEl.offsetLeft + handleEl.offsetWidth / 2)) / railEl.offsetWidth
        );

      this.$emit("input", newValue);
    },

    onRailClick(event) {
      const railEl = this.$refs.rail;
      const width = railEl.offsetWidth;
      const offset = event.offsetX;

      const value = this.minValue + Math.round(this.range * (offset / width));

      this.$emit("input", value);
    }
  }
};
</script>
