(this.webpackJsonp_front=this.webpackJsonp_front||[]).push([[5],{938:function(e,t,n){"use strict";n.r(t);n(366);var a,r=n(227),i=(n(111),n(37)),c=n(228),o=n(22),l=n(159),s=n(32),u=n.n(s),d=n(148),b=(n(367),n(258)),f=n(45),j=n(1),p=n.n(j),m=n(0),O=n(941),x=n(984),h=n(19),v=n(225),g=n(175),w=n(955),y=(n(193),n(97)),k=(n(516),n(354)),C=(n(956),n(970)),_=n(513),I=n(944),S=n(981),N=n(982),P=n(983),T=n(514),F=n(980),E=n(979),V=n(123),q=n(520),z=n(974),L=n(971),U=n(972),B=n(961),A=n.n(B),M=n(12),R=Object(h.x)(),K=Object(U.b)((function(e){return e.children})),D=Object(U.a)((function(e){return e.children})),Y=k.a.TabPane,Z=Object(v.a)({modal:{title:null,width:"80%",top:50,maskClosable:!0}})((function(e){var t=e.params,n=e.onCancel,a=Object(m.useState)(!1),r=Object(f.a)(a,2),c=r[0],o=r[1],l=Object(m.useState)([]),s=Object(f.a)(l,2),b=s[0],j=s[1],p=Object(m.useCallback)(function(){var t=Object(d.a)(u.a.mark((function t(n){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.ajax.post("/generate/preview",n,{setLoading:o});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e.ajax]);return Object(m.useEffect)((function(){Object(d.a)(u.a.mark((function e(){var n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p(t);case 2:n=e.sent,j(n);case 4:case"end":return e.stop()}}),e)})))()}),[p,t]),Object(M.jsx)(h.k,{bodyStyle:{padding:0},loading:c,footer:Object(M.jsx)(i.a,{onClick:n,children:"\u5173\u95ed"}),children:Object(M.jsx)(k.a,{type:"card",tabBarStyle:{marginBottom:0,marginTop:13,marginLeft:4},children:b.map((function(e){var t=e.id,n=e.name,a=e.content,r=e.targetPath.split(".").pop();return["jsx","js","vue","vux"].includes(r)&&(r="javascript"),["tsx","ts"].includes(r)&&(r="typescript"),Object(M.jsx)(Y,{tab:n,children:Object(M.jsx)(g.a,{otherHeight:80,language:r,value:a,readOnly:!0})},t)}))})})})),H=(n(945),n(946)),J=/macintosh|mac os x/i.test(navigator.userAgent),Q=Object(v.a)({modal:{title:"\u5e2e\u52a9\u6587\u6863",width:1e3,maskClosable:!0}})((function(e){var t=e.onCancel;return Object(M.jsx)(h.k,{fitHeight:!0,onCancel:t,footer:Object(M.jsx)(i.a,{onClick:t,children:"\u5173\u95ed"}),children:Object(M.jsxs)(r.b,{direction:"vertical",style:{width:"100%"},children:[Object(M.jsx)(H.a,{type:"success",message:"\u9875\u9762\u64cd\u4f5c",description:Object(M.jsxs)("ol",{children:[Object(M.jsxs)("li",{children:["\u6807\u7b7e\uff1a",J?"\u2318":"ctrl"," + \u9f20\u6807\u5de6\u952e\uff0c\u5feb\u901f\u5168\u9009/\u53d6\u6d88\u6807\u7b7e\uff1b"]}),Object(M.jsx)("li",{children:"\u300c\u66f4\u65b0\u672c\u5730\u6a21\u7248\u300d\uff1a\u5c06\u5de5\u5177\u4e2d\u5185\u7f6e\u6a21\u7248\u66f4\u65b0\u5230\u672c\u5730\uff0c\u540c\u540d\u6a21\u7248\u4f1a\u88ab\u8986\u76d6\uff1b"}),Object(M.jsx)("li",{children:"\u5b57\u6bb5\u8868\u683c\uff1a\u901a\u8fc7\u65b9\u5411\u952e\u5feb\uff0c\u53ef\u4ee5\u5728input\u6846\u4e4b\u95f4\u901f\u79fb\u52a8\u5149\u6807\uff1b\u56de\u8f66\u5149\u6807\u8df3\u5165\u4e0b\u4e00\u884c"}),Object(M.jsx)("li",{children:"\u5b57\u6bb5\u8868\u683c\uff1a\u6700\u540e\u4e00\u884cinput\u6846\u5185\uff0c\u56de\u8f66\u6216\u2193\uff0c\u4f1a\u65b0\u589e\u4e00\u884c\uff1b"}),Object(M.jsxs)("li",{children:["\u5b57\u6bb5\u8868\u683c\uff1a",J?"\u2318":"ctrl"," + shift + backspace \u5feb\u901f\u5220\u9664\u5f53\u524d\u884c\uff1b"]})]})}),Object(M.jsx)(H.a,{type:"warning",message:"\u6a21\u7248\u6587\u4ef6\u8bf4\u660e",description:Object(M.jsx)("div",{children:Object(M.jsxs)("ol",{children:[Object(M.jsx)("li",{children:"name: \u5217\u8868\u540d\u79f0\uff0c\u9ed8\u8ba4 folder/filename\uff1b"}),Object(M.jsx)("li",{children:"options: \u6587\u4ef6\u9009\u9879\uff0c\u663e\u793a\u5230\u9875\u9762\u6587\u4ef6\u540e\uff0c\u4f9b\u7528\u6237\u9009\u62e9\uff1b"}),Object(M.jsx)("li",{children:"fieldOptions: \u5b57\u6bb5\u9009\u9879\uff0c\u663e\u793a\u5230\u9875\u9762\u8868\u683c\u4e2d\uff0c\u4f9b\u7528\u6237\u9009\u62e9\uff1b"}),Object(M.jsxs)("li",{children:["targetPath: \u9ed8\u8ba4\u751f\u6210\u76ee\u6807\u6587\u4ef6\u7684\u4f4d\u7f6e\uff1b\u76f8\u5bf9\u547d\u4ee4\u542f\u52a8\u76ee\u5f55\u5f00\u59cb\u7f16\u5199\uff0c\u53ef\u4ee5\u4f7f\u7528","{module-name}","\u7b49\u6a21\u5757\u540d\u8fdb\u884c\u5360\u4f4d\uff1b"]}),Object(M.jsxs)("li",{children:[Object(M.jsx)("div",{children:"getContent: \u83b7\u53d6\u6587\u4ef6\u5185\u5bb9\u51fd\u6570\uff1b\u53c2\u6570\u8bf4\u660e\u5982\u4e0b\uff1a"}),Object(M.jsxs)("ol",{children:[Object(M.jsx)("li",{children:"file.options: \u7528\u6237\u9009\u62e9\u7684\u6587\u4ef6\u9009\u9879\uff1b"}),Object(M.jsx)("li",{children:"files: \u7528\u6237\u751f\u6210\u7684\u5176\u4ed6\u6587\u4ef6\uff1b"}),Object(M.jsx)("li",{children:Object(M.jsx)("div",{children:"moduleNames: \u6a21\u5757\u5404\u79cd\u547d\u540d\uff1bmoduleNames.moduleName\u3001moduleNames['module-name']\u7b49"})}),Object(M.jsxs)("li",{children:["fields: \u5b57\u6bb5\u914d\u7f6e\u4fe1\u606f\uff0c\u6570\u7ec4\u5143\u7d20\u5bf9\u8c61\u53c2\u6570\u5982\u4e0b",Object(M.jsxs)("ol",{children:[Object(M.jsx)("li",{children:"name: \u5b57\u6bb5\u540d"}),Object(M.jsx)("li",{children:"__names: \u5b57\u6bb5\u7684\u5404\u79cd\u547d\u540d\uff0c\u7528\u6cd5\u540cmoduleNames\uff0c\u6bd4\u5982\uff1a__names.moduleName\u3001__names.module_name\u7b49"}),Object(M.jsx)("li",{children:"type: \u6570\u636e\u5e93\u7c7b\u578b"}),Object(M.jsx)("li",{children:"formType: \u8868\u5355\u7c7b\u578b"}),Object(M.jsx)("li",{children:"dataType: \u540e\u7aef\u6570\u636e\u7c7b\u578b"}),Object(M.jsx)("li",{children:"isNullable: \u662f\u5426\u53ef\u4e3a\u7a7a"}),Object(M.jsx)("li",{children:"comment: \u5b57\u6bb5\u6ce8\u91ca"}),Object(M.jsx)("li",{children:"chinese: \u5b57\u6bb5\u4e2d\u6587\u540d"}),Object(M.jsx)("li",{children:"length: \u5b57\u6bb5\u957f\u5ea6"}),Object(M.jsx)("li",{children:"fieldOptions: \u5b57\u6bb5\u9009\u9879"}),Object(M.jsx)("li",{children:"validation: \u5b57\u6bb5\u6821\u9a8c"})]})]})]})]})]})})})]})})})),G=(n(949),n(951)),X=(n(950),n(952)),W=(n(368),n(158)),$=Object(v.a)({modal:{title:"\u57fa\u4e8e\u6570\u636e\u5e93\u8868\u6279\u91cf\u751f\u6210",width:1e3,maskClosable:!0}})((function(e){var t=e.onCancel,n=e.dbUrl,a=e.files,r=e.tableOptions,c=Object(m.useState)(!1),o=Object(f.a)(c,2),l=o[0],s=o[1],b=Object(m.useState)([]),j=Object(f.a)(b,2),p=j[0],O=j[1],x=Object(m.useState)(!1),v=Object(f.a)(x,2),g=v[0],w=v[1],k=Object(m.useState)(!1),C=Object(f.a)(k,2),_=C[0],I=C[1],S=Object(m.useCallback)(Object(d.a)(u.a.mark((function r(){var i,c;return u.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,Object(h.n)("\u60a8\u786e\u5b9a\u8981\u751f\u6210\u9009\u4e2d\u7684\u8868\u5417\uff1f\u672c\u5730\u540c\u540d\u6587\u4ef6\u5c06\u88ab\u8986\u76d6\uff0c\u8bf7\u8c28\u614e\u64cd\u4f5c\uff01");case 2:return i={dbUrl:n,tables:p,files:a},r.next=5,e.ajax.post("/generate/files/batch",i,{setLoading:s});case 5:c=r.sent,y.a.success({width:600,title:"\u751f\u6210\u6587\u4ef6\u5982\u4e0b",content:Object(M.jsx)("div",{style:{maxHeight:200,overflow:"auto"},children:c.map((function(e){return Object(M.jsx)("div",{children:e},e)}))})}),t();case 8:case"end":return r.stop()}}),r)}))),[n,a,t,e.ajax,p]),N=Object(m.useCallback)((function(e){O(e),I(!!e.length&&e.length<r.length),w(e.length===r.length)}),[r.length]),P=Object(m.useCallback)((function(e){var t=e.target.checked;O(t?r.map((function(e){return e.value})):[]),I(!1),w(t)}),[r]);return Object(M.jsxs)(h.k,{loading:l,fitHeight:!0,footer:Object(M.jsx)(M.Fragment,{children:Object(M.jsx)(i.a,{onClick:t,children:"\u5173\u95ed"})}),children:[Object(M.jsx)(H.a,{message:"\u63d0\u793a",style:{marginBottom:16},description:"\u9009\u62e9\u60a8\u8981\u751f\u6210\u6587\u4ef6\u7684\u6570\u636e\u5e93\u8868\uff0c\u4f1a\u6839\u636e\u9875\u9762\u6587\u4ef6\u914d\u7f6e\u751f\u6210\u6240\u6709\u6587\u4ef6\u3002\u6a21\u5757\u540d\u9ed8\u8ba4\u4e3a\u8868\u540d\u3002"}),Object(M.jsxs)("div",{style:{marginBottom:8,paddingBottom:8,borderBottom:"1px solid #e9e9e9"},children:[Object(M.jsx)(W.a,{indeterminate:_,onChange:P,checked:g,children:"\u5168\u9009"}),Object(M.jsx)(i.a,{style:{marginLeft:16},type:"primary",danger:!0,onClick:S,disabled:!(null!==p&&void 0!==p&&p.length),children:"\u751f\u6210\u6587\u4ef6"})]}),Object(M.jsx)(W.a.Group,{value:p,onChange:N,children:Object(M.jsx)(G.a,{children:r.map((function(e){return Object(M.jsx)(X.a,{span:8,style:{marginBottom:8},children:Object(M.jsx)(W.a,{value:e.value,children:e.label})},e.value)}))})})]})})),ee=n(963),te=n.n(ee),ne=(a=C.a,function(e){var t=e.columns,n=e.scroll,r=e.className,i=e.onSortEnd,c=Object(m.useState)(0),l=Object(f.a)(c,2),s=l[0],u=l[1],d=t.filter((function(e){return!e.width})).length,b=t.reduce((function(e,t){var n=t.width;return e+(void 0===n?0:n)}),0),j=t.map((function(e){if(e.width)return e;var t=(s-b)/d;return Object(o.a)(Object(o.a)({},e),{},{width:t})})),O=Object(m.useCallback)((function(e){e.oldIndex!==e.newIndex&&i&&i(e)}),[i]);return Object(M.jsx)(L.a,{onResize:function(e){var t=e.width;return u(t)},children:Object(M.jsx)(a,Object(o.a)(Object(o.a)({},e),{},{columns:j,components:{body:function(e){return Object(M.jsx)(D,{onSortEnd:O,shouldCancelStart:function(e){var t=e.target,n=t.tagName,a=t.classList;return!!["A","INPUT","SELECT","BUTTON","TEXTAREA","OPTION"].includes(n)||String(a).includes("select-selection")},helperClass:A.a.row,children:Object(M.jsx)(z.a,{height:n.y,itemCount:e.length,itemSize:50,width:s,children:function(n){var a=n.index,r=n.style;return Object(M.jsx)(K,{index:a,children:Object(M.jsx)("div",{style:r,className:p()(A.a.row),children:j.map((function(n,r){var i=e[a],c=Array.isArray(n.dataIndex)?n.dataIndex.reduce((function(e,t){return e[t]||{}}),i):i[n.dataIndex],o=n.render||function(e){return e},l=r===t.length-1?n.width-R:n.width,s=o(c,i,a);return Object(M.jsx)("div",{style:{width:l},className:p()(A.a.cell),children:"string"===typeof s?Object(M.jsx)("div",{title:s,className:p()(A.a.text),children:o(c,i,a)}):s},n.key||n.dataIndex)}))})})}})})}},className:p()(p()(A.a.root,r))}))})}),ae=k.a.TabPane,re=Object(v.a)()((function(e){var t=e.templateOptions,n=e.tableOptions,a=e.form,s=a.getFieldsValue(),b=s.dbUrl,j=s.tableName,O=s.files,x=(O||[]).map((function(e){return e.templateId})),v=Object(m.useState)([]),C=Object(f.a)(v,2),z=C[0],L=C[1],U=Object(m.useState)(!1),B=Object(f.a)(U,2),A=B[0],R=B[1],K=Object(m.useRef)(null),D=Object(h.E)(K,110,[x]),Y=Object(f.a)(D,1)[0],H=Object(m.useState)(null),J=Object(f.a)(H,2),G=J[0],X=J[1],W=Object(m.useState)("type"),ee=Object(f.a)(W,2),re=ee[0],ie=ee[1],ce=Object(m.useState)([]),oe=Object(f.a)(ce,2),le=oe[0],se=oe[1],ue=Object(m.useState)(!1),de=Object(f.a)(ue,2),be=de[0],fe=de[1],je=Object(m.useState)(!1),pe=Object(f.a)(je,2),me=pe[0],Oe=pe[1],xe=Object(m.useCallback)(function(){var t=Object(d.a)(u.a.mark((function t(n){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.ajax.post("/generate/files",n,{setLoading:R});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e.ajax]),he=Object(m.useCallback)(function(){var t=Object(d.a)(u.a.mark((function t(n){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.ajax.post("/generate/files/exist",n,{setLoading:R});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e.ajax]),ve=Object(m.useCallback)(function(){var t=Object(d.a)(u.a.mark((function t(n){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.ajax.get("/db/types",n);case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e.ajax]),ge=Object(m.useCallback)((function(e){var t=e.oldIndex,n=e.newIndex;z.splice.apply(z,[n,0].concat(Object(l.a)(z.splice(t,1)))),L(Object(l.a)(z))}),[z]),we=Object(m.useCallback)((function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=z.length,n={id:Object(E.a)(),comment:"\u65b0\u589e\u5217".concat(t+1),field:"field".concat(t+1),formType:"input",dataType:"String",__isNew:!0};e?z.push(n):z.unshift(n),L(Object(l.a)(z))}),[z]),ye=Object(m.useCallback)((function(e){var t=z.filter((function(t){return t.id!==e}));L(t)}),[z]),ke=Object(m.useCallback)((function(e,t){var n=t.tabIndex,a=t.columnIndex,r=t.totalColumn,i=t.totalRow,c=t.record,o=t.rowIndex,l=e.keyCode,s=e.ctrlKey,u=e.shiftKey,d=e.altKey,b=e.metaKey,f=(s||b)&&u&&13===l;if(!(s||u||d||b)||f){var j=38===l,p=39===l,m=40===l||13===l,O=37===l,x=Object(V.c)(e.target);if((!O||x.start)&&(!p||x.end)){var h,v,g=a*i,w=(a+1)*i-1;if(j){if(n===g)return;h=n-1}if(p&&(a===r-1?n===w?(v=!0,h=i):h=o+1:h=n+i),m&&(n===w?(v=!0,h=n+a):h=n+1),O){if(n===g&&0===a)return;0===a&&(h=i*(r-1)+(o-1)),0!==a&&(h=n-i)}f&&(ye(c.id),v=!1,h=n===w?(i-1)*a+(o-1):(i-1)*a+(o+1)-1),v&&we(!0),setTimeout((function(){var e=document.querySelector("input[tabindex='".concat(h,"']"));e&&(e.focus(),e.select())}))}}}),[we,ye]),Ce=Object(m.useMemo)((function(){return x.filter(Boolean).map((function(e){var n,a=null===(n=t.find((function(t){return t.value===e})))||void 0===n?void 0:n.record;return{title:null===a||void 0===a?void 0:a.shortName,dataIndex:["options",null===a||void 0===a?void 0:a.id],formProps:{type:"tags",options:(null===a||void 0===a?void 0:a.fieldOptions)||[]}}}))}),[x,t]),_e=z.length,Ie=Object(m.useCallback)((function(e,t){var n;if(null===e||void 0===e||null===(n=e.formProps)||void 0===n||!n.type)return e;var a=["name","type","length","defaultValue","isNullable"],r=e.title,i=e.dataIndex,l=e.width,s=e.formProps,u=Object(c.a)(e,["title","dataIndex","width","formProps"]),d=s.type,b=void 0===d?"input":d,f=s.required,j=void 0!==f&&f,m=s.options,O=void 0===m?[]:m,x="select"===b?"\u8bf7\u9009\u62e9".concat(r):"\u8bf7\u8f93\u5165".concat(r),v=j?l-18:l-8;"switch"===b&&(v="auto"),v||(v="100%");var w=["input"].includes(b);return Object(o.a)(Object(o.a)({title:r,dataIndex:i,width:l},u),{},{render:function(n,r,c){var l,u=r.__isNew;if(a.includes(i)&&!u)return["select","switch"].includes(b)&&(null===O||void 0===O||null===(l=O.find((function(e){return e.value===n})))||void 0===l?void 0:l.label)||n;var d=["dataSource",c,Array.isArray(i)?i:[i]].flat();if("tags"===b)return Object(M.jsx)("div",{className:p()(p()(te.a.element,j&&te.a.required)),children:Object(M.jsx)(h.e,Object(o.a)(Object(o.a)({},s),{},{name:d,style:{width:v},rules:[{required:j,message:"".concat(x,"!")}],children:Object(M.jsx)(g.e,{options:O})}))});var f={};if(w){var m=e.inputColumnIndex;f.tabIndex=_e*m+c;var y={tabIndex:f.tabIndex,columnIndex:m,totalColumn:t,totalRow:_e,rowIndex:c,record:r};f.onKeyDown=function(e){return ke(e,y)}}return Object(M.jsx)("div",{className:p()(p()(te.a.element,j&&te.a.required)),children:Object(M.jsx)(h.e,Object(o.a)(Object(o.a)(Object(o.a)({},s),f),{},{name:d,style:{width:v},rules:[{required:j,message:"".concat(x,"!")}],placeholder:x}))})}})}),[ke,_e]),Se=Object(m.useMemo)((function(){return[{key:"type",tab:"\u7c7b\u578b&\u9a8c\u8bc1",columns:[{title:"\u6570\u636e\u7c7b\u578b",dataIndex:"dataType",width:150,formProps:{type:"select",options:q.DATA_TYPE_OPTIONS}},{title:"\u8868\u5355\u7c7b\u578b",dataIndex:"formType",width:150,formProps:{type:"select",options:q.FORM_ELEMENT_OPTIONS}},{title:"\u6821\u9a8c\u89c4\u5219",dataIndex:"validation",formProps:{type:"select",mode:"multiple",options:q.VALIDATE_OPTIONS}}]},{key:"options",tab:"\u6a21\u677f\u9009\u9879",columns:Object(l.a)(Ce)}]}),[Ce]),Ne=Object(m.useMemo)((function(){var e="options"===re,t=Se.find((function(e){return e.key===re})).columns.map((function(e){return Object(o.a)(Object(o.a)({},e),{},{className:te.a.tabColumn})})),n=0;return[{title:"\u64cd\u4f5c",dataIndex:"operator",width:60,render:function(e,t){var n=t.id,a=t.name,r=[{label:"\u5220\u9664",color:"red",confirm:{title:'\u60a8\u786e\u5b9a\u5220\u9664"'.concat(a,'"?'),onConfirm:function(){return ye(n)}}}];return Object(M.jsx)(h.l,{items:r})}},{title:"\u5b57\u6bb5",dataIndex:"name",width:150,formProps:{type:"input",required:!0}},{title:"\u6ce8\u91ca",dataIndex:"comment",width:150},{title:"\u4e2d\u6587\u540d",dataIndex:"chinese",width:150,formProps:{type:"input",required:!0}},!e&&{title:"\u7c7b\u578b",dataIndex:"type",width:150,formProps:{type:"select",required:!0,options:le}},!e&&{title:"\u957f\u5ea6",dataIndex:"length",width:85,formProps:{type:"number",min:0,step:1}},!e&&{title:"\u9ed8\u8ba4\u503c",dataIndex:"defaultValue",width:150,formProps:{type:"input"}},!e&&{title:"\u53ef\u4e3a\u7a7a",dataIndex:"isNullable",width:60,formProps:{type:"switch",options:[{value:!0,label:"\u662f"},{value:!1,label:"\u5426"}]}}].concat(Object(l.a)(t)).filter(Boolean).map((function(e){return"input"===(e.formProps||{}).type&&(e.inputColumnIndex=n,n++),e})).map((function(e){return Ie(e,n)}))}),[re,le,ye,Ie,Se]),Pe=Object(m.useCallback)(Object(d.a)(u.a.mark((function e(){var t,n,r,i,c,l,s,d,b,f,j,p,m=arguments;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=m.length>0&&void 0!==m[0]&&m[0],e.prev=1,null!==z&&void 0!==z&&z.length){e.next=4;break}return e.abrupt("return",y.a.info({title:"\u6e29\u99a8\u63d0\u793a",content:"\u8868\u683c\u7684\u5b57\u6bb5\u914d\u7f6e\u4e0d\u80fd\u4e3a\u7a7a\uff01"}));case 4:return e.next=6,a.validateFields();case 6:if(n=e.sent,r=n.files,i=n.moduleName,c=z.map((function(e){var t,n=null===(t=e.validation)||void 0===t?void 0:t.map((function(e){var t,n=q.VALIDATE_OPTIONS.find((function(t){return t.value===e}));return Object(o.a)(Object(o.a)({},n),{},{pattern:null===(t=n.pattern)||void 0===t?void 0:t.toString()})}));return Object(o.a)(Object(o.a)({},e),{},{validation:n})})),l={moduleName:i,files:r,config:c},!t){e.next=14;break}X(l),e.next=42;break;case 14:return e.next=16,he({files:r});case 16:if(e.t0=e.sent,e.t0){e.next=19;break}e.t0=[];case 19:s=e.t0,d=Object(w.a)(s),e.prev=21,f=u.a.mark((function e(){var t,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=b.value,n=r.find((function(e){return e.targetPath===t})),e.prev=2,e.next=5,Object(h.n)({width:600,title:"\u6587\u4ef6\u5df2\u5b58\u5728",content:t,okText:"\u8986\u76d6",okButtonProps:{danger:!0}});case 5:n.rewrite=!0,e.next=11;break;case 8:e.prev=8,e.t0=e.catch(2),n.rewrite=!1;case 11:case"end":return e.stop()}}),e,null,[[2,8]])})),d.s();case 24:if((b=d.n()).done){e.next=28;break}return e.delegateYield(f(),"t1",26);case 26:e.next=24;break;case 28:e.next=33;break;case 30:e.prev=30,e.t2=e.catch(21),d.e(e.t2);case 33:return e.prev=33,d.f(),e.finish(33);case 36:return e.next=38,xe(l);case 38:if(null!==(j=e.sent)&&void 0!==j&&j.length){e.next=41;break}return e.abrupt("return",y.a.info({title:"\u6e29\u99a8\u63d0\u793a",content:"\u672a\u751f\u6210\u4efb\u4f55\u6587\u4ef6\uff01"}));case 41:y.a.success({width:600,title:"\u751f\u6210\u6587\u4ef6\u5982\u4e0b",content:Object(M.jsx)("div",{style:{maxHeight:200,overflow:"auto"},children:j.map((function(e){return Object(M.jsx)("div",{children:e},e)}))})});case 42:e.next=49;break;case 44:if(e.prev=44,e.t3=e.catch(1),null===e.t3||void 0===e.t3||null===(p=e.t3.errorFields)||void 0===p||!p.length){e.next=48;break}return e.abrupt("return",y.a.info({title:"\u6e29\u99a8\u63d0\u793a",content:"\u8868\u5355\u586b\u5199\u6709\u8bef\uff0c\u8bf7\u68c0\u67e5\u540e\u518d\u63d0\u4ea4\uff01"}));case 48:console.error(e.t3);case 49:case"end":return e.stop()}}),e,null,[[1,44],[21,30,33,36]])}))),[a,z,he,xe]),Te=Object(m.useCallback)(Object(d.a)(u.a.mark((function t(){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(h.n)("\u672c\u5730\u540c\u540d\u6a21\u7248\u5c06\u88ab\u8986\u76d6\uff0c\u662f\u5426\u7ee7\u7eed\uff1f");case 2:return t.next=4,e.ajax.get("/templates/local/download",null,{successTip:"\u66f4\u65b0\u6210\u529f\uff01"});case 4:case"end":return t.stop()}}),t)}))),[e.ajax]);return Object(F.a)((function(){Object(d.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ve({dbUrl:b});case 2:t=e.sent,se(t);case 4:case"end":return e.stop()}}),e)})))()}),[b,ve],{wait:500}),Object(F.a)((function(){Object(d.a)(u.a.mark((function t(){var n;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(b&&j){t.next=2;break}return t.abrupt("return",L([]));case 2:return t.next=4,e.ajax.get("/db/tables/".concat(j),{dbUrl:b},{setLoading:R});case 4:n=t.sent,L(n);case 6:case"end":return t.stop()}}),t)})))()}),[b,j,e.ajax],{wait:500}),Object(m.useEffect)((function(){Object(d.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Ce.forEach((function(e){var n=Object(f.a)(e.dataIndex,2)[1],a=Object(l.a)(e.formProps.options);z.forEach((function(e){e.options||(e.options={}),e.options[n]||(e.options[n]=Object(l.a)(a),t=!0)}))})),L(t?Object(l.a)(z):z);case 2:case"end":return e.stop()}}),e)})))()}),[z,Ce]),Object(m.useEffect)((function(){return a.setFieldsValue({dataSource:z})}),[a,z]),Object(M.jsxs)(h.c,{loading:A,ref:K,className:p()(te.a.root),children:[Object(M.jsx)(h.e,{noStyle:!0,shouldUpdate:!0,children:function(e){((0,e.getFieldValue)("dataSource")||[]).forEach((function(e){var t=z.find((function(t){return t.id===e.id}));t&&Object.entries(e).forEach((function(e){var n=Object(f.a)(e,2),a=n[0],r=n[1];t[a]=r}))}))}}),Object(M.jsx)(k.a,{tabBarExtraContent:{left:Object(M.jsxs)(r.b,{style:{marginRight:16},children:[Object(M.jsx)(i.a,{icon:Object(M.jsx)(_.a,{}),type:"primary",ghost:!0,onClick:function(){return we()},children:"\u6dfb\u52a0\u4e00\u884c"}),Object(M.jsx)(i.a,{icon:Object(M.jsx)(I.a,{}),onClick:function(){return Pe(!0)},children:"\u4ee3\u7801\u9884\u89c8"}),Object(M.jsx)(i.a,{type:"primary",danger:!0,icon:Object(M.jsx)(S.a,{}),onClick:function(){return Pe()},children:"\u751f\u6210\u6587\u4ef6"})]}),right:Object(M.jsxs)(r.b,{children:[Object(M.jsx)(i.a,{type:"primary",ghost:!0,icon:Object(M.jsx)(N.a,{}),disabled:!(null!==n&&void 0!==n&&n.length),onClick:function(){return Oe(!0)},children:"\u6279\u91cf\u751f\u6210"}),Object(M.jsx)(i.a,{icon:Object(M.jsx)(P.a,{}),onClick:Te,children:"\u66f4\u65b0\u672c\u5730\u6a21\u7248"}),Object(M.jsx)(i.a,{icon:Object(M.jsx)(T.a,{}),onClick:function(){return fe(!0)},children:"\u5e2e\u52a9"})]})},activeKey:re,onChange:ie,children:Se.map((function(e){return Object(M.jsx)(ae,{tab:e.tab},e.key)}))}),Object(M.jsx)(ne,{onSortEnd:ge,size:"small",columns:Ne,pagination:!1,dataSource:z,rowKey:"id",scroll:{y:Y}}),Object(M.jsx)(Z,{visible:!!G,params:G,onOk:function(){return X(null)},onCancel:function(){return X(null)}}),Object(M.jsx)(Q,{visible:be,onCancel:function(){return fe(!1)}}),Object(M.jsx)($,{visible:me,onCancel:function(){return Oe(!1)},dbUrl:b,files:O,tableOptions:n})]})})),ie=n(967),ce=n.n(ie),oe=n(973),le=(n(168),n(63)),se=n(215),ue=n(259),de=n(463),be=n(976);function fe(e){var t=e.value,n=e.onChange,a=e.moduleNames,r=e.templateOptions,i=e.templateId,l=Object(c.a)(e,["value","onChange","moduleNames","templateOptions","templateId"]),s=Object(m.useState)(!1),b=Object(f.a)(s,2),j=b[0],p=b[1],O=Object(be.a)(a);return Object(m.useEffect)((function(){if(t){var e,c,o=t;if(O!==a)o=null===(e=r.find((function(e){return e.value===i})))||void 0===e||null===(c=e.record)||void 0===c?void 0:c.targetPath;var l=Object(V.d)(o,a);n(l);var s=setTimeout(Object(d.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,de.b.post("/generate/file/exist",{targetPath:l});case 2:t=e.sent,p(t);case 4:case"end":return e.stop()}}),e)}))),300);return function(){return clearTimeout(s)}}}),[t,a,n,O,r,i]),Object(M.jsxs)("div",{children:[Object(M.jsx)(le.a,Object(o.a)({value:t,onChange:n},l)),Object(M.jsx)("span",{style:{marginLeft:4},children:j?Object(M.jsx)(se.a,{style:{color:"orange"}}):Object(M.jsx)(ue.a,{style:{color:"green"}})})]})}t.default=Object(v.a)({path:"/",title:"\u9996\u9875"})((function(e){var t=Object(m.useState)([]),n=Object(f.a)(t,2),a=n[0],s=n[1],j=Object(m.useState)([]),v=Object(f.a)(j,2),w=v[0],y=v[1],k=Object(m.useState)({}),C=Object(f.a)(k,2),_=C[0],I=C[1],S=Object(m.useState)({}),N=Object(f.a)(S,2),P=N[0],T=N[1],F=b.a.useForm(),E=Object(f.a)(F,1)[0],V=Object(m.useCallback)(function(){var t=Object(d.a)(u.a.mark((function t(n){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.ajax.get("/db/tables",{dbUrl:n});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e.ajax]),q=Object(m.useCallback)(function(){var t=Object(d.a)(u.a.mark((function t(n){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.ajax.get("/moduleNames/".concat(n));case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e.ajax]),z=Object(m.useCallback)(Object(d.a)(u.a.mark((function t(){return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.ajax.get("/templates");case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)}))),[e.ajax]),L=Object(oe.a)((function(){return T({})}),{wait:300}).run,U=Object(oe.a)(function(){var e=Object(d.a)(u.a.mark((function e(t){var n,a,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return E.setFieldsValue({tableName:void 0,moduleName:void 0}),e.prev=1,a=t.target.value,e.next=5,V(a);case 5:r=e.sent,n=r.map((function(e){return{value:e.name,label:"".concat(e.name).concat(e.comment?"\uff08".concat(e.comment,"\uff09"):""),comment:e.comment}})),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(1),n=[];case 12:s(n);case 13:case"end":return e.stop()}}),e,null,[[1,9]])})));return function(t){return e.apply(this,arguments)}}(),{wait:300}).run,B=Object(oe.a)(function(){var e=Object(d.a)(u.a.mark((function e(t){var n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,q(t);case 2:n=e.sent,I(n),E.setFieldsValue({moduleName:n["module-name"]}),L();case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),{wait:300}).run,A=Object(oe.a)(function(){var e=Object(d.a)(u.a.mark((function e(t){var n,a;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.target.value){e.next=3;break}return e.abrupt("return");case 3:return e.next=5,q(n);case 5:a=e.sent,I(a);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),{wait:300}).run,R=Object(m.useCallback)((function(e,t){var n=w.find((function(e){return e.value===t})).record,a=n.targetPath,r=n.options,i=E.getFieldValue("files"),c=E.getFieldValue(["files",e]);c.targetPath=a,c.options=Object(l.a)(r),i[e]=c,E.setFieldsValue({files:Object(l.a)(i)}),L()}),[w,E,L]),K=Object(m.useRef)(0),D=Object(m.useCallback)((function(){clearTimeout(K.current),K.current=setTimeout((function(){var e=E.getFieldsValue(),t=e.dbUrl,n=e.files;h.D.local.setItem("files",n),h.D.local.setItem("dbUrl",t)}),500)}),[E]);return Object(m.useEffect)((function(){Object(d.a)(u.a.mark((function e(){var t,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z();case 2:t=e.sent,n=t.map((function(e){return{record:e,value:e.id,label:e.name}})),y(n);case 5:case"end":return e.stop()}}),e)})))()}),[z]),Object(m.useEffect)((function(){Object(d.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=h.D.local.getItem("dbUrl")){e.next=3;break}return e.abrupt("return");case 3:return E.setFieldsValue({dbUrl:t}),e.next=6,U({target:{value:t}});case 6:case"end":return e.stop()}}),e)})))()}),[E,U]),Object(m.useEffect)((function(){if(null!==w&&void 0!==w&&w.length){var e=h.D.local.getItem("files");if(!e){var t=w[0].record;e=[{templateId:t.id,targetPath:t.targetPath,options:Object(l.a)(t.options)}]}var n=e.map((function(e){var t,n=null===(t=w.find((function(t){return t.value===e.templateId})))||void 0===t?void 0:t.record;return n?Object(o.a)(Object(o.a)({},e),n):null})).filter(Boolean);null!==n&&void 0!==n&&n.length&&E.setFieldsValue({files:n})}}),[E,w]),Object(M.jsx)(h.m,{className:p()(ce.a.root),children:Object(M.jsxs)(b.a,{style:{marginBottom:8},form:E,layout:"inline",initialValues:{files:[{}]},onValuesChange:D,className:p()(ce.a.query),children:[Object(M.jsx)(h.e,{labelCol:{flex:"100px"},style:{width:300},align:"right",label:"\u6570\u636e\u5e93",name:"dbUrl",placeholder:"mysql://username:password@host:port/database",onChange:U,tooltip:"\u652f\u6301mysql\u3001oracle"}),Object(M.jsx)(h.e,{labelCol:{flex:"100px"},style:{width:308},type:"select",showSearch:!0,label:"\u6570\u636e\u5e93\u8868",name:"tableName",onChange:B,options:a}),Object(M.jsx)(h.e,{labelCol:{flex:"91px"},style:{width:200},label:"\u6a21\u5757\u540d",name:"moduleName",placeholder:"\u6bd4\u5982\uff1auser-center",onChange:A,required:!0}),Object(M.jsx)("div",{style:{width:"100%",marginTop:8},children:Object(M.jsx)(b.a.List,{name:"files",children:function(e,t){var n=t.add,a=t.remove;return Object(M.jsx)(M.Fragment,{children:e.map((function(t,s){var u,d=t.key,b=t.name,f=(t.isListField,Object(c.a)(t,["key","name","isListField"])),j=0===s,m=s+1,v=m;j&&(v="\u6587\u4ef6".concat(m));var y=E.getFieldValue(["files",b,"templateId"]),k=null===(u=w.find((function(e){return e.value===y})))||void 0===u?void 0:u.record,C=(null===k||void 0===k?void 0:k.options)||[];return Object(M.jsxs)("div",{className:p()(ce.a.fileRow),children:[Object(M.jsxs)(r.b,{className:p()(ce.a.fileOperator),children:[Object(M.jsx)(i.a,{danger:!0,icon:Object(M.jsx)(O.a,{}),type:"link",disabled:1===e.length,onClick:function(){a(b),L()},className:p()(ce.a.fileMinus)}),j&&e.length<w.length&&Object(M.jsx)(i.a,{type:"link",icon:Object(M.jsx)(x.a,{}),onClick:function(){var e,t=E.getFieldValue("files"),a=(null===(e=w.find((function(e){return!t.find((function(t){return t.templateId===e.value}))})))||void 0===e?void 0:e.record)||{},r=a.id,i=a.targetPath,c=a.options;n({templateId:r,targetPath:i,options:Object(l.a)(c)}),L()},className:p()(ce.a.filePlus)})]}),Object(M.jsx)(h.e,{noStyle:!0,shouldUpdate:function(e,t){var n,a;return(null===e||void 0===e||null===(n=e.files)||void 0===n?void 0:n.length)!==(null===t||void 0===t||null===(a=t.files)||void 0===a?void 0:a.length)},children:function(e){var t=(0,e.getFieldValue)("files"),n=w.filter((function(e){return y===e.value||!t.find((function(t){return t.templateId===e.value}))}));return Object(M.jsx)("div",{style:{width:329},children:Object(M.jsx)(h.e,Object(o.a)(Object(o.a)({},f),{},{labelCol:{flex:"100px",style:{userSelect:"none"}},style:{width:211},label:v,name:[b,"templateId"],rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u6a21\u677f\u6587\u4ef6\uff01"}],options:n,placeholder:"\u8bf7\u9009\u62e9\u6a21\u677f",onChange:function(e){return R(b,e)}}))})}}),Object(M.jsx)(h.e,Object(o.a)(Object(o.a)({},f),{},{label:"\u76ee\u6807\u4f4d\u7f6e",name:[b,"targetPath"],rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u76ee\u6807\u6587\u4ef6\u4f4d\u7f6e\uff01"},{validator:function(e,t){return t&&E.getFieldValue("files").filter((function(e){return e.targetPath===t})).length>1?Promise.reject("\u4e0d\u80fd\u4f7f\u7528\u76f8\u540c\u7684\u76ee\u6807\u6587\u4ef6\uff01\u8bf7\u4fee\u6539"):Promise.resolve()}}],children:Object(M.jsx)(fe,{style:{width:400},moduleNames:_,templateId:E.getFieldValue(["files",b,"templateId"]),templateOptions:w,placeholder:"\u8bf7\u8f93\u5165\u76ee\u6807\u6587\u4ef6\u4f4d\u7f6e"})})),Object(M.jsx)(h.e,Object(o.a)(Object(o.a)({},f),{},{name:[b,"options"],children:Object(M.jsx)(g.e,{options:C})}))]},d)}))})}})}),Object(M.jsx)(re,{refreshTable:P,form:E,templateOptions:w,tableOptions:a})]})})}))},961:function(e,t,n){var a=n(147),r=n(962);"string"===typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var i={insert:"head",singleton:!1};a(r,i);e.exports=r.locals||{}},962:function(e,t,n){"use strict";n.r(t);var a=n(76),r=n.n(a)()(!1);r.push([e.i,".root_12CT6 .front-table-container:before,\n.root_12CT6 .front-table-container:after {\n  display: none;\n}\n.row_sSTfY {\n  display: flex;\n  align-items: center;\n  border-bottom: 1px solid #e8e8e8;\n  background: #FFF;\n  box-sizing: border-box;\n  cursor: move;\n}\n.row_sSTfY .front-form-item {\n  margin: 0 !important;\n  position: relative;\n}\n.row_sSTfY .front-form-item-explain {\n  position: absolute;\n  bottom: -21px;\n  z-index: 10;\n}\n.cell_3NZ7V {\n  height: 100%;\n  display: flex;\n  align-items: center;\n  padding: 0 4px;\n  width: 0;\n  box-sizing: border-box;\n}\n.cell_3NZ7V .text_2_OSf {\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n",""]),r.locals={antPrefix:"front",raLibPrefix:"front-ra",primaryColor:"#1890ff",root:"root_12CT6",row:"row_sSTfY",cell:"cell_3NZ7V",text:"text_2_OSf"},t.default=r},963:function(e,t,n){var a=n(147),r=n(964);"string"===typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var i={insert:"head",singleton:!1};a(r,i);e.exports=r.locals||{}},964:function(e,t,n){"use strict";n.r(t);var a=n(76),r=n.n(a)()(!1);r.push([e.i,".root_3bC8e {\n  background-color: #fafafa;\n}\n.root_3bC8e .front-form-item {\n  margin: 0 !important;\n}\n.root_3bC8e .front-tabs-nav {\n  margin-bottom: 0;\n}\n.root_3bC8e .front-form-item {\n  margin-bottom: 0;\n}\n.root_3bC8e tbody > tr {\n  cursor: move;\n}\n.element_IFQjZ {\n  position: relative;\n  box-sizing: border-box;\n  width: 100%;\n}\n.element_IFQjZ.required_2jtF5 {\n  padding-left: 10px;\n}\n.element_IFQjZ.required_2jtF5:before {\n  position: absolute;\n  display: inline-block;\n  left: 0;\n  top: 10px;\n  color: #ff4d4f;\n  font-size: 14px;\n  font-family: SimSun, sans-serif;\n  line-height: 1;\n  content: '*';\n}\n.tabColumn_YdMvS {\n  background: rgba(24, 144, 255, 0.05);\n}\n.helper_Ii5wz {\n  display: table-row;\n}\n.helper_Ii5wz td {\n  border-bottom: 1px solid #f0f0f0;\n  border-top: 1px solid #f0f0f0;\n  padding: 8px;\n  display: table-cell;\n  vertical-align: center;\n  background: #fff;\n  width: 10000px;\n  border-collapse: collapse;\n}\n.helper_Ii5wz .front-form-item_1zkjG {\n  margin-bottom: 0;\n}\n",""]),r.locals={antPrefix:"front",raLibPrefix:"front-ra",primaryColor:"#1890ff",root:"root_3bC8e",element:"element_IFQjZ",required:"required_2jtF5",tabColumn:"tabColumn_YdMvS",helper:"helper_Ii5wz","front-form-item":"front-form-item_1zkjG"},t.default=r},967:function(e,t,n){var a=n(147),r=n(968);"string"===typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var i={insert:"head",singleton:!1};a(r,i);e.exports=r.locals||{}},968:function(e,t,n){"use strict";n.r(t);var a=n(76),r=n.n(a)()(!1);r.push([e.i,".root_2ozUS {\n  height: 100vh;\n  overflow: hidden;\n  margin: 0;\n}\n.query_2Kszu .front-form-item {\n  margin-bottom: 6px;\n}\n.query_2Kszu .front-form-item-explain {\n  position: absolute;\n  margin-top: -3px;\n  z-index: 10;\n}\n.fileRow_3g0C2 {\n  display: flex;\n  align-items: center;\n  padding-top: 7px;\n  background: #eee;\n  position: relative;\n}\n.fileMinus_2CmC6,\n.filePlus_1BFCJ {\n  width: 14px;\n  height: 14px;\n}\n.fileOperator_2c7Sf {\n  display: flex;\n  align-items: center;\n  position: absolute;\n  left: 5px;\n  top: -2px;\n  height: 100%;\n  z-index: 10;\n}\n",""]),r.locals={antPrefix:"front",raLibPrefix:"front-ra",primaryColor:"#1890ff",root:"root_2ozUS",query:"query_2Kszu",fileRow:"fileRow_3g0C2",fileMinus:"fileMinus_2CmC6",filePlus:"filePlus_1BFCJ",fileOperator:"fileOperator_2c7Sf"},t.default=r}}]);