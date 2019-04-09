export const mutations = {
  toggle(state, { id, selected }) {
    state.filters = state.filters.map(filter => {
      if (filter.id !== id && filter.parent !== id) {
        return filter;
      }

      return { ...filter, selected };
    });
  }
};

export const actions = {
  toggle({ commit }, payload) {
    commit("toggle", payload);
  }
};

export default {
  namespaced: true,
  state: {
    filters: [
      {
        id: 0,
        name: "Stations",
        value: "Station",
        category: null,
        root: true,
        selected: false,
        parent: null,
        children: null,
        icon: "icon-bus"
      },
      // {
      //   id: 9,
      //   name: "Train Station",
      //   value: "Train Station",
      //   category: null,
      //   root: false,
      //   selected: false,
      //   parent: 0,
      //   children: null,
      //   icon: "icon-train"
      // },
      // {
      //   id: 2,
      //   name: "Bus Station",
      //   value: "Bus Station",
      //   category: null,
      //   root: false,
      //   selected: false,
      //   parent: 0,
      //   children: null,
      //   icon: "icon-bus"
      // },
      // {
      //   id: 1,
      //   name: "Tram Station",
      //   value: "Tram Station",
      //   category: null,
      //   root: false,
      //   selected: false,
      //   parent: 0,
      //   children: null,
      //   icon: "icon-tram"
      // },
      // {
      //   id: 10,
      //   name: "Subway Station",
      //   value: "Subway Station",
      //   category: null,
      //   root: false,
      //   selected: false,
      //   parent: 0,
      //   children: null,
      //   icon: "icon-subway"
      // },
      {
        id: 3,
        name: "Schools",
        value: "School",
        category: null,
        root: true,
        selected: false,
        parent: null,
        children: [4, 5, 6, 7, 8],
        icon: "icon-education"
      },
      {
        id: 4,
        name: "Age range 4-11",
        value: "Age range 4-11",
        category: null,
        root: false,
        selected: false,
        parent: 3,
        children: null,
        icon: "icon-education"
      },
      {
        id: 5,
        name: "Age range 4-18",
        value: "Age range 4-18",
        category: null,
        root: false,
        selected: false,
        parent: 3,
        children: null,
        icon: "icon-education"
      },
      {
        id: 6,
        name: "Primary education",
        value: "Primary education",
        category: null,
        root: false,
        selected: false,
        parent: 3,
        children: null,
        icon: "icon-education"
      },
      {
        id: 7,
        name: "Secondary education",
        value: "Secondary education",
        category: null,
        root: false,
        selected: false,
        parent: 3,
        children: null,
        icon: "icon-education"
      }
    ]
  },
  mutations,
  actions
};
