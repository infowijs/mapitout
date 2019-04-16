export const actions = {
  network(context, error) {
    console.error(error);
  },

  generic(context, error) {
    console.error(error);
  }
};

export default {
  namespaced: true,
  actions
};
