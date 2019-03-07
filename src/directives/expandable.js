import Vue from "vue";
import Hammer from "hammerjs";

const CLASS_EXPANDED = "expanded";
const CLASS_EXPANDING = "expanding";
const CLASS_HANDLE_DRAG = "handle-drag";
const STATE_ATTRIBUTE_PREFIX = "data-expandable-state";
const STATE_ATTRIBUTE_ORIGINAL_HEIGHT = `${STATE_ATTRIBUTE_PREFIX}-original-height`;
const STATE_ATTRIBUTE_DRAG_HANDLE_HEIGHT = `${STATE_ATTRIBUTE_PREFIX}-drag-handle-height`;

function onSwipeUp(event) {
  const el = event.target;

  if (!el.classList.contains(CLASS_EXPANDED)) {
    el.classList.add(CLASS_EXPANDED);
  }
}

function onSwipeDown(event) {
  const el = event.target;

  if (el.classList.contains(CLASS_EXPANDED)) {
    el.classList.remove(CLASS_EXPANDED);
  }
}

// todo figure out an appropriate manner to unit test this, if at all unit testable
Vue.directive("expandable", {
  bind(el, binding, vNode) {
    const sidebarHammerInstance = Hammer(el);
    sidebarHammerInstance.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });

    sidebarHammerInstance.on("swipeup", onSwipeUp);

    sidebarHammerInstance.on("swipedown", onSwipeDown);

    const dragHandle = document.createElement("div");
    dragHandle.classList.add(CLASS_HANDLE_DRAG);
    dragHandle.setAttribute(vNode.context.$options._scopeId, "");

    el.prepend(dragHandle);

    dragHandle.addEventListener("click", () => {
      el.classList.toggle(CLASS_EXPANDED);
    });

    const dragHandleHammerInstance = Hammer(dragHandle);
    dragHandleHammerInstance.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });

    dragHandleHammerInstance.on("panstart", () => {
      el.classList.add(CLASS_EXPANDING);
    });

    dragHandleHammerInstance.on("pan", event => {
      const originalHeight = parseInt(el.getAttribute(STATE_ATTRIBUTE_ORIGINAL_HEIGHT));
      const dragHandleHeight = parseInt(el.getAttribute(STATE_ATTRIBUTE_DRAG_HANDLE_HEIGHT));

      let temporaryHeight;

      if (el.classList.contains(CLASS_EXPANDED)) {
        temporaryHeight = window.innerHeight - event.deltaY;
      } else {
        temporaryHeight = originalHeight - event.deltaY;
      }

      if (dragHandleHeight <= temporaryHeight && temporaryHeight <= window.innerHeight) {
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

    Hammer.off(el, "swipeup", onSwipeUp);
    Hammer.off(el, "swipedown", onSwipeDown);

    // unlike the element bound events, the drag handle hammer events do not require explicit removal.
    // They die out with the element, whereas on swipe, the element is NOT removed
    el.querySelector(`.${CLASS_HANDLE_DRAG}`).remove();
  }
});
