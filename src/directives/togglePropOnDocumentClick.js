import Vue from "vue";

const clickHandlers = new WeakMap();

Vue.directive("toggle-prop-on-document-click", {
  bind: function(el, binding, vNode) {
    const propName = binding.value.propName;

    const onDocumentClick = event => {
      if (!el.contains(event.target) && vNode.context[propName]) {
        vNode.context[propName] = false;
      }
    };

    clickHandlers.set(el, onDocumentClick);

    document.addEventListener("click", onDocumentClick);
  },

  unbind: function(el) {
    clickHandlers.delete(el);
  }
});
