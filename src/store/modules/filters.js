export const mutations = {
  select(state, selectedIds) {
    state.filters = state.filters.map(filter => ({
      ...filter,
      selected: selectedIds.includes(filter.id)
    }));
  }
};

export const actions = {
  select({ commit }, filters) {
    commit("select", filters);
  }
};

export default {
  namespaced: true,
  state: {
    filters: [
      {
        id: 1,
        name: "Stations",
        value: "Station",
        category: null,
        root: true,
        propertyId: null,
        selected: false,
        parent: null,
        children: null,
        icon: "icon-bus"
      },
      {
        id: 2,
        name: "Schools",
        value: "School",
        category: null,
        root: true,
        propertyId: null,
        selected: false,
        parent: null,
        children: [4, 5, 6, 7, 8],
        icon: "icon-education"
      },
      {
        id: 3,
        name: "Age Range 4-11",
        value: "Age range 4-11",
        category: "School programs",
        root: false,
        propertyId: 1,
        selected: false,
        parent: 2,
        children: null,
        icon: "icon-education"
      },
      {
        id: 4,
        name: "Age Range 4-18",
        value: "Age range 4-18",
        category: "School programs",
        root: false,
        propertyId: 2,
        selected: false,
        parent: 2,
        children: null,
        icon: "icon-education"
      },
      {
        id: 5,
        name: "Primary Education",
        value: "Primary education",
        category: "School programs",
        root: false,
        propertyId: 3,
        selected: false,
        parent: 2,
        children: null,
        icon: "icon-education"
      },
      {
        id: 6,
        name: "Secondary Education",
        value: "Secondary education",
        category: "School programs",
        root: false,
        propertyId: 4,
        selected: false,
        parent: 2,
        children: null,
        icon: "icon-education"
      },
      {
        id: 7,
        name: "International Schools",
        value: "International schools",
        category: "School system",
        root: false,
        propertyId: 5,
        selected: false,
        parent: 2,
        children: null,
        icon: "icon-education"
      },
      {
        id: 8,
        name: "Dutch Schools",
        value: "Dutch schools",
        category: "School system",
        root: false,
        propertyId: 6,
        selected: false,
        parent: 2,
        children: null,
        icon: "icon-education"
      }
    ]
  },
  mutations,
  actions
};
