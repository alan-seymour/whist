(this.webpackJsonpwhist=this.webpackJsonpwhist||[]).push([[0],{16:function(n,e,t){n.exports=t(28)},21:function(n,e,t){},28:function(n,e,t){"use strict";t.r(e);var r=t(0),a=t.n(r),o=t(12),u=t.n(o),l=(t(21),t(3)),c=t(1),i=t(2);function d(){var n=Object(c.a)(["\n  grid-column: '1 / span 1';\n  grid-row: ",";\n  line-height: '40px';\n  font-weight: bold;\n  line-height: 60px;\n  text-align: center;\n  border: 1px solid #000;\n  border-left: none;\n"]);return d=function(){return n},n}function p(){var n=Object(c.a)(["\n  display: grid;\n  grid-template-columns: ",";\n  grid-template-rows: 40px repeat(26, 30px) 40px;\n"]);return p=function(){return n},n}var s=i.a.div(p(),(function(n){return"40px repeat( ".concat(3*n.playerCount,", 30px)")})),m=i.a.div(d(),(function(n){return"".concat(2*n.roundNumber+2," / span 2")})),f=t(9);function g(){var n=Object(c.a)(["\n  grid-column: ",";\n  grid-row: ",";\n  line-height: 60px;\n  text-align: center;\n  border: 1px solid #000;\n  font-size: 20px;\n"]);return g=function(){return n},n}function b(){var n=Object(c.a)(["\n  grid-column: ",";\n  grid-row: ",";\n  line-height: 30px;\n  text-align: center;\n  border: 1px solid #000;\n"]);return b=function(){return n},n}function x(){var n=Object(c.a)(["\n  grid-column: ",";\n  grid-row: ",";\n  line-height: 30px;\n  text-align: center;\n  border: 1px solid #000;\n"]);return x=function(){return n},n}var v=i.a.div(x(),(function(n){return"".concat(3*n.playerIndex+2," / span 1")}),(function(n){return"".concat(2*n.roundNumber+2," / span 1")})),h=i.a.div(b(),(function(n){return"".concat(3*n.playerIndex+2," / span 1")}),(function(n){return"".concat(2*n.roundNumber+3," / span 1")})),y=i.a.div(g(),(function(n){return"".concat(3*n.playerIndex+3," / span 2")}),(function(n){return"".concat(2*n.roundNumber+2," / span 2")})),E=t(5),j=t.n(E),O=function(n){var e=parseInt(n,10);return isNaN(e)?null:e},w=function(n){var e,t,o=n.playerIndex,u=n.roundNumber,c=n.runningScore,i=n.onScoreChange,d=Object(r.useState)(null),p=Object(l.a)(d,2),s=p[0],m=p[1],f=Object(r.useState)(null),g=Object(l.a)(f,2),b=g[0],x=g[1],E=Object(r.useState)(null),w=Object(l.a)(E,2),I=w[0],N=w[1];return Object(r.useEffect)((function(){if(null===s||null===b)null!==I&&(N(null),i(null));else if(s!==b){var n=Math.abs(s-b);N(-5-n),i(-5-n)}else s===b&&(N(5+s),i(5+s))}),[s,b,I,c]),a.a.createElement(a.a.Fragment,null,a.a.createElement(v,{playerIndex:o,roundNumber:u},a.a.createElement(j.a,{onChange:function(n){return m(O(n.target.value))},html:null!==(e=null===s||void 0===s?void 0:s.toString())&&void 0!==e?e:""})),a.a.createElement(h,{playerIndex:o,roundNumber:u},a.a.createElement(j.a,{onChange:function(n){return x(O(n.target.value))},html:null!==(t=null===b||void 0===b?void 0:b.toString())&&void 0!==t?t:""})),a.a.createElement(y,{playerIndex:o,roundNumber:u},null!==I&&null!==c?I+c:""))};function I(){var n=Object(c.a)(["\n  grid-column: ",";\n  grid-row: 28 / span 1;\n  text-align: center;\n  line-height: 40px;\n  font-size: 20px;\n  border: 1px solid #000;\n"]);return I=function(){return n},n}function N(){var n=Object(c.a)(["\n  grid-column: ",";\n  grid-row: 1 / span 1;\n  text-align: center;\n  line-height: 40px;\n  font-size: 20px;\n  border: 1px solid #000;\n"]);return N=function(){return n},n}var S=i.a.div(N(),(function(n){return"".concat(3*n.playerIndex+2," / span 3")})),C=i.a.div(I(),(function(n){return"".concat(3*n.playerIndex+2," / span 3")})),k=function(n){for(var e=Object(r.useState)(""),t=Object(l.a)(e,2),o=t[0],u=t[1],c=Object(r.useState)(Array(13).fill(null)),i=Object(l.a)(c,2),d=i[0],p=i[1],s=[],m=0,g=function(e){s.push(a.a.createElement(w,{playerIndex:n.playerIndex,roundNumber:e,runningScore:m,onScoreChange:function(n){p([].concat(Object(f.a)(d.slice(0,e)),[n],Object(f.a)(d.slice(e+1))))}})),m=null!==m&&null!==d[e]?m+d[e]:null},b=0;b<13;b++)g(b);return a.a.createElement(a.a.Fragment,null,a.a.createElement(S,{playerIndex:n.playerIndex},a.a.createElement(j.a,{html:o,onChange:function(n){return u(n.target.value)}})),s,a.a.createElement(C,{playerIndex:n.playerIndex},m))},z=[7,6,5,4,3,2,1,2,3,4,5,6,7],A=function(){for(var n=Object(r.useState)(4),e=Object(l.a)(n,2),t=e[0],o=e[1],u=[],c=0;c<t;c++)u.push(a.a.createElement(k,{playerIndex:c}));return a.a.createElement(a.a.Fragment,null,a.a.createElement(s,{playerCount:t},z.map((function(n,e){return a.a.createElement(m,{roundNumber:e},n)})),u),a.a.createElement("div",null,a.a.createElement("button",{onClick:function(){return o(t+1)}},"Add Player"),a.a.createElement("button",{onClick:function(){return o(Math.max(t-1,0))}},"Remove Player")))};var F=function(){return a.a.createElement("div",{className:"App"},a.a.createElement(A,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));u.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(F,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(n){n.unregister()})).catch((function(n){console.error(n.message)}))}},[[16,1,2]]]);
//# sourceMappingURL=main.0c21ac3b.chunk.js.map