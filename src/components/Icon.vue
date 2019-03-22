<template>
  <component :is="this.name" />
</template>
<script>
import IconBicycle from "./icons/IconBicycle";
import IconBicycleBus from "./icons/IconBicycleBus";
import IconBus from "./icons/IconBus";
import IconCar from "./icons/IconCar";
import IconPedestrian from "./icons/IconPedestrian";
import IconTime from "./icons/IconTime";

export default {
  props: {
    name: {
      type: String,
      required: true,
      validator: value =>
        ["bicycle", "bicycle-bus", "bus", "car", "pedestrian", "icon-time"].includes(value)
    }
  },
  components: {
    bicycle: IconBicycle,
    "bicycle-bus": IconBicycleBus,
    bus: IconBus,
    car: IconCar,
    pedestrian: IconPedestrian,
    "icon-time": IconTime
  }
};
</script>
