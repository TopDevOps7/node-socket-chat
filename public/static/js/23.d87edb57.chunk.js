(this["webpackJsonp@minimal/minimal-kit-react"]=this["webpackJsonp@minimal/minimal-kit-react"]||[]).push([[23],{1297:function(t,e,n){"use strict";n.d(e,"a",(function(){return b}));var i=n(3),a=n(36),o=n(35),c=n(614),r=n(198),s=n(1267),l=n(37),u=n(0),d=["links","action","heading","moreLink","sx"];function b(t){var e=t.links,n=t.action,b=t.heading,m=t.moreLink,j=void 0===m?[]:m,p=t.sx,h=Object(a.a)(t,d);return Object(u.jsxs)(c.a,{sx:Object(i.a)({mb:5},p),children:[Object(u.jsxs)(c.a,{sx:{display:"flex",alignItems:"center"},children:[Object(u.jsxs)(c.a,{sx:{flexGrow:1},children:[Object(u.jsx)(r.a,{variant:"h4",gutterBottom:!0,children:b}),Object(u.jsx)(l.b,Object(i.a)({links:e},h))]}),n&&Object(u.jsx)(c.a,{sx:{flexShrink:0},children:n})]}),Object(u.jsx)(c.a,{sx:{mt:2},children:Object(o.isString)(j)?Object(u.jsx)(s.a,{href:j,target:"_blank",variant:"body2",children:j}):j.map((function(t){return Object(u.jsx)(s.a,{noWrap:!0,href:t,variant:"body2",target:"_blank",sx:{display:"table"},children:t},t)}))})]})}},1299:function(t,e,n){"use strict";function i(t){return new Promise((function(e){return setTimeout(e,t)}))}n.d(e,"a",(function(){return i}))},1330:function(t,e){e.__esModule=!0,e.default={body:'<path d="M21.02 5H19V2.98c0-.54-.44-.98-.98-.98h-.03c-.55 0-.99.44-.99.98V5h-2.01c-.54 0-.98.44-.99.98v.03c0 .55.44.99.99.99H17v2.01c0 .54.44.99.99.98h.03c.54 0 .98-.44.98-.98V7h2.02c.54 0 .98-.44.98-.98v-.04c0-.54-.44-.98-.98-.98zM16 9.01V8h-1.01c-.53 0-1.03-.21-1.41-.58c-.37-.38-.58-.88-.58-1.44c0-.36.1-.69.27-.98H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8.28c-.3.17-.64.28-1.02.28A2 2 0 0 1 16 9.01zM15.96 19H6a.5.5 0 0 1-.4-.8l1.98-2.63c.21-.28.62-.26.82.02L10 18l2.61-3.48c.2-.26.59-.27.79-.01l2.95 3.68c.26.33.03.81-.39.81z" fill="currentColor"/>',width:24,height:24}},1663:function(t,e,n){"use strict";var i=n(623);Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n(628)),o=n(0),c=(0,a.default)((0,o.jsx)("path",{d:"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"}),"Cancel");e.default=c},1758:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return ut}));var i=n(1),a=n(1281),o=n(309),c=n(399),r=n(29),s=n(82),l=n(395),u=n(1297),d=n(3),b=n(12),m=n.n(b),j=n(20),p=n(16),h=n(231),O=n(23),x=n(162),g=n(230),f=n(1257),v=n(7),y=n(1261),w=n(1291),I=n(1178),P=n(1240),k=n(198),R=n(1271),S=n(6),L=n(5),M=n(2),A=n(196),W=n(10);n(9),n(239);var B=i.createContext({}),C=n(13),N=n(126),H=n(161),T=n(197);function z(t){return Object(H.a)("MuiImageListItem",t)}var E=Object(T.a)("MuiImageListItem",["root","img","standard","woven","masonry","quilted"]),_=n(0),F=["children","className","cols","component","rows","style"],V=Object(v.a)("li",{name:"MuiImageListItem",slot:"Root",overridesResolver:function(t,e){var n=t.styleProps;return[Object(S.a)({},"& .".concat(E.img),e.img),e.root,e[n.variant]]}})((function(t){var e=t.styleProps;return Object(M.a)({display:"inline-block",position:"relative",lineHeight:0},"standard"===e.variant&&{display:"flex",flexDirection:"column"},"woven"===e.variant&&{height:"100%",alignSelf:"center","&:nth-of-type(even)":{height:"70%"}},Object(S.a)({},"& .".concat(E.img),Object(M.a)({objectFit:"cover",width:"100%",height:"100%"},"standard"===e.variant&&{height:"auto",flexGrow:1})))})),q=i.forwardRef((function(t,e){var n=Object(C.a)({props:t,name:"MuiImageListItem"}),a=n.children,o=n.className,c=n.cols,r=void 0===c?1:c,s=n.component,l=void 0===s?"li":s,u=n.rows,d=void 0===u?1:u,b=n.style,m=Object(L.a)(n,F),j=i.useContext(B),p=j.rowHeight,h=void 0===p?"auto":p,O=j.gap,x=j.variant,g="auto";"woven"===x?g=void 0:"auto"!==h&&(g=h*d+O*(d-1));var f=Object(M.a)({},n,{cols:r,component:l,gap:O,rowHeight:h,rows:d,variant:x}),v=function(t){var e=t.classes,n={root:["root",t.variant],img:["img"]};return Object(A.a)(n,z,e)}(f);return Object(_.jsx)(V,Object(M.a)({as:l,className:Object(W.default)(v.root,v[x],o),ref:e,style:Object(M.a)({height:g,gridColumnEnd:"masonry"!==x?"span ".concat(r):void 0,gridRowEnd:"masonry"!==x?"span ".concat(d):void 0,marginBottom:"masonry"===x?O:void 0},b),styleProps:f},m,{children:i.Children.map(a,(function(t){return i.isValidElement(t)?"img"===t.type||Object(N.a)(t,["Image"])?i.cloneElement(t,{className:Object(W.default)(v.img,t.props.className)}):t:null}))}))})),D=n(15);function G(t){return Object(H.a)("MuiImageListItemBar",t)}Object(T.a)("MuiImageListItemBar",["root","positionBottom","positionTop","positionBelow","titleWrap","titleWrapBottom","titleWrapTop","titleWrapBelow","titleWrapActionPosLeft","titleWrapActionPosRight","title","subtitle","actionIcon","actionIconActionPosLeft","actionIconActionPosRight"]);var U=["actionIcon","actionPosition","className","subtitle","title","position"],J=Object(v.a)("div",{name:"MuiImageListItemBar",slot:"Root",overridesResolver:function(t,e){var n=t.styleProps;return[e.root,e["position".concat(Object(D.a)(n.position))]]}})((function(t){var e=t.theme,n=t.styleProps;return Object(M.a)({position:"absolute",left:0,right:0,background:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",fontFamily:e.typography.fontFamily},"bottom"===n.position&&{bottom:0},"top"===n.position&&{top:0},"below"===n.position&&{position:"relative",background:"transparent",alignItems:"normal"})})),K=Object(v.a)("div",{name:"MuiImageListItemBar",slot:"TitleWrap",overridesResolver:function(t,e){var n=t.styleProps;return[e.titleWrap,e["titleWrap".concat(Object(D.a)(n.position))],n.actionIcon&&e["titleWrapActionPos".concat(Object(D.a)(n.actionPosition))]]}})((function(t){var e=t.theme,n=t.styleProps;return Object(M.a)({flexGrow:1,padding:"12px 16px",color:e.palette.common.white,overflow:"hidden"},"below"===n.position&&{padding:"6px 0 12px",color:"inherit"},n.actionIcon&&"left"===n.actionPosition&&{paddingLeft:0},n.actionIcon&&"right"===n.actionPosition&&{paddingRight:0})})),Q=Object(v.a)("div",{name:"MuiImageListItemBar",slot:"Title",overridesResolver:function(t,e){return e.title}})((function(t){return{fontSize:t.theme.typography.pxToRem(16),lineHeight:"24px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}})),X=Object(v.a)("div",{name:"MuiImageListItemBar",slot:"Subtitle",overridesResolver:function(t,e){return e.subtitle}})((function(t){return{fontSize:t.theme.typography.pxToRem(12),lineHeight:1,textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}})),Y=Object(v.a)("div",{name:"MuiImageListItemBar",slot:"ActionIcon",overridesResolver:function(t,e){var n=t.styleProps;return[e.actionIcon,e["actionIconActionPos".concat(Object(D.a)(n.actionPosition))]]}})((function(t){var e=t.styleProps;return Object(M.a)({},"left"===e.actionPosition&&{order:-1})})),Z=i.forwardRef((function(t,e){var n=Object(C.a)({props:t,name:"MuiImageListItemBar"}),i=n.actionIcon,a=n.actionPosition,o=void 0===a?"right":a,c=n.className,r=n.subtitle,s=n.title,l=n.position,u=void 0===l?"bottom":l,d=Object(L.a)(n,U),b=Object(M.a)({},n,{position:u,actionPosition:o}),m=function(t){var e=t.classes,n=t.position,i=t.actionIcon,a=t.actionPosition,o={root:["root","position".concat(Object(D.a)(n))],titleWrap:["titleWrap","titleWrap".concat(Object(D.a)(n)),i&&"titleWrapActionPos".concat(Object(D.a)(a))],title:["title"],subtitle:["subtitle"],actionIcon:["actionIcon","actionIconActionPos".concat(Object(D.a)(a))]};return Object(A.a)(o,G,e)}(b);return Object(_.jsxs)(J,Object(M.a)({styleProps:b,className:Object(W.default)(m.root,c),ref:e},d,{children:[Object(_.jsxs)(K,{styleProps:b,className:m.titleWrap,children:[Object(_.jsx)(Q,{className:m.title,children:s}),r?Object(_.jsx)(X,{className:m.subtitle,children:r}):null]}),i?Object(_.jsx)(Y,{styleProps:b,className:m.actionIcon,children:i}):null]}))})),$=n(1263),tt=n(1290),et=n(1251),nt=n(614),it=n(1663),at=n.n(it),ot=n(1330),ct=n.n(ot),rt=n(21),st=n(1299);function lt(){var t=Object(x.useSnackbar)().enqueueSnackbar,e=Object(i.useRef)(null),n=Object(i.useState)([]),a=Object(p.a)(n,2),o=a[0],c=a[1],r=Object(i.useState)(null),s=Object(p.a)(r,2),l=s[0],u=s[1],b=Object(v.a)("img")((function(t){return{height:80,minWidth:80,width:"auto",cursor:"pointer",objectFit:"cover",borderRadius:t.theme.shape.borderRadius}})),S=h.b().shape({message:h.d().required("This field is required"),coverage:h.d().required("This field is required")}),L=Object(g.c)({enableReinitialize:!0,initialValues:{message:"",posted_at:"public",publisher:"admin",position:"",coverage:150},validationSchema:S,onSubmit:function(){var e=Object(j.a)(m.a.mark((function e(n,i){var a,o,r,s,d;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=i.setSubmitting,o=i.resetForm,r=i.setErrors,e.prev=1,e.next=4,Object(st.a)(500);case 4:if(s=[],!l){e.next=12;break}return e.next=8,rt.a.post("/roomMessages/upload_multi_imgs",l);case 8:d=e.sent,s=d.data.data,c([]),u(null);case 12:return n.imgs=s,e.next=15,rt.a.post("/roomMessages/announcement",n);case 15:o(),a(!1),t("Posted announcement successfully",{variant:"success"}),e.next=26;break;case 20:e.prev=20,e.t0=e.catch(1),console.error(e.t0),a(!1),t("Error occured: ".concat(e.t0.message),{variant:"error"}),r(e.t0);case 26:case"end":return e.stop()}}),e,null,[[1,20]])})));return function(t,n){return e.apply(this,arguments)}}()}),M=(L.errors,L.values,L.touched,L.handleSubmit),A=L.isSubmitting,W=(L.setFieldValue,L.getFieldProps);return console.log(o),Object(_.jsxs)(g.b,{value:L,children:[Object(_.jsx)(g.a,{noValidate:!0,autoComplete:"off",onSubmit:M,children:Object(_.jsx)(y.a,{container:!0,spacing:3,children:Object(_.jsx)(y.a,{item:!0,xs:12,md:12,children:Object(_.jsx)(w.a,{sx:{p:3},children:Object(_.jsxs)(I.a,{spacing:2,children:[Object(_.jsx)(I.a,{direction:{xs:"column",sm:"row"},spacing:{xs:3,sm:2},children:Object(_.jsx)(P.a,Object(d.a)(Object(d.a)({},W("message")),{},{maxRows:20,minRows:6,"aria-label":"Post Public Announcement",placeholder:"text input(max. 2000 words)",style:{width:"100%",padding:"10px"}}))}),Object(_.jsxs)(I.a,{direction:{xs:"column",sm:"row"},spacing:{xs:3,sm:2},children:[Object(_.jsx)(k.a,{variant:"body1",component:"div",style:{lineHeight:3},children:"Add pictures (max. 9) from hard-disk."}),Object(_.jsx)(R.a,{size:"small",onClick:function(){9!==o.length?e.current.click():t("Uploaded pictures (max. 9) from hard-disk.",{variant:"info"})},children:Object(_.jsx)(O.a,{icon:ct.a,width:24,height:24})})]}),o.length>0&&Object(_.jsx)(I.a,{direction:{xs:"column",sm:"row"},sx:{mt:1,mb:1},spacing:{xs:3,sm:2},children:o.map((function(t){return Object(_.jsxs)(q,{children:[Object(_.jsx)(b,{alt:"attachment",src:"".concat(t.url)},"".concat(t.index)),Object(_.jsx)(Z,{sx:{background:"transparent"},position:"top",actionIcon:Object(_.jsx)(R.a,{sx:{color:"#115293",backgroundColor:"white"},"aria-label":"close",onClick:function(e){return function(t){var e=o.filter((function(e){return e.index!==t})),n=l;n.delete("img[".concat(t,"]")),c(e),u(n)}(t.index)},size:"small",style:{position:"absolute",top:"-15px",right:"-15px"},children:Object(_.jsx)(at.a,{width:15,height:15})}),actionPosition:"right"})]},"".concat(t.index))}))}),Object(_.jsxs)(I.a,{direction:{xs:"column",sm:"row"},spacing:{xs:10,sm:8},children:[Object(_.jsx)(k.a,{variant:"subtitle1",component:"div",style:{lineHeight:2},children:"Post at"}),Object(_.jsxs)($.a,Object(d.a)(Object(d.a)({},W("posted_at")),{},{"aria-label":"Posted at",children:[Object(_.jsx)(tt.a,{value:"public",control:Object(_.jsx)(et.a,{}),label:"Public chat room"}),Object(_.jsx)(tt.a,{value:"top",control:Object(_.jsx)(et.a,{}),label:"Announcements"})]}))]}),Object(_.jsxs)(I.a,{direction:{xs:"column",sm:"row"},spacing:{xs:8,sm:5},children:[Object(_.jsx)(k.a,{variant:"subtitle1",component:"div",style:{lineHeight:2},children:"Publisher"}),Object(_.jsx)($.a,Object(d.a)(Object(d.a)({},W("publisher")),{},{"aria-label":"Publisher",children:Object(_.jsx)(tt.a,{value:"admin",control:Object(_.jsx)(et.a,{}),label:"App administrator (default)"})}))]}),Object(_.jsx)(nt.a,{sx:{mt:10,display:"flex",justifyContent:"center"},children:Object(_.jsx)(f.a,{type:"submit",variant:"contained",loading:A,children:"SEND MESSAGE"})})]})})})})}),Object(_.jsx)("input",{type:"file",multiple:!0,ref:e,accept:"image/*",style:{display:"none"},onChange:function(t){var e=[],n=[];o.length>0&&(n=o.map((function(t){return t})));var i=l||new FormData;e.push(t.target.files);for(var a=0,r=o.length>0&&o[o.length-1].index+1||0;a<e[0].length&&n.length<9;a+=1,r+=1){var s=e[0][a];i.append("img[".concat(r,"]"),s,s.name);var d=[];(d=s.name.split(".")).splice(d.length-1,0,"min"),i.append("img[".concat(r,"]"),s,d.join(".")),n.push({index:r,name:s.name,url:URL.createObjectURL(s)})}console.log(n,i),c(n),u(i)}})]})}function ut(){var t=Object(s.a)().themeStretch,e=Object(o.c)();Object(o.d)((function(t){return t.setting})).settingsList;return Object(i.useEffect)((function(){e(Object(c.b)())}),[e]),Object(_.jsx)(l.a,{title:"Announcement: Post | TopTalk",children:Object(_.jsxs)(a.a,{maxWidth:!t&&"lg",children:[Object(_.jsx)(u.a,{heading:"Announcement Post",links:[{name:"Dashboard",href:r.b.root},{name:"Announcement Post"}]}),Object(_.jsx)(lt,{})]})})}}}]);
//# sourceMappingURL=23.d87edb57.chunk.js.map