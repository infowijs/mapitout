import Vue from "vue";

export const documentClickHandlers = new WeakMap();

Vue.directive("overlay-container", {
  bind: function(el, binding, vNode) {
    const togglePropName = binding.value.togglePropName;

    const onDocumentClick = event => {
      if (!el.contains(event.target) && vNode.context[togglePropName]) {
        vNode.context[togglePropName] = false;
      }
    };
    documentClickHandlers.set(el, onDocumentClick);

    document.addEventListener("click", onDocumentClick);

    el.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        vNode.context[togglePropName] = false;
      }
    });
  },

  unbind: function(el) {
    document.removeEventListener("click", documentClickHandlers.get(el));

    documentClickHandlers.delete(el);
  }
});
