<template>
  <div class="range" :class="{ collapsed: collapsed }" @click="$emit('click', $event, value.id)">
    <ul class="edit" v-if="!collapsed">
      <li class="item origin">
        <location
          class="input"
          v-model="origin"
          :isDisabled="isDisabled"
          :types="originTypes"
          :lookup-address="lookupAddress"
          @input="onLocationInput"
        />
      </li>
      <li class="item transport-method">
        <transport-type
          class="input"
          :isDisabled="isDisabled"
          v-model="transportTypeId"
          :options="transportTypes"
          @input="onTransportTypeInput"
        />
      </li>
      <li class="item travel-time">
        <travel-time
          class="input"
          :isDisabled="isDisabled"
          v-model="travelTime"
          @input="onTravelTimeInput"
        />
      </li>
    </ul>
    <div class="summary" v-if="collapsed">
      <div class="values">
        <component
          class="location-type"
          :is="getOriginIconComponentByOriginTypeId(origin.typeId)"
        />
        <span class="location-address">{{ origin.address || "Adress..." }}</span>
        <component class="transport-method" :is="getTransportIconComponentById(transportTypeId)" />
        <span class="travel-time">{{ travelTime }}m</span>
      </div>
      <button class="delete" @click.stop="$emit('remove', $event, value.id)">
        <icon-delete class="icon" />
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.range {
  &.collapsed:hover {
    border-bottom: 2px solid $greyscale-2;
  }
}

.edit {
  position: relative;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  list-style: none;

  .item {
    height: 80px;
    padding: 0 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 1;
    order: 2;

    .input {
      flex-grow: 1;
    }
  }

  .origin {
    background-color: $greyscale-2;
    z-index: 2;
  }

  .transport-method {
    flex-grow: 1;
    background-color: $greyscale-2;
  }

  .travel-time {
    box-shadow: inset 0 -1px 2px 0 darken($greyscale-2, 20);
    background-color: darken($greyscale-2, 10);
  }
}
.summary {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
  padding: 0 32px;
  margin: 0;
  list-style: inside none;

  .values {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 1;
  }

  .location-type {
    width: 28px;
    height: 28px;
    padding-right: 16px;
  }

  .location-address {
    flex-grow: 1;
    font-size: 13px;
    margin-left: 16px;
    color: darken($greyscale-2, 40);
  }

  .transport-method {
    height: 28px;
    margin-left: 16px;
    color: darken($greyscale-2, 40);
  }

  .travel-time {
    font-size: 11px;
    color: darken($greyscale-2, 40);
  }

  .delete {
    border: 0 none;
    outline: 0 none;
    background: transparent;
    cursor: pointer;
    margin-left: 16px;
    padding: 0;

    .icon {
      display: block;
      width: 24px;
      height: 24px;
      color: lighten($greyscale-1, 25);
    }

    &:hover {
      .icon {
        color: $greyscale-1;
      }
    }
  }
}
</style>
<script>
import Location from "../Location";
import TransportType from "../TransportType";
import TravelTime from "./TravelTime";
import IconDelete from "@/assets/icons/IconDelete.svg?inline";
import IconHome from "@/assets/icons/IconHome.svg?inline";
import IconTransport from "@/assets/icons/IconBus.svg?inline";
import IconHealth from "@/assets/icons/IconHealth.svg?inline";
import IconWork from "@/assets/icons/IconWork.svg?inline";
import IconEducation from "@/assets/icons/IconEducation.svg?inline";
import IconWellness from "@/assets/icons/IconWellness.svg?inline";
import IconTransportBicycle from "@/assets/icons/IconTransportBicycle.svg?inline";
import IconTransportBicycleBus from "@/assets/icons/IconTransportBicycleBus.svg?inline";
import IconTransportBus from "@/assets/icons/IconTransportBus.svg?inline";
import IconTransportCar from "@/assets/icons/IconTransportCar.svg?inline";
import IconTransportPedestrian from "@/assets/icons/IconTransportPedestrian.svg?inline";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {
    Location,
    TransportType,
    TravelTime,
    IconHome,
    IconTransport,
    IconHealth,
    IconWork,
    IconEducation,
    IconWellness,
    IconDelete,
    IconTransportBicycle,
    IconTransportBicycleBus,
    IconTransportBus,
    IconTransportCar,
    IconTransportPedestrian
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        id: 0,
        travelTime: 45,
        transportTypeId: 0,
        departureTime: new Date().toISOString(),
        originTypeId: 0,
        originId: "",
        origin: ""
      })
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      transportTypeId: this.value.transportTypeId,
      travelTime: this.value.travelTime,
      origin: {
        typeId: this.value.originTypeId,
        addressId: this.value.originId,
        address: this.value.origin
      }
    };
  },
  computed: {
    ...mapState("origins", {
      originTypes: state => state.types
    }),
    ...mapState("transports", {
      transportTypes: state => state.types
    }),
    ...mapGetters("origins", ["getOriginIconComponentByOriginTypeId"]),
    ...mapGetters("transports", ["getTransportIconComponentById"])
  },
  watch: {
    value: function(value) {
      this.transportTypeId = this.value.transportTypeId;
      this.travelTime = this.value.travelTime;

      this.origin = {
        typeId: value.originTypeId,
        addressId: value.originId,
        address: value.origin
      };
    }
  },
  methods: {
    ...mapActions("origins", {
      lookupAddress: "lookup"
    }),

    onLocationInput(origin) {
      this.$emit("input", {
        ...this.value,
        originTypeId: origin.typeId,
        originId: origin.addressId,
        origin: origin.address
      });
    },

    onTransportTypeInput(transportTypeId) {
      this.$emit("input", { ...this.value, transportTypeId });
    },

    onTravelTimeInput(travelTime) {
      this.$emit("input", {
        ...this.value,
        travelTime,
        departureTime: this.getDepartureTime(new Date()).toISOString()
      });
    },

    getDepartureTime(date) {
      const dayOfWeek = date.getUTCDay();

      if (dayOfWeek !== 1) {
        const dayOfMonth = date.getUTCDate();

        date.setUTCDate(dayOfMonth - dayOfWeek + 8);
      }

      date.setUTCHours(9, 0, 0, 0);

      return date;
    }
  }
};
</script>
