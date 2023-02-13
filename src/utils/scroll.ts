interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window | Document;
  /** Scroll end callback */
  callback?: () => any;
  /** Animation duration, default as 450 */
  duration?: number;
}

export default function scrollTo(y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options;
  const container = getContainer();
  // eslint-disable-next-line no-use-before-define
  const scrollTop = getScroll(container, true);
  const startTime = Date.now();

  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    // eslint-disable-next-line no-use-before-define
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);
    // eslint-disable-next-line no-use-before-define
    if (isWindow(container)) {
      (container as Window).scrollTo(window.pageXOffset, nextScrollTop);
    } else if (container instanceof HTMLDocument || container.constructor.name === 'HTMLDocument') {
      (container as HTMLDocument).documentElement.scrollTop = nextScrollTop;
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop;
    }
    if (time < duration) {
      // eslint-disable-next-line no-use-before-define
      raf(frameFunc);
    } else if (typeof callback === 'function') {
      callback();
    }
  };
  // eslint-disable-next-line no-use-before-define
  raf(frameFunc);
}
export function isWindow(obj: any) {
  return obj !== null && obj !== undefined && obj === obj.window;
}

export function getScroll(target: HTMLElement | Window | Document | null, top: boolean): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  const method = top ? 'scrollTop' : 'scrollLeft';
  let result = 0;
  if (isWindow(target)) {
    result = (target as Window)[top ? 'pageYOffset' : 'pageXOffset'];
  } else if (target instanceof Document) {
    result = target.documentElement[method];
  } else if (target) {
    result = (target as HTMLElement)[method];
  }
  if (target && !isWindow(target) && typeof result !== 'number') {
    result = ((target as HTMLElement).ownerDocument || (target as Document)).documentElement?.[method];
  }
  return result;
}
export function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }
  // eslint-disable-next-line no-return-assign
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
}

// eslint-disable-next-line no-undef
let raf = (callback: FrameRequestCallback) => setTimeout(callback, 16) as any;
let caf = (num: number) => clearTimeout(num);

if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
  // eslint-disable-next-line no-undef
  raf = (callback: FrameRequestCallback) => window.requestAnimationFrame(callback);
  caf = (handle: number) => window.cancelAnimationFrame(handle);
}

let rafUUID = 0;
const rafIds = new Map<number, number>();

function cleanup(id: number) {
  rafIds.delete(id);
}

export function wrapperRaf(callback: () => void, times = 1): number {
  rafUUID += 1;
  const id = rafUUID;

  function callRef(leftTimes: number) {
    if (leftTimes === 0) {
      // Clean up
      cleanup(id);

      // Trigger
      callback();
    } else {
      // Next raf
      const realId = raf(() => {
        callRef(leftTimes - 1);
      });

      // Bind real raf id
      rafIds.set(id, realId);
    }
  }

  callRef(times);

  return id;
}

wrapperRaf.cancel = (id: number) => {
  const realId = rafIds.get(id);
  cleanup(realId);
  return caf(realId);
};
