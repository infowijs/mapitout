import Vue from "vue";
import Hammer from "hammerjs";

const CLASS_HANDLE_DRAG = "handle-drag";
const STATE_ATTRIBUTE_PREFIX = "data-expandable-state";
const STATE_ATTRIBUTE_ORIGINAL_HEIGHT = `${STATE_ATTRIBUTE_PREFIX}-original-height`;
const STATE_ATTRIBUTE_DRAG_HANDLE_HEIGHT = `${STATE_ATTRIBUTE_PREFIX}-drag-handle-height`;

// todo figure out an appropriate manner to unit test this, if at all unit testable
Vue.directive("app-sidebar", {
  bind(el, binding, vNode) {
    const sidebarHammerInstance = Hammer(el);
    sidebarHammerInstance.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });

    sidebarHammerInstance.on("swipeup", () => {
      vNode.context.sidebarExpanded = true;
    });

    sidebarHammerInstance.on("swipedown", () => {
      vNode.context.sidebarExpanded = false;
    });

    const dragHandle = document.createElement("div");
    dragHandle.classList.add(CLASS_HANDLE_DRAG);
    dragHandle.setAttribute(vNode.context.$options._scopeId, "");

    el.prepend(dragHandle);

    dragHandle.addEventListener("click", () => {
      vNode.context.sidebarExpanded = !vNode.context.sidebarExpanded;
    });

    const dragHandleHammerInstance = Hammer(dragHandle);
    dragHandleHammerInstance.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });

    dragHandleHammerInstance.on("panstart", () => {
      vNode.context.sidebarExpanding = true;
    });

    dragHandleHammerInstance.on("pan", event => {
      const originalHeight = parseInt(el.getAttribute(STATE_ATTRIBUTE_ORIGINAL_HEIGHT));
      const dragHandleHeight = parseInt(el.getAttribute(STATE_ATTRIBUTE_DRAG_HANDLE_HEIGHT));

      let temporaryHeight;

      if (vNode.context.sidebarExpanded) {
        temporaryHeight = window.innerHeight - event.deltaY;
      } else {
        temporaryHeight = originalHeight - event.deltaY;
      }

      if (dragHandleHeight <= temporaryHeight && temporaryHeight <= window.innerHeight) {
        el.style.height = `${temporaryHeight}px`;
      }
    });

    dragHandleHammerInstance.on("panend", () => {
      vNode.context.sidebarExpanding = false;

      if (vNode.context.sidebarExpanded) {
        if (el.offsetHeight <= (3 * window.innerHeight) / 4) {
          vNode.context.sidebarExpanded = false;
        }
      } else {
        if (el.offsetHeight >= window.innerHeight / 3) {
          vNode.context.sidebarExpanded = true;
        }
      }

      vNode.context.sidebarExpanding = false;
      el.style.height = "";
    });
  },

  inserted(el) {
    el.setAttribute(STATE_ATTRIBUTE_ORIGINAL_HEIGHT, el.offsetHeight);
    el.setAttribute(
      STATE_ATTRIBUTE_DRAG_HANDLE_HEIGHT,
      el.querySelector(`.${CLASS_HANDLE_DRAG}`).offsetHeight
    );
  },

  unbind(el) {
    el.removeAttribute(STATE_ATTRIBUTE_ORIGINAL_HEIGHT);

    Hammer.off(el);

    // unlike the element bound events, the drag handle hammer events do not require explicit removal.
    // They die out with the element, whereas on swipe, the element is NOT removed
    el.querySelector(`.${CLASS_HANDLE_DRAG}`).remove();
  }
});
