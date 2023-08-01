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

export function getNextTabIndex(e, options) {
    const { tabIndex, columnIndex, totalColumn, totalRow, rowIndex } = options;
    const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = e;
    const enterKey = keyCode === 13;

    const isDelete = (ctrlKey || metaKey) && shiftKey && enterKey;

    if ((ctrlKey || shiftKey || altKey || metaKey) && !isDelete) return;

    const isUp = keyCode === 38;
    const isRight = keyCode === 39;
    const isDown = keyCode === 40 || keyCode === 13;
    const isLeft = keyCode === 37;

    // 移动光标
    const cursorPosition = getCursorPosition(e.target);
    if (isLeft && !cursorPosition.start) return;
    if (isRight && !cursorPosition.end) return;

    const columnStartTabIndex = columnIndex * totalRow;
    const columnEndTabIndex = (columnIndex + 1) * totalRow - 1;

    let nextTabIndex;
    let isAdd;

    if (isUp) {
        // 到顶了
        if (tabIndex === columnStartTabIndex) return;

        nextTabIndex = tabIndex - 1;
    }

    if (isRight) {
        // 右侧
        if (columnIndex === totalColumn - 1) {
            // 右下角
            if (tabIndex === columnEndTabIndex) {
                isAdd = true;
                nextTabIndex = totalRow;
            } else {
                // 选中下一行第一个
                nextTabIndex = rowIndex + 1;
            }
        } else {
            // 选择右侧一个
            nextTabIndex = tabIndex + totalRow;
        }
    }

    if (isDown) {
        if (tabIndex === columnEndTabIndex) {
            isAdd = true;
            nextTabIndex = tabIndex + columnIndex + 1;
        } else {
            nextTabIndex = tabIndex + 1;
        }
    }

    if (isLeft) {
        // 左上角
        if (tabIndex === columnStartTabIndex && columnIndex === 0) return;

        // 左侧第一列继续左移动，选中上一行最后一个
        if (columnIndex === 0) nextTabIndex = totalRow * (totalColumn - 1) + (rowIndex - 1);

        // 选择前一个
        if (columnIndex !== 0) nextTabIndex = tabIndex - totalRow;
    }

    if (isDelete) {
        isAdd = false;

        if (tabIndex === columnEndTabIndex) {
            nextTabIndex = (totalRow - 1) * columnIndex + (rowIndex - 1);
        } else {
            nextTabIndex = (totalRow - 1) * columnIndex + (rowIndex + 1) - 1;
        }
    }

    return {
        isAdd,
        isDelete,
        nextTabIndex,
    };
}

export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

/**
 * 获取所有文件，包含子文件
 * @param files
 * @param templateOptions
 * @param moduleNames
 * @param moduleChineseName
 * @returns {*}
 */
export function getFiles({files, templateOptions, moduleNames = null, moduleChineseName, projectNames}) {
    return files.map(item => {
        let { templateId, targetPath, options } = item;
        const template = templateOptions.find(item => item.value === templateId)?.record;

        // 批量生成时候，moduleNames没传递，取原始targetPath
        if (!moduleNames) targetPath = template.targetPath;

        const filePaths = targetPath.split('/');
        filePaths.pop();
        const parentPath = filePaths.join('/');
        filePaths.pop();
        const __parentPath = filePaths.join('/');
        const extraFiles = template?.extraFiles || [];

        if (extraFiles) {
            const extraFilesList = extraFiles.map(it => {
                const targetPath = stringFormat(it.targetPath, { ...moduleNames, ...projectNames, parentPath, __parentPath, moduleChineseName });

                return {
                    parentTemplateId: templateId,
                    templateId: it.id,
                    targetPath,
                    options, // 使用父级模版的optins
                };
            });
            return [{ ...item, targetPath }, ...extraFilesList];
        }

        return { ...item, targetPath };
    }).flat();
}


export function compose(...fns) {
    fns = fns.reverse();
    return function(...args) {
        let [firstFn, ...restFn] = fns;
        if (!firstFn) return;
        if (restFn.length === 0) {
            return firstFn.apply(this, args);
        } else {
            let initValue = firstFn.apply(this, args);
            return restFn.reduceRight((accumulator, currentValue) => currentValue(accumulator), initValue);
        }
    };
}
