import {match} from 'path-to-regexp';
import {BASE_NAME, HASH_ROUTER, NO_AUTH_ROUTES} from '../config';
import pageConfigs from 'src/pages/page-configs';

/**
 * 浏览器跳转，携带baseName hash等
 * @param href
 * @returns {string|*}
 */
export function locationHref(href) {
    if (href?.startsWith('http')) return (window.location.href = href);

    if (href && BASE_NAME && href.startsWith(BASE_NAME)) href = href.replace(BASE_NAME, '');

    const hash = HASH_ROUTER ? '#' : '';

    return (window.location.href = `${BASE_NAME}${hash}${href}`);
}

/**
 * 进入首页
 */
export function toHome() {
    // 跳转页面，优先跳转上次登出页面
    let lastHref = window.sessionStorage.getItem('last-href') || '/';

    const url = lastHref.startsWith('http') ? new URL(lastHref) : { pathname: '/' };

    // 上次是非登录页面，直接跳转首页
    if (isNoAuthPage(url.pathname)) lastHref = '/';

    locationHref(lastHref);

    if (HASH_ROUTER) window.location.reload();
}

/**
 * 跳转到登录页面
 */
export function toLogin() {
    //
    // const loginPath = '/login';
    //
    // // 判断当前页面是否已经是login页面，如果是，直接返回，不进行跳转，防止出现跳转死循环
    // if (isLoginPage()) return null;
    //
    // // 清除相关数据
    // window.sessionStorage.clear();
    // window.sessionStorage.setItem('last-href', window.location.href);
    //
    // if (IS_SUB) {
    //     // 微前端，跳转主应用登录
    //     const mainToLogin = getMainApp()?.toLogin;
    //     if (mainToLogin) return mainToLogin();
    //
    //     // 嵌入iframe中
    //     const parentOrigin = getParentOrigin();
    //     if (parentOrigin) return (window.location.href = `${parentOrigin}/error-401.html`);
    // }
    //
    // locationHref(loginPath);
    //
    // if (HASH_ROUTER) window.location.reload();
    //
    // return null;
}

/**
 * 检测路由配置冲突
 * @param result
 * @returns {string|boolean}
 */
export async function checkPath(result) {

    const hasHome = result.some(({ path }) => path === '/');
    if (!hasHome) throw Error(`必须含有首页路由，path: '/'， 如果需要其他页面做首页，可以进行 Redirect`);

    result
        .filter(({ path }) => !!path)
        .forEach(({ path, filePath }) => {

            // 自身路由配置是否冲突
            const exit = result.find(({ filePath: f, path: p }) => {
                if (f === filePath) return false;

                if (!p || !path) return false;

                if (p === path) return true;

                return match(path, { decode: decodeURIComponent })(p) || match(p, { decode: decodeURIComponent })(path);
            });
            if (exit)
                throw Error(
                    `路由地址：「${path}」 与 「${exit.path}」 配置冲突，对应文件文件如下：\n${filePath}\n${exit.filePath}`,
                );
        });
}

/**
 * 基于 window.location.pathname pageConfig 获取当前页面config高级组件参数
 * @returns {{}|*}
 */
export function getCurrentPageConfig() {
    let { pathname, hash } = window.location;
    if (HASH_ROUTER) {
        pathname = hash.replace('#', '').split('?')[0];
    } else if (BASE_NAME) {
        pathname = pathname.replace(BASE_NAME, '');
    }

    const config = pageConfigs.find(({ path }) => path && match(path, { decode: decodeURIComponent })(pathname));

    return config || {};
}

/**
 * 加载js文件
 * @param url
 * @returns {Promise<unknown>}
 */
export function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.onload = resolve;
        script.src = url;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * 不需要登录的页面配置
 * @param pathname
 * @returns {boolean}
 */
export function isNoAuthPage(pathname) {
    return NO_AUTH_ROUTES.includes(pathname || window.location.pathname);
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
        const range = document.selection.createRange();
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
