import Vue from "vue";

Vue.directive("navigable-container", {
  bind(el, binding, vNode) {
    const cursorPropName = binding.value.cursorPropName;

    el.addEventListener("mouseover", event => {
      const hoveredListItemEl = event.target.closest("li");

      if (hoveredListItemEl && el.contains(hoveredListItemEl)) {
        el.querySelectorAll("li").forEach((listItemEl, index) => {
          if (listItemEl === hoveredListItemEl) {
            vNode.context[cursorPropName] = index;
          }
        });
      } else {
        vNode.context[cursorPropName] = -1;
      }
    });

    el.addEventListener("keydown", event => {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const minIndex = 0;
        const maxIndex = el.querySelectorAll("li").length - 1;
        const currentIndex = vNode.context[cursorPropName];

        let nextIndex;

        if (currentIndex === -1) {
          nextIndex = minIndex;
        } else {
          const currentItem = el.querySelectorAll("li").item(currentIndex);

          switch (event.key) {
            case "ArrowUp":
              if (currentItem.previousSibling) {
                nextIndex = currentIndex - 1;
              } else {
                nextIndex = minIndex;
              }
              break;
            case "ArrowDown":
              if (currentItem.nextSibling) {
                nextIndex = currentIndex + 1;
              } else {
                nextIndex = maxIndex;
              }
              break;
          }
        }

        vNode.context[cursorPropName] = nextIndex;
      }
    });
  }
});
