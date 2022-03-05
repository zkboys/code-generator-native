import Storage from './Storage';

export function toLogin() {
  // TODO
}

export const storage = new Storage();

/**
 * 获取一个元素距离浏览器顶部高度
 * @param element
 * @returns {number | Requireable<number>}
 */
export function getElementTop(element) {
  if (!element) return 0;
  let actualTop = element.offsetTop;
  let current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
}


/**
 * 获取浏览器滚动条宽度
 * @returns {number}
 */
export function getScrollBarWidth() {
  let scrollDiv = document.createElement('div');
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  let scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  window.document.body.removeChild(scrollDiv);
  return scrollBarWidth;
}



/**
 * 格式化字符串
 * @param str  eg: /front/pages/{module-name}/index.jsx
 * @param data eg: {'module-name': 'user-center'}
 * @returns {string}  eg: /front/pages/user-center/index.jsx
 */
export function stringFormat(str, data) {
  if (!str || typeof str !== 'string' || !data) return str;

  return Object.entries(data)
    .reduce((prev, curr) => {
      const [key, value] = curr;
      const reg = new RegExp('({)?\\{' + key + '\\}(?!})', 'gm');
      return prev.replace(reg, value);
    }, str);
}

/**
 * 获取光标在input中的位置
 * @param input
 * @returns {{start: boolean, end: boolean, position: number}|{start: boolean, end: boolean, position: *}}
 */
export function getCursorPosition(input) {
  let position = 0;
  let start = false;
  let end = false;

  if (!input) return {
    start,
    end,
    position,
  };

  if (typeof input.selectionStart == 'number') { // 非IE浏览器
    position = input.selectionStart;
  } else { // IE
    const range = document.selection?.createRange();
    if (!range) return;
    range.moveStart('character', -input.value.length);
    position = range.text.length;
  }

  start = position === 0;
  end = position === input?.value.length;

  return {
    start,
    end,
    position,
  };
}

/**
 * 触发window的热size事件
 */
export function triggerWindowResize() {
  // 触发 window resize 事件，重新调整页面高度
  if (document.createEvent) {
    const ev = document.createEvent('HTMLEvents');
    ev.initEvent('resize', true, true);
    window.dispatchEvent(ev);
  } else if (document.createEventObject) {
    window.fireEvent('onresize');
  }
}
