(this.webpackJsonp_front=this.webpackJsonp_front||[]).push([[7],{1091:function(e,t,a){"use strict";a(40),a(572)},1092:function(e,t,a){"use strict";a(40),a(572)},1093:function(e,t,a){"use strict";var n=a(539);t.a=n.a},1094:function(e,t,a){"use strict";var n=a(311);t.a=n.a},1120:function(e,t,a){},1124:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return q}));a(250);var n=a(125),c=(a(1091),a(1093)),o=(a(1092),a(1094)),l=a(18),r=(a(40),a(1120),a(1)),s=a(3),i=a(4),b=a(0),j=a(105),u=a(284),p=a(238),d=a(285),O=a(286),m=a(195),f=a(147),h=a(525),y=a(65),x=a(64),v=a(2),g=a.n(v),E=a(77),T=a(497),N=a(22),S=a(24),C=a(28),M=a(29),k=function(e){Object(C.a)(a,e);var t=Object(M.a)(a);function a(){var e;return Object(N.a)(this,a),(e=t.apply(this,arguments)).state={error:void 0,info:{componentStack:""}},e}return Object(S.a)(a,[{key:"componentDidCatch",value:function(e,t){this.setState({error:e,info:t})}},{key:"render",value:function(){var e=this.props,t=e.message,a=e.description,n=e.children,c=this.state,o=c.error,l=c.info,r=l&&l.componentStack?l.componentStack:null,s="undefined"===typeof t?(o||"").toString():t,i="undefined"===typeof a?r:a;return o?b.createElement(L,{type:"error",message:s,description:b.createElement("pre",null,i)}):n}}]),a}(b.Component),w=a(19),_=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var c=0;for(n=Object.getOwnPropertySymbols(e);c<n.length;c++)t.indexOf(n[c])<0&&Object.prototype.propertyIsEnumerable.call(e,n[c])&&(a[n[c]]=e[n[c]])}return a},U={success:m.a,info:h.a,error:y.a,warning:f.a},P={success:u.a,info:d.a,error:O.a,warning:p.a},I=function(e){var t,a=e.description,n=e.prefixCls,c=e.message,o=e.banner,l=e.className,u=void 0===l?"":l,p=e.style,d=e.onMouseEnter,O=e.onMouseLeave,m=e.onClick,f=e.afterClose,h=e.showIcon,y=e.closable,v=e.closeText,N=e.action,S=_(e,["description","prefixCls","message","banner","className","style","onMouseEnter","onMouseLeave","onClick","afterClose","showIcon","closable","closeText","action"]),C=b.useState(!1),M=Object(i.a)(C,2),k=M[0],I=M[1],L=b.useRef(),D=b.useContext(E.b),F=D.getPrefixCls,Y=D.direction,H=F("alert",n),V=function(e){var t;I(!0),null===(t=S.onClose)||void 0===t||t.call(S,e)},A=!!v||y,B=function(){var e=S.type;return void 0!==e?e:o?"warning":"info"}(),J=!(!o||void 0!==h)||h,R=g()(H,"".concat(H,"-").concat(B),(t={},Object(s.a)(t,"".concat(H,"-with-description"),!!a),Object(s.a)(t,"".concat(H,"-no-icon"),!J),Object(s.a)(t,"".concat(H,"-banner"),!!o),Object(s.a)(t,"".concat(H,"-rtl"),"rtl"===Y),t),u),q=Object(T.a)(S);return b.createElement(x.b,{visible:!k,motionName:"".concat(H,"-motion"),motionAppear:!1,motionEnter:!1,onLeaveStart:function(e){return{maxHeight:e.offsetHeight}},onLeaveEnd:f},(function(e){var t=e.className,n=e.style;return b.createElement("div",Object(r.a)({ref:L,"data-show":!k,className:g()(R,t),style:Object(r.a)(Object(r.a)({},p),n),onMouseEnter:d,onMouseLeave:O,onClick:m,role:"alert"},q),J?function(){var e=S.icon,t=(a?P:U)[B]||null;return e?Object(w.c)(e,b.createElement("span",{className:"".concat(H,"-icon")},e),(function(){return{className:g()("".concat(H,"-icon"),Object(s.a)({},e.props.className,e.props.className))}})):b.createElement(t,{className:"".concat(H,"-icon")})}():null,b.createElement("div",{className:"".concat(H,"-content")},b.createElement("div",{className:"".concat(H,"-message")},c),b.createElement("div",{className:"".concat(H,"-description")},a)),N?b.createElement("div",{className:"".concat(H,"-action")},N):null,A?b.createElement("button",{type:"button",onClick:V,className:"".concat(H,"-close-icon"),tabIndex:0},v?b.createElement("span",{className:"".concat(H,"-close-text")},v):b.createElement(j.a,null)):null)}))};I.ErrorBoundary=k;var L=I,D=a(31),F=a(1106),Y=a.n(F),H=a(21),V=a(25),A=a(282),B=a(6),J=[{value:!0,label:"\u662f"},{value:!1,label:"\u5426"}],R=[{value:"default",label:"\u4eae"},{value:"dark",label:"\u6697"}];function q(e){var t=Object(b.useState)(""),a=Object(D.a)(t,2),r=a[0],s=a[1];var i={labelCol:{flex:"100px"}};return Object(B.jsxs)(H.m,{fitHeight:!0,style:{display:"flex",flexDirection:"column"},children:[Object(B.jsxs)("div",{style:{flex:0},children:[Object(B.jsx)(L,{style:{marginBottom:24},type:"warning",message:Object(B.jsx)("div",{style:{color:"red"},children:"\u4e0d\u63a8\u8350\u5c06\u8bbe\u7f6e\u5f00\u653e\u7ed9\u7528\u6237\uff0c\u9009\u62e9\u597d\u4e86\u4e4b\u540e\uff0c\u590d\u5236\u4ee3\u7801\u5230\u9879\u76ee\u914d\u7f6e\u6587\u4ef6 src/config/index.js \u4e2d"})}),Object(B.jsxs)(n.a,{initialValues:V.e,onValuesChange:function(e,t){var a;H.M.local.setItem(V.f,t),Object.entries(t).forEach((function(e){var t=Object(D.a)(e,2),a=t[0],n=t[1];return V.e[a]=n})),(null===(a=A.b.current)||void 0===a?void 0:a.refresh)&&A.b.current.refresh();var n=Y.a.stringify(t,null,4)||"";n=(n=(n=n.replace("layoutType: 'side-menu'","layoutType: LAYOUT_TYPE.SIDE_MENU")).replace("layoutType: 'top-menu'","layoutType: LAYOUT_TYPE.TOP_MENU")).replace("layoutType: 'top-side-menu'","layoutType: LAYOUT_TYPE.TOP_SIDE_MENU"),s(n)},children:[Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u5e03\u5c40\u65b9\u5f0f",name:"layoutType",options:[{value:H.h.SIDE_MENU,label:"\u5de6\u4fa7\u83dc\u5355"},{value:H.h.TOP_MENU,label:"\u5934\u90e8\u83dc\u5355"},{value:H.h.TOP_SIDE_MENU,label:"\u5934\u90e8 + \u5de6\u4fa7\u83dc\u5355"}]})),Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"Logo\u4e3b\u9898",name:"logoTheme",options:R})),Object(B.jsxs)(c.a,{children:[Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u5de6\u4fa7",name:"side",options:J}))}),Object(B.jsx)(H.e,{shouldUpdate:!0,noStyle:!0,children:function(e){return(0,e.getFieldValue)("side")?Object(B.jsxs)(B.Fragment,{children:[Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u83dc\u5355\u4fdd\u6301\u6253\u5f00",name:"keepMenuOpen",options:J}))}),Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u5de6\u4fa7\u4e3b\u9898",name:"sideTheme",options:R}))}),Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u83dc\u5355\u641c\u7d22",name:"searchMenu",options:J}))})]}):null}})]}),Object(B.jsxs)(c.a,{children:[Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u5934\u90e8",name:"header",options:J}))}),Object(B.jsx)(H.e,{shouldUpdate:!0,noStyle:!0,children:function(e){return(0,e.getFieldValue)("header")?Object(B.jsxs)(B.Fragment,{children:[Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u5934\u90e8\u6536\u8d77\u83dc\u5355",name:"headerSideToggle",options:J}))}),Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u5934\u90e8\u4e3b\u9898",name:"headerTheme",options:R}))})]}):null}})]}),Object(B.jsxs)(c.a,{children:[Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"Tab\u9875",name:"tab",options:J}))}),Object(B.jsx)(H.e,{shouldUpdate:!0,noStyle:!0,children:function(e){return(0,e.getFieldValue)("tab")?Object(B.jsxs)(B.Fragment,{children:[Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"Tab\u6301\u4e45\u5316",name:"persistTab",options:J}))}),Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"Tab\u6536\u8d77\u83dc\u5355",name:"tabSideToggle",options:J}))}),Object(B.jsx)(o.a,{span:6,children:Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"Tab\u989d\u5916\u5934\u90e8",name:"tabHeaderExtra",options:J}))})]}):null}})]}),Object(B.jsx)(H.e,Object(l.a)(Object(l.a)({},i),{},{type:"radio-button",label:"\u9875\u9762\u5934\u90e8",name:"pageHeader",options:J}))]})]}),Object(B.jsx)("code",{style:{flex:1,overflow:"auto",borderTop:"1px solid #e8e8e8",padding:16,background:"#000"},children:Object(B.jsx)("pre",{style:{color:"#fff"},children:r})})]})}}}]);
//# sourceMappingURL=7.47957be5.chunk.js.map