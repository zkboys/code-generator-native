(this.webpackJsonp_front=this.webpackJsonp_front||[]).push([[15],{1056:function(e,t,a){"use strict";a.r(t);var n,l,r,i=a(32),o=(a(572),a(343)),s=a(2),c=a.n(s),d=a(0),u=a.n(d),b=a(21),h=(a(251),a(125)),m=(a(342),a(183)),f=(a(89),a(27)),p=a(18),g=(a(218),a(105)),j=a(126),v=a(410),y=a(411),O=a(412),w=a(413),x=a(239),S=a(250),C=a(574),T=a(5),E=Object(b.N)(b.p),N=function(e,t){var a={children:e,props:{}};return t.isTable&&(a.props.colSpan=0),a},F=Object(S.a)({ajax:!0})(n=function(e){Object(O.a)(a,e);var t=Object(w.a)(a);function a(){var e;Object(v.a)(this,a);for(var n=arguments.length,l=new Array(n),r=0;r<n;r++)l[r]=arguments[r];return(e=t.call.apply(t,[this].concat(l))).state={loading:!1,selectedRowKeys:[],dataSource:[]},e.columns=[{title:"\u8868\u540d",dataIndex:"tableName",width:200},{title:"\u6570\u636e\u5e93\u6ce8\u91ca",dataIndex:"comment",width:200},{title:Object(T.jsx)("span",{style:{paddingLeft:10},children:"\u4e2d\u6587\u540d"}),dataIndex:"chinese",width:250,formProps:function(e,t){return{label:" ",colon:!1,style:{width:200},required:!0,tabIndex:t+1,onBlur:function(t){e.chinese=t.target.value}}},render:N},{title:Object(T.jsx)("span",{style:{paddingLeft:10},children:"\u5217\u540d"}),dataIndex:"field",width:250,formProps:function(e,t){return e.isTable?null:{label:" ",colon:!1,style:{width:200},required:!0,tabIndex:t+100,onBlur:function(t){e.field=t.target.value}}},render:function(t,a){if(a.isTable){var n=Object(C.renderTags)(a,(function(){return e.setState({dataSource:Object(j.a)(e.state.dataSource)})}));return{children:Object(T.jsx)("div",{style:{textAlign:"right"},children:n}),props:{colSpan:3}}}return t}},{title:"\u9009\u9879",dataIndex:"options",render:function(t,a){return{children:Object(C.renderFieldTags)(a,(function(){return e.setState({dataSource:Object(j.a)(e.state.dataSource)})})),props:{colSpan:a.isTable?0:1}}}}],e.handleSubmit=function(t){e.setState({loading:!0}),e.props.ajax.get("/ra-gen/tables",t).then((function(t){var a=Object(C.getTables)(t),n=a.dataSource,l=a.selectedRowKeys;e.setState({dataSource:n,selectedRowKeys:l})})).finally((function(){return e.setState({loading:!1})}))},e.handleDbUrlChange=function(e){var t=e.target.value;window.localStorage.setItem(C.DB_URL_STORE_KEY,t||"")},e.handleGen=function(){g.a.confirm({icon:Object(T.jsx)(x.a,{}),title:"\u540c\u540d\u6587\u4ef6\u5c06\u88ab\u8986\u76d6\uff0c\u662f\u5426\u7ee7\u7eed\uff1f",content:"\u4ee3\u7801\u6587\u4ef6\u76f4\u63a5\u751f\u6210\u5230\u9879\u76ee\u76ee\u5f55\u4e2d\uff0c\u4f1a\u5f15\u8d77webpack\u7684\u70ed\u66f4\u65b0\uff0c\u5f53\u524d\u9875\u9762\u6709\u53ef\u80fd\u4f1a\u91cd\u65b0\u52a0\u8f7d\u3002",onOk:function(){var t=e.state,a=t.selectedRowKeys,n={tables:t.dataSource.filter((function(e){return a.includes(e.id)})).map((function(e){var t=e.children.map((function(e){return{field:e.field,chinese:Object(C.getLabel)(e.chinese),name:e.name,type:e.type,length:e.length,isNullable:e.isNullable,isForm:e.isForm,isColumn:e.isColumn,isQuery:e.isQuery}}));return Object(p.a)(Object(p.a)({},e),{},{children:t})}))};e.setState({loading:!0}),e.props.ajax.post("/ra-gen/tables",n,{successTip:"\u751f\u6210\u6210\u529f\uff01"}).then((function(e){console.log(e)})).finally((function(){return e.setState({loading:!1})}))}})},e}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var e=window.localStorage.getItem(C.DB_URL_STORE_KEY)||"";e&&(this.form.setFieldsValue({dbUrl:e}),this.form.submit())}},{key:"render",value:function(){var e=this,t=this.state,a=t.dataSource,n=t.selectedRowKeys,l=t.loading;return Object(T.jsxs)(b.m,{style:{padding:0,margin:0},loading:l,children:[Object(T.jsx)(b.o,{style:{marginLeft:0,marginRight:0},children:Object(T.jsx)(h.a,{ref:function(t){return e.form=t},onFinish:this.handleSubmit,children:Object(T.jsxs)(m.b,{children:[Object(T.jsx)(b.e,{label:"\u6570\u636e\u5e93\u5730\u5740",name:"dbUrl",placeholder:"mysql://username:password@host:port/database",required:!0,onChange:this.handleDbUrlChange,style:{width:400},rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6570\u636e\u5e93\u5730\u5740\uff01"}]}),Object(T.jsx)(b.e,{children:Object(T.jsxs)(m.b,{children:[Object(T.jsx)(f.a,{type:"primary",htmlType:"submit",children:"\u83b7\u53d6\u6570\u636e\u5e93\u8868"}),Object(T.jsx)(f.a,{disabled:!(null!==n&&void 0!==n&&n.length),onClick:this.handleGen,children:"\u751f\u6210\u9009\u4e2d\u8868"})]})})]})})}),Object(T.jsx)(E,{fitHeight:!0,rowSelection:{selectedRowKeys:n,onChange:function(t){return e.setState({selectedRowKeys:t})},renderCell:function(e,t,a,n){return t.isTable?n:null}},dataSource:a,columns:this.columns,rowKey:"id"})]})}}]),a}(d.Component))||n,I=(a(184),a(67)),k=a(41),q=a.n(k),D=a(163),K=a(1123),U=a(1111),R=a.n(U),V=a(186),_=function(e){Object(O.a)(a,e);var t=Object(w.a)(a);function a(e){var n;return Object(v.a)(this,a),(n=t.call(this,e)).state={containerHeight:"auto"},n.setHeight=function(){var e=document.documentElement.clientHeight||document.body.clientHeight;console.log(e);var t=e-286;n.setState({containerHeight:t})},n.highlight=function(){console.log(n.ref),n.ref&&n.ref.current&&R.a.highlightElement(n.ref.current)},n.ref=u.a.createRef(),n}return Object(y.a)(a,[{key:"componentDidMount",value:function(){this.highlight(),this.setHeight(),window.addEventListener("resize",this.setHeight)}},{key:"componentDidUpdate",value:function(){this.highlight()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.setHeight)}},{key:"render",value:function(){var e=this,t=this.props.code,a=this.state.containerHeight;return Object(T.jsx)("div",{ref:function(t){return e.container=t},style:{height:a},children:Object(T.jsx)(V.a,{showHeader:!1,value:t,readOnly:!0})})}}]),a}(u.a.Component),L=o.a.TabPane,P=Object(S.a)({modal:{title:"\u4ee3\u7801\u9884\u89c8",width:"70%",top:50}})(l=function(e){Object(O.a)(a,e);var t=Object(w.a)(a);function a(){var e;Object(v.a)(this,a);for(var n=arguments.length,l=new Array(n),r=0;r<n;r++)l[r]=arguments[r];return(e=t.call.apply(t,[this].concat(l))).state={},e}return Object(y.a)(a,[{key:"render",value:function(){var e=this.props,t=e.previewCode,a=e.onCancel;return Object(T.jsx)(b.k,{surplusSpace:!0,footer:Object(T.jsx)(f.a,{onClick:a,children:"\u5173\u95ed"}),bodyStyle:{padding:0},children:Object(T.jsx)(o.a,{tabBarStyle:{margin:"0 16px"},children:t.map((function(e){var t=e.config.fileTypeName,a=e.code;return Object(T.jsx)(L,{tab:t,children:Object(T.jsx)(_,{language:"jsx",plugins:["line-numbers"],code:a})},t)}))})})}}]),a}(d.Component))||l,H=Object(b.N)(Object(b.O)(b.p)),Q=Object(S.a)({ajax:!0})(r=function(e){Object(O.a)(a,e);var t=Object(w.a)(a);function a(){var e;Object(v.a)(this,a);for(var n=arguments.length,l=new Array(n),r=0;r<n;r++)l[r]=arguments[r];return(e=t.call.apply(t,[this].concat(l))).state={loading:!1,total:0,pageNum:1,pageSize:20,deleting:!1,table:{},tables:[],ignoreFields:[],previewVisible:!1,previewCode:"",fastEdit:!1},e.columns=[{title:"\u6ce8\u91ca",dataIndex:"comment"},{title:"\u4e2d\u6587\u540d",dataIndex:"chinese",width:240,formProps:function(t,a){var n=a+1;return{label:" ",colon:!1,style:{width:200},required:!0,tabIndex:n,onFocus:e.handleFocus,onBlur:function(e){t.chinese=e.target.value},onKeyDown:function(t){return e.handleKeyDown(t,n)}}}},{title:"\u5217\u540d",dataIndex:"field",width:240,formProps:function(t,a){if(t.isTable)return null;var n=e.state.table.children,l=a+((null===n||void 0===n?void 0:n.length)||0)+1;return{label:" ",colon:!1,style:{width:200},required:!0,tabIndex:l,onFocus:e.handleFocus,onBlur:function(e){t.field=e.target.value},onKeyDown:function(t){return e.handleKeyDown(t,l)}}}},{title:"\u8868\u5355\u7c7b\u578b",dataIndex:"formType",width:240,formProps:function(e){return e.isTable?null:{label:" ",colon:!1,style:{width:200},type:"select",showSearch:!0,options:[{value:"input",label:"\u8f93\u5165\u6846"},{value:"hidden",label:"\u9690\u85cf\u6846"},{value:"number",label:"\u6570\u5b57\u6846"},{value:"textarea",label:"\u6587\u672c\u6846"},{value:"password",label:"\u5bc6\u7801\u6846"},{value:"mobile",label:"\u624b\u673a\u8f93\u5165\u6846"},{value:"email",label:"\u90ae\u7bb1\u8f93\u5165\u6846"},{value:"select",label:"\u4e0b\u62c9\u6846"},{value:"select-tree",label:"\u4e0b\u62c9\u6811"},{value:"checkbox",label:"\u590d\u9009\u6846"},{value:"checkbox-group",label:"\u590d\u9009\u6846\u7ec4"},{value:"radio",label:"\u5355\u9009\u6846"},{value:"radio-group",label:"\u5355\u9009\u6846\u7ec4"},{value:"radio-button",label:"\u5355\u9009\u6309\u94ae\u7ec4"},{value:"switch",label:"\u5207\u6362\u6309\u94ae"},{value:"date",label:"\u65e5\u671f\u9009\u62e9\u6846"},{value:"time",label:"\u65f6\u95f4\u9009\u62e9\u6846"},{value:"moth",label:"\u6708\u4efd\u9009\u62e9\u6846"},{value:"date-time",label:"\u65e5\u671f+\u65f6\u95f4\u9009\u62e9\u6846"},{value:"date-range",label:"\u65e5\u671f\u533a\u95f4\u9009\u62e9\u6846"},{value:"cascader",label:"\u7ea7\u8054\u4e0b\u62c9\u6846"},{value:"transfer",label:"\u7a7f\u68ad\u6846"}],onChange:function(t){e.formType=t}}}},{title:"\u9009\u9879",dataIndex:"operator",width:270,render:function(t,a){return Object(C.renderFieldTags)(a,(function(){return e.setState({table:Object(p.a)({},e.state.table)})}))}},{title:"\u64cd\u4f5c",dataIndex:"operator",width:100,render:function(t,a){var n=a.id,l=a.chinese,r=[{label:"\u5220\u9664",color:"red",confirm:{title:'\u60a8\u786e\u5b9a\u5220\u9664"'.concat(l,'"?'),onConfirm:function(){return e.handleDelete(n)}}}];return Object(T.jsx)(b.l,{items:r})}}],e.handleFocus=function(e){e.target.select()},e.handleKeyDown=function(t,a){var n=t.keyCode,l=t.ctrlKey,r=t.shiftKey,i=t.altKey,o=t.metaKey;if(!(l||r||i||o)){var s,c=e.state.table.children,d=(null===c||void 0===c?void 0:c.length)||0,u=39===n,b=40===n,h=13===n;(b||h)&&(s=a===d||a===2*d?void 0:a+1),38===n&&(s=a-1),37===n&&(s=a<=d?a-1<=0?void 0:a-1+d:a-d),u&&(s=a<=d?a+d:a-d===d?void 0:a-d+1);var m=document.querySelector("input[tabindex='".concat(s,"']"));m?setTimeout((function(){m.focus(),m.select()})):(h||b||u)&&(e.handleAdd(!0),setTimeout((function(){var t=a;u&&(t=a-d),(b||h)&&a===2*d&&(t=a+1),e.handleKeyDown({keyCode:13},t)})))}},e.handleTypeChange=function(t){var a=t.target.value;"mysql"===a&&e.handleDbUrlChange(),"customer"===a&&e.handleModuleNameChange(),"swagger"===a&&e.handleSwaggerChange()},e.handleDbUrlChange=function(t){var a=e.form.getFieldValue("dbUrl");window.localStorage.setItem(C.DB_URL_STORE_KEY,a||""),e.setState({tables:[],table:{}}),e.form.setFieldsValue({tableName:void 0}),a&&(e.setState({loading:!0}),e.props.ajax.get("/ra-gen/tables",{dbUrl:a}).then((function(t){var a=Object(C.getTables)(t).dataSource;e.setState({tables:a},(function(){var t,n=null===(t=a[0])||void 0===t?void 0:t.tableName;e.form.setFieldsValue({tableName:n}),e.handleTableNameChange(n)}))})).finally((function(){return e.setState({loading:!1})})))},e.handleSwaggerChange=function(){var t=e.form.getFieldValue("swaggerUrl");if(window.localStorage.setItem(C.SWAGGER_URL_STORE_KEY,t),e.setState({tables:[],table:{}}),e.form.setFieldsValue({tableName:void 0}),t){var a={swaggerUrl:t,method:e.form.getFieldValue("method"),userName:e.form.getFieldValue("userName"),password:e.form.getFieldValue("password")};e.setState({loading:!0}),e.props.ajax.get("/ra-gen/swagger",a).then((function(t){var a=t.moduleName,n=t.queries,l=t.columns,r=t.forms,i=[];(n||[]).forEach((function(e){var t=e.type,n=e.field,l=e.label,r=e.required,o=Object(C.getLabel)(l),s=Object(C.getFormElementType)({oType:t,label:o});i.push({id:Object(K.a)(),tableName:a,field:n,comment:l,chinese:o,name:n,type:t,formType:s,length:0,isNullable:!r,isColumn:!0,isQuery:!0,isForm:!0,isExport:!0,isImport:!0,isIgnore:!1})})),(l||[]).forEach((function(e){var t=e.title,n=e.dataIndex;if(!i.find((function(e){return e.field===n}))){var l=Object(C.getFormElementType)({oType:"input",label:t});i.push({id:Object(K.a)(),tableName:a,field:n,comment:t,chinese:Object(C.getLabel)(t),name:n,type:"string",formType:l,length:0,isNullable:!0,isColumn:!0,isQuery:!1,isForm:!0,isExport:!0,isImport:!0,isIgnore:!1})}})),(r||[]).forEach((function(e){var t=e.type,n=e.field,l=e.label;if(!i.find((function(e){return e.field===n}))){var r=Object(C.getFormElementType)({oType:t,label:l});i.push({id:Object(K.a)(),tableName:a,field:n,comment:l,chinese:Object(C.getLabel)(l),name:n,type:t,formType:r,length:0,isNullable:!0,isColumn:!0,isQuery:!1,isForm:!0,isExport:!0,isImport:!0,isIgnore:!1})}}));var o={id:a,isTable:!0,tableName:a,comment:"",query:!0,selectable:!0,pagination:!0,serialNumber:!0,add:!0,operatorEdit:!0,operatorDelete:!0,batchDelete:!0,export:!0,import:!1,children:i};e.setState({table:o})})).finally((function(){return e.setState({loading:!1})}))}},e.handleModuleNameChange=function(){e.setState({tables:[],table:{}});var t=e.form.getFieldValue("moduleName");if(t){var a=t,n="name";e.setState({table:{id:a,isTable:!0,tableName:a,comment:"",query:!0,selectable:!0,pagination:!0,serialNumber:!0,add:!0,operatorEdit:!0,operatorDelete:!0,batchDelete:!0,import:!0,export:!0,children:[{id:Object(K.a)(),tableName:a,field:n,comment:"\u7528\u6237\u540d",chinese:"\u7528\u6237\u540d",name:n,type:"string",formType:"input",length:0,isNullable:!0,isColumn:!0,isQuery:!0,isForm:!0,isExport:!0,isImport:!0,isIgnore:!1}]}})}},e.handleDelete=function(t){var a=e.state.table,n=a.children;a.children=n.filter((function(e){return e.id!==t})),e.setState({table:Object(p.a)({},a)})},e.handleTableNameChange=function(t){var a=e.state.tables.find((function(e){return e.tableName===t}));e.setState({table:a})},e.handleAdd=function(t){var a=e.state.table;a.children||(a.children=[]);var n=a.children.length,l=a.tableName,r=a.children,i="field".concat(n+1),o={id:Object(K.a)(),tableName:l,field:i,comment:"\u65b0\u589e\u5217",chinese:"\u65b0\u589e\u5217",name:i,type:"string",formType:"input",length:0,isNullable:!0,isColumn:!0,isQuery:!1,isExport:!0,isImport:!0,isIgnore:!1};t?r.push(o):r.unshift(o),a.children=Object(j.a)(r),e.setState({table:Object(p.a)({},a)})},e.getParams=function(){var t=Object(D.a)(q.a.mark((function t(a){var n,l;return q.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.form.validateFields();case 2:if(null!==(n=e.state.table)&&void 0!==n&&null!==(l=n.children)&&void 0!==l&&l.length){t.next=5;break}return g.a.error({icon:Object(T.jsx)(x.a,{}),title:"\u6e29\u99a8\u63d0\u793a",content:"\u5b57\u6bb5\u914d\u7f6e\u4e3a\u7a7a\uff0c\u65e0\u6cd5\u751f\u6210\uff0c\u8bf7\u6dfb\u52a0\u5b57\u6bb5\u4fe1\u606f\uff01"}),t.abrupt("return",Promise.reject());case 5:return t.abrupt("return",new Promise((function(t,n){var l=function(){var a=e.state.table,n=a.children.map((function(e){return{field:e.field,chinese:Object(C.getLabel)(e.chinese),name:e.name,type:e.type,formType:e.formType||"input",isNullable:e.isNullable,isForm:e.isForm,isColumn:e.isColumn,isQuery:e.isQuery}})),l={tables:[Object(p.a)(Object(p.a)({},a),{},{children:n})]};t(l)};a?g.a.confirm({icon:Object(T.jsx)(x.a,{}),title:"\u540c\u540d\u6587\u4ef6\u5c06\u88ab\u8986\u76d6\uff0c\u662f\u5426\u7ee7\u7eed\uff1f",content:"\u4ee3\u7801\u6587\u4ef6\u76f4\u63a5\u751f\u6210\u5230\u9879\u76ee\u76ee\u5f55\u4e2d\uff0c\u4f1a\u5f15\u8d77webpack\u7684\u70ed\u66f4\u65b0\uff0c\u5f53\u524d\u9875\u9762\u6709\u53ef\u80fd\u4f1a\u91cd\u65b0\u52a0\u8f7d\u3002",onOk:function(){l()},onCancel:function(){n()}}):l()})));case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.handleGen=Object(D.a)(q.a.mark((function t(){var a;return q.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getParams(!0);case 2:a=t.sent,e.setState({loading:!0}),e.props.ajax.post("/ra-gen/tables",a,{successTip:"\u751f\u6210\u6210\u529f\uff01"}).finally((function(){return e.setState({loading:!1})}));case 5:case"end":return t.stop()}}),t)}))),e.handlePreview=Object(D.a)(q.a.mark((function t(){var a;return q.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getParams();case 2:a=t.sent,e.setState({loading:!0}),e.props.ajax.post("/ra-gen/preview",a).then((function(t){e.setState({previewVisible:!0,previewCode:t})})).finally((function(){return e.setState({loading:!1})}));case 5:case"end":return t.stop()}}),t)}))),e.handleSortEnd=function(t){var a=t.newIndex,n=t.oldIndex,l=e.state.table,r=void 0===l?{}:l,i=r.children,o=void 0===i?[]:i;o.splice.apply(o,[a,0].concat(Object(j.a)(o.splice(n,1)))),r.children=Object(j.a)(o),e.setState({table:Object(p.a)({},r)})},e.handleFastEdit=function(){var t=e.state,a=t.fastEdit,n=t.table,l=!a;if(e.setState({fastEdit:l}),!l){var r=document.getElementById("fastTextArea").value;if(!r)return void e.setState({table:Object(p.a)(Object(p.a)({},n),{},{children:[]})});var o=r.split("\n"),s=[];o.forEach((function(e,t){var a=e.trim();if(a=a.replace(/\s+/g," ")){var n=a.includes("isColumn"),l=a.includes("isForm"),r=a.includes("isQuery");if(a=(a=(a=(a=a.replace("isColumn","")).replace("isForm","")).replace("isQuery","")).replace(/\s+/g," ")){var o=a.split(" "),c=Object(i.a)(o,3),d=c[0],u=c[1],b=c[2];b||(b=Object(C.getFormElementType)({label:d})),u||(u=Object(C.getFormElementName)({label:d,fields:s.map((function(e){return e.field}))})),n||l||r||(n=!0,l=!0),s.push({id:u,comment:d,chinese:d,field:u,formType:b,isColumn:n,isForm:l,isQuery:r})}}})),e.setState({table:Object(p.a)(Object(p.a)({},n),{},{children:s})})}},e}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var e=window.localStorage.getItem(C.DB_URL_STORE_KEY)||"",t=window.localStorage.getItem(C.SWAGGER_URL_STORE_KEY)||"";this.form.setFieldsValue({swaggerUrl:t}),e&&(this.form.setFieldsValue({dbUrl:e}),this.handleDbUrlChange())}},{key:"render",value:function(){var e,t=this,a=this.state,n=a.loading,l=a.deleting,r=a.tables,i=a.table,o=a.previewVisible,s=a.previewCode,c=a.fastEdit,d={};return Object(T.jsxs)(b.m,{loading:n||l,style:{padding:0,margin:0},children:[Object(T.jsx)(b.o,{style:{marginLeft:0,marginRight:0,paddingLeft:0},children:Object(T.jsx)(h.a,{ref:function(e){return t.form=e},initialValues:{type:"mysql",method:"get",userName:"admin",password:"123456"},children:Object(T.jsxs)(m.b,{children:[Object(T.jsx)(b.e,Object(p.a)(Object(p.a)({},d),{},{type:"radio-button",name:"type",options:[{value:"swagger",label:"Swagger"},{value:"mysql",label:"MySql"},{value:"customer",label:"\u81ea\u5b9a\u4e49"}],onChange:this.handleTypeChange})),Object(T.jsx)(h.a.Item,{noStyle:!0,shouldUpdate:function(e,t){return e.type!==t.type},children:function(e){var a=(0,e.getFieldValue)("type");return"mysql"===a?Object(T.jsxs)(m.b,{children:[Object(T.jsx)(b.e,Object(p.a)(Object(p.a)({},d),{},{style:{width:500},label:"\u6570\u636e\u5e93\u5730\u5740",name:"dbUrl",placeholder:"mysql://username:password@host:port/database",onChange:t.handleDbUrlChange,required:!0,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6570\u636e\u5e93\u5730\u5740\uff01"}]})),Object(T.jsx)(b.e,Object(p.a)(Object(p.a)({},d),{},{style:{width:200},type:"select",showSearch:!0,label:"\u6570\u636e\u5e93\u8868",name:"tableName",onChange:t.handleTableNameChange,options:r.map((function(e){return{value:e.tableName,label:"".concat(e.tableName," ").concat(e.comment)}})),required:!0,rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u6570\u636e\u5e93\u8868!"}]}))]}):"swagger"===a?Object(T.jsxs)(m.b,{children:[Object(T.jsx)(b.e,Object(p.a)(Object(p.a)({},d),{},{style:{width:400},label:"\u63a5\u53e3\u5730\u5740",name:"swaggerUrl",placeholder:"http(s)://host:port/path",onChange:t.handleSwaggerChange,required:!0,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u63a5\u53e3\u5730\u5740\uff01"}]})),Object(T.jsx)(b.e,Object(p.a)(Object(p.a)({},d),{},{type:"select",style:{width:100},placeholder:"\u63a5\u53e3\u65b9\u6cd5",name:"method",options:[{value:"get",label:"GET"},{value:"post",label:"POST"},{value:"put",label:"PUT"}],onChange:t.handleSwaggerChange,rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u63a5\u53e3\u65b9\u6cd5\uff01"}]})),Object(T.jsx)(b.e,Object(p.a)(Object(p.a)({},d),{},{style:{width:120},placeholder:"Swagger\u7528\u6237",name:"userName"})),Object(T.jsx)(b.e,Object(p.a)(Object(p.a)({},d),{},{style:{width:120},placeholder:"Swagger\u5bc6\u7801",name:"password"}))]}):"customer"===a?Object(T.jsx)(b.e,Object(p.a)(Object(p.a)({},d),{},{style:{width:300},label:"\u6a21\u5757\u540d",name:"moduleName",placeholder:"\u6bd4\u5982\uff1auser-center",onChange:t.handleModuleNameChange,required:!0,rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6a21\u5757\u540d\uff01"}]})):void 0}})]})})}),Object(T.jsxs)("div",{style:{marginBottom:8,display:"flex",justifyContent:"space-between"},children:[Object(T.jsxs)("div",{children:[Object(T.jsx)(f.a,{disabled:c,type:"primary",onClick:function(){return t.handleAdd()},children:"\u6dfb\u52a0"}),Object(T.jsx)(f.a,{disabled:c,style:{margin:"0 8px"},type:"primary",onClick:this.handleGen,children:"\u751f\u6210\u6587\u4ef6"}),Object(T.jsx)(f.a,{disabled:c,onClick:this.handlePreview,children:"\u4ee3\u7801\u9884\u89c8"}),Object(T.jsx)(f.a,{type:"primary",style:{margin:"0 8px"},onClick:this.handleFastEdit,children:c?"\u8868\u683c\u7f16\u8f91":"\u5feb\u901f\u7f16\u8f91"})]}),Object(T.jsx)("div",{style:{paddingRight:23,paddingTop:3},children:Object(C.renderTags)(i,(function(){return t.setState({table:Object(p.a)({},i)})}))})]}),Object(T.jsx)("div",{style:{position:"relative",height:"calc(100vh - 230px)"},children:this.state.fastEdit?Object(T.jsx)(I.a.TextArea,{id:"fastTextArea",style:{position:"absolute",top:0,right:0,bottom:0,left:0},defaultValue:null===i||void 0===i||null===(e=i.children)||void 0===e?void 0:e.map((function(e){return"".concat(e.chinese||""," ").concat(e.field||""," ").concat(e.formType||""," ").concat(["isColumn","isForm","isQuery"].map((function(t){return e[t]?t:""})).join(" "))})).join("\n")}):Object(T.jsx)(H,{fitHeight:!0,onSortEnd:this.handleSortEnd,serialNumber:!0,columns:this.columns,dataSource:null===i||void 0===i?void 0:i.children,rowKey:"id",size:"small"})}),Object(T.jsx)(P,{visible:o,previewCode:s,onOk:function(){return t.setState({previewVisible:!1})},onCancel:function(){return t.setState({previewVisible:!1})}})]})}}]),a}(d.Component))||r,A=a(395),B=a.n(A),G=o.a.TabPane;t.default=Object(S.a)({path:"/"})((function(){var e=Object(d.useState)("single"),t=Object(i.a)(e,2),a=t[0],n=t[1];return Object(d.useEffect)((function(){if(document.createEvent){var e=document.createEvent("HTMLEvents");e.initEvent("resize",!0,!0),window.dispatchEvent(e)}else document.createEventObject&&window.fireEvent("onresize")}),[a]),Object(T.jsx)(b.m,{className:c()(B.a.root),children:Object(T.jsxs)(o.a,{activeKey:a,onChange:function(e){return n(e)},children:[Object(T.jsx)(G,{tab:"\u5355\u72ec\u751f\u6210",children:Object(T.jsx)(Q,{})},"single"),Object(T.jsx)(G,{tab:"\u5feb\u901f\u751f\u6210",children:Object(T.jsx)(F,{})},"fast")]})})}))}}]);
//# sourceMappingURL=15.42dd4743.chunk.js.map