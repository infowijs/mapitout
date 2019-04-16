import Vue from "vue";
import Router from "vue-router";

import RangesPanel from "./components/RangesPanel";
import DetailsPanel from "./components/DetailsPanel";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      redirect: { path: "/ranges" }
    },
    {
      path: "/ranges",
      name: "ranges",
      component: RangesPanel
    },
    {
      path: "/details/:poi",
      name: "details",
      component: DetailsPanel
    }
  ]
});

export default router;
