import Vue from "vue";
import Hammer from "hammerjs";

const CLASS_EXPANDED = "expanded";
const CLASS_EXPANDING = "expanding";
const CLASS_HANDLE_DRAG = "handle-drag";

Vue.directive("expandable", {
  bind(el, binding, vNode) {
    const sidebarHammerInstance = Hammer(el);
    sidebarHammerInstance.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });

    sidebarHammerInstance.on("swipeup", () => {
      if (!el.classList.contains(CLASS_EXPANDED)) {
        el.classList.add(CLASS_EXPANDED);
      }
    });

    sidebarHammerInstance.on("swipedown", () => {
      if (el.classList.contains(CLASS_EXPANDED)) {
        el.classList.remove(CLASS_EXPANDED);
      }
    });

    const dragHandle = document.createElement("div");
    dragHandle.classList.add(CLASS_HANDLE_DRAG);
    dragHandle.setAttribute(vNode.context.$options._scopeId, "");

    el.prepend(dragHandle);

    dragHandle.addEventListener("click", () => {
      el.classList.toggle(CLASS_EXPANDED);
    });

    const dragHandleHammerInstance = Hammer(dragHandle);
    dragHandleHammerInstance.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });

    dragHandleHammerInstance.on("panStart", () => {
      el.classList.add(CLASS_EXPANDING);
    });

    const minPanHeight = 100;

    dragHandleHammerInstance.on("pan", panEvent => {
      let temporaryHeight;

      if (el.classList.contains(CLASS_EXPANDED)) {
        temporaryHeight = window.innerHeight - panEvent.deltaY;
      } else {
        temporaryHeight = minPanHeight + Math.abs(panEvent.deltaY);
      }

      if (minPanHeight <= temporaryHeight && temporaryHeight <= window.innerHeight) {
        el.style.height = `${temporaryHeight}px`;
      }
    });

    dragHandleHammerInstance.on("panend", () => {
      if (el.classList.contains(CLASS_EXPANDED)) {
        if (el.offsetHeight <= (3 * window.innerHeight) / 4) {
          el.classList.remove(CLASS_EXPANDED);
        }
      } else {
        if (el.offsetHeight >= window.innerHeight / 3) {
          el.classList.add(CLASS_EXPANDED);
        }
      }

      el.classList.remove(CLASS_EXPANDING);
      el.style.height = "";
    });
  }
});
