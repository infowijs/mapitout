<template>
  <div class="panel panel-details">
    <div class="header">
      <div class="title">
        <button class="back" @click="onClickBack">
          <icon-arrow-left class="icon" />
        </button>
        <span v-if="details">{{ details.name }}</span>
      </div>
    </div>
    <div class="body">
      <p class="description" v-if="!details">Unable to retrieve location details</p>
      <dl class="details" v-if="details">
        <dd>
          <span>{{ details.description }}</span>
        </dd>
        <dd>
          <icon-poi class="icon icon-poi" />
          <span>{{ details.address }}</span>
        </dd>
        <dd v-if="details.website">
          <icon-website class="icon icon-website" />
          <a :href="details.website" :title="details.name" target="_blank">{{ details.website }}</a>
        </dd>
        <dd v-if="details.phone">
          <icon-phone class="icon icon-phone" />
          <a :href="details.phone" :title="`Call ${details.name}`">{{ details.phone }}</a>
        </dd>
      </dl>
    </div>
    <div class="footer">
      <button class="range">
        <icon-area class="icon" />
        <span>Range</span>
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables.scss";

.body {
  padding: 16px 24px;
  font-size: 14px;
}

.footer {
  padding: 0 24px 24px 24px;
}

.icon-poi,
.icon-website,
.icon-phone {
  color: $greyscale-1;
}

.icon-poi {
  width: 16px;
}

.icon-phone {
  width: 16px;
}

.icon-website {
  width: 16px;
}

.description {
  margin: 0;
}

.back {
  background-color: transparent;
  border: 0 none;
  outline: none;
}

.range {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 auto;
  border: 1px solid lighten($greyscale-1, 25);
  background-color: white;
  padding: 8px 16px;
  cursor: pointer;
  color: lighten($greyscale-1, 25);

  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  &:hover {
    color: $greyscale-1;
    border-color: $greyscale-1;
  }
}

.details {
  align-self: stretch;
  padding: 16px;
  background-color: $greyscale-2;

  dd {
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 1;

    .icon {
      margin-right: 16px;
    }

    a,
    span {
      color: $greyscale-1;
    }

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
<script>
import IconArrowLeft from "@/assets/icons/IconArrowLeft.svg?inline";
import IconPoi from "@/assets/icons/IconPoi.svg?inline";
import IconWebsite from "@/assets/icons/IconWebsite.svg?inline";
import IconPhone from "@/assets/icons/IconPhone.svg?inline";
import IconArea from "@/assets/icons/IconArea.svg?inline";
import { mapActions } from "vuex";

export default {
  components: {
    IconArrowLeft,
    IconPhone,
    IconWebsite,
    IconPoi,
    IconArea
  },

  data() {
    return {
      details: null
    };
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.poi !== from.params.poi) {
      await this.setDetails(to.params.poi);
    }

    next();
  },

  async created() {
    await this.setDetails(this.$route.params.poi);
  },

  methods: {
    ...mapActions("pois", {
      lookupPoi: "lookup"
    }),

    onClickBack() {
      this.$router.back();
    },

    async setDetails(poiName) {
      this.details = await this.lookupPoi(poiName);
    }
  }
};
</script>
