import Vue from "vue";

Vue.directive("navigable-list", {
  bind(el, binding, vNode) {
    const focusedIndexPropName = binding.value.focusedIndexPropName;
    const focusedItemClassName = binding.value.focusedItemClassName;

    el.addEventListener("mouseover", event => {
      const hoveredListItemEl = event.target.closest("li");

      if (hoveredListItemEl && el.contains(hoveredListItemEl)) {
        el.querySelectorAll("li").forEach((listItemEl, index) => {
          if (listItemEl === hoveredListItemEl) {
            listItemEl.classList.add(focusedItemClassName);

            vNode.context[focusedIndexPropName] = index;
          } else {
            listItemEl.classList.remove(focusedItemClassName);
          }
        });
      } else {
        vNode.context[focusedIndexPropName] = -1;
      }
    });

    el.addEventListener("keydown", event => {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const minIndex = 0;
        const maxIndex = el.querySelectorAll("li").length - 1;
        const currentIndex = vNode.context[focusedIndexPropName];

        let nextIndex;

        if (currentIndex === -1) {
          nextIndex = minIndex;
        } else {
          switch (event.key) {
            case "ArrowUp":
              if (el.querySelectorAll("li").item(currentIndex).previousSibling) {
                nextIndex = currentIndex - 1;
              } else {
                nextIndex = minIndex;
              }
              break;
            case "ArrowDown":
              if (el.querySelectorAll("li").item(currentIndex).nextSibling) {
                nextIndex = currentIndex + 1;
              } else {
                nextIndex = maxIndex;
              }
              break;
          }
        }

        vNode.context[focusedIndexPropName] = nextIndex;
      }
    });
  }
});
