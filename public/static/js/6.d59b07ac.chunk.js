(this.webpackJsonp_front=this.webpackJsonp_front||[]).push([[6],{1059:function(e,n,t){"use strict";t.r(n);t(185);var a=t(122),r=(t(342),t(183)),c=(t(89),t(27)),i=(t(164),t(29)),s=t(41),o=t.n(s),u=t(163),l=t(18),d=t(32),A=t(2),b=t.n(A),p=t(0),f=t(21),j=t(250),m=t(23),x=(t(416),t(238)),O=(t(218),t(105)),h=(t(251),t(125)),v=(t(572),t(343)),g=t(1108),y=t.n(g),C=t(1092),k=t(1104),E=t.n(k),w=t(5),_=C.default.menuTarget,I=v.a.TabPane,B=Object(j.a)()((function(e){var n=e.isAdd,t=e.selectedMenu,a=e.onSubmit,i=e.onValuesChange,s=h.a.useForm(),A=Object(d.a)(s,1)[0],j=Object(p.useState)(!1),g=Object(d.a)(j,2),C=g[0],k=g[1],B=Object(p.useState)("1"),R=Object(d.a)(B,2),N=R[0],S=R[1],M=Object(f.Q)(null,285),P=Object(d.a)(M,1)[0],T=Object(p.useRef)(null),F=t&&Object.keys(t).length,q=n&&!F,V=n&&F,L=q?m.o?"\u6dfb\u52a0\u5e94\u7528":"\u6dfb\u52a0\u9876\u7ea7":V?"\u6dfb\u52a0\u83dc\u5355":"\u4fee\u6539\u83dc\u5355",Y=e.ajax.useDel("/menu/:id",null,{setLoading:k}).run,z=e.ajax.usePost("/menu/addMenu",null,{setLoading:k}).run,D=e.ajax.usePost("/menu/addSubMenus",null,{setLoading:k}).run,J=e.ajax.usePost("/menu/updateMenuById",null,{setLoading:k}).run,U=e.ajax.useGet("/menu/getOneMenu").run,Q=e.ajax.usePost("/role/addRole",null,{setLoading:k}).run;Object(p.useEffect)((function(){A.resetFields();var e=Object(l.a)(Object(l.a)({},t),{},{order:null===t||void 0===t?void 0:t.ord});q&&(e={target:"qiankun"}),V&&(e={target:"menu",parentId:t.id,systemId:t.systemId}),A.setFieldsValue(e)}),[A,n,q,V,t]);var H=Object(p.useCallback)(function(){var e=Object(u.a)(o.a.mark((function e(t){var r,c,i,s,u,d,A,b;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!C){e.next=2;break}return e.abrupt("return");case 2:if(r=Object(l.a)(Object(l.a)({},t),{},{type:1,sort:t.order,ord:t.order}),!n){e.next=31;break}if(!V||"2"!==N){e.next=21;break}c=t.menus,i=t.parentId,e.prev=6,c=y.a.parse(c),e.next=13;break;case 10:return e.prev=10,e.t0=e.catch(6),e.abrupt("return",O.a.error({title:"\u6e29\u99a8\u63d0\u793a",content:"\u6279\u91cf\u6dfb\u52a0\u7684\u83dc\u5355\u6570\u636e\u6709\u8bef\uff0c\u8bf7\u4fee\u6b63\u540e\u4fdd\u5b58\uff01"}));case 13:return s={menus:c,parentId:i},e.next=16,D(s);case 16:u=e.sent,d=u.id,a&&a({id:d,isAdd:!0}),e.next=29;break;case 21:return e.next=23,z(r);case 23:if(A=e.sent,b=A.id,a&&a(Object(l.a)(Object(l.a)({},r),{},{id:b,isAdd:!0})),!m.o||!q){e.next=29;break}return e.next=29,Q({systemId:b,name:"\u7cfb\u7edf\u7ba1\u7406\u5458",enabled:!0,remark:"\u62e5\u6709\u5f53\u524d\u5b50\u7cfb\u7edf\u6240\u6709\u6743\u9650",type:2});case 29:e.next=34;break;case 31:return e.next=33,J(r);case 33:a&&a(Object(l.a)(Object(l.a)({},r),{},{isUpdate:!0}));case 34:case"end":return e.stop()}}),e,null,[[6,10]])})));return function(n){return e.apply(this,arguments)}}(),[N,D,n,V,q,C,a,z,Q,J]),Z=Object(f.P)(function(){var e=Object(u.a)(o.a.mark((function e(t,a){var r,c,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,U({name:a});case 4:if(r=e.sent){e.next=7;break}return e.abrupt("return");case 7:if(c=A.getFieldValue("id"),i="".concat(r.id),!n||r.name!==a){e.next=11;break}throw Error("\u6ce8\u518c\u540d\u79f0\u4e0d\u80fd\u91cd\u590d\uff01");case 11:if(n||i===c||r.name!==a){e.next=13;break}throw Error("\u6ce8\u518c\u540d\u79f0\u4e0d\u80fd\u91cd\u590d\uff01");case 13:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}()),G=Object(p.useCallback)(Object(u.a)(o.a.mark((function e(){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=null===t||void 0===t?void 0:t.id,e.next=3,Y({id:n});case 3:a&&a({id:n,isDelete:!0});case 4:case"end":return e.stop()}}),e)}))),[Y,a,null===t||void 0===t?void 0:t.id]),X={labelCol:{flex:"100px"}};return Object(w.jsxs)(h.a,{name:"menu-form",form:A,onFinish:H,onValuesChange:i,initialValues:{enabled:!0},className:b()(E.a.pane),children:[Object(w.jsx)("h3",{className:b()(E.a.title),children:L}),Object(w.jsxs)(f.c,{ref:T,loading:C,className:b()(E.a.content),children:[V?Object(w.jsxs)(v.a,{activeKey:N,onChange:function(e){return S(e)},children:[Object(w.jsx)(I,{tab:"\u5355\u4e2a\u6dfb\u52a0"},"1"),Object(w.jsx)(I,{tab:"\u6279\u91cf\u6dfb\u52a0"},"2")]}):null,Object(w.jsx)(f.e,{name:"id",hidden:!0}),Object(w.jsx)(f.e,{name:"parentId",hidden:!0}),"1"===N?Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)(f.e,Object(l.a)(Object(l.a)({},X),{},{label:"\u7c7b\u578b",type:"select",name:"target",options:_,tooltip:"\u6307\u5b9a\u7c7b\u578b\u4e4b\u540e\uff0c\u5c06\u4ee5\u4e7e\u5764\u5b50\u9879\u76ee\u6216\u7b2c\u4e09\u65b9\u7f51\u7ad9\u65b9\u5f0f\u6253\u5f00",required:!0,getPopupContainer:function(){return T.current}})),Object(w.jsx)(f.e,Object(l.a)(Object(l.a)({},X),{},{label:"\u6807\u9898",name:"title",required:!0,tooltip:"\u83dc\u5355\u6807\u9898"})),Object(w.jsx)(f.e,Object(l.a)(Object(l.a)({},X),{},{type:"number",label:"\u6392\u5e8f",name:"order",tooltip:"\u964d\u5e8f\uff0c\u8d8a\u5927\u8d8a\u9760\u524d"})),Object(w.jsx)(f.e,Object(l.a)(Object(l.a)({},X),{},{label:"\u8def\u5f84",name:"path",tooltip:"\u83dc\u5355\u8def\u5f84\u6216\u7b2c\u4e09\u65b9\u7f51\u7ad9\u5730\u5740"})),Object(w.jsx)(f.e,Object(l.a)(Object(l.a)({},X),{},{type:"switch",label:"\u542f\u7528",name:"enabled",checkedChildren:"\u542f",unCheckedChildren:"\u7981",tooltip:"\u662f\u5426\u542f\u7528"})),Object(w.jsx)(f.e,{shouldUpdate:!0,noStyle:!0,children:function(e){return"qiankun"===(0,e.getFieldValue)("target")?Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)(f.e,Object(l.a)(Object(l.a)({},X),{},{label:"\u6ce8\u518c\u540d\u79f0",tooltip:"\u8981\u4e0e\u5b50\u5e94\u7528package.json\u4e2d\u58f0\u660e\u7684name\u5c5e\u6027\u76f8\u540c\uff0c\u552f\u4e00\u4e0d\u53ef\u91cd\u590d",name:"name",rules:[{validator:Z},{pattern:/^[0-9A-Za-z_-]+$/,message:"\u53ea\u5141\u8bb8\u82f1\u6587\u5927\u5c0f\u5199\u3001_\u3001-\uff01"}],required:!0})),Object(w.jsx)(f.e,Object(l.a)(Object(l.a)({},X),{},{label:"\u5165\u53e3\u5730\u5740",tooltip:"http(s)\u5f00\u5934\u7684\u7f51\u5740",name:"entry",rules:[{validator:function(e,n){return n&&!n.startsWith("http")?Promise.reject("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u5165\u53e3\u5730\u5740\uff01"):Promise.resolve()}}],noSpace:!0,required:!0}))]}):Object(w.jsx)(f.e,Object(l.a)(Object(l.a)({},X),{},{label:"\u57fa\u7840\u8def\u5f84",name:"basePath",tooltip:"\u6240\u6709\u5176\u5b50\u83dc\u5355\u8def\u5f84\u5c06\u4ee5\u6b64\u4e3a\u524d\u7f00"}))}})]}):Object(w.jsx)(f.e,{labelCol:{flex:0},type:"textarea",name:"menus",rows:16,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u83dc\u5355\u6570\u636e\uff01"}],style:{height:P},placeholder:"\u6279\u91cf\u6dfb\u52a0\u5b50\u83dc\u5355\uff0c\u7ed3\u6784\u5982\u4e0b\uff1a\n[\n    {id: 'system', title: '\u7cfb\u7edf\u7ba1\u7406', order: 900},\n    {id: 'user', parentId: 'system', title: '\u7528\u6237\u7ba1\u7406', path: '/users', order: 900},\n    {id: 'menus', parentId: 'system', title: '\u83dc\u5355\u7ba1\u7406', path: '/menus', order: 900},\n    {id: 'role', parentId: 'system', title: '\u89d2\u8272\u7ba1\u7406', path: '/roles', order: 900},\n    {\n        id: 'demo', parentId: 'system', title: '\u6d4b\u8bd5\u5b50\u5e94\u7528',\n        target: 'qiankun',\n\n        name: 'react-admin',\n        entry: 'http://localhost:3000',\n\n        order: 850,\n    },\n]\n                            "})]}),Object(w.jsxs)(r.b,{className:b()(E.a.footerAction),children:[n?null:Object(w.jsx)(x.a,{title:"\u60a8\u786e\u5b9a\u5220\u9664\u300c".concat(null===t||void 0===t?void 0:t.title,"\u300d\uff1f"),onConfirm:G,children:Object(w.jsx)(c.a,{loading:C,danger:!0,children:"\u5220\u9664"})}),Object(w.jsx)(c.a,{loading:C,type:"primary",htmlType:"submit",children:"\u4fdd\u5b58"})]})]})})),R=t(1124),N=t(571),S=Object(j.a)()((function(e){var n=h.a.useForm(),t=Object(d.a)(n,1)[0],i=e.isAdd,s=e.selectedMenu,l=e.onSubmit,A=e.onValuesChange,j=Object(p.useState)(!1),m=Object(d.a)(j,2),x=m[0],O=m[1],v=e.ajax.usePost("/menu/updateSubActions",null,{setLoading:O,successTip:"\u529f\u80fd\u4fdd\u5b58\u6210\u529f\uff01"}).run,g=Object(p.useCallback)(function(){var e=Object(u.a)(o.a.mark((function e(n){var t,a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.actions,a=null===s||void 0===s?void 0:s.id,e.next=4,v({actions:t,parentId:a});case 4:l&&l(t);case 5:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),[l,s,v]);return Object(p.useEffect)((function(){t.resetFields(),s&&t.setFieldsValue({actions:null===s||void 0===s?void 0:s.actions})}),[s,t]),Object(w.jsxs)(h.a,{name:"action-form",form:t,onFinish:g,onValuesChange:A,className:b()(E.a.pane),children:[Object(w.jsx)("h3",{className:b()(E.a.title),children:"\u529f\u80fd\u5217\u8868"}),Object(w.jsx)(f.c,{loading:x,className:b()(E.a.content),children:i?Object(w.jsx)(a.a,{style:{marginTop:50},description:"\u8bf7\u9009\u62e9\u6216\u4fdd\u5b58\u65b0\u589e\u83dc\u5355"}):Object(w.jsx)(h.a.List,{name:"actions",children:function(e,n){var t=n.add,a=n.remove;return Object(w.jsxs)(w.Fragment,{children:[e.map((function(e){var n=e.key,t=e.name;return Object(w.jsxs)(r.b,{style:{display:"flex",marginBottom:8},align:"baseline",children:[Object(w.jsx)(f.e,{hidden:!0,name:[t,"id"]}),Object(w.jsx)(f.e,{type:"switch",name:[t,"enabled"],initialValue:!0,checkedChildren:"\u542f",unCheckedChildren:"\u7981"}),Object(w.jsx)(f.e,{name:[t,"title"],placeholder:"\u540d\u79f0",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u540d\u79f0\uff01"}]}),Object(w.jsx)(f.e,{name:[t,"code"],placeholder:"\u7f16\u7801",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7f16\u7801\uff01"}]}),Object(w.jsx)(R.a,{style:{color:"red"},onClick:function(){return a(t)}})]},n)})),Object(w.jsx)(f.e,{children:Object(w.jsx)(c.a,{type:"dashed",onClick:function(){return t()},block:!0,icon:Object(w.jsx)(N.a,{}),children:"\u65b0\u589e\u7f16\u7801"})})]})}})}),Object(w.jsx)(r.b,{className:b()(E.a.footerAction),children:Object(w.jsx)(c.a,{loading:x,disabled:i,type:"primary",htmlType:"submit",children:"\u4fdd\u5b58"})})]})})),M=t(123),P=t.n(M);n.default=Object(j.a)({path:"/menus"})((function(e){var n=Object(p.useState)(!0),t=Object(d.a)(n,2),s=t[0],A=t[1],j=Object(p.useState)(null),x=Object(d.a)(j,2),O=x[0],h=x[1],v=Object(p.useState)(!1),g=Object(d.a)(v,2),y=g[0],C=g[1],k=Object(p.useState)(!1),_=Object(d.a)(k,2),I=_[0],R=_[1],N=e.ajax.useGet("/menu/queryMenus",null,{formatResult:function(e){return(e||[]).map((function(e,n,t){var a,r,c=t.filter((function(n){return 2===n.type&&n.parentId===e.id}));return Object(l.a)(Object(l.a)({},e),{},{id:""+e.id,parentId:e.parentId?""+e.parentId:e.parentId,order:null!==(a=null!==(r=e.order)&&void 0!==r?r:e.sort)&&void 0!==a?a:e.ord,actions:c})})).filter((function(e){return 1===e.type}))}}),M=N.loading,T=N.data,F=void 0===T?[]:T,q=N.run,V=Object(p.useCallback)(Object(u.a)(o.a.mark((function e(){var n,t=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=!(t.length>0&&void 0!==t[0])||t[0])||!y){e.next=4;break}return e.next=4,Object(f.r)("\u83dc\u5355\u6709\u672a\u4fdd\u5b58\u6570\u636e\uff0c\u662f\u5426\u653e\u5f03\uff1f");case 4:if(C(!1),!n||!I){e.next=8;break}return e.next=8,Object(f.r)("\u529f\u80fd\u5217\u8868\u6709\u672a\u4fdd\u5b58\u6570\u636e\uff0c\u662f\u5426\u653e\u5f03\uff1f");case 8:R(!1);case 9:case"end":return e.stop()}}),e)}))),[y,I]),L=Object(p.useCallback)(function(){var e=Object(u.a)(o.a.mark((function e(n){var t,a,r,c=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.key,a=!(c.length>1&&void 0!==c[1])||c[1],e.next=4,V(a);case 4:r=F.find((function(e){return e.id===t})),h(r),A(!1);case 7:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),[V,F]),Y=Object(p.useMemo)((function(){var e=Object(f.s)(Object(f.L)(F,(function(e,n){return n.order-e.order})));return[function e(n){return n.map((function(n){var t=n.id,a=n.icon,r=n.title,c=n.children;return c&&c.length?Object(w.jsx)(i.a.SubMenu,{title:Object(w.jsx)("span",{onClick:function(){var e=Object(u.a)(o.a.mark((function e(n){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.stopPropagation(),e.next=3,L({key:t});case 3:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),children:r}),icon:a,"data-menu":n,className:b()((null===O||void 0===O?void 0:O.id)===t?"".concat(P.a.antPrefix,"-menu-item-selected"):""),children:e(c)},t):Object(w.jsx)(i.a.Item,{icon:a,"data-menu":n,children:r},t)}))}(e),e]}),[F,O,y]),z=Object(d.a)(Y,2),D=z[0],J=z[1];Object(p.useEffect)((function(){Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,q();case 2:case"end":return e.stop()}}),e)})))()}),[q]);var U=Object(p.useCallback)(function(){var e=Object(u.a)(o.a.mark((function e(n){var t,a,r,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return C(!1),t=n.isAdd,a=n.isDelete,n.isUpdate,r=n.id,e.next=4,q();case 4:if(t&&h(Object(l.a)({},O)),!a){e.next=15;break}if(!(c=Object(f.z)(J,r))){e.next=13;break}return e.next=11,L({key:c.id},!1);case 11:e.next=15;break;case 13:h({}),A(!0);case 15:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),[q,L,J,O]),Q=Object(p.useCallback)(Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return R(!1),e.next=3,q();case 3:case"end":return e.stop()}}),e)}))),[q]);return Object(w.jsxs)(f.m,{loading:M,fitHeight:!0,className:b()(E.a.menuRoot),children:[Object(w.jsxs)("div",{className:b()(E.a.menu),children:[Object(w.jsxs)(r.b,{className:b()(E.a.menuTop),children:[Object(w.jsx)(c.a,{type:"primary",onClick:Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,V();case 2:A(!0),h(null);case 4:case"end":return e.stop()}}),e)}))),children:m.o?"\u6dfb\u52a0\u5e94\u7528":"\u6dfb\u52a0\u9876\u7ea7"}),Object(w.jsx)(c.a,{disabled:!O,type:"primary",onClick:Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,V();case 2:A(!0);case 3:case"end":return e.stop()}}),e)}))),children:"\u6dfb\u52a0\u5b50\u7ea7"})]}),Object(w.jsx)("div",{className:b()(E.a.menuContent),children:null!==F&&void 0!==F&&F.length?Object(w.jsx)(i.a,{mode:"inline",selectable:!0,selectedKeys:[null===O||void 0===O?void 0:O.id],onClick:function(e){return L(e)},children:D}):Object(w.jsx)(a.a,{style:{marginTop:58},description:"\u6682\u65e0\u6570\u636e"})})]}),Object(w.jsx)(B,{isAdd:s,selectedMenu:O,onSubmit:U,onValuesChange:function(){return C(!0)}}),Object(w.jsx)(S,{isAdd:s,selectedMenu:O,onValuesChange:function(){return R(!0)},onSubmit:Q})]})}))},1092:function(e,n,t){"use strict";t.r(n);var a=t(32),r=t(21),c={},i=t(1102);i.keys().forEach((function(e){if(!["./index.js"].includes(e)){var n=i(e).default;Object.entries(n).forEach((function(n){var t=Object(a.a)(n,2),r=t[0],i=t[1];if(r in c)throw Error("".concat(e," \u6587\u4ef6\u4e2d key \u300c").concat(r,"\u300d\u5df2\u88ab\u4f7f\u7528\uff01\u8bf7\u66f4\u6362\uff01"));c[r]=i}))}})),Object(r.T)(c,5e3),n.default=c},1102:function(e,n,t){var a={"./index.js":1092,"./system.js":1103};function r(e){var n=c(e);return t(n)}function c(e){if(!t.o(a,e)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return a[e]}r.keys=function(){return Object.keys(a)},r.resolve=c,e.exports=r,r.id=1102},1103:function(e,n,t){"use strict";t.r(n);var a=t(41),r=t.n(a),c=t(163),i=(t(344),t(175)),s=t(415),o=t(5);n.default={menuTarget:[{value:"menu",label:"\u5e94\u7528\u83dc\u5355"},{value:"qiankun",label:"\u4e7e\u5764\u5b50\u5e94\u7528"},{value:"iframe",label:"iframe\u5185\u5d4c\u7b2c\u4e09\u65b9"},{value:"_self",label:"\u5f53\u524d\u7a97\u53e3\u6253\u5f00\u7b2c\u4e09\u65b9"},{value:"_blank",label:"\u65b0\u5f00\u7a97\u53e3\u6253\u5f00\u7b2c\u4e09\u65b9"}],yesNo:[{value:!0,label:"\u662f",tag:Object(o.jsx)(i.a,{color:"green",children:"\u662f"})},{value:!1,label:"\u5426",tag:Object(o.jsx)(i.a,{color:"red",children:"\u5426"})}],enabled:[{value:!0,label:"\u542f\u7528",tag:Object(o.jsx)(i.a,{color:"green",children:"\u542f\u7528"})},{value:!1,label:"\u7981\u7528",tag:Object(o.jsx)(i.a,{color:"red",children:"\u7981\u7528"})}],sex:[{value:"1",label:"\u7537"},{value:"2",label:"\u5973"},{value:"3",label:"\u672a\u77e5"}],system:function(){return Object(c.a)(r.a.mark((function e(){var n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.b.get("/menu/queryTopMenus");case 2:return n=e.sent,e.abrupt("return",n.map((function(e){return{value:e.id,label:e.title,meta:e}})));case 4:case"end":return e.stop()}}),e)})))()},action:function(){return[{value:"add",label:"\u6dfb\u52a0"}]},get demo(){return[]}}},1104:function(e,n,t){var a=t(135),r=t(1119);"string"===typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var c={insert:"head",singleton:!1};a(r,c);e.exports=r.locals||{}},1119:function(e,n,t){"use strict";t.r(n);var a=t(63),r=t.n(a)()(!0);r.push([e.i,".menuRoot_2P-EX {\n  display: flex;\n}\n.menu_ERmcs {\n  flex: 0 0 210px;\n  width: 210px;\n  display: flex;\n  flex-direction: column;\n  border-right: 1px solid #d9d9d9;\n}\n.menu_ERmcs .menuTop_17CH7 {\n  padding: 8px;\n  margin-right: 8px;\n  display: flex;\n  align-items: center;\n  border-bottom: 1px solid #d9d9d9;\n}\n.menu_ERmcs .menuContent_ko9de {\n  flex: 1;\n  overflow: auto;\n}\n.menu_ERmcs .front-menu-submenu {\n  position: relative;\n}\n.menu_ERmcs .front-menu-submenu:after {\n  position: absolute;\n  top: 0;\n  right: 0;\n  height: 44px;\n  border-right: 3px solid #1890ff;\n  transform: scaleY(0.0001);\n  opacity: 0;\n  transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);\n  content: '';\n}\n.menu_ERmcs .front-menu-submenu.front-menu-item-selected:after {\n  opacity: 1;\n  transform: scaleY(1);\n}\n.pane_2-ul6 {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  border-right: 1px solid #d9d9d9;\n}\n.title_2SONm {\n  flex: 0 0 40px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding-top: 8px;\n}\n.content_2wXZi {\n  flex: 1;\n  overflow: auto;\n  padding: 8px 32px;\n}\n.footerAction_3DfR_ {\n  flex: 0 0 50px;\n  justify-content: flex-end;\n  border-top: 1px solid #d9d9d9;\n  padding: 0 10px;\n  margin: 0 8px;\n}\n","",{version:3,sources:["webpack://src/pages/menus/style.less"],names:[],mappings:"AAEA;EACI,aAAA;AAIJ;AADA;EACI,eAAA;EACA,YAAA;EACA,aAAA;EACA,sBAAA;EACA,+BAAA;AAGJ;AARA;EAQQ,YAAA;EACA,iBAAA;EACA,aAAA;EACA,mBAAA;EACA,gCAAA;AAGR;AAfA;EAgBQ,OAAA;EACA,cAAA;AAER;AAnBA;EAsBY,kBAAA;AAAZ;AAEY;EACI,kBAAA;EACA,MAAA;EACA,QAAA;EACA,YAAA;EACA,+BAAA;EACA,yBAAA;EACA,UAAA;EACA,kHAAA;EACA,WAAA;AAAhB;AAjCA;EAsCY,UAAA;EACA,oBAAA;AAFZ;AAOA;EACI,OAAA;EACA,aAAA;EACA,sBAAA;EACA,+BAAA;AALJ;AAQA;EACI,cAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,gBAAA;AANJ;AASA;EACI,OAAA;EACA,cAAA;EACA,iBAAA;AAPJ;AAUA;EACI,cAAA;EACA,yBAAA;EACA,6BAAA;EACA,eAAA;EACA,aAAA;AARJ",sourcesContent:["@import \"src/theme\";\n\n.menuRoot {\n    display: flex;\n}\n\n.menu {\n    flex: 0 0 210px;\n    width: 210px;\n    display: flex;\n    flex-direction: column;\n    border-right: 1px solid @border-color-base;\n\n    .menuTop {\n        padding: 8px;\n        margin-right: 8px;\n        display: flex;\n        align-items: center;\n        border-bottom: 1px solid @border-color-base;\n    }\n\n    .menuContent {\n        flex: 1;\n        overflow: auto;\n    }\n\n    :global {\n        .@{ant-prefix}-menu-submenu {\n            position: relative;\n\n            &:after {\n                position: absolute;\n                top: 0;\n                right: 0;\n                height: 44px;\n                border-right: 3px solid @primary-color;\n                transform: scaleY(0.0001);\n                opacity: 0;\n                transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);\n                content: '';\n            }\n        }\n\n        .@{ant-prefix}-menu-submenu.@{ant-prefix}-menu-item-selected:after {\n            opacity: 1;\n            transform: scaleY(1);\n        }\n    }\n}\n\n.pane {\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n    border-right: 1px solid @border-color-base;\n}\n\n.title {\n    flex: 0 0 40px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    padding-top: 8px;\n}\n\n.content {\n    flex: 1;\n    overflow: auto;\n    padding: 8px 32px;\n}\n\n.footerAction {\n    flex: 0 0 50px;\n    justify-content: flex-end;\n    border-top: 1px solid @border-color-base;\n    padding: 0 10px;\n    margin: 0 8px;\n}\n\n\n@packageName: front;"],sourceRoot:""}]),r.locals={antPrefix:"front",raLibPrefix:"front-ra",primaryColor:"#1890ff",menuRoot:"menuRoot_2P-EX",menu:"menu_ERmcs",menuTop:"menuTop_17CH7",menuContent:"menuContent_ko9de",pane:"pane_2-ul6",title:"title_2SONm",content:"content_2wXZi",footerAction:"footerAction_3DfR_"},n.default=r},1124:function(e,n,t){"use strict";var a=t(0),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"}},{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"}}]},name:"minus-circle",theme:"outlined"},c=t(11),i=function(e,n){return a.createElement(c.a,Object.assign({},e,{ref:n,icon:r}))};i.displayName="MinusCircleOutlined";n.a=a.forwardRef(i)}}]);
//# sourceMappingURL=6.d59b07ac.chunk.js.map