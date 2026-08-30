function e(e,t,i,a){var o,n=arguments.length,r=n<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),o=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new n(i,e,a)},s=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,a))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:g}=Object,_=globalThis,u=_.trustedTypes,f=u?u.emptyScript:"",m=_.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),k={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&c(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const n=a?.call(this);o?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(s(e))}else void 0!==e&&t.push(s(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,a)=>{if(i)e.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of a){const a=document.createElement("style"),o=t.litNonce;void 0!==o&&a.setAttribute("nonce",o),a.textContent=i.cssText,e.appendChild(a)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(a):this.setAttribute(a,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=a;const n=o.fromAttribute(t,e.type);this[a]=n??this._$Ej?.get(a)??n,this._$Em=null}}requestUpdate(e,t,i,a=!1,o){if(void 0!==e){const n=this.constructor;if(!1===a&&(o=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??y)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:o},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,m?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,$=e=>e,D=w.trustedTypes,A=D?D.createPolicy("lit-html",{createHTML:e=>e}):void 0,T="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,I="?"+S,E=`<${I}>`,C=document,M=()=>C.createComment(""),B=e=>null===e||"object"!=typeof e&&"function"!=typeof e,L=Array.isArray,N="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,R=/>/g,O=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,F=/"/g,U=/^(?:script|style|textarea|title)$/i,K=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),W=K(1),j=K(2),G=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,Y=C.createTreeWalker(C,129);function X(e,t){if(!L(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,a=[];let o,n=2===t?"<svg>":3===t?"<math>":"",r=z;for(let t=0;t<i;t++){const i=e[t];let s,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===z?"!--"===l[1]?r=P:void 0!==l[1]?r=R:void 0!==l[2]?(U.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=O):void 0!==l[3]&&(r=O):r===O?">"===l[0]?(r=o??z,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,s=l[1],r=void 0===l[3]?O:'"'===l[3]?F:H):r===F||r===H?r=O:r===P||r===R?r=z:(r=O,o=void 0);const h=r===O&&e[t+1].startsWith("/>")?" ":"";n+=r===z?i+E:c>=0?(a.push(s),i.slice(0,c)+T+i.slice(c)+S+h):i+S+(-2===c?t:h)}return[X(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class J{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let o=0,n=0;const r=e.length-1,s=this.parts,[l,c]=Z(e,t);if(this.el=J.createElement(l,i),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=Y.nextNode())&&s.length<r;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(T)){const t=c[n++],i=a.getAttribute(e).split(S),r=/([.?@])?(.*)/.exec(t);s.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?ae:"?"===r[1]?oe:"@"===r[1]?ne:ie}),a.removeAttribute(e)}else e.startsWith(S)&&(s.push({type:6,index:o}),a.removeAttribute(e));if(U.test(a.tagName)){const e=a.textContent.split(S),t=e.length-1;if(t>0){a.textContent=D?D.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],M()),Y.nextNode(),s.push({type:2,index:++o});a.append(e[t],M())}}}else if(8===a.nodeType)if(a.data===I)s.push({type:2,index:o});else{let e=-1;for(;-1!==(e=a.data.indexOf(S,e+1));)s.push({type:7,index:o}),e+=S.length-1}o++}}static createElement(e,t){const i=C.createElement("template");return i.innerHTML=e,i}}function Q(e,t,i=e,a){if(t===G)return t;let o=void 0!==a?i._$Co?.[a]:i._$Cl;const n=B(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=o:i._$Cl=o),void 0!==o&&(t=Q(e,o._$AS(e,t.values),o,a)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??C).importNode(t,!0);Y.currentNode=a;let o=Y.nextNode(),n=0,r=0,s=i[0];for(;void 0!==s;){if(n===s.index){let t;2===s.type?t=new te(o,o.nextSibling,this,e):1===s.type?t=new s.ctor(o,s.name,s.strings,this,e):6===s.type&&(t=new re(o,this,e)),this._$AV.push(t),s=i[++r]}n!==s?.index&&(o=Y.nextNode(),n++)}return Y.currentNode=C,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),B(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==G&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>L(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&B(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new ee(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new J(e)),t}k(e){L(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const o of e)a===t.length?t.push(i=new te(this.O(M()),this.O(M()),this,this.options)):i=t[a],i._$AI(o),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(e,t=this,i,a){const o=this.strings;let n=!1;if(void 0===o)e=Q(this,e,t,0),n=!B(e)||e!==this._$AH&&e!==G,n&&(this._$AH=e);else{const a=e;let r,s;for(e=o[0],r=0;r<o.length-1;r++)s=Q(this,a[i+r],t,r),s===G&&(s=this._$AH[r]),n||=!B(s)||s!==this._$AH[r],s===V?e=V:e!==V&&(e+=(s??"")+o[r+1]),this._$AH[r]=s}n&&!a&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class oe extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class ne extends ie{constructor(e,t,i,a,o){super(e,t,i,a,o),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??V)===G)return;const i=this._$AH,a=e===V&&i!==V||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==V&&(i===V||a);a&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const se=w.litHtmlPolyfillSupport;se?.(J,te),(w.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ce=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let o=a._$litPart$;if(void 0===o){const e=i?.renderBefore??null;a._$litPart$=o=new te(t.insertBefore(M(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},ge=(e=pe,t,i)=>{const{kind:a,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===a){const{name:a}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(a,o,e,!0,i)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=i;return function(i){const o=this[a];t.call(this,i),this.requestUpdate(a,o,e,!0,i)}}throw Error("Unsupported decorator location: "+a)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _e(e){return(t,i)=>"object"==typeof i?ge(e,t,i):((e,t,i)=>{const a=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return _e({...e,state:!0,attribute:!1})}var fe,me;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(fe||(fe={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(me||(me={}));const be=e=>{if(e.time_format===me.language||e.time_format===me.system){const t=e.time_format===me.language?e.language:void 0,i=(new Date).toLocaleString(t);return i.includes("AM")||i.includes("PM")}return e.time_format===me.am_pm},ve=e=>new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric",hour:be(e)?"numeric":"2-digit",minute:"2-digit",hour12:be(e)}),ye=e=>new Intl.DateTimeFormat(e.language,{hour:"numeric",minute:"2-digit",hour12:be(e)}),ke=["closed","locked","off"],xe=(e,t,i,a)=>{a=a||{},i=null==i?{}:i;const o=new Event(t,{bubbles:void 0===a.bubbles||a.bubbles,cancelable:Boolean(a.cancelable),composed:void 0===a.composed||a.composed});return o.detail=i,e.dispatchEvent(o),o},we=e=>{xe(window,"haptic",e)},$e=(e,t,i,a)=>{if(a||(a={action:"more-info"}),!a.confirmation||a.confirmation.exemptions&&a.confirmation.exemptions.some(e=>e.user===t.user.id)||(we("warning"),confirm(a.confirmation.text||`Are you sure you want to ${a.action}?`)))switch(a.action){case"more-info":(i.entity||i.camera_image)&&xe(e,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":a.navigation_path&&((e,t,i=!1)=>{i?history.replaceState(null,"",t):history.pushState(null,"",t),xe(window,"location-changed",{replace:i})})(0,a.navigation_path);break;case"url":a.url_path&&window.open(a.url_path);break;case"toggle":i.entity&&(((e,t)=>{((e,t,i=!0)=>{const a=function(e){return e.substr(0,e.indexOf("."))}(t),o="group"===a?"homeassistant":a;let n;switch(a){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}e.callService(o,n,{entity_id:t})})(e,t,ke.includes(e.states[t].state))})(t,i.entity),we("success"));break;case"call-service":{if(!a.service)return void we("failure");const[e,i]=a.service.split(".",2);t.callService(e,i,a.service_data,a.target),we("success");break}case"fire-dom-event":xe(e,"ll-custom",a)}},De=(e,t,i,a)=>{let o;"double_tap"===a&&i.double_tap_action?o=i.double_tap_action:"hold"===a&&i.hold_action?o=i.hold_action:"tap"===a&&i.tap_action&&(o=i.tap_action),$e(e,t,i,o)},Ae={en:{"card.loading":"Loading...","card.placeholder_title":"AX Dose Logger Card","card.placeholder_subtitle":"Please select a device in the visual editor to begin.","card.trackers_error_title":"Invalid Drink Tracker selection","card.trackers_error_generic":"The selected Drink Trackers are invalid. Please reconfigure in the visual editor.","card.trackers_error_not_master":"One or more selected devices are not Drink Tracker devices. Please select only Caffeine Tracker or Alcohol Tracker devices.","card.trackers_error_mixed_substance":"All selected Drink Trackers must be the same substance (Caffeine OR Alcohol). Please select only one substance.","card.trackers_placeholder_title":"Select Drink Trackers","card.trackers_placeholder_subtitle":"Please select Caffeine Tracker or Alcohol Tracker devices in the visual editor.","card.profile_switcher_title":"Switch profile","card.medicines_error_title":"Invalid Medicine selection","card.medicines_error_generic":"The selected Medicines are invalid. Please reconfigure in the visual editor.","card.medicines_error_not_medicine":"One or more selected devices are not medicine devices (or are Drink Trackers). Please select only medicine devices.","card.medicine_switcher_title":"Switch medicine","pane.daily":"Daily","pane.graphs":"Graphs","pane.stats":"Stats","pane.tools":"Tools","pane.drinks":"Drinks","pane.inventory":"Inventory","daily.take_pill":"Take Pill","daily.limit_reached":"LIMIT REACHED","daily.24h_limit_reached":"24H LIMIT REACHED","daily.last":"Last","daily.next":"Next","daily.overdue":"Overdue","daily.slot_remaining":"{count} left this slot","daily.safe_to_take":"Safe to take","daily.pills_left":"Pills left","daily.na":"N/A","graphs.bar_title":"{days}-day taken tracker","graphs.line_title":"Amount in Body","graphs.empty_bar":"No dose data yet","graphs.empty_effectiveness":"No effectiveness data yet","graphs.effectiveness_title":"Effectiveness","graphs.effectiveness_avg":"Avg","graphs.effectiveness_individual":"Individual","graphs.loading_history":"Loading history...","graphs.timeframe_12h":"12H","graphs.timeframe_24h":"24H","graphs.timeframe_48h":"48H","graphs.timeframe_7d":"7D","graphs.timeframe_14d":"14D","graphs.timeframe_30d":"30D","graphs.timeframe_60d":"60D","graphs.aria_prev":"Previous graph","graphs.aria_next":"Next graph","stats.total_doses":"Total Doses","stats.days_since_first_dose":"Days Since First Dose","stats.last_dose":"Last Dose","stats.strength":"Strength","stats.amount_in_body":"Amount in Body","stats.steady_state":"Steady State","stats.steady_state_reached":"Reached ✓","stats.steady_state_days":"{days} days","stats.avg_7_day":"7-Day Average","stats.avg_14_day":"14-Day Average","stats.avg_30_day":"30-Day Average","stats.avg_yearly":"Yearly Average","stats.avg_running":"{days}-Day Average","stats.adherence_7_day":"7-Day Adherence","stats.adherence_14_day":"14-Day Adherence","stats.adherence_30_day":"30-Day Adherence","stats.adherence_365_day":"365-Day Adherence","stats.adherence_running":"{days}-Day Adherence","stats.amount_last_24h":"Amount in Last 24h","stats.daily_remaining":"Daily Remaining","stats.safe_to_take":"Pills Safe to Take","stats.next_dose":"Next Dose","stats.overdue":"Overdue","stats.sleep_disruption":"Sleep Disruption","stats.low_timestamp":"Low - Timestamp","stats.low_hours_until":"Low - Hours Until","stats.none_timestamp":"Sleep-Safe Time","stats.next_band":"Next Band","stats.next_band_in":"in {minutes}m","stats.days_left":"Days left","stats.days_left_est":"Est. days left","averages.avg_7_day":"7-Day Avg","averages.avg_14_day":"14-Day Avg","averages.avg_30_day":"30-Day Avg","averages.avg_year":"Year Avg","averages.avg_running":"{days}-Day Avg","averages.adh_7_day":"7d Adh","averages.adh_14_day":"14d Adh","averages.adh_30_day":"30d Adh","averages.adh_365_day":"365d Adh","averages.adh_running":"{days}d Adh","drinks.caffeine":"Caffeine","drinks.alcohol":"Alcohol","drinks.default_profile":"Default","drinks.log_drink":"Log Drink","drinks.in_body":"In Body","drinks.disruption":"Disruption","drinks.sleep_disruption":"Sleep Disruption","drinks.redirect_caffeine":"Please select the Caffeine device to view this drink.","drinks.redirect_alcohol":"Please select the Alcohol device to view this drink.","inventory.empty":"No drinks of this category configured.","inventory.avg_7_day":"7-Day Average","inventory.left":"Left","pane.tracking":"Tracking","tracking.today_label":"Today's {metric}","tracking.not_set":"Not set","tracking.set_today":"Set for today","tracking.already_set_title":"Already Set Today","tracking.already_set_body":"You already set {metric} to {oldValue} today. Change to {newValue}?","tracking.override":"Override","tracking.cancel":"Cancel","tools.adherence_header":"Adherence Tools","tools.dose_header":"Dose Tools","tools.general_header":"General Tools","tools.reset_adherence":"Reset Adherence %","tools.reset_averages":"Reset Averages","tools.mark_adherence_taken":"Mark Last Adherence Taken","tools.skip_dose":"Skip Dose","tools.reset_history":"Reset History","tools.undo_dose":"Undo Dose","tools.empty":"No maintenance tools available for this medication.","tools.desc.reset_adherence":"Clears the adherence percentage history for all windows. Does NOT affect Amount in Body, dose count, or any other sensor.","tools.desc.reset_averages":"Resets the 7/14/30/365-day averages only. Doses logged before the reset stop counting toward the averages; no dose data is deleted — Total Doses, Amount in Body, and Adherence % are untouched.","tools.desc.mark_adherence_taken":"Marks the most recent missed dose slot as taken for adherence calculation only. Does NOT add a dose to the pharmacokinetics model or dose count.","tools.desc.skip_dose":'Skips the current missed scheduled dose slot — clears the overdue alarm and advances the next-dose schedule WITHOUT logging a dose. Amount in Body, pill inventory, total doses, and last dose are untouched. Adherence stays penalized; press "Mark Last Adherence Taken" afterwards for a prescriber-directed skip.',"tools.desc.reset_history":"Clears ALL dose history across every sensor — adherence, Amount in Body, totals, and last dose. This cannot be undone.","tools.desc.undo_dose":"Removes the most recently logged dose from all sensors, including the pharmacokinetics model and adherence calculation.","tools.drinks_header":"Drink Maintenance","tools.undo_drink":"Undo {name}","tools.reset_drink":"Reset {name}","tools.desc.undo_drink":"Removes the most recently logged drink of this granular device from the master tracker and this drink's own stats.","tools.desc.reset_drink":"Clears ALL dose history for this granular drink — totals, last dose, and averages. The master tracker keeps its aggregated history. This cannot be undone.","dialog.warning":"Warning","dialog.cancel":"Cancel","dialog.confirm":"Confirm","dialog.refill.title":"Refill Medication","dialog.refill.placeholder":"Enter number of pills","dialog.refill.confirm":"Refill","dialog.refill.title_drink":"Refill {name}","dialog.log_drink.title":"Log Drink","dialog.log_drink.empty":"No drinks of this category configured.","dialog.log_drink.predicted_low":"Low","dialog.log_drink.predicted_low_dash":"Low: —","dialog.log_drink.select_profile":"Who is logging this?","dialog.log_drink.back":"Back","dialog.log_drink.unknown_profile":"Unknown profile","dialog.override.body_scheduled":"Your next scheduled dose is not until {time}. Take a dose now anyway?","dialog.override.body_as_needed":"Your next safe dose is not until {time}. Take a dose now anyway?","dialog.override.body_window":"Your dose limit resets at {time}. Take a dose now anyway?","dialog.override.body_24h_exceeded":"You have already exceeded the 24h strength limit for this medication ({time}). Taking another dose increases the risk of adverse effects. Press Override to log the dose anyway.","dialog.override.body_24h_would_exceed":"Your next dose ({next} {unit}) would push the 24h total to {projected} {unit}, exceeding the {limit} {unit} limit (currently {current} {unit}). Press Override to log the dose anyway.","dialog.override.confirm":"Override","dialog.device_info.button":"To Device info","dialog.device_info.aria":"View device info","dialog.refill.aria":"Refill medication","dialog.device_info.color_indicators":"Medical Color Indicators","dialog.device_info.color_indicators_aria":"Open the medical color indicators explainer","dialog.color_indicators.title":"Medical Color Indicators","dialog.color_indicators.close":"Close","dialog.color_indicators.explainer":["### Button State Indicator Colors","","The Take Pill and Log Drink buttons use a fixed color matrix to encode the system's current status. Each color means a specific medical state:","","| Color | State | When active |","|-------|-------|-------------|","| **Red** | Limit Reached | Daily limit reached / cooldown active |","| **Blue** | Dose Due | Scheduled dose due (within the first half of the on-time window) |","| **Amber** | Overdue Warning | Overdue (past half the on-time window) |","| **Green** | Logged Dose Indicator | Transient flash after a successful press |","","These indicator colors are **fixed** — they are not affected by the card's Color Scheme setting.","","The **on-time window** is the on-time buffer you configured for the medication (in minutes). The button stays blue for the **first half** of the window (on-time, no rush) and turns amber at the **halfway point** — a proactive heads-up that the window is closing. This applies to **all scheduled medications**, whether or not adherence tracking is enabled.","","### Color Scheme Conflict","","The idle button's background is tinted by your chosen **Color Scheme** accent. Four scheme colors match (or closely approximate) the four indicators above, so choosing one of them can make the *idle* button resemble an *active* medical state at a glance:","","- **Red** matches Limit Reached","- **Blue** matches Dose Due (exact)","- **Orange** matches Overdue Amber (near)","- **Green** matches Logged (exact)","","In the Color Scheme dropdown these four are listed last and marked with a trailing `*`. The active-state coloring still overrides correctly when a dose is actually due/overdue/limit-reached — this is a **readability** concern for the idle state, not a functional bug. Pick a non-starred color if you want the indicators to stay unambiguous."].join("\n"),"dialog.sleep_disruption.title":"Sleep Disruption","dialog.sleep_disruption.close":"Close","dialog.sleep_disruption.disruption_label":"Sleep Disruption","dialog.sleep_disruption.low_timestamp_label":"Low - Timestamp","dialog.sleep_disruption.low_hours_until_label":"Low - Hours Until","dialog.sleep_disruption.not_applicable":"—","dialog.sleep_disruption.caffeine":["### Caffeine Sleep Disruption","","* **None (0 - 10 mg):** Negligible impact. Normal sleep cycles and melatonin production.","* **Low (11 - 30 mg):** Minor shift. Deep sleep remains mostly stable.","* **Moderate (31 - 60 mg):** Hidden disruption. Measurable drop in deep sleep and an elevated resting heart rate.","* **High (61+ mg):** Severe disruption. Increased tossing and turning, frequent micro-awakenings, and delayed sleep onset.",'* **Note on "Immunity":** Even if you easily fall asleep with caffeine in your system, it still chemically blocks your deep, restorative sleep phases. You are unconscious, but not resting.',"","[See README for full biological breakdown.](https://github.com/Axildor/AX-Dose-Logger#caffeine--sleep-disruption-bands)"].join("\n"),"dialog.sleep_disruption.alcohol":["### Alcohol Sleep Disruption","","* **None (0 g):** Clean architecture. Normal resting heart rate and REM cycles.","* **Low (1 - 10 g):** Minor rebound. Slight, brief elevation in heart rate during the night.","* **Moderate (11 - 30 g):** Restless sleep. Mid-night awakenings, temperature dysregulation (sweating), and lowered Heart Rate Variability (HRV).","* **High (31+ g):** Severe stress. Spiked heart rate for hours, frequent waking, and stressful REM rebound (vivid dreams).",'* **Note on "The Nightcap":** Using alcohol to fall asleep faster is a biological trap. You trade falling asleep quickly for destroying the restorative quality of the second half of your night.',"","[See README for full biological breakdown.](https://github.com/Axildor/AX-Dose-Logger#alcohol--sleep-disruption-bands)"].join("\n"),"config.big_text":"Large Text","config.bold_text":"Bold Text","config.default_view":"Default View","config.take_pill_icon":"Take Pill Icon","config.take_pill_label":"Take Pill Label","config.safe_to_take_box":"Top Box","config.safe_to_take_entity":"Override Entity","config.safe_to_take_label":"Override Label","config.safe_to_take_icon":"Override Icon","config.safe_to_take_show_amount_in_body":"Amount in body instead of Safe to take","config.safe_to_take_tap_action":"Tap Action","config.safe_to_take_hold_action":"Hold Action","config.safe_to_take_double_tap_action":"Double Tap Action","config.pills_left_label":"Override Label","config.pills_left_icon":"Override Icon","config.pills_left_box":"Bottom Box","config.pills_left_show_days_left":"Days left instead of Pills left","config.pills_left_entity":"Override Entity","config.pills_left_tap_action":"Tap Action","config.pills_left_hold_action":"Hold Action","config.pills_left_double_tap_action":"Double Tap Action","config.drinks_panel":"Drinks Tab","config.log_drink_icon":"Log Drink Icon","config.log_drink_label":"Log Drink Label","config.in_body_box":"Top Box","config.in_body_entity":"Override Entity","config.in_body_label":"Override Label","config.in_body_icon":"Override Icon","config.in_body_tap_action":"Tap Action","config.in_body_hold_action":"Hold Action","config.in_body_double_tap_action":"Double Tap Action","config.disruption_box":"Bottom Box","config.disruption_mode":"Time to Low","config.disruption_entity":"Override Entity","config.disruption_label":"Override Label","config.disruption_icon":"Override Icon","config.disruption_tap_action":"Tap Action","config.disruption_hold_action":"Hold Action","config.disruption_double_tap_action":"Double Tap Action","config.disruption_mode_disruption":"Sleep Disruption","config.disruption_mode_low_timestamp":"Low - Timestamp","config.disruption_mode_low_hours_until":"Low - Hours Until","config.drink_chips":"Custom Boxes","config.drink_tracker_devices":"Drink Tracker Picker","config.medicine_devices":"Medicines Picker","config.drink_chip_1":"Box 1 (optional)","config.drink_chip_1_label":"Box 1 Label","config.drink_chip_1_icon":"Box 1 Icon","config.drink_chip_1_show_icon":"Show Icon","config.drink_chip_1_tap_action":"Tap Action","config.drink_chip_1_hold_action":"Hold Action","config.drink_chip_1_double_tap_action":"Double Tap Action","config.drink_chip_2":"Box 2 (optional)","config.drink_chip_2_label":"Box 2 Label","config.drink_chip_2_icon":"Box 2 Icon","config.drink_chip_2_show_icon":"Show Icon","config.drink_chip_2_tap_action":"Tap Action","config.drink_chip_2_hold_action":"Hold Action","config.drink_chip_2_double_tap_action":"Double Tap Action","config.drink_chip_3":"Box 3 (optional)","config.drink_chip_3_label":"Box 3 Label","config.drink_chip_3_icon":"Box 3 Icon","config.drink_chip_3_show_icon":"Show Icon","config.drink_chip_3_tap_action":"Tap Action","config.drink_chip_3_hold_action":"Hold Action","config.drink_chip_3_double_tap_action":"Double Tap Action","config.drink_chip_4":"Box 4 (optional)","config.drink_chip_4_label":"Box 4 Label","config.drink_chip_4_icon":"Box 4 Icon","config.drink_chip_4_show_icon":"Show Icon","config.drink_chip_4_tap_action":"Tap Action","config.drink_chip_4_hold_action":"Hold Action","config.drink_chip_4_double_tap_action":"Double Tap Action","config.color_scheme":"Color Scheme","config.name":"Name Override","config.daily_panel":"Daily Tab","config.graphs_panel":"Graphs Tab","config.stats_panel":"Stats Tab","config.settings_panel":"Settings Tab","config.show_color_indicator_explainer":"Color Explainer Button","config.confirm_tool_actions":"Confirm Tool Actions","config.helper.confirm_tool_actions":"Show a confirmation popup before running any Tools tab action. On by default.","config.chips":"Custom Boxes","config.box_settings":"Settings","config.button":"Button","config.take_button_lockout_style":"Limit Reached Style","config.take_button_lockout_icon_style":"Limit Reached Icon Style","config.take_button_execution_style":"Take Pill Style","config.take_button_execution_icon_style":"Take Pill Icon Style","config.take_button_latency_style":"Overdue Warning Style","config.take_button_latency_icon_style":"Overdue Warning Icon Style","config.take_button_ack_layout":"Logged Dose Indicator Style","config.take_button_ack_duration_ms":"Logged Animation Duration (ms)","config.take_button_ring_speed":"Glow / Ring Speed","config.drink_button_lockout_style":"Limit Reached Style","config.drink_button_lockout_icon_style":"Limit Reached Icon Style","config.drink_button_ack_layout":"Logged Dose Indicator Style","config.drink_button_ack_duration_ms":"Logged Animation Duration (ms)","config.drink_button_ring_speed":"Glow / Ring Speed","button_style.auto":"Default","button_style.full":"Full Button","button_style.border":"Border Only","button_style.none":"No Color","button_style.ring":"Rotating Ring","button_style.glow":"Ambilight Glow","icon_style.auto":"Default","icon_style.none":"None","icon_style.color":"Colored","icon_style.color_pulse":"Colored + Pulse","icon_style.pulse":"Pulse Only","ack_layout.top":"Top tick mark and text","ack_layout.inline":"Tick mark and text inline","ack_layout.big":"Big tick mark","ring_speed.slow":"Slow","ring_speed.medium":"Medium","ring_speed.fast":"Fast","button.ack_text":"Logged","config.chip_1_box":"Box 1","config.chip_2_box":"Box 2","config.chip_3_box":"Box 3","config.chip_4_box":"Box 4","config.chip_1":"Box 1 (optional)","config.chip_1_label":"Box 1 Label","config.chip_1_icon":"Box 1 Icon","config.chip_1_show_icon":"Show Icon","config.chip_1_tap_action":"Tap Action","config.chip_1_hold_action":"Hold Action","config.chip_1_double_tap_action":"Double Tap Action","config.chip_2":"Box 2 (optional)","config.chip_2_label":"Box 2 Label","config.chip_2_icon":"Box 2 Icon","config.chip_2_show_icon":"Show Icon","config.chip_2_tap_action":"Tap Action","config.chip_2_hold_action":"Hold Action","config.chip_2_double_tap_action":"Double Tap Action","config.chip_3":"Box 3 (optional)","config.chip_3_label":"Box 3 Label","config.chip_3_icon":"Box 3 Icon","config.chip_3_show_icon":"Show Icon","config.chip_3_tap_action":"Tap Action","config.chip_3_hold_action":"Hold Action","config.chip_3_double_tap_action":"Double Tap Action","config.chip_4":"Box 4 (optional)","config.chip_4_label":"Box 4 Label","config.chip_4_icon":"Box 4 Icon","config.chip_4_show_icon":"Show Icon","config.chip_4_tap_action":"Tap Action","config.chip_4_hold_action":"Hold Action","config.chip_4_double_tap_action":"Double Tap Action","config.show_amount_in_body":"Amount in Body Graph","config.amount_in_body_default_timeframe":"Amount in Body Default Timescale","config.show_day_avg_boxes":"Day Avg Boxes","config.show_adherence_boxes":"Adherence Boxes (If available)","config.stats_3_columns":"3-Column Stats","config.hide_nav_bar":"Hide Navigation Bar","config.helper.bold_text":"Makes all card text bolder for better readability.","config.helper.default_view":"Falls back to Daily if invalid.","config.helper.big_text":"Enlarges all card text for easier reading.","config.helper.take_pill_icon":"Icon for the Take Pill button. Defaults to mdi:pill.","config.helper.take_pill_label":'Button text. Defaults to "Take Pill". E.g. "Inject Dose", "Apply Cream".',"config.helper.safe_to_take_box":"Replace the box with any entity, or switch to the Amount in Body sensor. Leave empty for the default Safe to Take sensor.","config.helper.safe_to_take_entity":"Any entity to show here. Leave empty for default. Overridden by the Amount in body toggle.","config.helper.safe_to_take_label":'Custom label. Defaults to "Safe to take" or "Amount in Body" depending on the toggle.',"config.helper.safe_to_take_icon":"Icon on the box. Defaults to mdi:shield-check or mdi:chart-bell-curve depending on the toggle.","config.helper.safe_to_take_show_amount_in_body":"Show the Amount in Body sensor instead of Safe to take. The Take Pill limit check still uses the real Safe to Take sensor.","config.helper.safe_to_take_tap_action":"Defaults to more-info.","config.helper.safe_to_take_hold_action":"Long-press action.","config.helper.safe_to_take_double_tap_action":"Double-tap action.","config.helper.pills_left_label":'Defaults to "Pills left". E.g. "Amount Left (ml)", "Doses Left".',"config.helper.pills_left_icon":"Icon on the Pills Left box. Defaults to mdi:pill.","config.helper.pills_left_box":"Replace the box with any entity, or switch to the Days left sensor. Leave empty for the default sensor.","config.helper.pills_left_show_days_left":"Show the Days left sensor instead of Pills left. Keeps the Refill dialog as the default tap.","config.helper.pills_left_entity":"Any entity to show here. Leave empty for default. Overridden by the Days Left toggle.","config.helper.pills_left_tap_action":"Defaults to the Refill dialog. A custom action overrides it.","config.helper.pills_left_hold_action":"Long-press action.","config.helper.pills_left_double_tap_action":"Double-tap action.","config.helper.drinks_panel":"Drink Tracker (Caffeine / Alcohol) card settings.","config.helper.log_drink_icon":"Icon for the Log Drink button. Defaults to mdi:coffee / mdi:glass-mug-variant.","config.helper.log_drink_label":'Button text. Defaults to "Log Drink".',"config.helper.in_body_box":"Replace the box with any entity. Leave empty for the default sensor.","config.helper.in_body_entity":"Any entity to show here. Leave empty for default.","config.helper.in_body_label":'Custom label. Defaults to "In Body".',"config.helper.in_body_icon":"Icon on the box. Defaults to mdi:chart-bell-curve.","config.helper.in_body_tap_action":"Defaults to more-info.","config.helper.in_body_hold_action":"Long-press action.","config.helper.in_body_double_tap_action":"Double-tap action.","config.helper.disruption_box":"Show Sleep Disruption state, or switch to the Low - Timestamp / Low - Hours Until sensor. Or replace with any entity.","config.helper.disruption_mode":"Show Sleep Disruption state, or switch to the Low - Timestamp (HH:MM) or Low - Hours Until (countdown) sensor. Defaults to Sleep Disruption.","config.helper.disruption_entity":"Any entity to show here. Leave empty for default. Overridden by the Time to Low selector.","config.helper.disruption_label":'Custom label. Defaults to "Disruption", "Low - Timestamp", or "Low - Hours Until" depending on the selector.',"config.helper.disruption_icon":"Icon on the box. Defaults to mdi:sleep, mdi:clock-outline, or mdi:timer-sand depending on the selector.","config.helper.disruption_tap_action":"Defaults to the Sleep Disruption popup (Sleep Disruption mode) or more-info (Low modes).","config.helper.disruption_hold_action":"Long-press action.","config.helper.disruption_double_tap_action":"Double-tap action.","config.helper.drink_chips":"Show as a box on the Drinks tab.","config.helper.drink_tracker_devices":"Choose Caffeine or Alcohol Tracker devices. Multiple can be selected (all must be the same substance). Leave empty for a single medicine card.","config.helper.medicine_devices":"Choose one or more medicine devices. Multiple devices combine into one card with a title switcher. Do NOT select Caffeine/Alcohol Trackers here — use the Drink Tracker Picker below.","config.helper.drink_chip":"Show as a box on the Drinks tab.","config.helper.drink_chip_label":"Leave empty to use the entity's name.","config.helper.color_scheme":"Accent color for the card. *Press card title for more info on indicator colors and the starred colors.","config.helper.name":"Leave empty to use the device name.","config.helper.chip_label":"Leave empty to use the entity's name.","config.helper.chip":"Show as a box on the Daily tab.","config.helper.chip_icon":"Override the box icon. Leave empty for the entity's default icon.","config.helper.chip_show_icon":"Display an icon on this box. Off by default. When on, the box grows taller to fit the icon above the label — useful to make boxes larger for a button-like layout.","config.helper.chip_tap_action":"Defaults to more-info on the entity.","config.helper.chip_hold_action":"Long-press action.","config.helper.chip_double_tap_action":"Double-tap action.","config.helper.show_amount_in_body":"Show in the Graphs tab.","config.helper.amount_in_body_default_timeframe":"Default timescale on card load.","config.helper.show_day_avg_boxes":"Show beneath the bar graph.","config.helper.show_adherence_boxes":"Show beneath the bar graph. Requires adherence sensors.","config.helper.stats_3_columns":"3 columns instead of 2.","config.helper.hide_nav_bar":"Hide the tab navigation bar.","config.helper.show_color_indicator_explainer":"Show a Medical Color Indicators button in the device-info popup.","config.helper.take_button_lockout_style":"Visual style when the daily limit is reached (Full Button, Border Only, No Color, Rotating Ring, or Ambilight Glow). Default: Full Button.","config.helper.take_button_lockout_icon_style":"Icon color and pulse when the limit is reached. Default: None.","config.helper.take_button_execution_style":"Visual style when a scheduled dose is due (within the first half of the on-time window) (Full Button, Border Only, No Color, Rotating Ring, or Ambilight Glow). Default: No Color.","config.helper.take_button_execution_icon_style":"Icon color and pulse when a dose is due. Default: Colored.","config.helper.take_button_latency_style":"Visual style when the dose is overdue (past half the on-time window) (Full Button, Border Only, No Color, Rotating Ring, or Ambilight Glow). Default: Border Only.","config.helper.take_button_latency_icon_style":"Icon color and pulse when overdue. Default: Colored + Pulse.","config.helper.take_button_ack_layout":'Layout of the transient "Logged" flash after pressing the button. Default: Top tick mark and text.',"config.helper.take_button_ack_duration_ms":'How long the "Logged" flash appears, in milliseconds. Default: 3000.',"config.helper.take_button_ring_speed":"Speed of the rotating ring and ambilight glow breathing animation. Default: Medium.","config.helper.drink_button_lockout_style":"Visual style when the substance daily limit is reached (Full Button, Border Only, No Color, Rotating Ring, or Ambilight Glow). Default: Full Button.","config.helper.drink_button_lockout_icon_style":"Icon color and pulse when the limit is reached. Default: None.","config.helper.drink_button_ack_layout":'Layout of the transient "Logged" flash after logging a drink. Default: Top tick mark and text.',"config.helper.drink_button_ack_duration_ms":'How long the "Logged" flash appears, in milliseconds. Default: 3000.',"config.helper.drink_button_ring_speed":"Speed of the rotating ring and ambilight glow breathing animation. Default: Medium.","color.default":"Default (HA Theme)","color.blue":"Blue","color.red":"Red","color.green":"Green","color.yellow":"Yellow","color.orange":"Orange","color.purple":"Purple","color.pink":"Pink","color.teal":"Teal","color.brown":"Brown","color.coral":"Coral","color.slate":"Slate","color.gold":"Gold","color.grey":"Grey","setconfig.error.device_required":"A device is required for the AX Dose Logger card.","aria.take_pill_safe":"Take pill","aria.take_pill_limit":"Limit reached, override available","aria.take_pill_24h_limit":"24h strength limit reached, override available","aria.timeframe_12h":"12 hours","aria.timeframe_24h":"24 hours","aria.timeframe_48h":"48 hours","aria.timeframe_7d":"7 days","aria.timeframe_14d":"14 days","aria.timeframe_30d":"30 days","aria.timeframe_60d":"60 days","aria.effectiveness_avg":"Average of visible effectiveness trackers","aria.effectiveness_individual":"Individual effectiveness trackers"}};function Te(e,t,i){let a=Ae[e]?.[t]??Ae.en[t]??t;if(i)for(const[e,t]of Object.entries(i))a=a.replace(`{${e}}`,String(t));return a}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Se={},Ie=2,Ee=e=>(...t)=>({_$litDirective$:e,values:t});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Ce=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Me=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),Me(e,t);return!0},Be=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},Le=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Pe(t)}};function Ne(e){void 0!==this._$AN?(Be(this),this._$AM=e,Le(this)):this._$AM=e}function ze(e,t=!1,i=0){const a=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(t)if(Array.isArray(a))for(let e=i;e<a.length;e++)Me(a[e],!1),Be(a[e]);else null!=a&&(Me(a,!1),Be(a));else Me(this,e)}const Pe=e=>{e.type==Ie&&(e._$AP??=ze,e._$AQ??=Ne)};class Re extends Ce{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),Le(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(Me(this,e),Be(this))}setValue(e){if((e=>void 0===e.strings)(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}const Oe=Ee(class extends Re{constructor(e){super(e),this._latest=null,this._wrapper=e=>{void 0!==this._timer&&clearTimeout(this._timer),this._timer=window.setTimeout(()=>{this._timer=void 0,this.isConnected&&this._latest?.(e)},110)}}render(e){return this._latest=e,this._wrapper}update(e,[t]){return this._latest=t,this.render(t)}disconnected(){void 0!==this._timer&&(clearTimeout(this._timer),this._timer=void 0),this._latest=null,super.disconnected()}reconnected(){super.reconnected()}});function He(e){return Oe(e)}function Fe(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function Ue(e){switch(e){case"12h":return 12;case"24h":return 24;case"7d":return 168;case"14d":return 336;case"30d":return 720;default:return 48}}function Ke(e){return e.isLockedOut?"lockout":e.is24hLimitReached?"limit_24h":e.isScheduled?!e.isDueNow&&e.overdueSeconds<=0?"idle":e.overdueSeconds>3600*e.graceHours/2?"latency":"execution":"idle"}function We(){return[{value:"auto",label:Te("en","button_style.auto")},{value:"full",label:Te("en","button_style.full")},{value:"border",label:Te("en","button_style.border")},{value:"none",label:Te("en","button_style.none")},{value:"ring",label:Te("en","button_style.ring")},{value:"glow",label:Te("en","button_style.glow")}]}function je(){return[{value:"auto",label:Te("en","icon_style.auto")},{value:"none",label:Te("en","icon_style.none")},{value:"color",label:Te("en","icon_style.color")},{value:"color_pulse",label:Te("en","icon_style.color_pulse")},{value:"pulse",label:Te("en","icon_style.pulse")}]}function Ge(){return[{value:"top",label:Te("en","ack_layout.top")},{value:"inline",label:Te("en","ack_layout.inline")},{value:"big",label:Te("en","ack_layout.big")}]}function Ve(){return[{value:"slow",label:Te("en","ring_speed.slow")},{value:"medium",label:Te("en","ring_speed.medium")},{value:"fast",label:Te("en","ring_speed.fast")}]}let qe=null,Ye=0;function Xe(){const e="ax-dose-grid-align-items-end",t=()=>{const t=document.querySelectorAll("ha-dialog");let i=0;return t.forEach(t=>{t.querySelectorAll("ha-form").forEach(t=>{t.shadowRoot&&((t=>{if(t.querySelector(`#${e}`))return;const i=document.createElement("style");i.id=e,i.textContent='\n    /* Align grid children by bottom edge so entity picker + text field\n       control boxes line up despite different label rendering.\n       ha-form renders type:grid containers as divs with display:grid\n       in their inline style. */\n    div[style*="display: grid"],\n    div[style*="display:grid"] {\n      align-items: end !important;\n    }\n  ',t.appendChild(i)})(t.shadowRoot),i++)})}),i};t(),Ye++,qe||(qe=new MutationObserver(()=>{0===t()&&(Ye=Math.max(0,Ye-1),0===Ye&&(qe?.disconnect(),qe=null))}),qe.observe(document.body,{childList:!0,subtree:!0}))}let Ze=class extends ce{constructor(){super(...arguments),this.tick=0}get _lang(){return this.controller.lang}get _config(){return this.controller.config}render(){const e=this.controller,t=this.entities,i=[];if(t.totalDoses&&i.push({label:Te(this._lang,"stats.total_doses"),value:e.getState(t.totalDoses),icon:"mdi:counter",entityId:t.totalDoses}),t.daysSinceFirstDose&&i.push({label:Te(this._lang,"stats.days_since_first_dose"),value:e.getState(t.daysSinceFirstDose),icon:"mdi:calendar-start",entityId:t.daysSinceFirstDose}),t.daysLeft){const a=e.getState(t.daysLeft);let o="-";if(a&&"unknown"!==a&&"unavailable"!==a&&"None"!==a){const t=e.formatInteger(a);o=t&&"unknown"!==t&&"unavailable"!==t?t+" days":"-"}const n=t.daysLeftEst?Te(this._lang,"stats.days_left_est"):Te(this._lang,"stats.days_left");i.push({label:n,value:o,icon:"mdi:calendar-clock",entityId:t.daysLeft})}t.lastDose&&i.push({label:Te(this._lang,"stats.last_dose"),value:e.computeTimeSinceLastDose(t),icon:"mdi:clock-outline",entityId:t.lastDose});const a=e.getStrengthUnit(t);if(t.strength&&i.push({label:Te(this._lang,"stats.strength"),value:e.formatInteger(e.getState(t.strength))+" "+a,icon:"mdi:scale",entityId:t.strength}),t.amountInBody){const o=e.getState(t.amountInBody),n="unknown"!==o&&"unavailable"!==o&&o?e.formatInteger(o)+" "+a:"-";i.push({label:Te(this._lang,"stats.amount_in_body"),value:n,icon:"mdi:chart-bell-curve",entityId:t.amountInBody})}if(t.amountLast24h){const a=e.getState(t.amountLast24h);i.push({label:Te(this._lang,"stats.amount_last_24h"),value:"unknown"===a||"unavailable"===a?"-":a+" "+e.getStrengthUnit(t),icon:"mdi:calendar-clock",entityId:t.amountLast24h})}if(t.dailyRemaining){const a=e.getState(t.dailyRemaining);i.push({label:Te(this._lang,"stats.daily_remaining"),value:"unknown"===a||"unavailable"===a?"-":e.formatInteger(a)+" "+e.getStrengthUnit(t),icon:"mdi:progress-clock",entityId:t.dailyRemaining})}if(t.pillsSafeToTake&&i.push({label:Te(this._lang,"stats.safe_to_take"),value:e.formatInteger(e.getState(t.pillsSafeToTake)),icon:"mdi:pill",entityId:t.pillsSafeToTake}),t.nextDose&&i.push({label:Te(this._lang,"stats.next_dose"),value:e.computeNextDose(t),icon:"mdi:clock-plus",entityId:t.nextDose}),t.overdue){const a=e.computeOverTime(t);i.push({label:Te(this._lang,"stats.overdue"),value:a??"-",icon:"mdi:clock-alert",entityId:t.overdue})}if(t.steadyState){const a=e.getState(t.steadyState),o="0.0"===a||"0"===a?Te(this._lang,"stats.steady_state_reached"):Te(this._lang,"stats.steady_state_days",{days:a});i.push({label:Te(this._lang,"stats.steady_state"),value:o,icon:"mdi:chart-timeline-variant",entityId:t.steadyState})}const{hasDaysSensor:o,daysSince:n}=e.daysSinceReveal(t);if(t.avg7Days&&(!o||n>=7)&&i.push({label:Te(this._lang,"stats.avg_7_day"),value:e.getState(t.avg7Days),icon:"mdi:chart-line",entityId:t.avg7Days}),t.avg14Days&&(!o||n>=14)&&i.push({label:Te(this._lang,"stats.avg_14_day"),value:e.getState(t.avg14Days),icon:"mdi:chart-line",entityId:t.avg14Days}),t.avg30Days&&(!o||n>=30)&&i.push({label:Te(this._lang,"stats.avg_30_day"),value:e.getState(t.avg30Days),icon:"mdi:chart-line",entityId:t.avg30Days}),t.avgYearly&&(!o||n>0)){const a=o&&n<365?Te(this._lang,"stats.avg_running",{days:n}):Te(this._lang,"stats.avg_yearly");i.push({label:a,value:e.getState(t.avgYearly),icon:"mdi:chart-line",entityId:t.avgYearly})}if(t.adherence7Days&&(!o||n>=7)&&i.push({label:Te(this._lang,"stats.adherence_7_day"),value:e.getState(t.adherence7Days)+"%",icon:"mdi:check-decagram",entityId:t.adherence7Days}),t.adherence14Days&&(!o||n>=14)&&i.push({label:Te(this._lang,"stats.adherence_14_day"),value:e.getState(t.adherence14Days)+"%",icon:"mdi:check-decagram",entityId:t.adherence14Days}),t.adherence30Days&&(!o||n>=30)&&i.push({label:Te(this._lang,"stats.adherence_30_day"),value:e.getState(t.adherence30Days)+"%",icon:"mdi:check-decagram",entityId:t.adherence30Days}),t.adherence365Days&&(!o||n>0)){const a=o&&n<365?Te(this._lang,"stats.adherence_running",{days:n}):Te(this._lang,"stats.adherence_365_day");i.push({label:a,value:e.getState(t.adherence365Days)+"%",icon:"mdi:check-decagram",entityId:t.adherence365Days})}if(t.sleepDisruption){const a=e.getState(t.sleepDisruption);i.push({label:Te(this._lang,"stats.sleep_disruption"),value:"unknown"===a||"unavailable"===a?"-":a,icon:"mdi:bed-clock",entityId:t.sleepDisruption})}if(t.estimatedLowTime){const a=e.getState(t.estimatedLowTime);let o="-";if(a&&"unknown"!==a&&"unavailable"!==a){const e=new Date(a);isNaN(e.getTime())||(o=e.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}))}i.push({label:Te(this._lang,"stats.low_timestamp"),value:o,icon:"mdi:clock-alert-outline",entityId:t.estimatedLowTime})}if(t.lowHoursUntil){const a=e.getState(t.lowHoursUntil);let o="-";if(a&&"unknown"!==a&&"unavailable"!==a&&"None"!==a){const e=parseFloat(a);isNaN(e)||(o=String(e))}i.push({label:Te(this._lang,"stats.low_hours_until"),value:o,icon:"mdi:timer-sand",entityId:t.lowHoursUntil})}if(t.estimatedNoneTime){const a=e.getState(t.estimatedNoneTime);let o="-";if(a&&"unknown"!==a&&"unavailable"!==a){const e=new Date(a);isNaN(e.getTime())||(o=e.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}))}i.push({label:Te(this._lang,"stats.none_timestamp"),value:o,icon:"mdi:bed-clock",entityId:t.estimatedNoneTime})}if(t.nextBand){const a=e.getState(t.nextBand);let o="-";if(a&&"unknown"!==a&&"unavailable"!==a&&"None"!==a){o=a;const i=e.getAttr(t.nextBand,"minutes_until_next_band");"number"==typeof i&&i>0&&(o+=" "+Te(this._lang,"stats.next_band_in",{minutes:i}))}i.push({label:Te(this._lang,"stats.next_band"),value:o,icon:"mdi:transition",entityId:t.nextBand})}return W`
      <div class="pane pane-stats">
        <div class="stats-grid ${this._config?.stats_3_columns?"three-col":""}">
          ${i.map(e=>W`
            <div
              class="stat-cell ${e.entityId?"clickable":""}"
              role=${e.entityId?"button":void 0}
              tabindex=${e.entityId?0:-1}
              @click=${e.entityId?He(()=>this.controller.openMoreInfo(e.entityId)):void 0}
              @keydown=${e.entityId?t=>this.controller.onStatCellKeydown(t,e.entityId):void 0}
            >
              ${e.entityId?W`<ha-ripple></ha-ripple>`:V}
              <div class="stat-cell-header">
                <ha-icon icon="${e.icon}"></ha-icon>
                <span class="stat-cell-label">${e.label}</span>
              </div>
              <span class="stat-cell-value">${"unavailable"===e.value?"-":e.value}</span>
            </div>
          `)}
        </div>
      </div>
    `}};Ze.styles=r`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         (1:1 parity with Lovelace Mushroom cards). */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
    }
    .pane-stats {
      display: flex;
      flex-direction: column;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .stats-grid.three-col {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .stat-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      border-radius: 10px;
      transition: background 0.15s ease;
      /* position:relative + overflow:hidden clip the ha-ripple surface. */
      position: relative;
      overflow: hidden;
    }

    .stat-cell.clickable {
      cursor: pointer;
    }

    .stat-cell.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .stat-cell.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    .stat-cell-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-cell-header ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .stat-cell-label {
      font-size: calc(14px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .stat-cell-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }
  `,e([_e({attribute:!1})],Ze.prototype,"controller",void 0),e([_e({attribute:!1})],Ze.prototype,"entities",void 0),e([_e({attribute:!1})],Ze.prototype,"hass",void 0),e([_e({attribute:!1})],Ze.prototype,"tick",void 0),Ze=e([he("ax-dose-stats-panel")],Ze);let Je=class extends ce{get _lang(){return this.controller.lang}_handleAdherenceReset(e){this.controller.hass&&e.adherenceResetButton&&this.controller.runToolAction(Te(this._lang,"tools.reset_adherence"),Te(this._lang,"tools.desc.reset_adherence"),()=>{this.controller.hass.callService("button","press",{entity_id:e.adherenceResetButton})})}_handleAdherenceCover(e){this.controller.hass&&e.adherenceCoverButton&&this.controller.runToolAction(Te(this._lang,"tools.mark_adherence_taken"),Te(this._lang,"tools.desc.mark_adherence_taken"),()=>{this.controller.hass.callService("button","press",{entity_id:e.adherenceCoverButton})})}_handleSkipDose(e){this.controller.hass&&e.skipButton&&this.controller.runToolAction(Te(this._lang,"tools.skip_dose"),Te(this._lang,"tools.desc.skip_dose"),()=>{this.controller.hass.callService("button","press",{entity_id:e.skipButton})})}_handleResetHistory(e){this.controller.hass&&e.resetButton&&this.controller.runToolAction(Te(this._lang,"tools.reset_history"),Te(this._lang,"tools.desc.reset_history"),()=>{this.controller.hass.callService("button","press",{entity_id:e.resetButton})})}_handleResetAverages(e){this.controller.hass&&e.averagesResetButton&&this.controller.runToolAction(Te(this._lang,"tools.reset_averages"),Te(this._lang,"tools.desc.reset_averages"),()=>{this.controller.hass.callService("button","press",{entity_id:e.averagesResetButton})})}_handleUndoDoseConfirm(e){this.controller.hass&&e.undoButton&&this.controller.runToolAction(Te(this._lang,"tools.undo_dose"),Te(this._lang,"tools.desc.undo_dose"),()=>{this.controller.hass.callService("button","press",{entity_id:e.undoButton})})}_handleDrinkUndo(e){this.controller.hass&&e.undoButtonEntityId&&this.controller.runToolAction(Te(this._lang,"tools.undo_drink",{name:e.name}),Te(this._lang,"tools.desc.undo_drink"),()=>{this.controller.undoDrink(e.undoButtonEntityId)})}_handleDrinkReset(e){this.controller.hass&&e.resetButtonEntityId&&this.controller.runToolAction(Te(this._lang,"tools.reset_drink",{name:e.name}),Te(this._lang,"tools.desc.reset_drink"),()=>{this.controller.resetDrink(e.resetButtonEntityId)})}_handleResetAveragesEntity(e){this.controller.hass&&e&&this.controller.runToolAction(Te(this._lang,"tools.reset_averages"),Te(this._lang,"tools.desc.reset_averages"),()=>{this.controller.hass.callService("button","press",{entity_id:e})})}_renderMasterTools(){const e=this.entities.substance;if(!e)return W`<div class="tools-panel"><div class="tools-empty">${Te(this._lang,"tools.empty")}</div></div>`;const t=this.controller.getDrinksOfSubstance(e),i="alcohol"===e?"mdi:glass-wine":"mdi:coffee";return 0===t.length?W`<div class="tools-panel"><div class="tools-empty">${Te(this._lang,"tools.empty")}</div></div>`:W`
      <div class="tools-panel">
        ${this.entities.averagesResetButton?W`
          <div class="tools-section-header">${Te(this._lang,"tools.general_header")}</div>
          <div class="tools-grid">
            <button
              class="tool-btn"
              @click=${He(()=>this._handleResetAveragesEntity(this.entities.averagesResetButton))}
            >
              <ha-ripple></ha-ripple>
              <ha-icon icon="mdi:chart-bell-curve-remove"></ha-icon>
              <span>${Te(this._lang,"tools.reset_averages")}</span>
            </button>
          </div>
        `:V}
        <div class="tools-section-header ${this.entities.averagesResetButton?"tools-section-header--spaced":""}">${Te(this._lang,"tools.drinks_header")}</div>
        ${t.map(e=>W`
          <div class="drink-tool-row">
            <div class="drink-tool-name">
              <ha-icon icon="${i}"></ha-icon>
              <span>${e.name}</span>
            </div>
            <div class="drink-tool-actions">
              ${e.undoButtonEntityId?W`
                <button class="tool-btn danger drink-tool-btn" @click=${He(()=>this._handleDrinkUndo(e))}>
                  <ha-ripple></ha-ripple>
                  <ha-icon icon="mdi:undo"></ha-icon>
                  <span>${Te(this._lang,"tools.undo_dose")}</span>
                </button>
              `:V}
              ${e.resetButtonEntityId?W`
                <button class="tool-btn danger drink-tool-btn" @click=${He(()=>this._handleDrinkReset(e))}>
                  <ha-ripple></ha-ripple>
                  <ha-icon icon="mdi:history"></ha-icon>
                  <span>${Te(this._lang,"tools.reset_history")}</span>
                </button>
              `:V}
            </div>
          </div>
        `)}
      </div>
    `}render(){if("drink_master"===this.entities.deviceType)return this._renderMasterTools();const e=this.entities,t=!(!e.adherenceResetButton&&!e.adherenceCoverButton),i=!(!e.skipButton&&!e.undoButton),a=!(!e.resetButton&&!e.averagesResetButton);return t||i||a?W`
      <div class="tools-panel">
        ${t?W`
          <div class="tools-section-header">${Te(this._lang,"tools.adherence_header")}</div>
          <div class="tools-grid">
            ${e.adherenceResetButton?W`
              <button
                class="tool-btn"
                @click=${He(()=>this._handleAdherenceReset(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:percent-circle-outline"></ha-icon>
                <span>${Te(this._lang,"tools.reset_adherence")}</span>
              </button>
            `:V}
            ${e.adherenceCoverButton?W`
              <button
                class="tool-btn"
                @click=${He(()=>this._handleAdherenceCover(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:check-underline-circle"></ha-icon>
                <span>${Te(this._lang,"tools.mark_adherence_taken")}</span>
              </button>
            `:V}
          </div>
        `:V}

        ${i?W`
          <div class="tools-section-header tools-section-header--spaced">${Te(this._lang,"tools.dose_header")}</div>
          <div class="tools-grid">
            ${e.skipButton?W`
              <button
                class="tool-btn"
                @click=${He(()=>this._handleSkipDose(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:skip-next"></ha-icon>
                <span>${Te(this._lang,"tools.skip_dose")}</span>
              </button>
            `:V}
            ${e.undoButton?W`
              <button
                class="tool-btn"
                @click=${He(()=>this._handleUndoDoseConfirm(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:undo"></ha-icon>
                <span>${Te(this._lang,"tools.undo_dose")}</span>
              </button>
            `:V}
          </div>
        `:V}

        ${a?W`
          <div class="tools-section-header tools-section-header--spaced">${Te(this._lang,"tools.general_header")}</div>
          <div class="tools-grid">
            ${e.averagesResetButton?W`
              <button
                class="tool-btn"
                @click=${He(()=>this._handleResetAverages(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:chart-bell-curve-remove"></ha-icon>
                <span>${Te(this._lang,"tools.reset_averages")}</span>
              </button>
            `:V}
            ${e.resetButton?W`
              <button
                class="tool-btn danger"
                @click=${He(()=>this._handleResetHistory(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:history"></ha-icon>
                <span>${Te(this._lang,"tools.reset_history")}</span>
              </button>
            `:V}
          </div>
        `:V}
      </div>
    `:W`
        <div class="tools-panel">
          <div class="tools-empty">${Te(this._lang,"tools.empty")}</div>
        </div>
      `}};Je.styles=r`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         (1:1 parity with Lovelace Mushroom cards). Per-element overrides below
         set the ripple colour to the element's own identity colour. */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
    }
    /* Danger buttons (Undo/Reset) ripple red instead of the primary tint. */
    .tool-btn.danger {
      --ha-ripple-color: var(--error-color, #db4437);
    }
    .tools-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tools-empty {
      text-align: center;
      color: var(--secondary-text-color, #666);
      font-size: calc(14px + var(--pill-text-offset, 0px));
      padding: 24px 8px;
    }

    .tools-section-header {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tools-section-header--spaced {
      margin-top: 8px;
    }

    .tools-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .tool-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 14px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      color: var(--primary-text-color, #222);
      font-size: calc(14px + var(--pill-text-offset, 0px));
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s;
      /* position:relative + overflow:hidden clip the ha-ripple surface to the
         button's rounded border (MdRipple geometry requirement). */
      position: relative;
      overflow: hidden;
    }

    .tool-btn ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .tool-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    /* :active scale transform removed — ha-ripple provides the press feedback
       (Material Design radiating circle), so the physical compression is
       redundant and can fight the ripple's layout. */

    .tool-btn.danger {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.06);
    }

    .tool-btn.danger ha-icon {
      color: var(--error-color, #db4437);
    }

    .tool-btn.danger:hover {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
    }

    /* ── Master Tracker per-granular-drink rows ── */
    .drink-tool-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      flex-wrap: wrap;
    }
    .drink-tool-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color);
    }
    .drink-tool-name ha-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-color);
    }
    .drink-tool-actions {
      display: flex;
      gap: 8px;
    }
    .drink-tool-btn {
      flex-direction: row;
      padding: 8px 12px;
      font-size: calc(13px + var(--pill-text-offset, 0px));
    }
    .drink-tool-btn ha-icon { --mdc-icon-size: 20px; }
  `,e([_e({attribute:!1})],Je.prototype,"controller",void 0),e([_e({attribute:!1})],Je.prototype,"entities",void 0),e([_e({attribute:!1})],Je.prototype,"hass",void 0),Je=e([he("ax-dose-tools-panel")],Je);let Qe=class extends ce{get _lang(){return this.controller.lang}render(){const e=this.controller,t=this.entities.metrics;return t.length?W`
      <div class="tracking-panel">
        ${t.map(t=>{const i=e.getState(t.entityId),a=e.getAttr(t.entityId,"logged_today"),o=!0===a||"True"===a||"true"===a,n="unavailable"===i||"unknown"===i?null:parseFloat(i),r=null!==n?n:0,s=Te(this._lang,"tracking.today_label",{metric:t.label});return W`
            <div class="tracking-row">
              <div class="tracking-header">
                <span class="tracking-label">${s}</span>
                ${o?W`<span class="tracking-badge tracking-badge--set">${Te(this._lang,"tracking.set_today")}</span>`:W`<span class="tracking-badge tracking-badge--unset">${Te(this._lang,"tracking.not_set")}</span>`}
              </div>
              <div class="tracking-slider-row">
                <div class="tracking-slider-wrapper">
                  <ha-slider
                    .value=${r}
                    .min=${0}
                    .max=${10}
                    .step=${1}
                    .disabled=${!1}
                    pin
                    @change=${e=>this.controller.handleTrackingChange(t,e.target.value)}
                  ></ha-slider>
                  <div class="tracking-scale">
                    ${[0,1,2,3,4,5,6,7,8,9,10].map(e=>W`
                      <span class="tracking-scale-tick">${e}</span>
                    `)}
                  </div>
                </div>
                <span class="tracking-value">${null!==n?n:"—"}</span>
              </div>
            </div>
          `})}
      </div>
    `:W`
        <div class="tracking-panel">
          <div class="tracking-empty">${Te(this._lang,"tools.empty")}</div>
        </div>
      `}};Qe.styles=r`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
    }
    .tracking-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 4px 0;
    }

    .tracking-empty {
      text-align: center;
      color: var(--secondary-text-color, #666);
      font-size: calc(14px + var(--pill-text-offset, 0px));
      padding: 24px 0;
    }

    .tracking-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tracking-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tracking-label {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    .tracking-badge {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
    }

    .tracking-badge--set {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
    }

    .tracking-badge--unset {
      background: rgba(var(--rgb-secondary-text-color, 102, 102, 102), 0.12);
      color: var(--secondary-text-color, #666);
    }

    .tracking-slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tracking-slider-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .tracking-slider-wrapper ha-slider {
      width: 100%;
    }

    .tracking-value {
      min-width: 28px;
      text-align: center;
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    .tracking-scale {
      display: flex;
      justify-content: space-between;
      /* Asymmetric padding aligns tick centers with slider thumb centers.
         The ha-slider thumb sits about 10px from each track edge at min and
         max. Single-digit ticks are about 8px wide (center at 4px), so
         padding-left 6px places the 0 center at 10px. The 10 tick is two
         digits (about 14px, center at 7px), so padding-right 2px shifts it
         right to match the thumb at max. */
      padding-left: 6px;
      padding-right: 2px;
      margin-top: -2px;
      box-sizing: border-box;
    }

    .tracking-scale-tick {
      font-size: calc(11px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #888);
      text-align: center;
    }
  `,e([_e({attribute:!1})],Qe.prototype,"controller",void 0),e([_e({attribute:!1})],Qe.prototype,"entities",void 0),e([_e({attribute:!1})],Qe.prototype,"hass",void 0),Qe=e([he("ax-dose-tracking-panel")],Qe);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et=Ee(class extends Ce{constructor(){super(...arguments),this.key=V}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(((e,t=Se)=>{e._$AH=t})(e),this.key=t),i}});let tt=class extends ce{constructor(){super(...arguments),this.tick=0,this.buttonState="idle",this.ackActive=!1,this.ackCount=0}get _lang(){return this.controller.lang}_takeButtonClasses(){const e=this.buttonState,t=this.controller.config,i={style:"none",iconStyle:"color"},a={style:"border",iconStyle:"color_pulse"};let o="none",n="none";if("lockout"===e||"limit_24h"===e){const e={style:"full",iconStyle:"none"};o=t?.take_button_lockout_style??e.style,"auto"===o&&(o=e.style),n=t?.take_button_lockout_icon_style??e.iconStyle,"auto"===n&&(n=e.iconStyle)}else if("execution"===e){const e=i;o=t?.take_button_execution_style??e.style,"auto"===o&&(o=e.style),n=t?.take_button_execution_icon_style??e.iconStyle,"auto"===n&&(n=e.iconStyle)}else{if("latency"!==e)return this.ackActive?"take-pill-btn ack-flash":"take-pill-btn";{const e=a;o=t?.take_button_latency_style??e.style,"auto"===o&&(o=e.style),n=t?.take_button_latency_icon_style??e.iconStyle,"auto"===n&&(n=e.iconStyle)}}const r="lockout"===e||"limit_24h"===e?"red":"execution"===e?"blue":"latency"===e?"amber":"green",s=["take-pill-btn",`state-${e}`];return"full"===o&&s.push(`full-${r}`),"border"===o&&s.push(`border-${r}`),"ring"===o&&s.push(`ring-${r}`),"glow"===o&&s.push("style-none"),"none"===o&&s.push("style-none"),"color"!==n&&"color_pulse"!==n||s.push(`icon-${r}`),"color_pulse"!==n&&"pulse"!==n||s.push("pulse"),this.ackActive&&s.push("ack-flash"),s.join(" ")}_ringDuration(){const e=this.controller.config?.take_button_ring_speed??"medium";return"slow"===e?"6s":"medium"===e?"4s":"2.2s"}_takeGlowWrapClass(){const e=this.buttonState,t=this.controller.config;let i="none";if("lockout"===e||"limit_24h"===e)i=t?.take_button_lockout_style??"full","auto"===i&&(i="full");else if("execution"===e)i=t?.take_button_execution_style??"none","auto"===i&&(i="none");else{if("latency"!==e)return"";i=t?.take_button_latency_style??"border","auto"===i&&(i="border")}if("glow"!==i)return"";return`glow-${"lockout"===e||"limit_24h"===e?"red":"execution"===e?"blue":"latency"===e?"amber":"green"}`}_ackLayout(){return this.controller.config?.take_button_ack_layout??"top"}_ackLabelText(){const e=Te(this._lang,"button.ack_text");return this.ackCount>=2?`${e} ${this.ackCount}x`:e}render(){const e=this.controller,t=this.entities,i=e.getState(t.pillsSafeToTake),a=e.computeTimeSinceLastDose(t),o=e.computeNextDose(t),n=e.computeOverTime(t),r=e.getChipEntities(),s=e.getAttr(t.doseStatus,"slot_remaining"),l="number"==typeof s?s:null!=s&&""!==s?parseFloat(String(s)):NaN,c=Number.isFinite(l)&&l>0?Math.floor(l):0,d=!0===e.config?.pills_left_show_days_left,h=e.getPillsLeftBoxEntity(t),p=e.getState(h),g="unknown"===p||"unavailable"===p||void 0===p,_=!(!e.config?.pills_left_entity||e.config.pills_left_entity===t.pillsLeft||d),u={entity:h,tap_action:e.config?.pills_left_tap_action,hold_action:e.config?.pills_left_hold_action,double_tap_action:e.config?.pills_left_double_tap_action},f=!!e.config?.pills_left_tap_action,m=!!e.config?.pills_left_hold_action,b=!!e.config?.pills_left_double_tap_action,v=f||m||b||!!h||!!t.addRefill,y=()=>{t.addRefill?e.showRefillDialog():h&&e.openMoreInfo(h)},k=Te(this._lang,d?t.daysLeftEst?"stats.days_left_est":"stats.days_left":"daily.pills_left"),x=d?"mdi:calendar-month":"mdi:pill",w=!0===e.config?.safe_to_take_show_amount_in_body,$=e.getSafeBoxEntity(t),D=e.getState($),A="unknown"===D||"unavailable"===D||void 0===D,T=!(!e.config?.safe_to_take_entity||e.config.safe_to_take_entity===t.pillsSafeToTake),S=Te(this._lang,w?"stats.amount_in_body":"daily.safe_to_take"),I=w?"mdi:chart-bell-curve":"mdi:shield-check",E={entity:$,tap_action:e.config?.safe_to_take_tap_action,hold_action:e.config?.safe_to_take_hold_action,double_tap_action:e.config?.safe_to_take_double_tap_action},C=!!e.config?.safe_to_take_tap_action,M=!!e.config?.safe_to_take_hold_action,B=!!e.config?.safe_to_take_double_tap_action,L=!!$||C||M||B;return W`
      <div class="pane pane-daily">
        <div class="daily-main">
          <div class="take-pill-wrap${this._takeGlowWrapClass()?" "+this._takeGlowWrapClass():""}"
               style=${`--ring-duration: ${this._ringDuration()}`}
          >
            <div class="glow-backdrop"></div>
            <button
              class=${this._takeButtonClasses()}
              style=${this.ackActive?`--ack-duration: ${this.controller.config?.take_button_ack_duration_ms??3e3}ms`:""}
              aria-label=${"lockout"===this.buttonState?Te(this._lang,"aria.take_pill_limit"):"limit_24h"===this.buttonState?Te(this._lang,"aria.take_pill_24h_limit"):e.config?.take_pill_label||Te(this._lang,"aria.take_pill_safe")}
              @click=${He(()=>e.handleTakePill(t))}
            >
              <div class="ring-track"></div>
              <ha-ripple></ha-ripple>
            <ha-icon icon="${"lockout"===this.buttonState||"limit_24h"===this.buttonState?"mdi:alert":e.config?.take_pill_icon||"mdi:pill"}"></ha-icon>
            <span class="take-label">${"lockout"===this.buttonState?Te(this._lang,"daily.limit_reached"):"limit_24h"===this.buttonState?Te(this._lang,"daily.24h_limit_reached"):e.config?.take_pill_label||Te(this._lang,"daily.take_pill")}</span>
            <span class="take-sub"><span class="take-sub-segment">${Te(this._lang,"daily.last")}: ${a}</span>${n?W` \u2022 <span class="take-sub-segment">${Te(this._lang,"daily.overdue")}: ${n}</span>`:V}${c>0?W` \u2022 <span class="take-sub-segment">${Te(this._lang,"daily.slot_remaining",{count:String(c)})}</span>`:"Unavailable"!==o&&"now"!==o?W` \u2022 <span class="take-sub-segment">${Te(this._lang,"daily.next")}: ${o}</span>`:V}</span>
            ${this.ackActive?et(this.ackCount,W`
              <div class="ack-flash ack-${this._ackLayout()}${this.ackCount>=2?" ack-repeat":""}">
                <ha-icon icon="mdi:check-bold" class="ack-icon"></ha-icon>
                ${"big"!==this._ackLayout()?W`<span class="ack-text">${this._ackLabelText()}</span>`:this.ackCount>=2?W`<span class="ack-count-badge">${this.ackCount}x</span>`:V}
              </div>
            `):V}
            </button>
          </div>

          <div class="stats-column">
            <div class="stat-pill ${L?"clickable":""}"
                 role="button"
                 tabindex=${L?0:-1}
                 aria-label=${e.config?.safe_to_take_label||S}
                 @click=${L?He(t=>e.handleSafeBoxAction(t,"tap",E,$)):null}
                 @keydown=${L?t=>e.onKeyActivate(t,()=>e.handleSafeBoxAction(null,"tap",E,$)):null}
                 @contextmenu=${M?t=>{t.preventDefault(),e.handleSafeBoxAction(null,"hold",E,$)}:null}
                 @dblclick=${B?()=>e.handleSafeBoxAction(null,"double_tap",E,$):null}>
              ${L?W`<ha-ripple></ha-ripple>`:V}
               <ha-icon icon="${e.config?.safe_to_take_icon||I}"></ha-icon>
              <span class="stat-label">${e.config?.safe_to_take_label||S}</span>
              <span class="stat-value">${A?Te(this._lang,"daily.na"):w&&!T?(()=>{const i=parseFloat(D),a=e.getStrengthUnit(t);return isNaN(i)?D:`${Math.round(i)}${a?" "+a:""}`})():T?D?isNaN(parseFloat(D))?D.charAt(0).toUpperCase()+D.slice(1):e.formatInteger(D)+(e.getAttr($,"unit_of_measurement")?" "+e.getAttr($,"unit_of_measurement"):""):"":e.formatInteger(i)}</span>
            </div>
            <div class="stat-pill ${v?"clickable":""}"
                 role="button"
                 tabindex=${v?0:-1}
                 aria-label=${e.config?.pills_left_label||k}
                 @click=${v?He(t=>e.handlePillsLeftBoxAction(t,"tap",u,h,y)):null}
                 @keydown=${v?t=>e.onKeyActivate(t,()=>e.handlePillsLeftBoxAction(null,"tap",u,h,y)):null}
                 @contextmenu=${m?t=>{t.preventDefault(),e.handlePillsLeftBoxAction(null,"hold",u,h)}:null}
                 @dblclick=${b?()=>e.handlePillsLeftBoxAction(null,"double_tap",u,h):null}>
              ${v?W`<ha-ripple></ha-ripple>`:V}
               <ha-icon icon="${e.config?.pills_left_icon||x}"></ha-icon>
              <span class="stat-label">${e.config?.pills_left_label||k}</span>
              <span class="stat-value">${g?Te(this._lang,"daily.na"):d?e.formatInteger(p):_?p?isNaN(parseFloat(p))?p.charAt(0).toUpperCase()+p.slice(1):e.formatInteger(p)+(e.getAttr(h,"unit_of_measurement")?" "+e.getAttr(h,"unit_of_measurement"):""):"":"unavailable"===p?"-":e.formatInteger(p)}</span>
            </div>
          </div>
        </div>

        ${r.length>0?W`
              <div class="chips-row">
                ${r.map(t=>{const i=e.getState(t.entityId),a=t.label||e.hass?.states[t.entityId]?.attributes?.friendly_name||t.entityId,o=e.getAttr(t.entityId,"unit_of_measurement"),n=e.getAttr(t.entityId,"device_class"),r=t.icon||e.hass?.states[t.entityId]?.attributes?.icon||"mdi:chip";let s;if("timestamp"===n){const e=new Date(i);s=isNaN(e.getTime())?Te(this._lang,"daily.na"):e.toLocaleTimeString(this._lang,{hour:"2-digit",minute:"2-digit",hour12:!1})}else s=e.formatInteger(i)+(o?" "+o:"");const l={entity:t.entityId,tap_action:t.tapAction,hold_action:t.holdAction,double_tap_action:t.doubleTapAction},c=!!t.holdAction,d=!!t.doubleTapAction;return W`
                    <div class="chip clickable${t.showIcon?" with-icon":""}"
                      role="button"
                      tabindex="0"
                      aria-label=${a}
                      @click=${He(i=>e.handleChipAction(i,"tap",l,t.entityId))}
                      @keydown=${i=>e.onKeyActivate(i,()=>e.handleChipAction(null,"tap",l,t.entityId))}
                      @contextmenu=${c?i=>{i.preventDefault(),e.handleChipAction(null,"hold",l,t.entityId)}:null}
                      @dblclick=${d?()=>e.handleChipAction(null,"double_tap",l,t.entityId):null}>
                      <ha-ripple></ha-ripple>
                       ${t.showIcon?W`<ha-icon icon=${r} class="chip-icon"></ha-icon>`:V}
                      <span class="chip-name">${a}</span>
                      <span class="chip-value">${s}</span>
                    </div>
                  `})}
              </div>
            `:V}
      </div>
    `}};var it;tt.styles=r`
    /* Bold-text catch-all: sets a base font-weight so text without an explicit
       font-weight declaration still inherits the boost when bold_text is on.
       --pill-font-weight-boost is 1.5 (on) or 1 (off), injected on <ha-card>. */
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         (1:1 parity with Lovelace Mushroom cards). Per-element overrides below
         set the ripple colour to the element's own identity colour. */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
    }
    .pane-daily {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .daily-main {
      display: flex;
      gap: 12px;
    }

    .stats-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
      position: relative;  /* global z-axis protection — glow bleeds behind stats (Patch 1, belt-and-suspenders) */
      z-index: 1;
    }

    /* Wrapper for the ambilight glow backdrop. Becomes the .daily-main flex
       child (replaces the button's flex role). isolation:isolate + z-index:0
       spawn a localized z-axis boundary so the backdrop's z-index:-1 can't
       bleed behind the card background. NO overflow:hidden — the backdrop
       must bleed freely beyond the button (the button keeps its own
       overflow:hidden for ring-track/ripple clipping). See plans/
       architecture-rollback-z-axis-stacking-plan.md. */
    .take-pill-wrap {
      position: relative;
      z-index: 0;
      isolation: isolate;
      display: flex;
      flex: 1;
    }

    .take-pill-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      padding: 12px 16px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      flex: 1;
      z-index: 1;  /* stack above the .glow-backdrop (z-index:-1) */
      /* Reserve the full two-line-sub-text button height permanently. The
         button's justify-content: center distributes the reserved height as
         symmetric top/bottom padding around the icon + take-label + sub-text
         block, so the icon→label→sub gap stays the fixed 2px (uniform) while
         only the button's top/bottom breathing room grows to fit the reserved
         two lines. This keeps the internal spacing visually consistent between
         the one-line and two-line configurations; only the outer padding
         changes. min-height is expressed in em units (relative to the button's
         inherited 16px base font) so it scales with --pill-text-offset:
           icon 28px + icon margin-bottom 2px + take-label 18px (line ~1.2)
           + gap 2px + two sub lines (16px × 1.5 × 2) + gap 2px + padding 24px
         ≈ 28+2+22+2+48+2+24 = 128px ≈ 8em. */
      min-height: 8em;
    }

    /* :active scale transform removed — ha-ripple provides the press feedback
       (Material Design radiating circle), so the physical compression is
       redundant and can fight the ripple's layout. */
    /* ha-ripple sits above the .ring-track (z-index 0) AND above the
       .ack-flash overlay (z-index 2) so the native ripple keeps radiating
       over the opaque green "Logged" surface after an ACK press. The
       ripple fires at pointerdown (t=0) and animates ~300ms; the green
       overlay mounts ~110ms later (delayedAction), so raising the ripple
       to z-index 3 lets the user see press feedback even when their
       finger covers the Nx text. Matches Mushroom template-card
       layering (ripple renders over content). */
    .take-pill-btn > ha-ripple {
      z-index: 3;
    }
    /* State-coloured ripples — the press feedback colour matches the button's
       current medical state (richer than Mushroom's single colour, fits the
       Button State Matrix). The ACK state uses a light tint so the ripple
       reads on the opaque dark-green overlay surface (#212c22). */
    .take-pill-btn.state-lockout { --ha-ripple-color: var(--btn-red); }
    .take-pill-btn.state-limit_24h { --ha-ripple-color: var(--btn-red); }
    .take-pill-btn.state-execution { --ha-ripple-color: var(--btn-blue); }
    .take-pill-btn.state-latency { --ha-ripple-color: var(--btn-amber); }
    .take-pill-btn.ack-flash { --ha-ripple-color: #ffffff; }

    /* ── Button State Matrix (Prosumer UI) ──
       Replaces the prior binary .safe/.danger classes with a 5-state, 7-style-
       option system. The default (idle / no state class) keeps the original
       theme-tinted look. Each colored state composes a state-color class
       (e.g. .full-red, .icon-blue, .border-amber, .ring-green) from the panel's
       _takeButtonClasses() helper. See plans/button-state-matrix-plan.md. */

    /* State color tokens (CSS vars so the rules below stay generic). */
    :host {
      --btn-red: var(--error-color, #db4437);
      --rgb-btn-red: var(--rgb-error-color, 219, 68, 55);
      --btn-blue: #03a9f4;
      --rgb-btn-blue: 3, 169, 244;
      --btn-amber: #f5a623;
      --rgb-btn-amber: 245, 166, 35;
      --btn-green: #43a047;
      --rgb-btn-green: 67, 160, 71;
      /* Dark green surface for the Logged Dose Indicator (ACK) overlay.
         High contrast against the bright --btn-green glyph so the tick/text
         are clearly legible; opaque so the underlying button state
         (red/amber/blue) does not bleed through behind the green tick.
         See plans/ack-clarity-and-softening-plan.md (Issue 2). */
      --btn-green-soft: #212c22;
    }

    /* Base idle state (no state class) — original theme-tinted safe look.
       Gradient-stack surface: opaque --card-background-color base wall blocks
       the ambilight backlight; flat rgba(...,0.12) tint layer (linear-gradient
       with identical stops = flat color) restores the perceptual tint. See
       plans/gradient-stacking-material-synthesis-plan.md. */
    .take-pill-btn:not(.state-lockout):not(.state-limit_24h):not(.state-execution):not(.state-latency):not(.state-ack) {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    .take-pill-btn:not(.state-lockout):not(.state-limit_24h):not(.state-execution):not(.state-latency):not(.state-ack):hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.2), rgba(var(--rgb-primary-color, 3, 169, 244), 0.2));
    }

    /* Option 1 — Full Button (per color). Gradient-stack surface: opaque
       --card-background-color base wall blocks the ambilight backlight; flat
       rgba(var(--rgb-btn-*),0.12) tint layer restores the identity-color tint.
       See plans/gradient-stacking-material-synthesis-plan.md. */
    .take-pill-btn.full-red    { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.12), rgba(var(--rgb-btn-red), 0.12));    color: var(--btn-red); }
    .take-pill-btn.full-red:hover    { background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.2), rgba(var(--rgb-btn-red), 0.2)); }
    .take-pill-btn.full-blue   { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-blue), 0.12), rgba(var(--rgb-btn-blue), 0.12));   color: var(--btn-blue); }
    .take-pill-btn.full-blue:hover   { background-image: linear-gradient(rgba(var(--rgb-btn-blue), 0.2), rgba(var(--rgb-btn-blue), 0.2)); }
    .take-pill-btn.full-amber  { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-amber), 0.12), rgba(var(--rgb-btn-amber), 0.12));  color: var(--btn-amber); }
    .take-pill-btn.full-amber:hover  { background-image: linear-gradient(rgba(var(--rgb-btn-amber), 0.2), rgba(var(--rgb-btn-amber), 0.2)); }
    .take-pill-btn.full-green { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-green), 0.12), rgba(var(--rgb-btn-green), 0.12)); color: var(--btn-green); }
    .take-pill-btn.full-green:hover { background-image: linear-gradient(rgba(var(--rgb-btn-green), 0.2), rgba(var(--rgb-btn-green), 0.2)); }

    /* Option 2 — Icon recolor only (Icon Style: color / color_pulse). The >
       child combinator scopes the recolor to the button's OWN icon only — the
       nested ACK tick is excluded so it keeps its own color. Do NOT set
       background/color here: every Style option emits its own bg rule with
       equal specificity, and a bg here would tie with .full-{color} and win
       by source order, erasing the Full Button tint (bug: Full Button only
       worked with Icon Style None or Pulse Only). See plans/
       full-button-icon-style-override-fix-plan.md. */
    .take-pill-btn.icon-red > ha-icon    { color: var(--btn-red); }
    .take-pill-btn.icon-blue > ha-icon   { color: var(--btn-blue); }
    .take-pill-btn.icon-amber > ha-icon  { color: var(--btn-amber); }
    .take-pill-btn.icon-green > ha-icon  { color: var(--btn-green); }

    /* Option 3 — Border only (inset box-shadow so the button does not grow;
       a real border would add 2px to the outer size on each side). */
    .take-pill-btn.border-red    { box-shadow: inset 0 0 0 2px var(--btn-red); }
    .take-pill-btn.border-blue   { box-shadow: inset 0 0 0 2px var(--btn-blue); }
    .take-pill-btn.border-amber  { box-shadow: inset 0 0 0 2px var(--btn-amber); }
    .take-pill-btn.border-green  { box-shadow: inset 0 0 0 2px var(--btn-green); }
    .take-pill-btn.border-red, .take-pill-btn.border-blue,
    .take-pill-btn.border-amber, .take-pill-btn.border-green {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }

    /* Option 6 — Rotating Ring (Apple Intelligence perimeter sweep).
       TWO-LAYER architecture (required: the mask-ring and the rotation-oversize
       cannot share one element — oversizing moves the mask's content-box ring
       off the button, where overflow:hidden clips it away → nothing renders).
       Layer 1 .ring-track: button-sized (inset 0), holds the mask that carves
       the 2px ring on the button edge + overflow:hidden to clip the rotating
       child to the rounded perimeter. Layer 2 .ring-track::before: oversized
       (inset -150%) rotating gradient source; the track's mask carves the ring
       from this rotating gradient. transform animates without @property. */
    @keyframes ax-btn-ring-sweep { to { transform: rotate(360deg); } }
    .take-pill-btn.ring-red, .take-pill-btn.ring-blue,
    .take-pill-btn.ring-amber, .take-pill-btn.ring-green {
      position: relative;
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    /* Layer 1 — the static geometry mask. Button-sized so the mask ring sits
       exactly on the button edge. padding:2px defines the ring thickness;
       border-radius:inherit follows the rounded corners; overflow:hidden clips
       the rotating child to the perimeter. */
    .take-pill-btn .ring-track {
      position: absolute;
      inset: 0;
      padding: 2px;
      border-radius: inherit;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      /* Both prefixed AND unprefixed mask must be declared: mask-composite
         operates on the unprefixed mask in modern Chromium. */
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
              mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
    }
    /* Layer 2 — the rotating oversized gradient engine. 400% of the track
       (button-sized) so its rotating square always covers the track at every
       angle (no corner gaps). The track's mask carves the 2px ring from this
       rotating gradient. */
    .take-pill-btn .ring-track::before {
      content: '';
      position: absolute;
      inset: -150%;
      animation: ax-btn-ring-sweep var(--ring-duration, 2.2s) linear infinite;
    }
    /* State color → gradient. 85% line with a solid-color middle (76.5→229.5,
       153deg = 50% of the line) so the state color stays unambiguous; a
       white-tipped shimmer head at 306deg (color-mix lifts toward #fff); a
       crisp head edge (306→306.1deg near-zero stop); 54deg transparent gap. */
    .take-pill-btn.ring-red .ring-track::before    { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-red)    76.5deg, var(--btn-red)    229.5deg, color-mix(in srgb, var(--btn-red)    60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }
    .take-pill-btn.ring-blue .ring-track::before   { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-blue)   76.5deg, var(--btn-blue)   229.5deg, color-mix(in srgb, var(--btn-blue)   60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }
    .take-pill-btn.ring-amber .ring-track::before  { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-amber)  76.5deg, var(--btn-amber)  229.5deg, color-mix(in srgb, var(--btn-amber)  60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }
    .take-pill-btn.ring-green .ring-track::before  { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-green)  76.5deg, var(--btn-green)  229.5deg, color-mix(in srgb, var(--btn-green)  60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }

    /* Option 6 — Ambilight Glow (GPU-composited diffused backlight + breathing).
       A dedicated .glow-backdrop div sits behind the button (inside the
       .take-pill-wrap wrapper) and bleeds outward (inset:-9px) with a STATIC
       filter:blur(8px) that produces the ambilight falloff (vibrant edge,
       quickly diffusing). The breathing animation animates OPACITY only
       (compositor-only property → GPU layer, zero CPU repaint — safe for
       tablet SOCs). will-change is sandboxed inside the active glow selector
       below so inactive (non-glow) states revert to will-change:auto and
       release the GPU compositor layer + VRAM. The button face stays
       theme-tinted (style-none) — the glow is purely an outer light.
       Z-axis: the wrapper has isolation:isolate + z-index:0, so the
       backdrop's z-index:-1 renders behind the wrapper baseline but in
       front of the card background. The 9px diffusion bleeds outside the
       wrapper but stays behind adjacent siblings (z-index:1). See plans/
       architecture-rollback-z-axis-stacking-plan.md. */
   .take-pill-wrap .glow-backdrop {
     position: absolute;
     inset: -9px;
     z-index: -1;
     border-radius: calc(var(--ha-card-border-radius, 12px) + 9px);
     background: var(--glow-color, transparent);
     filter: blur(8px);
     opacity: 0;
      pointer-events: none;
      /* will-change OMITTED from the base class — sandboxed inside the active
         .glow-{color} .glow-backdrop selector so non-glow states revert to
         will-change:auto and flush the VRAM footprint (no GPU layer pinned). */
      /* No animation here — gated to the active glow selector below. */
    }
    /* Per-color activation: the wrapper's glow-{color} class sets the color
       token consumed by the backdrop's background. */
    .take-pill-wrap.glow-red    { --glow-color: rgba(var(--rgb-btn-red), 0.85); }
    .take-pill-wrap.glow-blue   { --glow-color: rgba(var(--rgb-btn-blue), 0.85); }
    .take-pill-wrap.glow-amber  { --glow-color: rgba(var(--rgb-btn-amber), 0.85); }
    .take-pill-wrap.glow-green  { --glow-color: rgba(var(--rgb-btn-green), 0.85); }
    /* Active-glow selector: animation + will-change scoped here ONLY. When no
       glow-{color} class is on the wrapper, these rules do not apply → the
       backdrop is opacity:0 with no animation and no will-change → zero GPU
       layer cost (VRAM-safe). */
    .take-pill-wrap.glow-red .glow-backdrop,
    .take-pill-wrap.glow-blue .glow-backdrop,
    .take-pill-wrap.glow-amber .glow-backdrop,
    .take-pill-wrap.glow-green .glow-backdrop {
      opacity: 0.6;
      will-change: opacity;
      animation: ax-btn-glow-breathe var(--ring-duration, 4s) ease-in-out infinite;
    }
    /* Breathing keyframe — opacity only (GPU-composited). The static
       filter:blur(8px) is rasterized once when the layer is created; the
       keyframe just fades the pre-blurred layer in/out. No per-frame CPU work. */
    @keyframes ax-btn-glow-breathe {
      0%, 100% { opacity: 0.35; }
      50%      { opacity: 0.85; }
    }

    /* Option 5 — No change (theme default, no color override). The surface
       is still solidified (alpha-1.0) to occlude the ambilight backlight;
       only the color identity is left at the theme default primary tint. */
    .take-pill-btn.style-none {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }

    /* Icon-pulse animation (independent toggle per state). */
    @keyframes ax-btn-icon-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.15); opacity: 0.7; }
    }
    .take-pill-btn.pulse ha-icon {
      animation: ax-btn-icon-pulse 1.2s ease-in-out infinite;
    }

    /* ACK (logged) transient overlay — a pure flash layered on top of the
       button's true state. The button keeps its real color underneath; the
       overlay paints an opaque green surface + white tick ("mdi:check-bold")
       and optional "Logged" text, fully covering the underlying button, then
       fades to reveal the true state. Rendered as a real <div class="ack-flash">
       element (conditionally added to the template when ackActive is true) so
       it can host a real <ha-icon>. The layout is selected by the ack-top /
       ack-inline / ack-big modifier class from the per-button ack_layout
       config. Duration comes from the inline --ack-duration var. */
    .take-pill-btn .ack-flash {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      /* Issue 2 — dark green surface (not the saturated --btn-green) so the
         flash is less jarring; opaque so the underlying button state does
         not bleed through. The tick + text use solid --btn-green (bright
         green) for clear, legible success semantics on the dark surface. */
      background: var(--btn-green-soft);
      color: var(--btn-green);
      border-radius: inherit;
      opacity: 0;
      transform-origin: center;
      /* Issue 3 — two-animation split on a single line (a multi-line
         animation shorthand breaks the Lit CSS compiler, which drops the
         whole rule + the keyframes). A FIXED 240ms press-in intro (so the
         press feel stays snappy even when a long ack_duration is set — a
         proportional intro would stretch to ~800ms at 10000ms and feel
         sluggish), then the hold+fade animation delayed by 240ms. The intro
         uses "both" fill so its end state (opacity 1, scale 1) holds during
         the 240ms delay before the fade animation takes over. */
      animation: ax-btn-ack-intro 240ms ease-out both, ax-btn-ack-fade var(--ack-duration, 3000ms) ease-out 240ms forwards;
      pointer-events: none;
      z-index: 2;
    }
    /* Rapid-click repeat: on the 2nd+ press the overlay is already at full
       opacity, so skip the 240ms intro (no flicker) and run only the fade
       animation from the start. The key() directive recreates the element
       on each ackCount change, restarting the animation so the fade timer
       effectively resets with each click. */
    .take-pill-btn .ack-flash.ack-repeat {
      animation: ax-btn-ack-fade var(--ack-duration, 3000ms) ease-out forwards;
    }
    /* Option 1 — Top tick mark and text (default; mirrors button layout). */
    .take-pill-btn .ack-flash.ack-top {
      flex-direction: column;
      gap: 4px;
    }
    .take-pill-btn .ack-flash.ack-top .ack-icon { --mdc-icon-size: 28px; }
    .take-pill-btn .ack-flash.ack-top .ack-text {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
    }
    /* Option 2 — Tick mark and text inline (the prior single-line layout). */
    .take-pill-btn .ack-flash.ack-inline {
      flex-direction: row;
      gap: 8px;
    }
    .take-pill-btn .ack-flash.ack-inline .ack-icon { --mdc-icon-size: 24px; }
    .take-pill-btn .ack-flash.ack-inline .ack-text {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
    }
    /* Option 3 — Big tickmark only (no text). */
    .take-pill-btn .ack-flash.ack-big .ack-icon { --mdc-icon-size: 56px; }
    /* Rapid-click count badge for the big (tickmark-only) ACK layout.
       Hidden on top/inline (those embed the count in ack-text). Sized to
       match the big tickmark's visual weight (56px icon) so the count reads
       as a peer of the tick, not a footnote. Uses the bright --btn-green
       glyph color so it reads as part of the success indicator; a
       translucent green chip background ties it to the green overlay
       surface. */
    .take-pill-btn .ack-flash.ack-big .ack-count-badge {
      font-size: calc(28px + var(--pill-text-offset, 0px));
      font-weight: 700;
      color: var(--btn-green);
      background: rgba(67, 160, 71, 0.18);
      padding: 4px 14px;
      border-radius: 14px;
      margin-top: 10px;
      line-height: 1.1;
    }
    /* Issue 3 — FIXED 240ms press-in intro mirrors the button's own
       :active { transform: scale(0.96) } press so the overlay reads like a
       button press instead of a hard cut. Fixed (not proportional to
       --ack-duration) so the press feel stays snappy even when a long flash
       interval is set. */
    @keyframes ax-btn-ack-intro {
      0%   { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
    /* Hold + fade-out. Starts at opacity 1 (the intro's end state) and is
       delayed by 240ms (see the animation shorthand above) so it begins
       exactly when the intro finishes. */
    @keyframes ax-btn-ack-fade {
      0%   { opacity: 1; transform: scale(1); }
      70%  { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1); }
    }

    .take-pill-btn ha-icon {
      --mdc-icon-size: 28px;
      margin-bottom: 2px;
    }

    .take-label {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(550 * var(--pill-font-weight-boost, 1));
    }

    .take-sub {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(450 * var(--pill-font-weight-boost, 1));
      opacity: 0.9;
    }

    .take-sub-segment {
      white-space: nowrap;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      /* Gradient-stack surface: opaque --card-background-color base wall blocks
         the ambilight backlight; flat rgba(...,0.06) tint layer restores the
         perceptual tint. The stat-pill is an adjacent UI surface on
         .stats-column (z-index:1 sibling of .take-pill-wrap). See plans/
         gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.06), rgba(var(--rgb-primary-color, 3, 169, 244), 0.06));
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      flex: 1;
      /* position:relative clips the ha-ripple surface (overflow:hidden
         already present). */
      position: relative;
    }

    .stat-pill ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .stat-label {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.2;
      min-height: 2.6em;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
      margin-left: auto;
      line-height: 1.5;
      white-space: nowrap;
    }

    .stat-pill.clickable {
      cursor: pointer;
    }

    .stat-pill.clickable:hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
    }

    .chips-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      position: relative;  /* global z-axis protection — glow bleeds behind chips (Patch 1, belt-and-suspenders) */
      z-index: 1;
    }

    /* ── Chips — match the Graph panel Day Avg Boxes format (primary-tinted
       background, uppercase label with letter-spacing, column layout, no icon
       by default) but with the stat-pill min-height so the chip row aligns
       with the two boxes above it on the Daily panel. The .with-icon modifier
       relaxes the min-height so the box grows to fit the icon-on-top. ── */
    .chip {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 4px;
      /* Gradient-stack surface: opaque --card-background-color base wall blocks
         the ambilight backlight; flat rgba(...,0.05) tint layer restores the
         perceptual tint. The chip row (.chips-row, z-index:1) sits below
         .daily-main. See plans/gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.05), rgba(var(--rgb-primary-color, 3, 169, 244), 0.05));
      border-radius: 10px;
      overflow: hidden;
      /* position:relative clips the ha-ripple surface. */
      position: relative;
    }

    .chip.clickable {
      cursor: pointer;
    }

    .chip.clickable:hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
    }

    /* .with-icon modifier: gap stays 2px (label→value spacing unchanged); the
       icon gets its own breathing room via .chip-icon margin-bottom so
       toggling the icon on doesn't alter the label-to-value gap. */
    .chip-icon {
      --mdc-icon-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
      margin-bottom: 8px;
    }

    .chip-name {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: 1.2;
      text-align: center;
      word-break: break-word;
      max-width: 100%;
    }

    .chip-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
      line-height: 1.5;
      white-space: nowrap;
    }
  `,e([_e({attribute:!1})],tt.prototype,"controller",void 0),e([_e({attribute:!1})],tt.prototype,"entities",void 0),e([_e({attribute:!1})],tt.prototype,"hass",void 0),e([_e({attribute:!1})],tt.prototype,"tick",void 0),e([_e({attribute:!1})],tt.prototype,"buttonState",void 0),e([_e({attribute:!1})],tt.prototype,"ackActive",void 0),e([_e({attribute:!1})],tt.prototype,"ackCount",void 0),tt=e([he("ax-dose-daily-panel")],tt);let at=it=class extends ce{constructor(){super(...arguments),this.amountHistory=[],this.amountHistorySampled=!1,this.doseHistory=[],this.activeGraph=0,this.activeTimeframe="48h",this.activeBarTimeframe="14d",this.activeEffectivenessTimeframe="14d",this.activeEffectivenessView="avg",this.effectivenessHistory={},this.effectivenessVisible=new Set}get _lang(){return this.controller.lang}get _config(){return this.controller.config}_getBarTimeframeDays(){switch(this.activeBarTimeframe){case"30d":return 30;case"60d":return 60;default:return 14}}_getTimeframeHours(){return Ue(this.activeTimeframe)}render(){const e=this.controller,t=this.entities,i=e.bucketByDay(this._getBarTimeframeDays()),a=t.amountInBody&&"0"!==e.getState(t.amountInBody)&&"unknown"!==e.getState(t.amountInBody)&&"unavailable"!==e.getState(t.amountInBody),o=["bar"];a&&!1!==this._config?.show_amount_in_body&&o.push("line"),t.metrics.length>0&&o.push("effectiveness");const n=Math.min(this.activeGraph,o.length-1),r=o[n],s="bar"===r?Te(this._lang,"graphs.bar_title",{days:this._getBarTimeframeDays()}):Te(this._lang,"line"===r?"graphs.line_title":"graphs.effectiveness_title"),l="line"===r?e.getState(t.amountInBody):"",c=parseFloat(l),d="line"===r&&l&&"unavailable"!==l&&!isNaN(c),h=d?e.getStrengthUnit(t):"";return W`
      <div class="pane pane-graphs">
        ${o.length>1?W`
          <div class="carousel-nav">
            <button
              class="nav-btn"
              aria-label=${Te(this._lang,"graphs.aria_prev")}
              @click=${()=>e.setActiveGraph((n-1+o.length)%o.length)}
              ?disabled=${o.length<=1}
            >
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <span class="nav-title">${s}${d?`: ${Math.round(c)} ${h}`:""}</span>
            <button
              class="nav-btn"
              aria-label=${Te(this._lang,"graphs.aria_next")}
              @click=${()=>e.setActiveGraph((n+1)%o.length)}
              ?disabled=${o.length<=1}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        `:W`
          <div class="carousel-nav">
            <span class="nav-title">${s}${d?`: ${Math.round(c)} ${h}`:""}</span>
          </div>
        `}

        <div class="graph-container">
          ${"bar"===r?this._renderBarGraph(i):"line"===r?this._renderLineGraph(t):this._renderEffectivenessGraph(t)}
        </div>

        ${"bar"===r?this._renderAveragesGrid(t):V}
      </div>
    `}_renderBarGraph(e){this.controller;const t=Math.max(...e.map(e=>e.count),1),i=e.some(e=>e.count>0),a=this._getBarTimeframeDays();if(!i)return W`
        <div class="bar-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderBarTimeframeChips()}
          </div>
          <div class="graph-placeholder">
            <ha-icon icon="mdi:chart-bar"></ha-icon>
            <span>${Te(this._lang,"graphs.empty_bar")}</span>
          </div>
        </div>
      `;const o=320,n=188,r=(280-2*(e.length-1))/e.length;let s;return s=a<=14?1:a<=30?2:5,W`
      <div class="bar-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderBarTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${o} ${n}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/188">
          ${[0,.25,.5,.75,1].map(e=>{const i=36+144*(1-e);return j`
              <line x1="${32}" y1="${i}" x2="${312}" y2="${i}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${28}" y="${i+3}" text-anchor="end"
                    style="font-size: calc(11px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${Math.round(t*e)}</text>
            `})}

          ${e.map((e,i)=>{const a=Math.max(e.count/t*144,e.count>0?2:0);return j`
              <rect x="${32+i*(r+2)}" y="${180-a}" width="${r}" height="${a}" rx="2"
                    fill="var(--primary-color)" opacity="0.85">
                <title>${e.label}: ${e.count} dose${1!==e.count?"s":""}</title>
              </rect>
            `})}

          <!-- Baseline -->
          <line x1="${32}" y1="${180}" x2="${312}" y2="${180}"
                stroke="var(--divider-color)" stroke-width="1"/>
        </svg>
        <div class="bar-labels">
          ${e.map((e,t)=>W`
            <span>${t%s===0?e.label:""}</span>
          `)}
        </div>
      </div>
    `}_renderTimeframeChips(){const e=this.controller;return[{id:"12h",labelKey:"graphs.timeframe_12h",ariaKey:"aria.timeframe_12h"},{id:"24h",labelKey:"graphs.timeframe_24h",ariaKey:"aria.timeframe_24h"},{id:"48h",labelKey:"graphs.timeframe_48h",ariaKey:"aria.timeframe_48h"},{id:"7d",labelKey:"graphs.timeframe_7d",ariaKey:"aria.timeframe_7d"},{id:"14d",labelKey:"graphs.timeframe_14d",ariaKey:"aria.timeframe_14d"},{id:"30d",labelKey:"graphs.timeframe_30d",ariaKey:"aria.timeframe_30d"}].map(t=>W`
      <button
        class="timeframe-chip ${this.activeTimeframe===t.id?"active":""}"
        aria-label=${Te(this._lang,t.ariaKey)}
        @click=${()=>e.handleTimeframeChange(t.id)}
      >${Te(this._lang,t.labelKey)}</button>
    `)}_renderBarTimeframeChips(){const e=this.controller;return[{id:"14d",labelKey:"graphs.timeframe_14d",ariaKey:"aria.timeframe_14d"},{id:"30d",labelKey:"graphs.timeframe_30d",ariaKey:"aria.timeframe_30d"},{id:"60d",labelKey:"graphs.timeframe_60d",ariaKey:"aria.timeframe_60d"}].map(t=>W`
      <button
        class="timeframe-chip ${this.activeBarTimeframe===t.id?"active":""}"
        aria-label=${Te(this._lang,t.ariaKey)}
        @click=${()=>e.handleBarTimeframeChange(t.id)}
      >${Te(this._lang,t.labelKey)}</button>
    `)}_renderLineGraph(e){const t=this.controller.getState(e.amountInBody),i=this.amountHistory,a=320,o=208,n=36,r=36,s=276,l=144;if(0===i.length)return W`
        <div class="line-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderTimeframeChips()}
          </div>
          <svg viewBox="0 0 ${a} ${o}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: ${a}/${o}">
            <text x="${160}" y="${104}" text-anchor="middle"
                  style="font-size: calc(14px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${Te(this._lang,"graphs.loading_history")}</text>
          </svg>
        </div>
      `;const c=new Date,d=this._getTimeframeHours(),h=new Date(c.getTime()-60*d*60*1e3),p=this.amountHistorySampled?i.map(e=>({timestamp:new Date(e.timestamp).getTime(),value:e.value})):function(e,t=18e4){if(e.length<2)return e.map(e=>({timestamp:new Date(e.timestamp).getTime(),value:e.value}));const i=[];for(let a=0;a<e.length;a++){const o={timestamp:new Date(e[a].timestamp).getTime(),value:e[a].value};if(a>0){const e=i[i.length-1];o.timestamp-e.timestamp>t&&i.push({timestamp:o.timestamp-1e3,value:e.value})}i.push(o)}return i}(i),g=p.map(e=>e.value),_=Math.max(...g,1),u=p.map(e=>{const t=Math.max(0,Math.min(1,(e.timestamp-h.getTime())/(60*d*60*1e3)));return`${n+t*s},${r+l*(1-e.value/_)}`}).join(" "),f=parseFloat(t),m=t&&"unavailable"!==t&&!isNaN(f),b=m?Math.max(r,Math.min(180,r+l*(1-f/_))):r,v=[],y=[],k=this._getTimeframeHours();if(k<=12){for(let e=0;e<=k;e+=1){const t=e/k;v.push({x:n+t*s})}for(let e=0;e<=k;e+=2){const t=e/k;y.push({label:`-${k-e}h`,x:n+t*s})}}else if(k<=24){for(let e=0;e<=k;e+=2){const t=e/k;v.push({x:n+t*s})}for(let e=0;e<=k;e+=4){const t=e/k;y.push({label:`-${k-e}h`,x:n+t*s})}}else if(k<=48){for(let e=0;e<=k;e+=3){const t=e/k;v.push({x:n+t*s})}for(let e=0;e<=k;e+=6){const t=e/k;y.push({label:`-${k-e}h`,x:n+t*s})}}else{const e=k/24;let t,i;e<=7?(t=1,i=.5):e<=14?(t=2,i=1):(t=5,i=2);for(let t=0;t<=e;t+=i){const i=t/e;v.push({x:n+i*s})}for(let i=0;i<=e;i+=t){const t=i/e;y.push({label:`-${Math.round(e-i)}d`,x:n+t*s})}}return W`
      <div class="line-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${a} ${o}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: ${a}/${o}">
          <!-- Y-axis grid lines and labels -->
          ${[0,.25,.5,.75,1].map(e=>{const t=r+l*(1-e);return j`
              <line x1="${n}" y1="${t}" x2="${312}" y2="${t}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${32}" y="${t+3}" text-anchor="end"
                    style="font-size: calc(11px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${(_*e).toFixed(1)}</text>
            `})}

          <!-- History polyline -->
          <polyline points="${u}"
                    fill="none" stroke="var(--primary-color)" stroke-width="1.5"
                    stroke-linejoin="round" opacity="0.8"/>

          <!-- Current amount dashed line (label rendered as an HTML chip in
               the top-right of .line-graph-wrapper so it can't overlap the
               polyline) -->
          ${m?j`
            <line x1="${n}" y1="${b}" x2="${312}" y2="${b}"
                  stroke="var(--primary-color)" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"/>
          `:V}

          <!-- X-axis baseline -->
          <line x1="${n}" y1="${180}" x2="${312}" y2="${180}"
                stroke="var(--divider-color)" stroke-width="1"/>

          <!-- X-axis tick marks (visual only, no text) -->
          ${v.map(e=>j`
            <line x1="${e.x}" y1="${180}" x2="${e.x}" y2="${183}"
                  stroke="var(--divider-color)" stroke-width="0.5" opacity="0.6"/>
          `)}

          <!-- X-axis time labels (with slightly longer tick) -->
          ${y.map(e=>j`
            <line x1="${e.x}" y1="${180}" x2="${e.x}" y2="${184}"
                  stroke="var(--divider-color)" stroke-width="1"/>
            <text x="${e.x}" y="${202}" text-anchor="middle"
                  style="font-size: calc(11px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${e.label}</text>
          `)}
        </svg>
      </div>
    `}_getEffectivenessTimeframeDays(){switch(this.activeEffectivenessTimeframe){case"30d":return 30;case"60d":return 60;default:return 14}}_renderEffectivenessTimeframeChips(){const e=this.controller;return[{id:"14d",labelKey:"graphs.timeframe_14d",ariaKey:"aria.timeframe_14d"},{id:"30d",labelKey:"graphs.timeframe_30d",ariaKey:"aria.timeframe_30d"},{id:"60d",labelKey:"graphs.timeframe_60d",ariaKey:"aria.timeframe_60d"}].map(t=>W`
      <button
        class="timeframe-chip ${this.activeEffectivenessTimeframe===t.id?"active":""}"
        aria-label=${Te(this._lang,t.ariaKey)}
        @click=${()=>e.handleEffectivenessTimeframeChange(t.id)}
      >${Te(this._lang,t.labelKey)}</button>
    `)}_metricColor(e,t){const i=t.indexOf(e),a=it.METRIC_COLORS;return a[(i<0?0:i)%a.length]}_bucketByDay(e,t){const i=new Map;if(!e.length)return i;const a=new Map;for(const t of e)a.set(Fe(new Date(t.timestamp)),t.value);const o=new Date;for(let e=0;e<t;e++){const t=Fe(new Date(o.getTime()-24*e*60*60*1e3)),n=a.get(t);void 0!==n&&i.set(t,n)}return i}_renderEffectivenessGraph(e){this.controller;const t=e.metrics,i=this._getEffectivenessTimeframeDays(),a=t.map(e=>e.metricKey).sort(),o=t.filter(e=>this.effectivenessVisible.has(e.metricKey)),n=new Map;let r=!1;for(const e of t){const t=this.effectivenessHistory[e.metricKey]||[],a=this._bucketByDay(t,i);n.set(e.metricKey,a),a.size>0&&(r=!0)}const s=new Date,l=[];let c;c=i<=14?1:i<=30?2:5;for(let e=i-1;e>=0;e-=1){const t=new Date(s.getTime()-24*e*60*60*1e3),i=Fe(t),a=e%c===0?`${t.getDate()}`:"";l.push({key:i,label:a})}const d=320,h=204,p=28,g=[];for(const{key:e}of l){const t=[];for(const i of o){const a=n.get(i.metricKey),o=a?.get(e);"number"==typeof o&&t.push(o)}g.push(t.length?{key:e,value:t.reduce((e,t)=>e+t,0)/t.length}:null)}const _=e=>{const t=[];let i=[];for(const a of e)null===a?i.length&&(t.push(i.join(" ")),i=[]):i.push(`${a.x.toFixed(1)},${a.y.toFixed(1)}`);return i.length&&t.push(i.join(" ")),t},u=t.length>1,f=t.length>1;if(!r)return W`
        <div class="bar-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderEffectivenessTimeframeChips()}
          </div>
          <div class="graph-placeholder">
            <ha-icon icon="mdi:clipboard-list"></ha-icon>
            <span>${Te(this._lang,"graphs.empty_effectiveness")}</span>
          </div>
          ${this._renderEffectivenessBottomBar(t,a,u,f)}
        </div>
      `;const m="avg"===this.activeEffectivenessView?(()=>{const e=g.map((e,t)=>e?{x:p+t/Math.max(l.length-1,1)*284,y:36+144*(1-e.value/10)}:null),t=_(e);return W`
            ${t.map(e=>j`<polyline points="${e}" fill="none" stroke="var(--primary-color)" stroke-width="1.8" stroke-linejoin="round" opacity="0.9"/>`)}
            ${e.map((e,t)=>e?j`<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="2.2" fill="var(--primary-color)"><title>${l[t].key} : ${g[t].value.toFixed(1)} (avg)</title></circle>`:V)}
          `})():W`
          ${o.map(e=>{const t=this._metricColor(e.metricKey,a),i=n.get(e.metricKey),o=(e=>l.map((t,i)=>{const a=e.get(t.key);return"number"!=typeof a?null:{x:p+i/Math.max(l.length-1,1)*284,y:36+144*(1-a/10)}}))(i),r=_(o);return W`
              ${r.map(e=>j`<polyline points="${e}" fill="none" stroke="${t}" stroke-width="1.5" stroke-linejoin="round" opacity="0.85"/>`)}
              ${o.map((a,o)=>a?j`<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="2" fill="${t}"><title>${e.label} — ${l[o].key} : ${i.get(l[o].key)}</title></circle>`:V)}
            `})}
        `;return W`
      <div class="bar-graph-wrapper effectiveness-wrapper">
        <div class="timeframe-chips">
          ${this._renderEffectivenessTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${d} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: ${d}/${h}">
          ${Array.from({length:11},(e,t)=>t).map(e=>{const t=36+144*(1-e/10);return j`
              <line x1="${p}" y1="${t}" x2="${312}" y2="${t}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="${0===e?0:.35}"/>
              <text x="${24}" y="${t+3}" text-anchor="end"
                    style="font-size: calc(10px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${e}</text>
            `})}
          ${m}
          <line x1="${p}" y1="${180}" x2="${312}" y2="${180}"
                stroke="var(--divider-color)" stroke-width="1"/>
          ${l.map((e,t)=>{const i=p+t/Math.max(l.length-1,1)*284,a=180;return j`
              ${e.label?j`
                <line x1="${i}" y1="${a}" x2="${i}" y2="${184}"
                      stroke="var(--divider-color)" stroke-width="1"/>
                <text x="${i}" y="${195}" text-anchor="middle"
                      style="font-size: calc(10px + var(--pill-text-offset, 0px))"
                      fill="var(--secondary-text-color)">${e.label}</text>
              `:j`
                <line x1="${i}" y1="${a}" x2="${i}" y2="${183}"
                      stroke="var(--divider-color)" stroke-width="0.5" opacity="0.6"/>
              `}
            `})}
        </svg>
        ${this._renderEffectivenessBottomBar(t,a,u,f)}
      </div>
    `}_renderEffectivenessBottomBar(e,t,i,a){if(!i&&!a)return V;const o=this.controller,n=this.activeEffectivenessView,r=(e,t,i)=>W`
      <button
        class="eff-view-tab ${n===e?"active":""}"
        role="tab"
        aria-selected=${n===e}
        aria-label=${Te(this._lang,i)}
        @click=${()=>o.setEffectivenessView(e)}
      >${Te(this._lang,t)}</button>
    `;return W`
      <div class="eff-bottom-bar">
        ${i?W`
          <div class="eff-view-toggle" role="tablist">
            ${r("avg","graphs.effectiveness_avg","aria.effectiveness_avg")}
            ${r("individual","graphs.effectiveness_individual","aria.effectiveness_individual")}
          </div>
          <span class="eff-bottom-separator"></span>
        `:V}
        ${a?W`
          <div class="eff-tracker-row">
            ${e.map(e=>{const i=this._metricColor(e.metricKey,t),a=this.effectivenessVisible.has(e.metricKey);return W`
                <button
                  class="eff-tracker-chip ${a?"on":"off"}"
                  aria-pressed=${a}
                  aria-label=${e.label}
                  @click=${()=>o.toggleEffectivenessMetric(e.metricKey)}
                >
                  <span class="eff-swatch" style="background:${i}"></span>
                  <span class="eff-tracker-label">${e.label}</span>
                </button>
              `})}
          </div>
        `:V}
      </div>
    `}_renderAveragesGrid(e){const t=this.controller,i=[],{hasDaysSensor:a,daysSince:o}=t.daysSinceReveal(e);if(!1!==this._config?.show_day_avg_boxes&&(e.avg7Days&&(!a||o>=7)&&i.push({label:Te(this._lang,"averages.avg_7_day"),value:t.getState(e.avg7Days)}),e.avg14Days&&(!a||o>=14)&&i.push({label:Te(this._lang,"averages.avg_14_day"),value:t.getState(e.avg14Days)}),e.avg30Days&&(!a||o>=30)&&i.push({label:Te(this._lang,"averages.avg_30_day"),value:t.getState(e.avg30Days)}),e.avgYearly&&(!a||o>0))){const n=a&&o<365?Te(this._lang,"averages.avg_running",{days:o}):Te(this._lang,"averages.avg_year");i.push({label:n,value:t.getState(e.avgYearly)})}if(!1!==this._config?.show_adherence_boxes&&(e.adherence7Days&&(!a||o>=7)&&i.push({label:Te(this._lang,"averages.adh_7_day"),value:t.getState(e.adherence7Days)+"%"}),e.adherence14Days&&(!a||o>=14)&&i.push({label:Te(this._lang,"averages.adh_14_day"),value:t.getState(e.adherence14Days)+"%"}),e.adherence30Days&&(!a||o>=30)&&i.push({label:Te(this._lang,"averages.adh_30_day"),value:t.getState(e.adherence30Days)+"%"}),e.adherence365Days&&(!a||o>0))){const n=a&&o<365?Te(this._lang,"averages.adh_running",{days:o}):Te(this._lang,"averages.adh_365_day");i.push({label:n,value:t.getState(e.adherence365Days)+"%"})}return 0===i.length?V:W`
      <div class="averages-grid">
        ${i.map(e=>W`
          <div class="avg-cell">
            <span class="avg-label">${e.label}</span>
            <span class="avg-value">${"unavailable"===e.value?"-":e.value}</span>
          </div>
        `)}
      </div>
    `}};at.METRIC_COLORS=["#03a9f4","#4caf50","#ff9800","#e91e63","#9c27b0","#00bcd4","#ffc107","#795548"],at.styles=r`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
    }
    .pane-graphs {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .carousel-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      transition: background 0.2s;
    }

    .nav-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18);
    }

    .nav-btn[disabled] {
      opacity: 0.3;
      cursor: default;
    }

    .nav-btn ha-icon {
      --mdc-icon-size: 20px;
    }

    .nav-title {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      color: var(--secondary-text-color, #666);
      min-width: 100px;
      text-align: center;
    }

    .graph-container {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.03);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 0;
      min-height: 180px;
      overflow: hidden;
    }

    .chart-svg {
      display: block;
      width: 100%;
    }

    .line-graph-wrapper {
      position: relative;
    }

    .timeframe-chips {
      position: absolute;
      top: 4px;
      left: 24px;
      display: flex;
      gap: 2px;
      z-index: 1;
    }

    .timeframe-chip {
      padding: 4px 10px;
      font-size: 12px;
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      border-radius: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: none;
      font-family: inherit;
      transition: color 0.2s, background 0.2s;
      line-height: 1.4;
      /* Fixed min-width + centered text so 2-char labels (e.g. "7D") render
         the same width as 3-char labels (e.g. "12H", "48H", "14D"). box-sizing
         keeps the padding inside the min-width so the visible pill is uniform. */
      min-width: 41px;
      box-sizing: border-box;
      text-align: center;
    }

    .timeframe-chip:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
    }

    .timeframe-chip.active {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
    }

    .bar-graph-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .bar-labels {
      display: flex;
      padding-left: 10%;
      padding-right: 2.5%;
      margin-top: -2px;
      padding-bottom: 6px;
      overflow: hidden;
    }

    .bar-labels span {
      flex: 1;
      text-align: center;
      font-size: calc(13px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
      line-height: 1.4;
    }

    .graph-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px 16px;
      color: var(--secondary-text-color, #666);
      font-size: calc(16px + var(--pill-text-offset, 0px));
    }

    .graph-placeholder ha-icon {
      --mdc-icon-size: 40px;
      opacity: 0.4;
    }

    .averages-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .avg-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      padding: 6px 4px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      border-radius: 10px;
      flex: 1;
      min-width: 0;
    }

    .avg-label {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .avg-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    /* ── Effectiveness graph ── */
    .effectiveness-wrapper {
      gap: 4px;
    }

    /* Bottom control bar: view toggle + separator + tracker chips on ONE
       line. flex-wrap lets the tracker chips flow to a second line when there
       are many custom metrics, but the view toggle and separator stay on the
       first line with the first batch of chips. */
    .eff-bottom-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      justify-content: center;
      margin-top: 7px;
      padding-top: 6px;
    }

    .eff-bottom-separator {
      width: 1px;
      align-self: stretch;
      background: var(--divider-color, #e0e0e0);
      opacity: 0.6;
      min-height: 20px;
    }

    .eff-view-toggle {
      display: flex;
      gap: 4px;
      justify-content: center;
    }

    .eff-view-tab {
      padding: 5px 16px;
      font-size: calc(13px + var(--pill-text-offset, 0px));
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      border-radius: 999px;
      cursor: pointer;
      color: var(--secondary-text-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: none;
      font-family: inherit;
      transition: color 0.2s, background 0.2s;
    }

    .eff-view-tab:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
    }

    .eff-view-tab.active {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
    }

    .eff-tracker-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }

    .eff-tracker-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      border-radius: 999px;
      border: none;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      cursor: pointer;
      font-family: inherit;
      font-size: calc(12px + var(--pill-text-offset, 0px));
      color: var(--primary-text-color);
      transition: opacity 0.2s, background 0.2s;
    }

    .eff-tracker-chip:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
    }

    .eff-tracker-chip.off {
      opacity: 0.45;
    }

    .eff-swatch {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .eff-tracker-label {
      white-space: nowrap;
    }
  `,e([_e({attribute:!1})],at.prototype,"controller",void 0),e([_e({attribute:!1})],at.prototype,"entities",void 0),e([_e({attribute:!1})],at.prototype,"hass",void 0),e([_e({attribute:!1})],at.prototype,"amountHistory",void 0),e([_e({type:Boolean})],at.prototype,"amountHistorySampled",void 0),e([_e({attribute:!1})],at.prototype,"doseHistory",void 0),e([_e({type:Number})],at.prototype,"activeGraph",void 0),e([_e({attribute:!1})],at.prototype,"activeTimeframe",void 0),e([_e({attribute:!1})],at.prototype,"activeBarTimeframe",void 0),e([_e({attribute:!1})],at.prototype,"activeEffectivenessTimeframe",void 0),e([_e({attribute:!1})],at.prototype,"activeEffectivenessView",void 0),e([_e({attribute:!1})],at.prototype,"effectivenessHistory",void 0),e([_e({attribute:!1})],at.prototype,"effectivenessVisible",void 0),at=it=e([he("ax-dose-graphs-panel")],at);let ot=class extends ce{constructor(){super(...arguments),this.tick=0,this.buttonState="idle",this.ackActive=!1,this.ackCount=0}get _lang(){return this.controller.lang}_logDrinkButtonClasses(){const e=this.buttonState,t=this.controller.config,i={style:"full",iconStyle:"none"};let a="none",o="none";if("lockout"!==e)return this.ackActive?"log-drink-btn ack-flash":"log-drink-btn";{const e=i;a=t?.drink_button_lockout_style??e.style,"auto"===a&&(a=e.style),o=t?.drink_button_lockout_icon_style??e.iconStyle,"auto"===o&&(o=e.iconStyle)}const n="lockout"===e?"red":"green",r=["log-drink-btn",`state-${e}`];return"full"===a&&r.push(`full-${n}`),"border"===a&&r.push(`border-${n}`),"ring"===a&&r.push(`ring-${n}`),"glow"===a&&r.push("style-none"),"none"===a&&r.push("style-none"),"color"!==o&&"color_pulse"!==o||r.push(`icon-${n}`),"color_pulse"!==o&&"pulse"!==o||r.push("pulse"),this.ackActive&&r.push("ack-flash"),r.join(" ")}_ringDuration(){const e=this.controller.config?.drink_button_ring_speed??"medium";return"slow"===e?"6s":"medium"===e?"4s":"2.2s"}_logDrinkGlowWrapClass(){const e=this.buttonState,t=this.controller.config;let i="none";if("lockout"!==e)return"";if(i=t?.drink_button_lockout_style??"full","auto"===i&&(i="full"),"glow"!==i)return"";return`glow-${"lockout"===e?"red":"green"}`}_ackLayout(){return this.controller.config?.drink_button_ack_layout??"top"}_ackLabelText(){const e=Te(this._lang,"button.ack_text");return this.ackCount>=2?`${e} ${this.ackCount}x`:e}render(){const e=this.controller,t=this.entities,i=t.substance,a=e.config,o=a?.log_drink_icon||("alcohol"===i?"mdi:glass-mug-variant":"mdi:coffee"),n=a?.log_drink_label||Te(this._lang,"drinks.log_drink"),r=e.computeTimeSinceLastDose(t),s=e.getInBodyBoxEntity(t),l=s?e.getState(s):"",c=!l||"unknown"===l||"unavailable"===l,d=!(!a?.in_body_entity||a.in_body_entity===t.amountInBody),h=e.getStrengthUnit(t),p=parseFloat(l),g=c?Te(this._lang,"daily.na"):d?isNaN(p)?l.charAt(0).toUpperCase()+l.slice(1):e.formatInteger(l)+(e.getAttr(s,"unit_of_measurement")?" "+e.getAttr(s,"unit_of_measurement"):""):`${isNaN(p)?l:Math.round(p)} ${h}`,_={entity:s,tap_action:a?.in_body_tap_action,hold_action:a?.in_body_hold_action,double_tap_action:a?.in_body_double_tap_action},u=!!a?.in_body_tap_action,f=!!a?.in_body_hold_action,m=!!a?.in_body_double_tap_action,b=u||f||m||!!s,v=a?.disruption_mode||"disruption",y=e.getDisruptionBoxEntity(t),k=y?e.getState(y):"",x=!k||"unknown"===k||"unavailable"===k,w=!(!a?.disruption_entity||a.disruption_entity===t.sleepDisruption||"disruption"!==v);let $=Te(this._lang,"daily.na");if(!x)if(w){const t=parseFloat(k);$=isNaN(t)?k.charAt(0).toUpperCase()+k.slice(1):e.formatInteger(k)+(e.getAttr(y,"unit_of_measurement")?" "+e.getAttr(y,"unit_of_measurement"):"")}else if("low_timestamp"===v){const e=new Date(k);$=isNaN(e.getTime())?Te(this._lang,"daily.na"):e.toLocaleTimeString(this._lang,{hour:"2-digit",minute:"2-digit",hour12:!1})}else if("low_hours_until"===v){const e=parseFloat(k);$=isNaN(e)?Te(this._lang,"daily.na"):String(e)}else $=k.charAt(0).toUpperCase()+k.slice(1);const D="low_timestamp"===v?"mdi:clock-outline":"low_hours_until"===v?"mdi:timer-sand":"mdi:sleep",A=Te(this._lang,"low_timestamp"===v?"stats.low_timestamp":"low_hours_until"===v?"stats.low_hours_until":"drinks.disruption"),T={entity:y,tap_action:a?.disruption_tap_action,hold_action:a?.disruption_hold_action,double_tap_action:a?.disruption_double_tap_action},S=!!a?.disruption_tap_action,I=!!a?.disruption_hold_action,E=!!a?.disruption_double_tap_action,C=()=>{i?e.showSleepDisruptionDialog(i):y&&e.openMoreInfo(y)},M=S||I||E||!!y||!!i,B=e.getDrinkChipEntities();return W`
      <div class="pane pane-drinks">

        <div class="daily-main">
          <div class="log-drink-wrap${this._logDrinkGlowWrapClass()?" "+this._logDrinkGlowWrapClass():""}"
               style=${`--ring-duration: ${this._ringDuration()}`}
          >
            <div class="glow-backdrop"></div>
            <button
              class=${this._logDrinkButtonClasses()}
              style=${this.ackActive?`--ack-duration: ${this.controller.config?.drink_button_ack_duration_ms??3e3}ms`:""}
              aria-label=${n}
              ?disabled=${!i}
              @click=${He(()=>i&&e.showLogDrinkDialog(i))}
            >
              <div class="ring-track"></div>
              <ha-ripple ?disabled=${!i}></ha-ripple>
            <ha-icon icon="${o}"></ha-icon>
            <span class="take-label">${n}</span>
            <span class="take-sub"><span class="take-sub-segment">${Te(this._lang,"daily.last")}: ${r}</span></span>
            ${this.ackActive?et(this.ackCount,W`
              <div class="ack-flash ack-${this._ackLayout()}${this.ackCount>=2?" ack-repeat":""}">
                <ha-icon icon="mdi:check-bold" class="ack-icon"></ha-icon>
                ${"big"!==this._ackLayout()?W`<span class="ack-text">${this._ackLabelText()}</span>`:this.ackCount>=2?W`<span class="ack-count-badge">${this.ackCount}x</span>`:V}
              </div>
            `):V}
            </button>
          </div>

          <div class="stats-column">
            <div class="stat-pill ${b?"clickable":""}"
                 role="button"
                 tabindex=${b?0:-1}
                 aria-label=${a?.in_body_label||Te(this._lang,"drinks.in_body")}
                 @click=${b?He(t=>e.handleInBodyBoxAction(t,"tap",_,s)):null}
                 @keydown=${b?t=>e.onKeyActivate(t,()=>e.handleInBodyBoxAction(null,"tap",_,s)):null}
                 @contextmenu=${f?t=>{t.preventDefault(),e.handleInBodyBoxAction(null,"hold",_,s)}:null}
                 @dblclick=${m?()=>e.handleInBodyBoxAction(null,"double_tap",_,s):null}>
              ${b?W`<ha-ripple></ha-ripple>`:V}
               <ha-icon icon="${a?.in_body_icon||"mdi:chart-bell-curve"}"></ha-icon>
              <span class="stat-label">${a?.in_body_label||Te(this._lang,"drinks.in_body")}</span>
              <span class="stat-value">${g}</span>
            </div>
            <div class="stat-pill ${M?"clickable":""}"
                 role="button"
                 tabindex=${M?0:-1}
                 aria-label=${a?.disruption_label||A}
                 @click=${M?He(t=>e.handleDisruptionBoxAction(t,"tap",T,y,C)):null}
                 @keydown=${M?t=>e.onKeyActivate(t,()=>e.handleDisruptionBoxAction(null,"tap",T,y,C)):null}
                 @contextmenu=${I?t=>{t.preventDefault(),e.handleDisruptionBoxAction(null,"hold",T,y)}:null}
                 @dblclick=${E?()=>e.handleDisruptionBoxAction(null,"double_tap",T,y):null}>
              ${M?W`<ha-ripple></ha-ripple>`:V}
               <ha-icon icon="${a?.disruption_icon||D}"></ha-icon>
              <span class="stat-label">${a?.disruption_label||A}</span>
              <span class="stat-value">${$}</span>
            </div>
          </div>
        </div>

        ${B.length>0?W`
              <div class="chips-row">
                ${B.map(t=>{const i=e.getState(t.entityId),a=t.label||e.hass?.states[t.entityId]?.attributes?.friendly_name||t.entityId,o=e.getAttr(t.entityId,"unit_of_measurement"),n=e.getAttr(t.entityId,"device_class"),r=t.icon||e.hass?.states[t.entityId]?.attributes?.icon||"mdi:chip";let s;if("timestamp"===n){const e=new Date(i);s=isNaN(e.getTime())?Te(this._lang,"daily.na"):e.toLocaleTimeString(this._lang,{hour:"2-digit",minute:"2-digit",hour12:!1})}else s=e.formatInteger(i)+(o?" "+o:"");const l={entity:t.entityId,tap_action:t.tapAction,hold_action:t.holdAction,double_tap_action:t.doubleTapAction},c=!!t.holdAction,d=!!t.doubleTapAction;return W`
                    <div class="chip clickable${t.showIcon?" with-icon":""}"
                      role="button"
                      tabindex="0"
                      aria-label=${a}
                      @click=${He(i=>e.handleDrinkChipAction(i,"tap",l,t.entityId))}
                      @keydown=${i=>e.onKeyActivate(i,()=>e.handleDrinkChipAction(null,"tap",l,t.entityId))}
                      @contextmenu=${c?i=>{i.preventDefault(),e.handleDrinkChipAction(null,"hold",l,t.entityId)}:null}
                      @dblclick=${d?()=>e.handleDrinkChipAction(null,"double_tap",l,t.entityId):null}>
                      <ha-ripple></ha-ripple>
                       ${t.showIcon?W`<ha-icon icon=${r} class="chip-icon"></ha-icon>`:V}
                      <span class="chip-name">${a}</span>
                      <span class="chip-value">${s}</span>
                    </div>
                  `})}
              </div>
            `:V}
      </div>
    `}};ot.styles=r`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         (1:1 parity with Lovelace Mushroom cards). */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
    }
    .pane-drinks {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── .daily-main / .stats-column — verbatim from daily-panel.ts ── */
    .daily-main {
      display: flex;
      gap: 12px;
    }

    .stats-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
      position: relative;  /* global z-axis protection — glow bleeds behind stats (Patch 1, belt-and-suspenders) */
      z-index: 1;
    }

    /* Wrapper for the ambilight glow backdrop. Becomes the .daily-main flex
       child (replaces the button's flex role). isolation:isolate + z-index:0
       spawn a localized z-axis boundary. Mirrors daily-panel .take-pill-wrap.
       See plans/architecture-rollback-z-axis-stacking-plan.md. */
    .log-drink-wrap {
      position: relative;
      z-index: 0;
      isolation: isolate;
      display: flex;
      flex: 1;
    }

    /* ── Log Drink button — styled like Daily's .take-pill-btn.safe ── */
    .log-drink-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      padding: 12px 16px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      flex: 1;
      z-index: 1;  /* stack above the .glow-backdrop (z-index:-1) */
      /* Reserve the full two-line-sub-text button height permanently (mirrors
         daily-panel.ts .take-pill-btn). justify-content: center distributes
         the reserved height as symmetric top/bottom padding so the
         icon→label→sub gap stays the fixed 2px (uniform) and only the outer
         padding changes. min-height in em (relative to 16px base font) scales
         with --pill-text-offset. ≈ 128px = 8em. */
      min-height: 8em;
    }

    /* :active scale transform removed — ha-ripple provides the press feedback
       (Material Design radiating circle), so the physical compression is
       redundant and can fight the ripple's layout. */
    /* ha-ripple sits above the .ring-track (z-index 0) AND above the
       .ack-flash overlay (z-index 2) so the native ripple keeps radiating
       over the opaque green "Logged" surface after an ACK press. The
       ripple fires at pointerdown (t=0) and animates ~300ms; the green
       overlay mounts ~110ms later (delayedAction), so raising the ripple
       to z-index 3 lets the user see press feedback even when their
       finger covers the Nx text. Matches Mushroom template-card
       layering (ripple renders over content). */
    .log-drink-btn > ha-ripple {
      z-index: 3;
    }
    /* State-coloured ripples — the press feedback colour matches the button's
       current medical state (richer than Mushroom's single colour, fits the
       Button State Matrix). The ACK state uses a light tint so the ripple
       reads on the opaque dark-green overlay surface (#212c22). */
    .log-drink-btn.state-lockout { --ha-ripple-color: var(--btn-red); }
    .log-drink-btn.ack-flash { --ha-ripple-color: #ffffff; }

    /* ── Button State Matrix (Prosumer UI) — Drinks ──
       Only lockout + ack are possible for PRN drinks. Mirrors the Daily
       panel's CSS structure (full / border / none / ring / icon / pulse / ack).
       The default (idle / no state class) keeps the original theme-tinted
       safe look. See plans/button-state-matrix-plan.md §1.2. */
    :host {
      --btn-red: var(--error-color, #db4437);
      --rgb-btn-red: var(--rgb-error-color, 219, 68, 55);
      --btn-green: #43a047;
      --rgb-btn-green: 67, 160, 71;
      /* Dark green surface for the Logged Dose Indicator (ACK) overlay.
         High contrast against the bright --btn-green glyph so the tick/text
         are clearly legible; opaque so the underlying button state (red)
         does not bleed through behind the green tick. See plans/
         ack-clarity-and-softening-plan.md (Issue 2). */
      --btn-green-soft: #212c22;
    }

    /* Base idle (no state class) — original theme-tinted safe look.
       Gradient-stack surface: opaque --card-background-color base wall blocks
       the ambilight backlight; flat rgba(...,0.12) tint layer (linear-gradient
       with identical stops = flat color) restores the perceptual tint. See
       plans/gradient-stacking-material-synthesis-plan.md. */
    .log-drink-btn:not(.state-lockout):not(.state-ack) {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    .log-drink-btn:not(.state-lockout):not(.state-ack):hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.2), rgba(var(--rgb-primary-color, 3, 169, 244), 0.2));
    }

    /* Option 1 — Full Button (red lockout / green ack). Gradient-stack
       surface: opaque --card-background-color base wall blocks the ambilight
       backlight; flat rgba(var(--rgb-btn-*),0.12) tint layer restores the
       identity-color tint. See plans/
       gradient-stacking-material-synthesis-plan.md. */
    .log-drink-btn.full-red    { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.12), rgba(var(--rgb-btn-red), 0.12));    color: var(--btn-red); }
    .log-drink-btn.full-red:hover    { background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.2), rgba(var(--rgb-btn-red), 0.2)); }
    .log-drink-btn.full-green { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-green), 0.12), rgba(var(--rgb-btn-green), 0.12)); color: var(--btn-green); }
    .log-drink-btn.full-green:hover { background-image: linear-gradient(rgba(var(--rgb-btn-green), 0.2), rgba(var(--rgb-btn-green), 0.2)); }

    /* Option 2 — Icon recolor only (Icon Style: color / color_pulse). The >
       child combinator scopes the recolor to the button's OWN icon only — the
       nested ACK tick is excluded so it keeps its own color. Do NOT set
       background/color here: every Style option emits its own bg rule with
       equal specificity, and a bg here would tie with .full-{color} and win
       by source order, erasing the Full Button tint (bug: Full Button only
       worked with Icon Style None or Pulse Only). See plans/
       full-button-icon-style-override-fix-plan.md. */
    .log-drink-btn.icon-red > ha-icon    { color: var(--btn-red); }
    .log-drink-btn.icon-green > ha-icon  { color: var(--btn-green); }

    /* Option 3 — Border only (inset box-shadow so the button does not grow;
       a real border would add 2px to the outer size on each side). */
    .log-drink-btn.border-red, .log-drink-btn.border-green {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    .log-drink-btn.border-red    { box-shadow: inset 0 0 0 2px var(--btn-red); }
    .log-drink-btn.border-green  { box-shadow: inset 0 0 0 2px var(--btn-green); }

    /* Option 6 — Rotating Ring (Apple Intelligence perimeter sweep).
       TWO-LAYER architecture (required: the mask-ring and the rotation-oversize
       cannot share one element — oversizing moves the mask's content-box ring
       off the button, where overflow:hidden clips it away → nothing renders).
       Layer 1 .ring-track: button-sized (inset 0), holds the mask that carves
       the 2px ring on the button edge + overflow:hidden to clip the rotating
       child to the rounded perimeter. Layer 2 .ring-track::before: oversized
       (inset -150%) rotating gradient source; the track's mask carves the ring
       from this rotating gradient. transform animates without @property. */
    @keyframes ax-drink-btn-ring-sweep { to { transform: rotate(360deg); } }
    .log-drink-btn.ring-red, .log-drink-btn.ring-green {
      position: relative;
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    /* Layer 1 — the static geometry mask. Button-sized so the mask ring sits
       exactly on the button edge. padding:2px defines the ring thickness;
       border-radius:inherit follows the rounded corners; overflow:hidden clips
       the rotating child to the perimeter. */
    .log-drink-btn .ring-track {
      position: absolute;
      inset: 0;
      padding: 2px;
      border-radius: inherit;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      /* Both prefixed AND unprefixed mask must be declared: mask-composite
         operates on the unprefixed mask in modern Chromium. */
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
              mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
    }
    /* Layer 2 — the rotating oversized gradient engine. 400% of the track
       (button-sized) so its rotating square always covers the track at every
       angle (no corner gaps). The track's mask carves the 2px ring from this
       rotating gradient. */
    .log-drink-btn .ring-track::before {
      content: '';
      position: absolute;
      inset: -150%;
      animation: ax-drink-btn-ring-sweep var(--ring-duration, 2.2s) linear infinite;
    }
    /* State color → gradient. 85% line with a solid-color middle (76.5→229.5,
       153deg = 50% of the line) so the state color stays unambiguous; a
       white-tipped shimmer head at 306deg (color-mix lifts toward #fff); a
       crisp head edge (306→306.1deg near-zero stop); 54deg transparent gap. */
    .log-drink-btn.ring-red .ring-track::before    { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-red)    76.5deg, var(--btn-red)    229.5deg, color-mix(in srgb, var(--btn-red)    60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }
    .log-drink-btn.ring-green .ring-track::before  { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-green)  76.5deg, var(--btn-green)  229.5deg, color-mix(in srgb, var(--btn-green)  60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }

    /* Option 6 — Ambilight Glow (GPU-composited diffused backlight + breathing).
       Mirrors daily-panel: a .glow-backdrop div behind the button (inside the
       .log-drink-wrap wrapper) bleeds outward (inset:-9px) with a STATIC
       filter:blur(8px); the breathing animates OPACITY only (GPU-composited,
       zero CPU repaint). will-change is sandboxed inside the active glow
       selector so non-glow states release the GPU layer + VRAM. Z-axis: the
       wrapper has isolation:isolate + z-index:0, so the backdrop's z-index:-1
       renders behind the wrapper baseline but in front of the card
       background. See plans/architecture-rollback-z-axis-stacking-plan.md. */
    .log-drink-wrap .glow-backdrop {
      position: absolute;
      inset: -9px;
      z-index: -1;
      border-radius: calc(var(--ha-card-border-radius, 12px) + 9px);
      background: var(--glow-color, transparent);
      filter: blur(8px);
      opacity: 0;
      pointer-events: none;
      /* will-change OMITTED here — sandboxed inside the active glow selector. */
      /* No animation here — gated to the active glow selector below. */
    }
    .log-drink-wrap.glow-red    { --glow-color: rgba(var(--rgb-btn-red), 0.85); }
    .log-drink-wrap.glow-green  { --glow-color: rgba(var(--rgb-btn-green), 0.85); }
    .log-drink-wrap.glow-red .glow-backdrop,
    .log-drink-wrap.glow-green .glow-backdrop {
      opacity: 0.6;
      will-change: opacity;
      animation: ax-btn-glow-breathe var(--ring-duration, 4s) ease-in-out infinite;
    }
    /* Shared breathing keyframe (same name as daily-panel; Lit scopes CSS so
       the two definitions don't conflict — both are identical opacity-only
       keyframes). */
    @keyframes ax-btn-glow-breathe {
      0%, 100% { opacity: 0.35; }
      50%      { opacity: 0.85; }
    }

    /* Option 5 — No change (theme default). The surface is still solidified
       (alpha-1.0) to occlude the ambilight backlight; only the color
       identity is left at the theme default primary tint. */
    .log-drink-btn.style-none {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }

    /* Icon-pulse animation. */
    @keyframes ax-drink-btn-icon-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.15); opacity: 0.7; }
    }
    .log-drink-btn.pulse ha-icon {
      animation: ax-drink-btn-icon-pulse 1.2s ease-in-out infinite;
    }

    /* ACK (logged) transient overlay — a pure flash layered on top of the
       button's true state. The button keeps its real color underneath; the
       overlay paints an opaque green surface + white tick ("mdi:check-bold")
       and optional "Logged" text, fully covering the underlying button, then
       fades to reveal the true state. Rendered as a real <div class="ack-flash">
       element (conditionally added to the template when ackActive is true) so
       it can host a real <ha-icon>. The layout is selected by the ack-top /
       ack-inline / ack-big modifier class from the per-button ack_layout
       config. Duration comes from the inline --ack-duration var. */
    .log-drink-btn .ack-flash {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      /* Issue 2 — dark green surface (not the saturated --btn-green) so the
         flash is less jarring; opaque so the underlying button state does
         not bleed through. The tick + text use solid --btn-green (bright
         green) for clear, legible success semantics on the dark surface. */
      background: var(--btn-green-soft);
      color: var(--btn-green);
      border-radius: inherit;
      opacity: 0;
      transform-origin: center;
      /* Issue 3 — two-animation split on a single line (a multi-line
         animation shorthand breaks the Lit CSS compiler, which drops the
         whole rule + the keyframes). A FIXED 240ms press-in intro (so the
         press feel stays snappy even when a long ack_duration is set — a
         proportional intro would stretch to ~800ms at 10000ms and feel
         sluggish), then the hold+fade animation delayed by 240ms. The intro
         uses "both" fill so its end state (opacity 1, scale 1) holds during
         the 240ms delay before the fade animation takes over. */
      animation: ax-drink-btn-ack-intro 240ms ease-out both, ax-drink-btn-ack-fade var(--ack-duration, 3000ms) ease-out 240ms forwards;
      pointer-events: none;
      z-index: 2;
    }
    /* Rapid-click repeat: on the 2nd+ press the overlay is already at full
       opacity, so skip the 240ms intro (no flicker) and run only the fade
       animation from the start. The keyed() directive recreates the element
       on each ackCount change, restarting the animation so the fade timer
       effectively resets with each click. */
    .log-drink-btn .ack-flash.ack-repeat {
      animation: ax-drink-btn-ack-fade var(--ack-duration, 3000ms) ease-out forwards;
    }
    /* Option 1 — Top tick mark and text (default; mirrors button layout). */
    .log-drink-btn .ack-flash.ack-top {
      flex-direction: column;
      gap: 4px;
    }
    .log-drink-btn .ack-flash.ack-top .ack-icon { --mdc-icon-size: 28px; }
    .log-drink-btn .ack-flash.ack-top .ack-text {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
    }
    /* Option 2 — Tick mark and text inline (the prior single-line layout). */
    .log-drink-btn .ack-flash.ack-inline {
      flex-direction: row;
      gap: 8px;
    }
    .log-drink-btn .ack-flash.ack-inline .ack-icon { --mdc-icon-size: 24px; }
    .log-drink-btn .ack-flash.ack-inline .ack-text {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
    }
    /* Option 3 — Big tickmark only (no text). */
    .log-drink-btn .ack-flash.ack-big .ack-icon { --mdc-icon-size: 56px; }
    /* Rapid-click count badge for the big (tickmark-only) ACK layout.
       Hidden on top/inline (those embed the count in ack-text). Sized to
       match the big tickmark's visual weight (56px icon) so the count reads
       as a peer of the tick, not a footnote. Mirrors the Daily panel's badge. */
    .log-drink-btn .ack-flash.ack-big .ack-count-badge {
      font-size: calc(28px + var(--pill-text-offset, 0px));
      font-weight: 700;
      color: var(--btn-green);
      background: rgba(67, 160, 71, 0.18);
      padding: 4px 14px;
      border-radius: 14px;
      margin-top: 10px;
      line-height: 1.1;
    }
    /* Issue 3 — FIXED 240ms press-in intro mirrors the button's own
       :active { transform: scale(0.96) } press so the overlay reads like a
       button press instead of a hard cut. Fixed (not proportional to
       --ack-duration) so the press feel stays snappy even when a long flash
       interval is set. */
    @keyframes ax-drink-btn-ack-intro {
      0%   { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
    /* Hold + fade-out. Starts at opacity 1 (the intro's end state) and is
       delayed by 240ms (see the animation shorthand above) so it begins
       exactly when the intro finishes. */
    @keyframes ax-drink-btn-ack-fade {
      0%   { opacity: 1; transform: scale(1); }
      70%  { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1); }
    }

    .log-drink-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .log-drink-btn ha-icon {
      --mdc-icon-size: 28px;
      margin-bottom: 2px;
    }

    .take-label {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(550 * var(--pill-font-weight-boost, 1));
    }

    /* ── .take-sub — verbatim from daily-panel.ts ── */
    .take-sub {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(450 * var(--pill-font-weight-boost, 1));
      opacity: 0.9;
    }

    .take-sub-segment {
      white-space: nowrap;
    }

    /* ── .stat-pill / .stat-label / .stat-value — verbatim from daily-panel.ts ── */
    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      /* Gradient-stack surface: opaque --card-background-color base wall blocks
         the ambilight backlight; flat rgba(...,0.06) tint layer restores the
         perceptual tint. The .stats-column at z-index:1 is a sibling of
         .log-drink-wrap. See plans/
         gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.06), rgba(var(--rgb-primary-color, 3, 169, 244), 0.06));
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      flex: 1;
      /* position:relative clips the ha-ripple surface. */
      position: relative;
    }

    .stat-pill.clickable {
      cursor: pointer;
    }

    .stat-pill.clickable:hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
    }

    .stat-pill ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .stat-label {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.2;
      min-height: 2.6em;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
      margin-left: auto;
      line-height: 1.5;
      white-space: nowrap;
    }

    /* ── Custom chips — verbatim from daily-panel.ts ──
       Z-axis dependency (Patch 1, belt-and-suspenders): z-index is a null
       operation on static elements, so position:relative MUST accompany
       z-index:1. Without this the 9px .glow-backdrop diffusion (inset:-9px,
       bleeding beyond .daily-main) paints on top of the chips. The wrapper's
       isolation:isolate floor (z-index:0) contains the backdrop at z-index:-1;
       this lifts the chips above that floor. Mirrors daily-panel .chips-row. */
    .chips-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      position: relative;  /* global z-axis protection — glow bleeds behind chips */
      z-index: 1;
    }

    /* ── Chips — match the Graph panel Day Avg Boxes format (primary-tinted
       background, uppercase label with letter-spacing, column layout, no icon
       by default) but with the stat-pill min-height so the chip row aligns
       with the two boxes above it on the Drinks panel. The .with-icon modifier
       relaxes the min-height so the box grows to fit the icon-on-top. ── */
    .chip {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 4px;
      /* Gradient-stack surface: opaque --card-background-color base wall blocks
         the ambilight backlight; flat rgba(...,0.05) tint layer restores the
         perceptual tint. The .chips-row (z-index:1) sits below .daily-main.
         See plans/gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.05), rgba(var(--rgb-primary-color, 3, 169, 244), 0.05));
      border-radius: 10px;
      overflow: hidden;
      /* position:relative clips the ha-ripple surface. */
      position: relative;
    }

    .chip.with-icon {
      /* gap stays 2px (label→value spacing unchanged); the icon gets its own
         breathing room via .chip-icon margin-bottom so toggling the icon on
         doesn't alter the label-to-value gap. */
    }

    .chip.clickable {
      cursor: pointer;
    }

    .chip.clickable:hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
    }

    .chip-icon {
      --mdc-icon-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
      margin-bottom: 8px;
    }

    .chip-name {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: 1.2;
      text-align: center;
      word-break: break-word;
      max-width: 100%;
    }

    .chip-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
      line-height: 1.5;
      white-space: nowrap;
    }
  `,e([_e({attribute:!1})],ot.prototype,"controller",void 0),e([_e({attribute:!1})],ot.prototype,"entities",void 0),e([_e({attribute:!1})],ot.prototype,"hass",void 0),e([_e({attribute:!1})],ot.prototype,"tick",void 0),e([_e({attribute:!1})],ot.prototype,"buttonState",void 0),e([_e({attribute:!1})],ot.prototype,"ackActive",void 0),e([_e({attribute:!1})],ot.prototype,"ackCount",void 0),ot=e([he("ax-dose-drinks-panel")],ot);let nt=class extends ce{constructor(){super(...arguments),this.tick=0}get _lang(){return this.controller.lang}render(){const e=this.controller,t=this.entities.substance;if(!t)return V;const i=e.getDrinksOfSubstance(t);if(0===i.length)return W`
        <div class="pane pane-inventory">
          <div class="inv-empty">
            <ha-icon icon="mdi:package-variant-closed"></ha-icon>
            <span>${Te(this._lang,"inventory.empty")}</span>
          </div>
        </div>
      `;const a="alcohol"===t?"mdi:glass-wine":"mdi:coffee";return W`
      <div class="pane pane-inventory">
        <div class="inv-grid">
          ${i.map(e=>this._renderRow(e,a))}
        </div>
      </div>
    `}_renderRow(e,t){const i=this.controller,a=e.stockEntityId?i.getState(e.stockEntityId):"",o=e.stockEntityId?i.getAttr(e.stockEntityId,"unit_of_measurement"):"",n="string"==typeof o&&o?` ${o}`:"",r=`${e.name}${n} ${Te(this._lang,"inventory.left")}`,s=parseInt(a,10),l=isNaN(s)?"-":i.formatInteger(String(s)),c=e.addStockEntityId,d=!!c,h=e.daysLeftEntityId?i.getState(e.daysLeftEntityId):"";let p="-";if(h&&"unknown"!==h&&"unavailable"!==h&&"None"!==h){const e=parseFloat(h);isNaN(e)||(p=i.formatInteger(h))}const g=e.avg7EntityId?i.getState(e.avg7EntityId):"",_=g&&"unknown"!==g&&"unavailable"!==g?g:"-",{hasDaysSensor:u,daysSince:f}=i.drinkDaysSinceReveal(e.avg365EntityId),m=e.avg365EntityId?i.getState(e.avg365EntityId):"",b=m&&"unknown"!==m&&"unavailable"!==m?m:"-",v=u&&f<365?Te(this._lang,"stats.avg_running",{days:String(f)}):Te(this._lang,"stats.avg_yearly");return W`
      <div class="inv-row">
        <div
          class="stat-pill ${d?"clickable":""}"
          role=${d?"button":V}
          tabindex=${d?0:-1}
          aria-label=${Te(this._lang,"dialog.refill.aria")}
          @click=${d?He(()=>i.showRefillDialogFor(c,e.name)):null}
          @keydown=${d?t=>i.onKeyActivate(t,()=>i.showRefillDialogFor(c,e.name)):null}
        >
          ${d?W`<ha-ripple></ha-ripple>`:V}
          <div class="stat-pill-header">
            <ha-icon icon="${t}"></ha-icon>
            <div class="stat-text">
              <div class="stat-line">
                <span class="stat-label">${r}</span>
                <span class="stat-value">${l}</span>
              </div>
              <div class="stat-line">
                <span class="stat-sublabel">${Te(this._lang,"stats.days_left_est")}</span>
                <span class="stat-subvalue">${p}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="avg-cell"
             role="button" tabindex="0"
             aria-label=${Te(this._lang,"dialog.device_info.aria")}
             @click=${He(()=>i.showDeviceInfoFor(e.deviceId,e.name))}
             @keydown=${t=>i.onKeyActivate(t,()=>i.showDeviceInfoFor(e.deviceId,e.name))}
        >
           <ha-ripple></ha-ripple>
           <div class="avg-line">
            <span class="avg-label">${Te(this._lang,"inventory.avg_7_day")}</span>
            <span class="avg-value">${_}</span>
          </div>
          <div class="avg-line">
            <span class="avg-label">${v}</span>
            <span class="avg-value">${b}</span>
          </div>
        </div>
      </div>
    `}};function rt(e,t){const i=e[`${t}_style`],a=e[`${t}_pulse`];if(void 0!==e[`${t}_icon_style`])return;if(void 0===i&&void 0===a)return;const o="icon"===i||"icon_border"===i||"icon_glow"===i;if(void 0===a&&!o)return;const n="icon"===i?"none":"icon_border"===i?"border":"icon_glow"===i?"ring":i;let r;r=o?a?"color_pulse":"color":a?"pulse":"none",e[`${t}_style`]=n,e[`${t}_icon_style`]=r,delete e[`${t}_pulse`]}nt.styles=r`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         (1:1 parity with Lovelace Mushroom cards). */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
    }
    /* ── Container parity with the Stats pane (.pane-stats) ── */
    .pane-inventory {
      display: flex;
      flex-direction: column;
    }

    .inv-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px 16px;
      color: var(--secondary-text-color);
      font-size: calc(16px + var(--pill-text-offset, 0px));
      text-align: center;
    }
    .inv-empty ha-icon { --mdc-icon-size: 40px; opacity: 0.4; }

    /* ── .inv-grid — mirrors the Stats .stats-grid: 2-col grid, 8px gap ── */
    .inv-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    /* One drink = two adjacent grid cells (col-1 + col-2). The .inv-row
       wrapper spans both columns and holds its own 2-col sub-grid so the
       pair stays together while the outer grid governs inter-pair spacing. */
    .inv-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      grid-column: 1 / -1;
    }

    /* ── .stat-pill + .avg-cell — both adopt the Stats .stat-cell visual
       language: padding 10px 8px, border-radius 10px, primary-tinted
       background rgba(...,0.05), 4px internal gap, column flex. This makes
       the Inventory boxes the same size + spacing as the Stats boxes. */
    .stat-pill {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      border-radius: 10px;
      transition: background 0.15s ease;
      /* position:relative + overflow:hidden clip the ha-ripple surface to the
         box's rounded border (MdRipple geometry requirement). */
      position: relative;
      overflow: hidden;
    }
    .stat-pill.clickable {
      cursor: pointer;
    }
    .stat-pill.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }
    .stat-pill.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    /* ── stat-pill header row: icon + 2-line text block. The icon stays at
       the left (its exact current position) and align-items:center on the
       header row keeps it vertically centered against the 2-line text
       block. The .stat-text wrapper takes flex:1 so the text fills the
       space to the right of the icon. Each .stat-line is a space-between
       row. Sizing matches the Stats .stat-cell: label 14px uppercase (but
       the drink name keeps natural case per the proper-noun rule), value
       18px weight-600. The 2nd line ("Est. days left" + value) uses the
       SAME sizes as the 1st line per user request (label 15px, value 18px)
       so both lines are equally prominent. */
    .stat-pill-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .stat-pill-header ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }
    .stat-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      line-height: 1.1;
      flex: 1;
      min-width: 0;
    }
    .stat-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .stat-label {
      flex: 1;
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      letter-spacing: 0.3px;
    }
    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }
    /* 2nd line — same sizes as the 1st line (label 15px, value 18px). */
    .stat-sublabel {
      flex: 1;
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      letter-spacing: 0.3px;
    }
    .stat-subvalue {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    /* ── .avg-cell — col-2 averages box, same .stat-cell visual language. */
    .avg-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      line-height: 1.1;
      padding: 10px 8px;
      border-radius: 10px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      cursor: pointer;
      transition: background 0.15s ease;
      /* position:relative + overflow:hidden clip the ha-ripple surface. */
      position: relative;
      overflow: hidden;
    }
    .avg-cell:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }
    .avg-cell:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .avg-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .avg-label {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
    }
    .avg-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    @media (max-width: 380px) {
      .inv-grid { grid-template-columns: 1fr; }
      .inv-row { grid-template-columns: 1fr; }
    }
  `,e([_e({attribute:!1})],nt.prototype,"controller",void 0),e([_e({attribute:!1})],nt.prototype,"entities",void 0),e([_e({attribute:!1})],nt.prototype,"hass",void 0),e([_e({attribute:!1})],nt.prototype,"tick",void 0),nt=e([he("ax-dose-inventory-panel")],nt);class st extends ce{constructor(){super(...arguments),this._activePane="daily",this._activeGraph=0,this._amountHistory=[],this._amountHistorySampled=!1,this._doseHistory=[],this._showDeviceInfo=!1,this._showRefillDialog=!1,this._refillAmount="",this._refillTarget=null,this._deviceInfoTarget=null,this._showLogDrinkDialog=!1,this._logDrinkSubstance=null,this._drinkLowPredictions={},this._predictLowToken=0,this._logDrinkProfileTarget=null,this._showSleepDisruptionDialog=!1,this._sleepDisruptionSubstance=null,this._showColorExplainerDialog=!1,this._dailyAckActive=!1,this._drinksAckActive=!1,this._dailyAckCount=0,this._drinksAckCount=0,this._dailyFrozenState=null,this._drinksFrozenState=null,this._activeTimeframe="48h",this._activeBarTimeframe="14d",this._activeEffectivenessTimeframe="14d",this._activeEffectivenessView="avg",this._effectivenessHistory={},this._effectivenessVisible=new Set,this._toolsDialog=null,this._overrideDialog=null,this._overrideDialogExtras=null,this._trackingOverrideDialog=null,this._pendingTracking=new Set,this._connected=!1,this._tick=0,this._tickTimer=null,this._resolvedEntities=null,this._resolvedDeviceId="",this._resolvedEntitiesRef=null,this._drinksCache=null,this._profilesCache=null,this._masterEntityCache=null,this._activeTrackerIndex=0,this._resolvedTrackers=[],this._trackersError=null,this._trackersCache=null,this._showProfileSwitcher=!1,this._legacyProfileLock=null,this._legacyMasterEntities=null,this._activeMedicineIndex=0,this._resolvedMedicines=[],this._medicinesError=null,this._medicinesCache=null,this._showMedicineSwitcher=!1,this._legacyDeviceIdMigrated=!1,this._amountFetchToken=0,this._doseFetchToken=0,this._effectivenessFetchToken=0,this._graphsRefetchTimer=null}_viewTrackersError(){return void 0!==this._pendingTrackersError?this._pendingTrackersError:this._trackersError}_viewActiveTrackerIndex(){return void 0!==this._pendingTrackerIndex?this._pendingTrackerIndex:this._activeTrackerIndex}_viewMedicinesError(){return void 0!==this._pendingMedicinesError?this._pendingMedicinesError:this._medicinesError}_viewActiveMedicineIndex(){return void 0!==this._pendingMedicineIndex?this._pendingMedicineIndex:this._activeMedicineIndex}_commitResolutionState(){void 0!==this._pendingTrackersError&&(this._trackersError=this._pendingTrackersError,this._pendingTrackersError=void 0),void 0!==this._pendingTrackerIndex&&(this._activeTrackerIndex=this._pendingTrackerIndex,this._pendingTrackerIndex=void 0),void 0!==this._pendingMedicinesError&&(this._medicinesError=this._pendingMedicinesError,this._pendingMedicinesError=void 0),void 0!==this._pendingMedicineIndex&&(this._activeMedicineIndex=this._pendingMedicineIndex,this._pendingMedicineIndex=void 0)}setConfig(e){const t=e={...e};if(Array.isArray(t.chips)){const i=t.chips,a={};i.forEach((e,t)=>{e&&(a[`chip_${t+1}`]=e)});const{chips:o,...n}=t;e={...n,...a}}!function(e){rt(e,"take_button_lockout"),rt(e,"take_button_execution"),rt(e,"take_button_latency"),rt(e,"drink_button_lockout"),void 0!==e.take_button_glow_speed&&void 0===e.take_button_ring_speed&&(e.take_button_ring_speed=e.take_button_glow_speed,delete e.take_button_glow_speed),void 0!==e.drink_button_glow_speed&&void 0===e.drink_button_ring_speed&&(e.drink_button_ring_speed=e.drink_button_glow_speed,delete e.drink_button_glow_speed)}(e);const i=e;if("string"==typeof i.drink_tracker_devices?i.drink_tracker_devices=i.drink_tracker_devices?[i.drink_tracker_devices]:[]:Array.isArray(i.drink_tracker_devices)||(i.drink_tracker_devices=[]),"string"==typeof i.medicine_devices?i.medicine_devices=i.medicine_devices?[i.medicine_devices]:[]:Array.isArray(i.medicine_devices)||(i.medicine_devices=[]),Array.isArray(i.drink_master_entities)&&i.drink_master_entities.length>0&&0===i.drink_tracker_devices.length?this._legacyMasterEntities=i.drink_master_entities.filter(e=>"string"==typeof e&&e):"string"==typeof i.drink_master_entities&&i.drink_master_entities&&0===i.drink_tracker_devices.length&&(this._legacyMasterEntities=[i.drink_master_entities]),delete i.drink_master_entities,i.drink_target_profile&&0===i.drink_tracker_devices.length&&!this._legacyMasterEntities&&(this._legacyProfileLock=String(i.drink_target_profile)),delete i.drink_target_profile,null==e.device_id&&!e.drink_tracker_devices?.length&&!e.medicine_devices?.length&&!this._legacyMasterEntities)throw new Error(Te("en","setconfig.error.device_required"));const a=this.config?.device_id,o=this._trackerConfigKey(),n=this._medicineConfigKey();this.config=e,a===this.config.device_id&&o===this._trackerConfigKey()&&n===this._medicineConfigKey()||this._invalidateEntityCache()}_resolveEntities(){if(!this.hass||!this.config)return{medicationName:"Medication",metrics:[]};if(this._isMultiMedicineMode()){const e=this._resolveMedicines();if(0===e.length)return{medicationName:"Medication",metrics:[]};const t=Math.min(this._viewActiveMedicineIndex(),e.length-1);return this._resolvedEntities=e[t].entities,this._resolvedDeviceId=e[t].deviceId,this._resolvedEntitiesRef=this.hass.entities,this._resolvedEntities}if(this._isMultiTrackerMode()){const e=this._resolveTrackers();if(0===e.length)return{medicationName:"Medication",metrics:[]};const t=Math.min(this._viewActiveTrackerIndex(),e.length-1);return this._resolvedEntities=e[t].entities,this._resolvedDeviceId=e[t].deviceId,this._resolvedEntitiesRef=this.hass.entities,this._resolvedEntities}const e=this.config.device_id;if(!e)return{medicationName:"Medication",metrics:[]};const t=this.hass.entities;if(this._resolvedEntities&&this._resolvedDeviceId===e&&this._resolvedEntitiesRef===t)return this._resolvedEntities;const i=this._computeEntities(e);return this._resolvedEntities=i,this._resolvedDeviceId=e,this._resolvedEntitiesRef=t,i}_invalidateEntityCache(){this._resolvedEntities=null,this._resolvedEntitiesRef=null,this._drinksCache=null,this._profilesCache=null,this._masterEntityCache=null,this._trackersCache=null}_isMultiTrackerMode(){return Array.isArray(this.config?.drink_tracker_devices)&&this.config.drink_tracker_devices.length>0}_resolveTrackers(){if(!this.hass||!this.config)return[];const e=this.hass.entities,t=this._trackerConfigKey();if(this._trackersCache&&this._trackersCache.entitiesRef===e&&this._trackersCache.configKey===t&&this._resolvedTrackers.length>0)return this._resolvedTrackers;let i=Array.isArray(this.config.drink_tracker_devices)?this.config.drink_tracker_devices.slice():[];if(0===i.length&&this._legacyMasterEntities){const e=this._legacyMasterEntities;this._legacyMasterEntities=null;const t=[];for(const i of e){if(!i)continue;const e=this.hass.entities[i];e&&(!0===this._getAttr(i,"drink_master")&&e.device_id&&t.push(e.device_id))}t.length>0&&(i=t,this.config.drink_tracker_devices=t)}if(0===i.length&&this._legacyProfileLock){const e=this._legacyProfileLock;this._legacyProfileLock=null;for(const[t,a]of Object.entries(this.hass.entities))if(!0===this._getAttr(t,"drink_master")&&this._getAttr(t,"profile_id")===e&&a.device_id){i=[a.device_id],this.config.drink_tracker_devices=i;break}}if(0===i.length){const e=this._effectiveDeviceId();e&&!this._masterEntityForDevice(e)||(i=this._autoDiscoverMasterDevices())}const a=[],o=new Set;for(const n of i){if(!n)continue;const i=this._masterEntityForDevice(n);if(!i)return this._pendingTrackersError=Te(this._lang,"card.trackers_error_not_master"),this._resolvedTrackers=[],this._trackersCache={entitiesRef:e,configKey:t},[];const r=(this._getAttr(i,"substance")||"").toLowerCase();if("caffeine"!==r&&"alcohol"!==r)return this._pendingTrackersError=Te(this._lang,"card.trackers_error_not_master"),this._resolvedTrackers=[],this._trackersCache={entitiesRef:e,configKey:t},[];o.add(r);const s=this._getAttr(i,"profile_id")||"",l=this._getAttr(i,"profile_name")||"Default",c=this._computeEntities(n);a.push({entityId:i,deviceId:n,profileId:s,profileName:l,substance:r,entities:c})}return o.size>1?(this._pendingTrackersError=Te(this._lang,"card.trackers_error_mixed_substance"),this._resolvedTrackers=[],this._trackersCache={entitiesRef:e,configKey:t},[]):(this._pendingTrackersError=null,this._resolvedTrackers=a,this._trackersCache={entitiesRef:e,configKey:t},this._pendingTrackerIndex=this._readActiveTrackerIndex(a.length),a)}_masterEntityForDevice(e){return this.hass&&e?this._masterEntityMap().get(e)??"":""}_masterEntityMap(){const e=this.hass.entities;if(this._masterEntityCache&&this._masterEntityCache.entitiesRef===e)return this._masterEntityCache.map;const t=new Map;for(const[i,a]of Object.entries(e)){if(!0!==this._getAttr(i,"drink_master"))continue;const e=a.device_id;e&&!t.has(e)&&t.set(e,i)}return this._masterEntityCache={entitiesRef:e,map:t},t}_autoDiscoverMasterDevices(){if(!this.hass)return[];const e=[],t=new Set;for(const[i,a]of Object.entries(this.hass.entities)){if(!0!==this._getAttr(i,"drink_master"))continue;const o=a.device_id;o&&!t.has(o)&&(t.add(o),e.push(o))}return e}_autoDiscoveryIsMultiSubstance(){const e=this._autoDiscoverMasterDevices();if(0===e.length)return!1;const t=new Set;for(const i of e){const e=this._masterEntityForDevice(i);if(!e)continue;const a=(this._getAttr(e,"substance")||"").toLowerCase();a&&t.add(a)}return t.size>1}_trackerConfigKey(){return(Array.isArray(this.config?.drink_tracker_devices)?this.config.drink_tracker_devices:[]).slice().sort().join("|")}_readActiveTrackerIndex(e){if(0===e)return 0;const t=`ax-dose-logger:tracker-idx:${this._trackerConfigKey()}`;let i=0;try{const e=window.localStorage.getItem(t);if(null!==e){const t=parseInt(e,10);isNaN(t)||(i=t)}}catch{}return i<0||i>=e?0:i}_persistActiveTrackerIndex(){const e=`ax-dose-logger:tracker-idx:${this._trackerConfigKey()}`;try{window.localStorage.setItem(e,String(this._activeTrackerIndex))}catch{}}_activeTracker(){if(!this._isMultiTrackerMode())return null;const e=this._resolveTrackers();if(0===e.length)return null;return e[Math.min(this._viewActiveTrackerIndex(),e.length-1)]}_switchTracker(e){const t=this._resolveTrackers();e<0||e>=t.length||(this._activeTrackerIndex=e,this._persistActiveTrackerIndex(),this._showProfileSwitcher=!1,this._resolvedEntities=null,this._drinksCache=null,this.requestUpdate())}_isMultiMedicineMode(){return Array.isArray(this.config?.medicine_devices)&&this.config.medicine_devices.length>0}_medicineConfigKey(){return(Array.isArray(this.config?.medicine_devices)?this.config.medicine_devices:[]).slice().sort().join("|")}_migrateLegacyDeviceId(){if(this._legacyDeviceIdMigrated)return;if(!this.hass||!this.config)return;this._legacyDeviceIdMigrated=!0;const e=this.config.device_id;!e||Array.isArray(this.config.medicine_devices)&&this.config.medicine_devices.length>0||this._masterEntityForDevice(e)||this.setConfig({...this.config,medicine_devices:[e],device_id:void 0})}_effectiveDeviceId(){return this._isMultiMedicineMode()?this._activeMedicine()?.deviceId??"":this.config?.device_id??""}_resolveMedicines(){if(!this.hass||!this.config)return[];const e=this.hass.entities,t=this._medicineConfigKey();if(this._medicinesCache&&this._medicinesCache.entitiesRef===e&&this._medicinesCache.configKey===t&&this._resolvedMedicines.length>0)return this._resolvedMedicines;const i=Array.isArray(this.config.medicine_devices)?this.config.medicine_devices.filter(e=>!!e):[],a=[];for(const o of i){if(this._masterEntityForDevice(o))return this._pendingMedicinesError=Te(this._lang,"card.medicines_error_not_medicine"),this._resolvedMedicines=[],this._medicinesCache={entitiesRef:e,configKey:t},[];const i=this._computeEntities(o);if(!i||0===Object.keys(i).length)return this._pendingMedicinesError=Te(this._lang,"card.medicines_error_not_medicine"),this._resolvedMedicines=[],this._medicinesCache={entitiesRef:e,configKey:t},[];const n=this.hass.devices?.[o]?.name||i.medicationName||"Medication";a.push({deviceId:o,name:n,entities:i})}return 0===a.length?(this._pendingMedicinesError=Te(this._lang,"card.medicines_error_not_medicine"),this._resolvedMedicines=[],this._medicinesCache={entitiesRef:e,configKey:t},[]):(this._pendingMedicinesError=null,this._resolvedMedicines=a,this._medicinesCache={entitiesRef:e,configKey:t},this._pendingMedicineIndex=this._readActiveMedicineIndex(a.length),a)}_readActiveMedicineIndex(e){if(0===e)return 0;const t=`ax-dose-logger:medicine-idx:${this._medicineConfigKey()}`;let i=0;try{const e=window.localStorage.getItem(t);if(null!==e){const t=parseInt(e,10);isNaN(t)||(i=t)}}catch{}return i<0||i>=e?0:i}_persistActiveMedicineIndex(){const e=`ax-dose-logger:medicine-idx:${this._medicineConfigKey()}`;try{window.localStorage.setItem(e,String(this._activeMedicineIndex))}catch{}}_activeMedicine(){if(!this._isMultiMedicineMode())return null;const e=this._resolveMedicines();if(0===e.length)return null;return e[Math.min(this._viewActiveMedicineIndex(),e.length-1)]}_activeMedicineName(){return this._activeMedicine()?.name??""}_switchMedicine(e){const t=this._resolveMedicines();e<0||e>=t.length||(this._activeMedicineIndex=e,this._persistActiveMedicineIndex(),this._showMedicineSwitcher=!1,this._resolvedEntities=null,this._drinksCache=null,this.requestUpdate())}_renderMedicinesError(){const e=this._viewMedicinesError()||Te(this._lang,"card.medicines_error_generic");return W`
      <ha-card>
        <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
          <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
          <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${Te(this._lang,"card.medicines_error_title")}</div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">${e}</div>
        </div>
      </ha-card>
    `}_renderMedicineSwitcher(){const e=this._resolveMedicines(),t=()=>{this._showMedicineSwitcher=!1};return W`
      <ha-dialog open width="small" @closed=${t}>
        <div slot="header" class="dialog-header">${Te(this._lang,"card.medicine_switcher_title")}</div>
        <div class="dialog-body">
          <div class="log-drink-grid">
            ${e.map((e,t)=>W`
              <button
                class="dialog-btn log-drink-btn ${t===this._viewActiveMedicineIndex()?"active":""}"
                @click=${He(()=>this._switchMedicine(t))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:pill"></ha-icon>
                <span class="log-drink-name">${e.name}</span>
              </button>
            `)}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${t}>
            ${Te(this._lang,"dialog.cancel")}
          </button>
        </div>
      </ha-dialog>
    `}_autoDiscoveryActive(){if(this._isMultiTrackerMode())return!1;if(this._isMultiMedicineMode())return!1;const e=this.config?.device_id;return!(e&&!this._masterEntityForDevice(e))}_activeTrackerName(){return this._activeTracker()?.profileName??""}_renderTrackersError(){const e=this._viewTrackersError()||Te(this._lang,"card.trackers_error_generic");return W`
      <ha-card>
        <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
          <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
          <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${Te(this._lang,"card.trackers_error_title")}</div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">${e}</div>
        </div>
      </ha-card>
    `}_renderTrackersPlaceholder(){return W`
      <ha-card>
        <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
          <ha-icon icon="mdi:account-group" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
          <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${Te(this._lang,"card.trackers_placeholder_title")}</div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">${Te(this._lang,"card.trackers_placeholder_subtitle")}</div>
        </div>
      </ha-card>
    `}_renderProfileSwitcher(){const e=this._resolveTrackers(),t=()=>{this._showProfileSwitcher=!1};return W`
      <ha-dialog open width="small" @closed=${t}>
        <div slot="header" class="dialog-header">${Te(this._lang,"card.profile_switcher_title")}</div>
        <div class="dialog-body">
          <div class="log-drink-grid">
            ${e.map((e,t)=>W`
              <button
                class="dialog-btn log-drink-btn ${t===this._viewActiveTrackerIndex()?"active":""}"
                @click=${He(()=>this._switchTracker(t))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:account"></ha-icon>
                <span class="log-drink-name">${e.profileName}</span>
              </button>
            `)}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${t}>
            ${Te(this._lang,"dialog.cancel")}
          </button>
        </div>
      </ha-dialog>
    `}_getProfileNameMap(){if(!this.hass)return{};const e=this.hass.entities;if(this._profilesCache&&this._profilesCache.entitiesRef===e)return this._profilesCache.map;const t={};for(const[e]of Object.entries(this.hass.entities)){if(!0!==this._getAttr(e,"drink_master"))continue;const i=this._getAttr(e,"profile_id");if("string"!=typeof i||!i)continue;const a=this._getAttr(e,"profile_name");t[i]="string"==typeof a&&a?a:"Default"}return this._profilesCache={entitiesRef:e,map:t},t}_profileDisplayName(e){const t=this._getProfileNameMap()[e];return t||(e.length>8?`${e.slice(0,4)}…`:e)}_computeEntities(e){const t={medicationName:"Medication",metrics:[]};if(!this.hass)return t;this.hass.devices?.[e]?.name&&(t.medicationName=this.hass.devices[e].name);let i=!1,a=!1;for(const[o,n]of Object.entries(this.hass.entities)){if(n.device_id!==e)continue;if("Medication"===t.medicationName&&n.name&&(t.medicationName=n.name),o.startsWith("sensor."))if(o.endsWith("_total_doses"))t.totalDoses=o;else if(o.endsWith("_last_dose"))t.lastDose=o;else if(o.endsWith("_pills_safe_to_take"))t.pillsSafeToTake=o;else if(o.endsWith("_amount_in_body"))t.amountInBody=o;else if(o.endsWith("_next_dose"))t.nextDose=o;else if(o.endsWith("_overdue"))t.overdue=o;else if(o.endsWith("_avg_daily_doses_7_days"))t.avg7Days=o;else if(o.endsWith("_avg_daily_doses_14_days"))t.avg14Days=o;else if(o.endsWith("_avg_daily_doses_30_days"))t.avg30Days=o;else if(o.endsWith("_avg_daily_doses_365_days")||o.endsWith("_avg_daily_doses_yearly"))t.avgYearly=o;else if(o.endsWith("_adherence_7_days"))t.adherence7Days=o;else if(o.endsWith("_adherence_14_days"))t.adherence14Days=o;else if(o.endsWith("_adherence_30_days"))t.adherence30Days=o;else if(o.endsWith("_adherence_365_days"))t.adherence365Days=o;else if(o.endsWith("_days_since_first_dose"))t.daysSinceFirstDose=o;else if(o.endsWith("_days_to_steady_state"))t.steadyState=o;else if(o.endsWith("_days_left_est"))t.daysLeft=o,t.daysLeftEst=!0;else if(o.endsWith("_days_left"))t.daysLeft=o,t.daysLeftEst=!1;else if(o.endsWith("_strength"))t.strength=o;else if(o.endsWith("_24h_limit_exceeded"))t.limit24hExceeded=o;else if(o.endsWith("_dose_status"))t.doseStatus=o;else{const e=this._getAttr(o,"role");"daily_amount"===e?t.amountLast24h=o:"daily_remaining"===e&&(t.dailyRemaining=o)}else if(o.startsWith("button."))if(o.endsWith("_take"))t.takeButton=o;else if(o.endsWith("_reset_history"))t.resetButton=o;else if(o.endsWith("_undo_dose"))t.undoButton=o;else if(o.endsWith("_reset_adherence"))t.adherenceResetButton=o;else{const e=this._getAttr(o,"role");"cover"===e?t.adherenceCoverButton=o:"skip"===e?t.skipButton=o:"averages_reset"===e&&(t.averagesResetButton=o)}else if(o.startsWith("number."))if(o.endsWith("_pills_left"))t.pillsLeft=o;else if(o.endsWith("_add_refill"))t.addRefill=o;else if(o.endsWith("_effectiveness")){const e=this._getAttr(o,"metric_label")||n.name?.replace(/\s+Effectiveness$/i,"")||o,i=this._getAttr(o,"metric_key")||"";t.metrics.push({entityId:o,label:e,metricKey:i})}const r=this._getAttr(o,"drink_master"),s=(this._getAttr(o,"device_type")||"").toLowerCase();if(!0===r){i=!0;const e=(this._getAttr(o,"substance")||"").toLowerCase();"caffeine"!==e&&"alcohol"!==e||(t.substance=e),this._getAttr(o,"pk_model")&&void 0===this._getAttr(o,"window_days")&&(t.amountInBody=o);const a=this._getAttr(o,"window_days");null!=a&&(7===a?t.avg7Days=o:14===a?t.avg14Days=o:30===a?t.avg30Days=o:365===a&&(t.avgYearly=o));const n=this._getAttr(o,"role");"daily_amount"===n?t.amountLast24h=o:"daily_remaining"===n?t.dailyRemaining=o:"sleep_disruption"===n?t.sleepDisruption=o:"next_band"===n?t.nextBand=o:"estimated_low_time"===n?t.estimatedLowTime=o:"estimated_none_time"===n?t.estimatedNoneTime=o:"low_hours_until"===n?t.lowHoursUntil=o:"last_dose"===n&&(t.lastDose=o)}else if("drink"===s){a=!0;const e=(this._getAttr(o,"substance")||"").toLowerCase();"caffeine"!==e&&"alcohol"!==e||(t.substance=e);const i=this._getAttr(o,"role");if("total"===i)t.totalDoses=o;else if("last_dose"===i)t.lastDose=o;else if("avg"===i){const e=this._getAttr(o,"window_days");7===e?t.avg7Days=o:14===e?t.avg14Days=o:30===e?t.avg30Days=o:365===e&&(t.avgYearly=o)}else"cooldown"===i?t.pillsSafeToTake=o:"days_left"===i&&(t.daysLeft=o,t.daysLeftEst=!0)}}return i?t.deviceType="drink_master":a&&(t.deviceType="drink"),t}_getChipEntities(){if(!this.config)return[];const e=[];for(const t of["chip_1","chip_2","chip_3","chip_4"]){const i=this.config[t];if(i){const a=`${t}_label`,o=`${t}_icon`,n=`${t}_show_icon`,r=`${t}_tap_action`,s=`${t}_hold_action`,l=`${t}_double_tap_action`;e.push({entityId:i,label:this.config[a],icon:this.config[o],showIcon:!0===this.config[n],tapAction:this.config[r],holdAction:this.config[s],doubleTapAction:this.config[l]})}}return e}_getState(e){return function(e,t){if(!t||!e)return"unavailable";const i=e.states[t];return i?i.state:"unavailable"}(this.hass,e)}_getAttr(e,t){return function(e,t,i){if(!t||!i||!e)return;const a=e.states[t];return a?.attributes?.[i]}(this.hass,e,t)}_getStrengthUnit(e){const t=this._getAttr(e.strength,"strength_unit");if("string"==typeof t&&t)return t;const i=this._getAttr(e.amountInBody,"unit_of_measurement");return"string"==typeof i&&i?i:"mg"}_formatInteger(e){return function(e){const t=parseFloat(e);return isNaN(t)?e:Math.round(t).toString()}(e)}_getColorOverrides(){return function(e){const t={default:{primary:"",rgb:""},blue:{primary:"#03a9f4",rgb:"3, 169, 244"},red:{primary:"#e53935",rgb:"229, 57, 53"},green:{primary:"#43a047",rgb:"67, 160, 71"},yellow:{primary:"#fdd835",rgb:"253, 216, 53"},orange:{primary:"#fb8c00",rgb:"251, 140, 0"},purple:{primary:"#7e57c2",rgb:"126, 87, 194"},pink:{primary:"#d81b60",rgb:"216, 27, 96"},teal:{primary:"#00897b",rgb:"0, 137, 123"},brown:{primary:"#795548",rgb:"121, 85, 72"},coral:{primary:"#ff7043",rgb:"255, 112, 67"},slate:{primary:"#546e7a",rgb:"84, 110, 122"},gold:{primary:"#daa520",rgb:"218, 165, 32"},grey:{primary:"#9e9e9e",rgb:"158, 158, 158"}}[e||"default"];return t&&t.primary?`--primary-color: ${t.primary}; --rgb-primary-color: ${t.rgb};`:""}(this.config?.color_scheme)}_toLocalDateKey(e){return Fe(e)}_bucketByDay(e=14){const t={};for(const e of this._doseHistory){const i=this._toLocalDateKey(new Date(e[0]));t[i]=(t[i]||0)+1}const i=[],a=new Date;for(let o=e-1;o>=0;o--){const e=new Date(a);e.setDate(e.getDate()-o);const n=this._toLocalDateKey(e);i.push({date:n,label:e.getDate().toString(),count:t[n]||0})}return i}_computeNextDose(e){const t=this._getState(e.nextDose);if("unavailable"===t||"unknown"===t)return"Unavailable";try{const e=new Date(t),i=new Date;if(isNaN(e.getTime())||e<=i)return"now";const a=Math.max(0,e.getTime()-i.getTime()),o=Math.floor(a/36e5),n=Math.floor(a%36e5/6e4);return o>0?`${o}h ${n}m`:`${n}m`}catch(e){return console.warn("[ax-dose-logger-card] _computeNextDose failed:",e),"Unavailable"}}_computeOverTime(e){if("As Needed"===this._getAttr(e.nextDose,"tracking_type"))return null;const t=this._getState(e.overdue);if("unavailable"===t||"unknown"===t||!t)return null;const i=parseFloat(t);if(isNaN(i)||i<=0)return null;const a=Math.floor(i/3600),o=Math.floor(i%3600/60);return a>0?`${a}h ${o}m`:`${o}m`}_computeWindowExpiry(e){const t=this._getAttr(e.pillsSafeToTake,"window_expires_at");if(t&&"string"==typeof t)try{const e=new Date(t),i=new Date;if(!isNaN(e.getTime())&&e>i){const t=e.getTime()-i.getTime(),a=Math.floor(t/36e5),o=Math.floor(t%36e5/6e4);return a>0?`${a}h ${o}m`:`${o}m`}}catch(e){console.warn("[ax-dose-logger-card] _computeWindowExpiry failed:",e)}return this._computeNextDose(e)}_formatOverrideTime(e){if(!this.hass?.locale)return e.toLocaleTimeString();const t=new Date;return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()?(i=e,a=this.hass.locale,ye(a).format(i)):((e,t)=>ve(t).format(e))(e,this.hass.locale);var i,a}_computeTimeSinceLastDose(e){const t=this._getState(e.lastDose);if("unavailable"===t||"unknown"===t||"None"===t||!t)return"Never";try{const e=new Date(t),i=new Date;if(isNaN(e.getTime()))return"Never";const a=Math.max(0,i.getTime()-e.getTime()),o=Math.floor(a/36e5),n=Math.floor(a%36e5/6e4);return o>0?`${o}h ${n}m`:`${n}m`}catch(e){return console.warn("[ax-dose-logger-card] _computeTimeSinceLastDose failed:",e),"Never"}}_getTimeframeHours(){return Ue(this._activeTimeframe)}_handleTakePill(e){if(!this.hass||!e.takeButton)return;const t=this._getState(e.pillsSafeToTake),i=parseInt(t,10);if(e.limit24hExceeded){if("on"===this._getState(e.limit24hExceeded)){const t=this._getAttr(e.limit24hExceeded,"current_amount"),i=this._getAttr(e.limit24hExceeded,"daily_limit"),a=this._getAttr(e.limit24hExceeded,"next_dose_strength"),o=this._getAttr(e.limit24hExceeded,"already_exceeded"),n=this._getAttr(e.limit24hExceeded,"unit_of_measurement")||"mg",r=("number"==typeof t?t:0)+("number"==typeof a?a:0),s=`${t} / ${i} ${n}`,l=o?"dialog.override.body_24h_exceeded":"dialog.override.body_24h_would_exceed";return this._overrideDialog={timeLabel:s,bodyKey:l,entities:e},void(this._overrideDialogExtras={current:String(t),limit:String(i),next:String(a),projected:String(r),unit:String(n)})}}if(!isNaN(i)&&i<=0){const t=(this._getAttr(e.nextDose,"tracking_type")||"").toLowerCase();let i,a;if("as_needed"===t||"as needed"===t){const t=this._getAttr(e.pillsSafeToTake,"window_expires_at"),o=t?new Date(t):null;o&&!isNaN(o.getTime())?(i=this._formatOverrideTime(o),a="dialog.override.body_as_needed"):(i=this._computeWindowExpiry(e),a="dialog.override.body_as_needed")}else{const t=this._getState(e.nextDose),o=t&&"unavailable"!==t&&"unknown"!==t?new Date(t):null,n=this._getAttr(e.pillsSafeToTake,"window_expires_at"),r=n?new Date(n):null;null!==r&&!isNaN(r.getTime())&&r>new Date&&(!o||isNaN(o.getTime())||r<o)?(i=this._formatOverrideTime(r),a="dialog.override.body_window"):o&&!isNaN(o.getTime())&&o>new Date?(i=this._formatOverrideTime(o),a="dialog.override.body_scheduled"):(i=this._computeWindowExpiry(e),a="dialog.override.body_scheduled")}return void(this._overrideDialog={timeLabel:i,bodyKey:a,entities:e})}this.hass.callService("button","press",{entity_id:e.takeButton}),this._triggerDailyAck()}_handleUndoDose(e){this.hass&&e.undoButton&&this.hass.callService("button","press",{entity_id:e.undoButton})}_handleRefill(e){if(!this.hass)return;const t=this._refillTarget?.addStockEntityId??e.addRefill;if(!t)return;const i=parseFloat(this._refillAmount);isNaN(i)||i<=0||(this.hass.callService("number","set_value",{entity_id:t,value:i}),this._showRefillDialog=!1,this._refillAmount="",this._refillTarget=null)}_getDrinksOfSubstance(e){if(!this.hass)return[];const t=this.hass.entities,i=this._activeTracker()?.profileId??"";if(this._drinksCache&&this._drinksCache.substance===e&&this._drinksCache.entitiesRef===t&&this._drinksCache.activeProfileId===i)return this._drinksCache.drinks;const a={};for(const[t,i]of Object.entries(this.hass.entities)){if("ax_dose_logger"!==i.platform)continue;const o=i.device_id;if(!o)continue;if("drink"!==(this._getAttr(t,"device_type")||"").toLowerCase())continue;if((this._getAttr(t,"substance")||"").toLowerCase()!==e)continue;const n=a[o]??{deviceId:o,name:this.hass.devices?.[o]?.name||i.name||t,substance:e},r=this._getAttr(t,"role");if(t.startsWith("button."))if("log"===r){n.logButtonEntityId=t;const e=this._getAttr(t,"allowed_profiles");Array.isArray(e)&&(n.allowedProfiles=e.map(String))}else"undo"===r?n.undoButtonEntityId=t:"reset"===r&&(n.resetButtonEntityId=t);else if(t.startsWith("number."))"stock"===r?n.stockEntityId=t:"add_stock"===r&&(n.addStockEntityId=t);else if(t.startsWith("sensor."))if("avg"===r){const e=this._getAttr(t,"window_days");7===e?n.avg7EntityId=t:365===e&&(n.avg365EntityId=t)}else"days_left"===r&&(n.daysLeftEntityId=t);a[o]=n}let o=Object.values(a).sort((e,t)=>e.name.localeCompare(t.name));return i&&(o=o.filter(e=>(e.allowedProfiles??[]).includes(i))),this._drinksCache={substance:e,entitiesRef:t,drinks:o,activeProfileId:i},o}_drinkDaysSinceReveal(e){if(!e)return{hasDaysSensor:!1,daysSince:0};const t=this._getAttr(e,"history_start_date");if(!t)return{hasDaysSensor:!1,daysSince:0};const i=new Date(t);if(isNaN(i.getTime()))return{hasDaysSensor:!1,daysSince:0};const a=Math.floor((Date.now()-i.getTime())/864e5);return{hasDaysSensor:!0,daysSince:Math.max(0,a)}}_logDrink(e,t){if(!this.hass||!e)return;const i=this._activeTracker()?.profileId,a=t??i;this.hass.callService("ax_dose_logger","log_drink",{entity_id:e,...a?{target_profile:a}:{}}),this._showLogDrinkDialog=!1,this._logDrinkSubstance=null,this._logDrinkProfileTarget=null,this._triggerDrinksAck()}_triggerDailyAck(){const e=this.config?.take_button_ack_duration_ms??3e3,t=this._resolveEntities();this._dailyFrozenState=this._computeDailyButtonState(t),void 0!==this._dailyFreezeTimer&&window.clearTimeout(this._dailyFreezeTimer),this._dailyFreezeTimer=window.setTimeout(()=>{this._connected&&(this._dailyFrozenState=null,this._dailyFreezeTimer=void 0,this.requestUpdate())},240),this._dailyAckActive?this._dailyAckCount+=1:(this._dailyAckCount=1,this._dailyAckActive=!0),void 0!==this._dailyAckTimer&&window.clearTimeout(this._dailyAckTimer),this._dailyAckTimer=window.setTimeout(()=>{this._connected&&(this._dailyAckActive=!1,this._dailyAckCount=0,this._dailyAckTimer=void 0,this.requestUpdate())},Math.max(500,e))}_triggerDrinksAck(){const e=this.config?.drink_button_ack_duration_ms??3e3,t=this._resolveEntities();this._drinksFrozenState=this._computeDrinksButtonState(t),void 0!==this._drinksFreezeTimer&&window.clearTimeout(this._drinksFreezeTimer),this._drinksFreezeTimer=window.setTimeout(()=>{this._connected&&(this._drinksFrozenState=null,this._drinksFreezeTimer=void 0,this.requestUpdate())},240),this._drinksAckActive?this._drinksAckCount+=1:(this._drinksAckCount=1,this._drinksAckActive=!0),void 0!==this._drinksAckTimer&&window.clearTimeout(this._drinksAckTimer),this._drinksAckTimer=window.setTimeout(()=>{this._connected&&(this._drinksAckActive=!1,this._drinksAckCount=0,this._drinksAckTimer=void 0,this.requestUpdate())},Math.max(500,e))}_cancelDailyAck(){void 0!==this._dailyAckTimer&&(window.clearTimeout(this._dailyAckTimer),this._dailyAckTimer=void 0),void 0!==this._dailyFreezeTimer&&(window.clearTimeout(this._dailyFreezeTimer),this._dailyFreezeTimer=void 0),this._dailyFrozenState=null,this._dailyAckActive=!1,this._dailyAckCount=0}_cancelDrinksAck(){void 0!==this._drinksAckTimer&&(window.clearTimeout(this._drinksAckTimer),this._drinksAckTimer=void 0),void 0!==this._drinksFreezeTimer&&(window.clearTimeout(this._drinksFreezeTimer),this._drinksFreezeTimer=void 0),this._drinksFrozenState=null,this._drinksAckActive=!1,this._drinksAckCount=0}_resolveGraceHours(e){if(e.overdue){const t=this._getAttr(e.overdue,"grace_minutes");if("number"==typeof t&&t>0)return t/60}const t=[e.adherence7Days,e.adherence14Days,e.adherence30Days,e.adherence365Days];for(const e of t){if(!e)continue;const t=this._getAttr(e,"grace_hours");if("number"==typeof t&&t>0)return t}return 1}_computeDailyButtonState(e){if(null!==this._dailyFrozenState)return this._dailyFrozenState;if(e.doseStatus){const t=function(e){if(!e||"unavailable"===e||"unknown"===e)return null;switch(e){case"limit_reached":return"lockout";case"limit_24h":return"limit_24h";case"overdue":return"latency";case"due":return"execution";case"not_due":case"ok":return"idle";default:return null}}(this._getState(e.doseStatus));if(null!==t)return t}const t=this._getState(e.pillsSafeToTake),i=parseInt(t,10),a=!isNaN(i)&&i<=0;let o=!1;if(e.limit24hExceeded){o="on"===this._getState(e.limit24hExceeded)}const n=(this._getAttr(e.nextDose,"tracking_type")||"").toLowerCase(),r="as_needed"!==n&&"as needed"!==n&&""!==n,s=this._getState(e.overdue);let l=0;if(s&&"unavailable"!==s&&"unknown"!==s){const e=parseFloat(s);!isNaN(e)&&e>0&&(l=e)}let c=!0;const d=this._getState(e.nextDose);if(d&&"unavailable"!==d&&"unknown"!==d){const e=new Date(d);isNaN(e.getTime())||(c=e.getTime()<=Date.now())}return Ke({isLockedOut:a,is24hLimitReached:o,isScheduled:r,isDueNow:c,overdueSeconds:l,graceHours:this._resolveGraceHours(e),ackActive:this._dailyAckActive})}_computeDrinksButtonState(e){if(null!==this._drinksFrozenState)return this._drinksFrozenState;let t=!1;if(e.dailyRemaining){const i=this._getState(e.dailyRemaining);if(i&&"unavailable"!==i&&"unknown"!==i){const e=parseFloat(i);!isNaN(e)&&e<=0&&(t=!0)}}else if(e.amountLast24h){const i=this._getAttr(e.amountLast24h,"remaining");if("number"==typeof i&&i<=0)t=!0;else if("string"==typeof i){const e=parseFloat(i);!isNaN(e)&&e<=0&&(t=!0)}}return Ke({isLockedOut:t,is24hLimitReached:!1,isScheduled:!1,isDueNow:!1,overdueSeconds:0,graceHours:1,ackActive:this._drinksAckActive})}_undoDrink(e){this.hass&&e&&this.hass.callService("button","press",{entity_id:e})}_resetDrink(e){this.hass&&e&&this.hass.callService("button","press",{entity_id:e})}_openToolsDialog(e,t,i){this._toolsDialog={title:e,descriptor:t,onConfirm:i}}_closeToolsDialog(){this._toolsDialog=null}_runToolAction(e,t,i){!1!==this.config?.confirm_tool_actions?this._openToolsDialog(e,t,i):i()}_handleTimeframeChange(e){e!==this._activeTimeframe&&(this._activeTimeframe=e)}get _lang(){return this.hass?.language||"en"}get lang(){return this._lang}get activeTimeframe(){return this._activeTimeframe}get activeBarTimeframe(){return this._activeBarTimeframe}get activeGraph(){return this._activeGraph}get amountHistory(){return this._amountHistory}get amountHistorySampled(){return this._amountHistorySampled}get doseHistory(){return this._doseHistory}get activeEffectivenessTimeframe(){return this._activeEffectivenessTimeframe}get activeEffectivenessView(){return this._activeEffectivenessView}get effectivenessHistory(){return this._effectivenessHistory}get effectivenessVisible(){return this._effectivenessVisible}showRefillDialog(){this._showRefillDialog=!0,this._refillAmount="",this._refillTarget=null}showRefillDialogFor(e,t){this._refillTarget={addStockEntityId:e,drinkName:t},this._showRefillDialog=!0,this._refillAmount=""}showDeviceInfo(){this._deviceInfoTarget=null,this._showDeviceInfo=!0}showDeviceInfoFor(e,t){this._deviceInfoTarget={deviceId:e,name:t},this._showDeviceInfo=!0}showColorExplainerDialog(){this._showColorExplainerDialog=!0}showLogDrinkDialog(e){this._logDrinkSubstance=e,this._showLogDrinkDialog=!0,this._fetchDrinkLowPredictions(e)}async _fetchDrinkLowPredictions(e){if(!this.hass)return;const t=this._getDrinksOfSubstance(e),i=++this._predictLowToken;this._drinkLowPredictions={},await Promise.all(t.map(async e=>{if(e.logButtonEntityId)try{const t=await this.hass.callApi("GET",`ax_dose_logger/predict_low?entity_id=${encodeURIComponent(e.logButtonEntityId)}`);if(i!==this._predictLowToken)return;this._drinkLowPredictions={...this._drinkLowPredictions,[e.logButtonEntityId]:t?.low_time??null}}catch(t){console.warn("[ax-dose-logger-card] predict_low fetch failed for",e.logButtonEntityId,t)}}))}showSleepDisruptionDialog(e){this._sleepDisruptionSubstance=e,this._showSleepDisruptionDialog=!0}setActiveGraph(e){this._activeGraph=e}_onKeyActivate(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),t())}getState(e){return this._getState(e)}getAttr(e,t){return this._getAttr(e,t)}getStrengthUnit(e){return this._getStrengthUnit(e)}getMedName(e){return this._getMedName(e)}getSafeBoxEntity(e){return this._getSafeBoxEntity(e)}getChipEntities(){return this._getChipEntities()}handleChipAction(e,t,i,a){this._handleChipAction(e,t,i,a)}formatInteger(e){return this._formatInteger(e)}computeNextDose(e){return this._computeNextDose(e)}computeOverTime(e){return this._computeOverTime(e)}computeTimeSinceLastDose(e){return this._computeTimeSinceLastDose(e)}computeDailyButtonState(e){return this._computeDailyButtonState(e)}computeDrinksButtonState(e){return this._computeDrinksButtonState(e)}bucketByDay(e){return this._bucketByDay(e)}daysSinceReveal(e){return this._daysSinceReveal(e)}getDrinksOfSubstance(e){return this._getDrinksOfSubstance(e)}getProfileOptions(){const e=this._getProfileNameMap();return Object.entries(e).map(([e,t])=>({value:e,label:t})).sort((e,t)=>e.label.localeCompare(t.label))}drinkDaysSinceReveal(e){return this._drinkDaysSinceReveal(e)}logDrink(e,t){this._logDrink(e,t)}undoDrink(e){this._undoDrink(e)}resetDrink(e){this._resetDrink(e)}handleTakePill(e){this._handleTakePill(e)}handleUndoDose(e){this._handleUndoDose(e)}handleRefill(e){this._handleRefill(e)}openToolsDialog(e,t,i){this._openToolsDialog(e,t,i)}runToolAction(e,t,i){this._runToolAction(e,t,i)}openMoreInfo(e){this._openMoreInfo(e)}handleSafeBoxAction(e,t,i,a){this._handleSafeBoxAction(e,t,i,a)}getPillsLeftBoxEntity(e){return this._getPillsLeftBoxEntity(e)}handlePillsLeftBoxAction(e,t,i,a,o){this._handlePillsLeftBoxAction(e,t,i,a,o)}getInBodyBoxEntity(e){return this._getInBodyBoxEntity(e)}handleInBodyBoxAction(e,t,i,a){this._handleInBodyBoxAction(e,t,i,a)}getDisruptionBoxEntity(e){return this._getDisruptionBoxEntity(e)}handleDisruptionBoxAction(e,t,i,a,o){this._handleDisruptionBoxAction(e,t,i,a,o)}getDrinkChipEntities(){return this._getDrinkChipEntities()}handleDrinkChipAction(e,t,i,a){this._handleDrinkChipAction(e,t,i,a)}handleTimeframeChange(e){this._handleTimeframeChange(e)}handleBarTimeframeChange(e){e!==this._activeBarTimeframe&&(this._activeBarTimeframe=e)}handleEffectivenessTimeframeChange(e){e!==this._activeEffectivenessTimeframe&&(this._activeEffectivenessTimeframe=e)}setEffectivenessView(e){e!==this._activeEffectivenessView&&(this._activeEffectivenessView=e)}toggleEffectivenessMetric(e){const t=new Set(this._effectivenessVisible);t.has(e)?t.delete(e):t.add(e),this._effectivenessVisible=t}handleTrackingChange(e,t){this._handleTrackingChange(e,t)}onKeyActivate(e,t){this._onKeyActivate(e,t)}onStatCellKeydown(e,t){this._onStatCellKeydown(e,t)}navigateToDevice(){this._navigateToDevice()}_handlePaneChange(e){if(e!==this._activePane){if("daily"===this._activePane?this._cancelDailyAck():"drinks"===this._activePane&&this._cancelDrinksAck(),this._activePane=e,"graphs"===e&&this.config&&this.hass){const e=this._resolveEntities(),t=this._getState(e.amountInBody),i=!!e.amountInBody&&"0"!==t&&"unknown"!==t&&"unavailable"!==t;this._activeGraph=!1!==this.config.show_amount_in_body&&i?1:0}this.updateComplete.then(()=>{this.dispatchEvent(new CustomEvent("card-resize",{bubbles:!0,composed:!0}))})}}_navigateToDevice(e){const t=e??this._effectiveDeviceId();t&&(window.history.pushState(null,"",`/config/devices/device/${t}`),window.dispatchEvent(new CustomEvent("location-changed")))}_renderDeviceInfoDialog(e){const t=this._deviceInfoTarget?.name??this._getMedName(e),i=this._deviceInfoTarget?.deviceId,a=()=>{this._showDeviceInfo=!1,this._deviceInfoTarget=null};return W`
      <ha-dialog
        open
        width="medium"
        @closed=${a}
      >
        <div slot="header" class="dialog-header">${t}</div>
        <div class="dialog-body dialog-body--center">
          <button class="dialog-btn" @click=${He(()=>{this._navigateToDevice(i),a()})}>
            <ha-ripple></ha-ripple>
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>${Te(this._lang,"dialog.device_info.button")}</span>
          </button>
          ${!1!==this.config?.show_color_indicator_explainer?W`<button class="dialog-btn" aria-label=${Te(this._lang,"dialog.device_info.color_indicators_aria")} @click=${He(()=>{this.showColorExplainerDialog(),a()})}>
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:palette-outline"></ha-icon>
                <span>${Te(this._lang,"dialog.device_info.color_indicators")}</span>
              </button>`:V}
        </div>
      </ha-dialog>
    `}_renderRefillDialog(e){const t=this._refillTarget?Te(this._lang,"dialog.refill.title_drink",{name:this._refillTarget.drinkName}):Te(this._lang,"dialog.refill.title"),i=()=>{this._showRefillDialog=!1,this._refillAmount="",this._refillTarget=null};return W`
      <ha-dialog
        open
        width="small"
        @closed=${i}
      >
        <div slot="header" class="dialog-header">${t}</div>
        <div class="dialog-body">
          <input
            type="number"
            class="refill-input"
            .value=${this._refillAmount}
            @input=${e=>this._refillAmount=e.target.value}
            placeholder=${Te(this._lang,"dialog.refill.placeholder")}
            min="1"
            step="1"
          />
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${i}>
            ${Te(this._lang,"dialog.cancel")}
          </button>
          <button class="dialog-btn" @click=${He(()=>this._handleRefill(e))}>
            <ha-ripple></ha-ripple>
            ${Te(this._lang,"dialog.refill.confirm")}
          </button>
        </div>
      </ha-dialog>
    `}_renderLogDrinkDialog(){const e=this._logDrinkSubstance;if(!e)return V;const t=this._getDrinksOfSubstance(e),i=this._resolveTrackers(),a=this._activeTracker()?.profileId??"",o=i.length<=1,n=()=>{this._showLogDrinkDialog=!1,this._logDrinkSubstance=null,this._drinkLowPredictions={},this._predictLowToken++,this._logDrinkProfileTarget=null},r=e=>{if(!e)return Te(this._lang,"dialog.log_drink.predicted_low_dash");const t=this._drinkLowPredictions[e];if(void 0===t)return`${Te(this._lang,"dialog.log_drink.predicted_low")}: …`;if(null===t)return Te(this._lang,"dialog.log_drink.predicted_low_dash");const i=new Date(t);if(isNaN(i.getTime()))return Te(this._lang,"dialog.log_drink.predicted_low_dash");const a=i.toLocaleTimeString(this._lang,{hour:"2-digit",minute:"2-digit",hour12:!1});return`${Te(this._lang,"dialog.log_drink.predicted_low")}: ${a}`},s=this._logDrinkProfileTarget;if(s){const e=new Set(s.allowedProfiles),t=o?s.allowedProfiles:i.map(e=>e.profileId).filter(t=>e.has(t));return W`
        <ha-dialog
          open
          width="small"
          @closed=${n}
        >
          <div slot="header" class="dialog-header">${s.drinkName}</div>
          <div class="dialog-body">
            <div class="tools-dialog-descriptor">${Te(this._lang,"dialog.log_drink.select_profile")}</div>
            <div class="log-drink-grid">
              ${t.map(e=>W`
                <button
                  class="dialog-btn log-drink-btn"
                  @click=${He(()=>this._logDrink(s.logButtonEntityId,e))}
                >
                  <ha-ripple></ha-ripple>
                  <ha-icon icon="mdi:account"></ha-icon>
                  <span class="log-drink-name">${this._profileDisplayName(e)}</span>
                </button>
              `)}
            </div>
          </div>
          <div class="custom-action-bar">
            <button class="dialog-btn dialog-btn--muted" @click=${()=>{this._logDrinkProfileTarget=null}}>
              ${Te(this._lang,"dialog.log_drink.back")}
            </button>
            <button class="dialog-btn dialog-btn--muted" @click=${n}>
              ${Te(this._lang,"dialog.cancel")}
            </button>
          </div>
        </ha-dialog>
      `}return W`
      <ha-dialog
        open
        width="small"
        @closed=${n}
      >
        <div slot="header" class="dialog-header">${Te(this._lang,"dialog.log_drink.title")}</div>
        <div class="dialog-body">
          ${0===t.length?W`<div class="tools-dialog-descriptor">${Te(this._lang,"dialog.log_drink.empty")}</div>`:W`<div class="log-drink-grid">
                ${t.map(t=>{const i=t.allowedProfiles??[],n=""!==a&&i.includes(a),s=!o&&i.length>=2&&!n;return W`
                    <button
                      class="dialog-btn log-drink-btn"
                      ?disabled=${!t.logButtonEntityId}
                      @click=${He(()=>{t.logButtonEntityId&&(s?this._logDrinkProfileTarget={drinkName:t.name,logButtonEntityId:t.logButtonEntityId,allowedProfiles:t.allowedProfiles}:this._logDrink(t.logButtonEntityId))})}
                    >
                      <ha-ripple ?disabled=${!t.logButtonEntityId}></ha-ripple>
                      <ha-icon icon=${"caffeine"===e?"mdi:coffee":"mdi:glass-wine"}></ha-icon>
                      <span class="log-drink-name">${t.name}</span>
                      <span class="log-drink-low">${r(t.logButtonEntityId)}</span>
                    </button>
                  `})}
              </div>`}
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${n}>
            ${Te(this._lang,"dialog.cancel")}
          </button>
        </div>
      </ha-dialog>
    `}_renderOverrideDialog(){const e=this._overrideDialog;if(!e)return V;const t=this._overrideDialogExtras,i={time:e.timeLabel};t&&(i.current=t.current,i.limit=t.limit,i.next=t.next,i.projected=t.projected,i.unit=t.unit);const a=()=>{this._overrideDialog=null,this._overrideDialogExtras=null};return W`
      <ha-dialog
        open
        width="small"
        @closed=${a}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${Te(this._lang,"dialog.warning")}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${Te(this._lang,e.bodyKey,i)}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${a}>
            ${Te(this._lang,"dialog.cancel")}
          </button>
          <button class="dialog-btn"
                  @click=${He(()=>{this.hass&&e.entities.takeButton&&(this.hass.callService("button","press",{entity_id:e.entities.takeButton}),this._triggerDailyAck()),a()})}>
            <ha-ripple></ha-ripple>
            ${Te(this._lang,"dialog.override.confirm")}
          </button>
        </div>
      </ha-dialog>
    `}_getMedName(e){let t=this.config?.name||e.medicationName;const i=this._getState(e.strength),a=parseFloat(i);return e.strength&&!isNaN(a)&&0!==a&&"unknown"!==i&&"unavailable"!==i&&(t+=` - ${this._formatInteger(i)} ${this._getStrengthUnit(e)}`),t}_getSafeBoxEntity(e){return!0===this.config?.safe_to_take_show_amount_in_body?e.amountInBody||e.pillsSafeToTake:this.config?.safe_to_take_entity||e.pillsSafeToTake}_handleSafeBoxAction(e,t,i,a){if(!this.hass)return;i[`${t}_action`]?De(this,this.hass,i,t):"tap"===t&&a&&this._openMoreInfo(a)}_handleChipAction(e,t,i,a){if(!this.hass)return;i[`${t}_action`]?De(this,this.hass,i,t):"tap"===t&&a&&this._openMoreInfo(a)}_getPillsLeftBoxEntity(e){return!0===this.config?.pills_left_show_days_left?e.daysLeft:this.config?.pills_left_entity||e.pillsLeft}_handlePillsLeftBoxAction(e,t,i,a,o){if(!this.hass)return;i[`${t}_action`]?De(this,this.hass,i,t):"tap"===t&&o?o():"tap"===t&&a&&this._openMoreInfo(a)}_getInBodyBoxEntity(e){return this.config?.in_body_entity||e.amountInBody}_handleInBodyBoxAction(e,t,i,a){if(!this.hass)return;i[`${t}_action`]?De(this,this.hass,i,t):"tap"===t&&a&&this._openMoreInfo(a)}_getDisruptionBoxEntity(e){return"low_timestamp"===this.config?.disruption_mode?e.estimatedLowTime:"low_hours_until"===this.config?.disruption_mode?e.lowHoursUntil:this.config?.disruption_entity||e.sleepDisruption}_handleDisruptionBoxAction(e,t,i,a,o){if(!this.hass)return;i[`${t}_action`]?De(this,this.hass,i,t):"tap"===t&&o?o():"tap"===t&&a&&this._openMoreInfo(a)}_handleDrinkChipAction(e,t,i,a){if(!this.hass)return;i[`${t}_action`]?De(this,this.hass,i,t):"tap"===t&&a&&this._openMoreInfo(a)}_getDrinkChipEntities(){if(!this.config)return[];const e=[];for(const t of["drink_chip_1","drink_chip_2","drink_chip_3","drink_chip_4"]){const i=this.config[t];if(i){const a=`${t}_label`,o=`${t}_icon`,n=`${t}_show_icon`,r=`${t}_tap_action`,s=`${t}_hold_action`,l=`${t}_double_tap_action`;e.push({entityId:i,label:this.config[a],icon:this.config[o],showIcon:!0===this.config[n],tapAction:this.config[r],holdAction:this.config[s],doubleTapAction:this.config[l]})}}return e}async _fetchAmountHistory(e){if(!this.hass||!e.amountInBody)return;const t=++this._amountFetchToken,i=this._effectiveDeviceId();if(i)try{const e=this._getTimeframeHours(),a=await this.hass.callApi("GET",`ax_dose_logger/graph/${i}?hours=${e}&points=240`);if(t!==this._amountFetchToken)return;if(a&&Array.isArray(a.amount))return this._amountHistory=a.amount.map(e=>({timestamp:e[0],value:parseFloat(String(e[1]))})),void(this._amountHistorySampled=!0)}catch{}if(t!==this._amountFetchToken)return;const a=e.amountInBody,o=new Date,n=new Date(o.getTime()-60*this._getTimeframeHours()*60*1e3).toISOString(),r=o.toISOString();try{const e=await this.hass.callApi("GET",`history/period/${n}?filter_entity_id=${a}&end_time=${r}&minimal_response&significant_changes_only=1`);if(t!==this._amountFetchToken)return;const i=e;if(i&&i[0]){const e=i[0].filter(e=>e.state&&!isNaN(parseFloat(e.state))).map(e=>({timestamp:e.last_changed,value:parseFloat(e.state)})),t=800,a=Math.ceil(e.length/t);this._amountHistory=a>1?e.filter((e,t)=>t%a===0):e,this._amountHistorySampled=!1}}catch(e){console.warn("[ax-dose-logger-card] amount history fetch failed:",e)}}async _fetchDoseHistory(e){const t=this._effectiveDeviceId();if(!this.hass||!t)return;const i=++this._doseFetchToken;try{const e=await this.hass.callApi("GET",`ax_dose_logger/history/${t}`);if(i!==this._doseFetchToken)return;Array.isArray(e)&&(this._doseHistory=e)}catch(e){console.warn("[ax-dose-logger-card] dose history fetch failed:",e)}}async _fetchEffectivenessHistory(e){if(!this.hass||!e.metrics.length)return;const t="30d"===this._activeEffectivenessTimeframe?30:"60d"===this._activeEffectivenessTimeframe?60:14,i=++this._effectivenessFetchToken,a=this._effectiveDeviceId();if(a)try{const o=await this.hass.callApi("GET",`ax_dose_logger/graph/${a}?hours=${24*t}&points=40`);if(i!==this._effectivenessFetchToken)return;if(o&&o.metrics&&"object"==typeof o.metrics){const t={};for(const i of e.metrics){const e=o.metrics[i.metricKey];e&&"object"==typeof e&&(t[i.metricKey]=Object.entries(e).map(([e,t])=>({timestamp:`${e}T12:00:00.000Z`,value:parseFloat(String(t))})).filter(e=>!isNaN(e.value)))}return this._effectivenessHistory=t,void this._initEffectivenessVisible(e)}}catch{}if(i!==this._effectivenessFetchToken)return;const o=e.metrics.map(e=>e.entityId).join(","),n=new Date,r=new Date(n.getTime()-24*t*60*60*1e3).toISOString(),s=n.toISOString();try{const t=await this.hass.callApi("GET",`history/period/${r}?filter_entity_id=${o}&end_time=${s}&minimal_response&significant_changes_only=1`);if(i!==this._effectivenessFetchToken)return;const a={};Array.isArray(t)&&e.metrics.forEach((e,i)=>{const o=t[i];Array.isArray(o)&&(a[e.metricKey]=o.filter(e=>e.state&&!isNaN(parseFloat(e.state))).map(e=>({timestamp:e.last_changed,value:parseFloat(e.state)})))}),this._effectivenessHistory=a,this._initEffectivenessVisible(e)}catch(e){console.warn("[ax-dose-logger-card] effectiveness history fetch failed:",e)}}_initEffectivenessVisible(e){const t=e.metrics.map(e=>e.metricKey),i=t.filter(e=>this._effectivenessVisible.has(e));i.length===t.length&&0!==i.length||(this._effectivenessVisible=new Set(t))}_daysSinceReveal(e){const t=this._getState(e.daysSinceFirstDose),i=!!e.daysSinceFirstDose&&"unavailable"!==t;return{hasDaysSensor:i,daysSince:i?parseInt(t)||0:-1}}_openMoreInfo(e){xe(this,"hass-more-info",{entityId:e})}_onStatCellKeydown(e,t){"Enter"!==e.key&&" "!==e.key&&"Spacebar"!==e.key||(e.preventDefault(),this._openMoreInfo(t))}_renderSleepDisruptionDialog(){const e=this._sleepDisruptionSubstance;if(!e)return V;const t=()=>{this._showSleepDisruptionDialog=!1,this._sleepDisruptionSubstance=null},i="alcohol"===e?"dialog.sleep_disruption.alcohol":"dialog.sleep_disruption.caffeine",a=this._resolveEntities(),o=Te(this._lang,"dialog.sleep_disruption.not_applicable");let n=o;const r=this._getState(a.sleepDisruption);r&&"unknown"!==r&&"unavailable"!==r&&(n=r.charAt(0).toUpperCase()+r.slice(1));let s=o;const l=this._getState(a.estimatedLowTime);if(l&&"unknown"!==l&&"unavailable"!==l&&"None"!==l){const e=new Date(l);isNaN(e.getTime())||(s=e.toLocaleTimeString(this._lang,{hour:"2-digit",minute:"2-digit",hour12:!1}))}let c=o;const d=this._getState(a.lowHoursUntil);if(d&&"unknown"!==d&&"unavailable"!==d&&"None"!==d){const e=parseFloat(d);isNaN(e)||(c=String(e))}return W`
      <ha-dialog
        open
        width="medium"
        @closed=${t}
      >
        <div slot="header" class="dialog-header">
          <ha-icon icon="mdi:sleep"></ha-icon>
          ${Te(this._lang,"dialog.sleep_disruption.title")}
        </div>
        <div class="dialog-body">
          <div class="disruption-summary">
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${Te(this._lang,"dialog.sleep_disruption.disruption_label")}</span>
              <span class="disruption-summary-value">${n}</span>
            </div>
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${Te(this._lang,"dialog.sleep_disruption.low_timestamp_label")}</span>
              <span class="disruption-summary-value">${s}</span>
            </div>
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${Te(this._lang,"dialog.sleep_disruption.low_hours_until_label")}</span>
              <span class="disruption-summary-value">${c}</span>
            </div>
          </div>
          <ha-markdown .content=${Te(this._lang,i)}></ha-markdown>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn" @click=${t}>
            <ha-icon icon="mdi:close"></ha-icon>
            <span>${Te(this._lang,"dialog.sleep_disruption.close")}</span>
          </button>
        </div>
      </ha-dialog>
    `}_renderColorExplainerDialog(){const e=()=>{this._showColorExplainerDialog=!1};return W`
     <ha-dialog
       open
       width="medium"
       @closed=${e}
     >
       <div slot="header" class="dialog-header">
         <ha-icon icon="mdi:palette-outline"></ha-icon>
         ${Te(this._lang,"dialog.color_indicators.title")}
       </div>
       <div class="dialog-body">
         <ha-markdown .content=${Te(this._lang,"dialog.color_indicators.explainer")}></ha-markdown>
       </div>
       <div class="custom-action-bar">
         <button class="dialog-btn" @click=${e}>
           <ha-icon icon="mdi:close"></ha-icon>
           <span>${Te(this._lang,"dialog.color_indicators.close")}</span>
         </button>
       </div>
     </ha-dialog>
   `}_renderToolsDialog(){const e=this._toolsDialog;if(!e)return V;return W`
      <ha-dialog
        open
        width="small"
        @closed=${()=>this._closeToolsDialog()}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${Te(this._lang,"dialog.warning")}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">${e.descriptor}</div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${()=>this._closeToolsDialog()}>
            <ha-icon icon="mdi:close"></ha-icon>
            <span>${Te(this._lang,"dialog.cancel")}</span>
          </button>
          <button class="dialog-btn" @click=${He(()=>{e.onConfirm(),this._closeToolsDialog()})}>
            <ha-ripple></ha-ripple>
            <ha-icon icon="mdi:check"></ha-icon>
            <span>${Te(this._lang,"dialog.confirm")}</span>
          </button>
        </div>
      </ha-dialog>
    `}_handleTrackingChange(e,t){const i=parseFloat(t);if(isNaN(i))return;const a=this._getState(e.entityId),o=this._getAttr(e.entityId,"logged_today");if(!0===o||"True"===o||"true"===o||this._pendingTracking.has(e.entityId)){const t=parseFloat(a);this._trackingOverrideDialog={metricKey:e.metricKey,metricLabel:e.label,oldValue:isNaN(t)?0:t,newValue:i,entityId:e.entityId}}else this._pendingTracking.add(e.entityId),this.hass&&this.hass.callService("number","set_value",{entity_id:e.entityId,value:i})}_renderTrackingOverrideDialog(){const e=this._trackingOverrideDialog;return e?W`
      <ha-dialog
        open
        width="small"
        @closed=${()=>{this._trackingOverrideDialog=null}}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${Te(this._lang,"tracking.already_set_title")}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${Te(this._lang,"tracking.already_set_body",{metric:Te(this._lang,"tracking.today_label",{metric:e.metricLabel}),oldValue:String(e.oldValue),newValue:String(e.newValue)})}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${()=>{this._trackingOverrideDialog=null}}>
            ${Te(this._lang,"tracking.cancel")}
          </button>
          <button class="dialog-btn"
                  @click=${He(()=>{this.hass&&this.hass.callService("ax_dose_logger","set_metric",{entity_id:e.entityId,value:e.newValue,override:!0}),this._trackingOverrideDialog=null})}>
            <ha-ripple></ha-ripple>
            ${Te(this._lang,"tracking.override")}
          </button>
        </div>
      </ha-dialog>
    `:V}_renderPaneSelector(e){const t=e.metrics.length>0;let i;return i="drink_master"===e.deviceType?[{id:"drinks",labelKey:"pane.drinks",icon:"alcohol"===e.substance?"mdi:glass-wine":"mdi:coffee"},{id:"graphs",labelKey:"pane.graphs",icon:"mdi:chart-bar"},{id:"inventory",labelKey:"pane.inventory",icon:"mdi:package-variant-closed"},{id:"stats",labelKey:"pane.stats",icon:"mdi:clipboard-list"},{id:"tools",labelKey:"pane.tools",icon:"mdi:wrench"}]:[{id:"daily",labelKey:"pane.daily",icon:"mdi:pill"},{id:"graphs",labelKey:"pane.graphs",icon:"mdi:chart-bar"},{id:"stats",labelKey:"pane.stats",icon:"mdi:clipboard-list"},...t?[{id:"tracking",labelKey:"pane.tracking",icon:"mdi:chart-sankey"}]:[],{id:"tools",labelKey:"pane.tools",icon:"mdi:wrench"}],W`
      <div class="pane-selector">
        ${i.map(e=>{const t=Te(this._lang,e.labelKey),i="tools"===e.id;return W`
            <button
              class="pane-btn ${this._activePane===e.id?"active":""} ${i?"tools":""}"
              aria-label=${t}
              @click=${()=>this._handlePaneChange(e.id)}
            >
              <ha-icon icon="${e.icon}"></ha-icon>
              ${i?V:W`<span>${t}</span>`}
            </button>
          `})}
      </div>
    `}willUpdate(e){if(!this.config||!this.hass)return;if(this._commitResolutionState(),this._migrateLegacyDeviceId(),!(e.has("_activePane")||e.has("config")||e.has("hass")))return;const t=this._resolveEntities();if("drink"===t.deviceType)return;"tracking"===this._activePane&&0===t.metrics.length&&(this._activePane="daily");const i="drink_master"===t.deviceType;i&&["daily","tracking"].includes(this._activePane)&&(this._activePane="drinks"),!i&&["drinks","inventory"].includes(this._activePane)&&(this._activePane="daily")}render(){if(!this.config||!this.hass)return W`<ha-card><div class="card-content">${Te("en","card.loading")}</div></ha-card>`;if(this._isMultiMedicineMode()){const e=this._resolveMedicines();if(this._viewMedicinesError())return this._renderMedicinesError();if(0===e.length&&!this._viewMedicinesError())return this._renderMedicinesError()}if(this._isMultiTrackerMode()||this._autoDiscoveryActive()){const e=this._resolveTrackers();if(this._viewTrackersError())return this._renderTrackersError();if(0===e.length&&this._autoDiscoveryIsMultiSubstance())return this._renderTrackersPlaceholder();if(0===e.length&&!this._effectiveDeviceId())return this._renderTrackersPlaceholder()}if(!this._effectiveDeviceId()&&!this._isMultiTrackerMode()&&!this._isMultiMedicineMode())return W`
        <ha-card>
          <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
            <ha-icon icon="mdi:cog" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
            <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${Te(this._lang,"card.placeholder_title")}</div>
            <div style="font-size: 14px; color: var(--secondary-text-color);">${Te(this._lang,"card.placeholder_subtitle")}</div>
          </div>
        </ha-card>
      `;const e=this._resolveEntities();if("drink"===e.deviceType){const t="alcohol"===e.substance?Te(this._lang,"drinks.redirect_alcohol"):Te(this._lang,"drinks.redirect_caffeine");return W`
        <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${!0===this.config?.big_text?"0px":"-2px"}; --pill-font-weight-boost: ${!0===this.config?.bold_text?"1.5":"1"};">
          <div class="card-content">
            <div class="caffeine-placeholder">
              <ha-icon icon=${"alcohol"===e.substance?"mdi:glass-wine":"mdi:coffee"}></ha-icon>
              <span>${t}</span>
            </div>
          </div>
        </ha-card>
      `}let t=V;if("drink_master"===e.deviceType){const i="alcohol"===e.substance?Te(this._lang,"drinks.alcohol"):Te(this._lang,"drinks.caffeine"),a=this._resolveTrackers(),o=this._activeTrackerName()||Te(this._lang,"drinks.default_profile"),n=a.length>1;t=W`
        <div class="card-title-row">
          <button class="card-title-btn"
            aria-label=${i}
            @click=${He(()=>this.showDeviceInfo())}
            @keydown=${e=>this.onKeyActivate(e,()=>this.showDeviceInfo())}
          ><ha-ripple></ha-ripple>${i}</button>
          <span class="card-title-divider" aria-hidden="true">-</span>
          <button class="card-title-btn${n?" is-selector":""}"
            aria-label=${o}
            @click=${He(()=>n?this._showProfileSwitcher=!0:this.showDeviceInfo())}
            @keydown=${e=>this.onKeyActivate(e,()=>n?this._showProfileSwitcher=!0:this.showDeviceInfo())}
          ><ha-ripple></ha-ripple><span class="card-title-name">${o}</span>${n?W`<ha-icon icon="mdi:chevron-down" class="card-title-chevron"></ha-icon>`:V}</button>
        </div>
      `}else{const i=this._isMultiMedicineMode()&&this._resolveMedicines().length>1,a=i?this._activeMedicineName():this._getMedName(e);t=W`
        <div class="card-title-row">
          <button class="card-title-btn${i?" is-selector":""}"
            aria-label=${a}
            @click=${He(()=>i?this._showMedicineSwitcher=!0:this.showDeviceInfo())}
            @keydown=${e=>this.onKeyActivate(e,()=>i?this._showMedicineSwitcher=!0:this.showDeviceInfo())}
          ><ha-ripple></ha-ripple><span class="card-title-name">${a}</span>${i?W`<ha-icon icon="mdi:chevron-down" class="card-title-chevron"></ha-icon>`:V}</button>
        </div>
      `}return W`
      <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${!0===this.config?.big_text?"0px":"-2px"}; --pill-font-weight-boost: ${!0===this.config?.bold_text?"1.5":"1"};">
        <div class="card-content">
          ${t}
          ${"daily"===this._activePane?W`<ax-dose-daily-panel .controller=${this} .entities=${e} .hass=${this.hass} .tick=${this._tick} .buttonState=${this._computeDailyButtonState(e)} .ackActive=${this._dailyAckActive} .ackCount=${this._dailyAckCount}></ax-dose-daily-panel>`:V}
          ${"graphs"===this._activePane?W`<ax-dose-graphs-panel .controller=${this} .entities=${e} .hass=${this.hass} .amountHistory=${this._amountHistory} .amountHistorySampled=${this._amountHistorySampled} .doseHistory=${this._doseHistory} .activeGraph=${this._activeGraph} .activeTimeframe=${this._activeTimeframe} .activeBarTimeframe=${this._activeBarTimeframe} .activeEffectivenessTimeframe=${this._activeEffectivenessTimeframe} .activeEffectivenessView=${this._activeEffectivenessView} .effectivenessHistory=${this._effectivenessHistory} .effectivenessVisible=${this._effectivenessVisible}></ax-dose-graphs-panel>`:V}
          ${"stats"===this._activePane?W`<ax-dose-stats-panel .controller=${this} .entities=${e} .hass=${this.hass} .tick=${this._tick}></ax-dose-stats-panel>`:V}
          ${"drinks"===this._activePane?W`<ax-dose-drinks-panel .controller=${this} .entities=${e} .hass=${this.hass} .tick=${this._tick} .buttonState=${this._computeDrinksButtonState(e)} .ackActive=${this._drinksAckActive} .ackCount=${this._drinksAckCount}></ax-dose-drinks-panel>`:V}
          ${"inventory"===this._activePane?W`<ax-dose-inventory-panel .controller=${this} .entities=${e} .hass=${this.hass} .tick=${this._tick}></ax-dose-inventory-panel>`:V}
          ${"tools"===this._activePane?W`<ax-dose-tools-panel .controller=${this} .entities=${e} .hass=${this.hass}></ax-dose-tools-panel>`:V}
          ${"tracking"===this._activePane?W`<ax-dose-tracking-panel .controller=${this} .entities=${e} .hass=${this.hass}></ax-dose-tracking-panel>`:V}
        </div>
        ${!0!==this.config?.hide_nav_bar?this._renderPaneSelector(e):V}
        ${this._showProfileSwitcher?this._renderProfileSwitcher():V}
        ${this._showMedicineSwitcher?this._renderMedicineSwitcher():V}
        ${this._showDeviceInfo?this._renderDeviceInfoDialog(e):V}
        ${this._showRefillDialog?this._renderRefillDialog(e):V}
        ${this._showLogDrinkDialog?this._renderLogDrinkDialog():V}
        ${this._showSleepDisruptionDialog?this._renderSleepDisruptionDialog():V}
        ${this._showColorExplainerDialog?this._renderColorExplainerDialog():V}
        ${this._toolsDialog?this._renderToolsDialog():V}
        ${this._overrideDialog?this._renderOverrideDialog():V}
        ${this._trackingOverrideDialog?this._renderTrackingOverrideDialog():V}
      </ha-card>
    `}connectedCallback(){super.connectedCallback(),this._connected=!0;const e=this.config?.default_view;this._activePane=e&&["daily","graphs","stats","drinks","inventory","tools","tracking"].includes(e)?e:"daily",this._activeGraph=0;const t=this.config?.amount_in_body_default_timeframe;this._activeTimeframe=t&&["12h","24h","48h","7d","14d","30d"].includes(t)?t:"48h",this._activeBarTimeframe="14d",this._activeEffectivenessTimeframe="14d",this._activeEffectivenessView="avg",this._effectivenessHistory={},this._effectivenessVisible=new Set,this._showDeviceInfo=!1,this._deviceInfoTarget=null,this._showRefillDialog=!1,this._refillAmount="",this._refillTarget=null,this._showLogDrinkDialog=!1,this._logDrinkSubstance=null,this._showSleepDisruptionDialog=!1,this._sleepDisruptionSubstance=null,this._showColorExplainerDialog=!1,this._toolsDialog=null,this._overrideDialog=null,this._overrideDialogExtras=null,this._pendingTracking.clear(),this._startTickTimer()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,this._stopTickTimer(),this._amountFetchToken++,this._doseFetchToken++,this._effectivenessFetchToken++,this._predictLowToken++,null!==this._graphsRefetchTimer&&(window.clearTimeout(this._graphsRefetchTimer),this._graphsRefetchTimer=null),void 0!==this._dailyFreezeTimer&&(window.clearTimeout(this._dailyFreezeTimer),this._dailyFreezeTimer=void 0),void 0!==this._drinksFreezeTimer&&(window.clearTimeout(this._drinksFreezeTimer),this._drinksFreezeTimer=void 0),void 0!==this._dailyAckTimer&&(window.clearTimeout(this._dailyAckTimer),this._dailyAckTimer=void 0),void 0!==this._drinksAckTimer&&(window.clearTimeout(this._drinksAckTimer),this._drinksAckTimer=void 0)}_startTickTimer(){null===this._tickTimer&&(this._tickTimer=window.setInterval(()=>{this._tick+=1},3e4))}_stopTickTimer(){null!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=null)}shouldUpdate(e){if(!this.config||!this.hass)return e.has("config")||e.has("hass");for(const t of["config","_activePane","_activeGraph","_activeTimeframe","_activeBarTimeframe","_amountHistory","_doseHistory","_activeEffectivenessTimeframe","_activeEffectivenessView","_effectivenessHistory","_effectivenessVisible","_showDeviceInfo","_deviceInfoTarget","_showRefillDialog","_refillAmount","_refillTarget","_showLogDrinkDialog","_logDrinkSubstance","_drinkLowPredictions","_showSleepDisruptionDialog","_sleepDisruptionSubstance","_showColorExplainerDialog","_toolsDialog","_overrideDialog","_trackingOverrideDialog","_showProfileSwitcher","_activeTrackerIndex","_logDrinkProfileTarget","_trackersError","_showMedicineSwitcher","_activeMedicineIndex","_medicinesError","_dailyAckActive","_dailyAckCount","_drinksAckActive","_drinksAckCount","_dailyFrozenState","_drinksFrozenState"])if(e.has(t))return!0;if(e.has("_tick")&&("daily"===this._activePane||"stats"===this._activePane||"drinks"===this._activePane||"inventory"===this._activePane))return!0;if(e.has("hass")){const t=e.get("hass");return this._relevantStateChanged(t)}return!1}_relevantStateChanged(e){if(!this.hass)return!1;if(!e)return!0;const t=this._resolveEntities(),i=[];for(const e of Object.values(t))"string"==typeof e&&e&&i.push(e);for(const e of this._getChipEntities())e.entityId&&i.push(e.entityId);for(const e of this._getDrinkChipEntities())e.entityId&&i.push(e.entityId);if("inventory"===this._activePane&&t.substance)for(const e of this._getDrinksOfSubstance(t.substance))e.stockEntityId&&i.push(e.stockEntityId),e.addStockEntityId&&i.push(e.addStockEntityId),e.avg7EntityId&&i.push(e.avg7EntityId),e.avg365EntityId&&i.push(e.avg365EntityId),e.daysLeftEntityId&&i.push(e.daysLeftEntityId);const a=this.hass.states,o=e.states;for(const e of i){const t=a[e],i=o[e];if(t!==i)return!0;if(void 0===t!=(void 0===i))return!0}return!1}updated(e){if(super.updated(e),"graphs"===this._activePane&&this.config&&this.hass){const t=this._resolveEntities();e.has("_activePane")?(this._fetchAmountHistory(t),this._fetchDoseHistory(t),t.metrics.length&&(this._effectivenessHistory={},this._fetchEffectivenessHistory(t))):e.has("_activeTimeframe")?(this._amountHistory=[],this._fetchAmountHistory(t)):e.has("_activeEffectivenessTimeframe")?t.metrics.length&&(this._effectivenessHistory={},this._fetchEffectivenessHistory(t)):e.has("hass")&&(null!==this._graphsRefetchTimer&&window.clearTimeout(this._graphsRefetchTimer),this._graphsRefetchTimer=window.setTimeout(()=>{if(this._graphsRefetchTimer=null,!this._connected)return;const e=this._resolveEntities();this._fetchDoseHistory(e),this._fetchAmountHistory(e),e.metrics.length&&this._fetchEffectivenessHistory(e)},st.GRAPHS_REFETCH_DEBOUNCE_MS))}if(this.hass&&this._pendingTracking.size>0)for(const e of this._pendingTracking){!0===this._getAttr(e,"logged_today")&&this._pendingTracking.delete(e)}}getCardSize(){switch(this._activePane){case"graphs":case"inventory":return 8;case"stats":return 7;case"tools":case"tracking":case"drinks":return 6;default:return 5}}getGridOptions(){return{columns:12,min_rows:4}}static getConfigForm(){return Xe(),{schema:[{name:"medicine_devices",selector:{device:{multiple:!0,filter:{integration:"ax_dose_logger"}}}},{name:"drink_tracker_devices",selector:{device:{multiple:!0,filter:{integration:"ax_dose_logger"}}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"color_scheme",selector:{select:{options:[{value:"default",label:Te("en","color.default")},{value:"yellow",label:Te("en","color.yellow")},{value:"purple",label:Te("en","color.purple")},{value:"pink",label:Te("en","color.pink")},{value:"teal",label:Te("en","color.teal")},{value:"brown",label:Te("en","color.brown")},{value:"coral",label:Te("en","color.coral")},{value:"slate",label:Te("en","color.slate")},{value:"gold",label:Te("en","color.gold")},{value:"grey",label:Te("en","color.grey")},{value:"red",label:Te("en","color.red")+" *"},{value:"blue",label:Te("en","color.blue")+" *"},{value:"orange",label:Te("en","color.orange")+" *"},{value:"green",label:Te("en","color.green")+" *"}]}}},{name:"default_view",selector:{select:{options:[{value:"daily",label:Te("en","pane.daily")},{value:"graphs",label:Te("en","pane.graphs")},{value:"stats",label:Te("en","pane.stats")},{value:"drinks",label:Te("en","pane.drinks")},{value:"inventory",label:Te("en","pane.inventory")},{value:"tools",label:Te("en","pane.tools")},{value:"tracking",label:Te("en","pane.tracking")}]}}}]},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"show_color_indicator_explainer",default:!0,selector:{boolean:{}}},{name:"hide_nav_bar",selector:{boolean:{}}}]},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"big_text",selector:{boolean:{}}},{name:"bold_text",selector:{boolean:{}}}]},{type:"expandable",name:"daily_panel",flatten:!0,schema:[{type:"grid",name:"",column_min_width:"200px",schema:[{name:"take_pill_icon",selector:{icon:{}}},{name:"take_pill_label",selector:{text:{}}}]},{type:"expandable",name:"safe_to_take_box",title:"Top Box",flatten:!0,schema:[{name:"safe_to_take_show_amount_in_body",selector:{boolean:{}}},{name:"safe_to_take_entity",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"safe_to_take_icon",selector:{icon:{}}},{name:"safe_to_take_label",selector:{text:{}}}]},{name:"safe_to_take_tap_action",selector:{ui_action:{}}},{name:"safe_to_take_hold_action",selector:{ui_action:{}}},{name:"safe_to_take_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"pills_left_box",title:"Bottom Box",flatten:!0,schema:[{name:"pills_left_show_days_left",selector:{boolean:{}}},{name:"pills_left_entity",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"pills_left_icon",selector:{icon:{}}},{name:"pills_left_label",selector:{text:{}}}]},{name:"pills_left_tap_action",selector:{ui_action:{}}},{name:"pills_left_hold_action",selector:{ui_action:{}}},{name:"pills_left_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"chips",title:"Custom Boxes",flatten:!0,schema:[{type:"expandable",name:"chip_1_box",title:Te("en","config.chip_1_box"),flatten:!0,schema:[{name:"chip_1_show_icon",label:Te("en","config.chip_1_show_icon"),helper:Te("en","config.helper.chip_show_icon"),selector:{boolean:{}}},{name:"chip_1",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"180px",schema:[{name:"chip_1_icon",selector:{icon:{}}},{name:"chip_1_label",selector:{text:{}}}]},{name:"chip_1_tap_action",selector:{ui_action:{}}},{name:"chip_1_hold_action",selector:{ui_action:{}}},{name:"chip_1_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"chip_2_box",title:Te("en","config.chip_2_box"),flatten:!0,schema:[{name:"chip_2_show_icon",label:Te("en","config.chip_2_show_icon"),helper:Te("en","config.helper.chip_show_icon"),selector:{boolean:{}}},{name:"chip_2",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"180px",schema:[{name:"chip_2_icon",selector:{icon:{}}},{name:"chip_2_label",selector:{text:{}}}]},{name:"chip_2_tap_action",selector:{ui_action:{}}},{name:"chip_2_hold_action",selector:{ui_action:{}}},{name:"chip_2_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"chip_3_box",title:Te("en","config.chip_3_box"),flatten:!0,schema:[{name:"chip_3_show_icon",label:Te("en","config.chip_3_show_icon"),helper:Te("en","config.helper.chip_show_icon"),selector:{boolean:{}}},{name:"chip_3",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"180px",schema:[{name:"chip_3_icon",selector:{icon:{}}},{name:"chip_3_label",selector:{text:{}}}]},{name:"chip_3_tap_action",selector:{ui_action:{}}},{name:"chip_3_hold_action",selector:{ui_action:{}}},{name:"chip_3_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"chip_4_box",title:Te("en","config.chip_4_box"),flatten:!0,schema:[{name:"chip_4_show_icon",label:Te("en","config.chip_4_show_icon"),helper:Te("en","config.helper.chip_show_icon"),selector:{boolean:{}}},{name:"chip_4",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"180px",schema:[{name:"chip_4_icon",selector:{icon:{}}},{name:"chip_4_label",selector:{text:{}}}]},{name:"chip_4_tap_action",selector:{ui_action:{}}},{name:"chip_4_hold_action",selector:{ui_action:{}}},{name:"chip_4_double_tap_action",selector:{ui_action:{}}}]}]},{type:"expandable",name:"take_button_box",title:Te("en","config.button"),flatten:!0,schema:[{type:"grid",name:"",column_min_width:"200px",schema:[{name:"take_button_lockout_style",default:"auto",selector:{select:{options:We(),mode:"dropdown"}}},{name:"take_button_lockout_icon_style",default:"auto",selector:{select:{options:je(),mode:"dropdown"}}}]},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"take_button_execution_style",default:"auto",selector:{select:{options:We(),mode:"dropdown"}}},{name:"take_button_execution_icon_style",default:"auto",selector:{select:{options:je(),mode:"dropdown"}}}]},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"take_button_latency_style",default:"auto",selector:{select:{options:We(),mode:"dropdown"}}},{name:"take_button_latency_icon_style",default:"auto",selector:{select:{options:je(),mode:"dropdown"}}}]},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"take_button_ack_layout",default:"top",selector:{select:{options:Ge(),mode:"dropdown"}}},{name:"take_button_ack_duration_ms",default:3e3,selector:{number:{min:500,max:1e4,step:100}}}]},{name:"take_button_ring_speed",default:"medium",selector:{select:{options:Ve(),mode:"dropdown"}}}]}]},{type:"expandable",name:"drinks_panel",flatten:!0,schema:[{type:"grid",name:"",column_min_width:"200px",schema:[{name:"log_drink_icon",selector:{icon:{}}},{name:"log_drink_label",selector:{text:{}}}]},{type:"expandable",name:"in_body_box",title:"Top Box",flatten:!0,schema:[{name:"in_body_entity",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"in_body_icon",selector:{icon:{}}},{name:"in_body_label",selector:{text:{}}}]},{name:"in_body_tap_action",selector:{ui_action:{}}},{name:"in_body_hold_action",selector:{ui_action:{}}},{name:"in_body_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"disruption_box",title:"Bottom Box",flatten:!0,schema:[{name:"disruption_mode",selector:{select:{options:[{value:"disruption",label:Te("en","config.disruption_mode_disruption")},{value:"low_timestamp",label:Te("en","config.disruption_mode_low_timestamp")},{value:"low_hours_until",label:Te("en","config.disruption_mode_low_hours_until")}]}}},{name:"disruption_entity",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"disruption_icon",selector:{icon:{}}},{name:"disruption_label",selector:{text:{}}}]},{name:"disruption_tap_action",selector:{ui_action:{}}},{name:"disruption_hold_action",selector:{ui_action:{}}},{name:"disruption_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"drink_chips",title:"Custom Boxes",flatten:!0,schema:[{type:"expandable",name:"drink_chip_1_box",title:Te("en","config.chip_1_box"),flatten:!0,schema:[{name:"drink_chip_1_show_icon",label:Te("en","config.drink_chip_1_show_icon"),helper:Te("en","config.helper.chip_show_icon"),selector:{boolean:{}}},{name:"drink_chip_1",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"180px",schema:[{name:"drink_chip_1_icon",selector:{icon:{}}},{name:"drink_chip_1_label",selector:{text:{}}}]},{name:"drink_chip_1_tap_action",selector:{ui_action:{}}},{name:"drink_chip_1_hold_action",selector:{ui_action:{}}},{name:"drink_chip_1_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"drink_chip_2_box",title:Te("en","config.chip_2_box"),flatten:!0,schema:[{name:"drink_chip_2_show_icon",label:Te("en","config.drink_chip_2_show_icon"),helper:Te("en","config.helper.chip_show_icon"),selector:{boolean:{}}},{name:"drink_chip_2",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"180px",schema:[{name:"drink_chip_2_icon",selector:{icon:{}}},{name:"drink_chip_2_label",selector:{text:{}}}]},{name:"drink_chip_2_tap_action",selector:{ui_action:{}}},{name:"drink_chip_2_hold_action",selector:{ui_action:{}}},{name:"drink_chip_2_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"drink_chip_3_box",title:Te("en","config.chip_3_box"),flatten:!0,schema:[{name:"drink_chip_3_show_icon",label:Te("en","config.drink_chip_3_show_icon"),helper:Te("en","config.helper.chip_show_icon"),selector:{boolean:{}}},{name:"drink_chip_3",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"180px",schema:[{name:"drink_chip_3_icon",selector:{icon:{}}},{name:"drink_chip_3_label",selector:{text:{}}}]},{name:"drink_chip_3_tap_action",selector:{ui_action:{}}},{name:"drink_chip_3_hold_action",selector:{ui_action:{}}},{name:"drink_chip_3_double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"drink_chip_4_box",title:Te("en","config.chip_4_box"),flatten:!0,schema:[{name:"drink_chip_4_show_icon",label:Te("en","config.drink_chip_4_show_icon"),helper:Te("en","config.helper.chip_show_icon"),selector:{boolean:{}}},{name:"drink_chip_4",selector:{entity:{}}},{type:"grid",name:"",column_min_width:"180px",schema:[{name:"drink_chip_4_icon",selector:{icon:{}}},{name:"drink_chip_4_label",selector:{text:{}}}]},{name:"drink_chip_4_tap_action",selector:{ui_action:{}}},{name:"drink_chip_4_hold_action",selector:{ui_action:{}}},{name:"drink_chip_4_double_tap_action",selector:{ui_action:{}}}]}]},{type:"expandable",name:"drink_button_box",title:Te("en","config.button"),flatten:!0,schema:[{type:"grid",name:"",column_min_width:"200px",schema:[{name:"drink_button_lockout_style",default:"auto",selector:{select:{options:We(),mode:"dropdown"}}},{name:"drink_button_lockout_icon_style",default:"auto",selector:{select:{options:je(),mode:"dropdown"}}}]},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"drink_button_ack_layout",default:"top",selector:{select:{options:Ge(),mode:"dropdown"}}},{name:"drink_button_ack_duration_ms",default:3e3,selector:{number:{min:500,max:1e4,step:100}}}]},{name:"drink_button_ring_speed",default:"medium",selector:{select:{options:Ve(),mode:"dropdown"}}}]}]},{type:"expandable",name:"graphs_panel",flatten:!0,schema:[{name:"show_amount_in_body",selector:{boolean:{}},default:!0},{name:"amount_in_body_default_timeframe",selector:{select:{options:[{value:"12h",label:"12 Hours"},{value:"24h",label:"24 Hours"},{value:"48h",label:"48 Hours"},{value:"7d",label:"7 Days"},{value:"14d",label:"14 Days"},{value:"30d",label:"30 Days"}]}}},{type:"grid",name:"",column_min_width:"200px",schema:[{name:"show_day_avg_boxes",selector:{boolean:{}},default:!0},{name:"show_adherence_boxes",selector:{boolean:{}},default:!0}]}]},{type:"expandable",name:"stats_panel",flatten:!0,schema:[{name:"stats_3_columns",selector:{boolean:{}}}]},{type:"expandable",name:"settings_panel",flatten:!0,schema:[{name:"confirm_tool_actions",selector:{boolean:{}},default:!0}]}],computeLabel:(e,t,i)=>{const a=i?.language||"en";return"grid"!==e.type&&e.name?"chip_1"===e.name||"chip_2"===e.name||"chip_3"===e.name||"chip_4"===e.name||"drink_chip_1"===e.name||"drink_chip_2"===e.name||"drink_chip_3"===e.name||"drink_chip_4"===e.name?Te(a,"config.box_settings"):Te(a,"config."+e.name):""},computeHelper:(e,t,i)=>{const a=i?.language||"en",o=e.name;return"grid"!==e.type&&"expandable"!==e.type&&e.selector?o?.startsWith("chip_")&&o?.endsWith("_icon")?Te(a,"config.helper.chip_icon"):o?.startsWith("chip_")&&o?.endsWith("_tap_action")?Te(a,"config.helper.chip_tap_action"):o?.startsWith("chip_")&&(o?.endsWith("_hold_action")||o?.endsWith("_double_tap_action"))?Te(a,"config.helper.chip_hold_action"):o?.startsWith("chip_")&&o?.endsWith("_label")?Te(a,"config.helper.chip_label"):o?.startsWith("chip_")?Te(a,"config.helper.chip"):o?.startsWith("drink_chip_")&&o?.endsWith("_icon")?Te(a,"config.helper.chip_icon"):o?.startsWith("drink_chip_")&&o?.endsWith("_tap_action")?Te(a,"config.helper.chip_tap_action"):o?.startsWith("drink_chip_")&&(o?.endsWith("_hold_action")||o?.endsWith("_double_tap_action"))?Te(a,"config.helper.chip_hold_action"):o?.startsWith("drink_chip_")&&o?.endsWith("_label")?Te(a,"config.helper.drink_chip_label"):o?.startsWith("drink_chip_")?Te(a,"config.helper.drink_chip"):Te(a,"config.helper."+o):""}}}static getStubConfig(){return{medicine_devices:[],show_amount_in_body:!0}}}st.GRAPHS_REFETCH_DEBOUNCE_MS=500,st.styles=r`
    :host {
      display: block;
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         on dialog action buttons (1:1 parity with Lovelace Mushroom cards). */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
    }

    /* ── Unified Card Title ──
       Shown at the top of .card-content on every pane for both card types
       (Drink Master and Medicine), so the title is consistent across all
       panels. For Drink Master (N>=1): two invisible buttons (substance +
       profile) separated by a '-' divider, with a trailing chevron-down on
       the profile button when N>1. For Medicine: a single centered button
       showing "MedName - Strength". Typography: 20px, weight 600, with
       ha-ripple press feedback. Replaces the old card-header
       .profile-switcher-bar (N>1 only), the per-pane .drinks-title, and the
       per-Daily-pane .med-name div. */
    .card-title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: calc(20px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      z-index: 1;  /* global z-axis protection — glow bleeds behind title */
    }
    .card-title-btn {
      position: relative;
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 12px);
      border: none;
      background: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
    }
    .card-title-btn:hover {
      background: var(--secondary-background-color, rgba(0,0,0,0.04));
    }
    .card-title-divider {
      opacity: 0.5;
      user-select: none;
    }
    .card-title-name {
       /* profile name text — inherits title typography from the button */
     }
    .card-title-chevron {
      --mdc-icon-size: 18px;
      opacity: 0.6;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    ha-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .card-content {
      padding: 10px 16px 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1 1 auto;
    }

    /* ── Pane Selector ─────────────────────── */

    .pane-selector {
      display: flex;
      border-top: 1px solid var(--divider-color, rgba(0,0,0,0.1));
      /* Solidified opaque surface — the same alpha-channel transmission bug
         that affected .stat-pill/.chip applies here at the card-root level:
         .pane-selector is a sibling of .card-content (which contains the
         .glow-backdrop), and the 9px+8px glow diffusion bleeds past the
         bottom of .card-content into the nav bar's territory. With
         background:none the glow was visible THROUGH the transparent nav bar
         despite correct z-index:1 (z-index controls paint ORDER, opacity
         controls paint BLENDING). An opaque background-color matching the
         card bg fully occludes the backlight. See plans/
         gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      position: relative;  /* global z-axis protection — glow bleeds behind nav bar (Patch 1, belt-and-suspenders) */
      z-index: 1;
    }

    .pane-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 8px;
      border: none;
      background: none;
      color: var(--secondary-text-color, #666);
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-family: inherit;
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      cursor: pointer;
      transition: color 0.2s, background 0.2s, box-shadow 0.2s;
      border-bottom: 2px solid transparent;
    }

    .pane-btn.tools {
      flex: 0 0 auto;
      min-width: 44px;
      padding: 12px;
    }

    .pane-btn:hover {
      color: var(--primary-text-color, #222);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
    }

    .pane-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
    }

    .pane-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* ── Pane 3: Stats ──────────────────────── */

    /* ── Dialog content (ha-dialog provides scrim/surface/heading) ─── */

    .dialog-body {
      padding: 8px 0;
    }

    .dialog-body--center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }

    /* Device-info dialog: stacked buttons kept narrow (half-width) and
       centered, since they no longer share a row. Scoped to
       .dialog-body--center (used only by the device-info dialog) so the
       full-width .dialog-btn in other dialogs is unaffected. */
    .dialog-body--center .dialog-btn {
      width: 50%;
      box-sizing: border-box;
    }

    /* Sleep Disruption popup — live Disruption + ETA Low summary box
       above the band-description markdown.  Mirrors the card's
       primary-tinted surface (rgba primary 0.06) used by .stat-pill /
       .avg-cell so the summary reads as a card-native stat box. */
    .disruption-summary {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 10px 12px;
      margin-bottom: 12px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: 10px;
    }

    .disruption-summary-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .disruption-summary-label {
      font-size: calc(13px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #727272);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .disruption-summary-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    /* Dialog header (slot="header" for HA 2026.3+ Material 3 compatibility).
       Pre-2026.3 used the .heading property / slot="heading"; HA 2026.3
       renamed the slot to "header". Using the slot element works on both. */
    .dialog-header {
      font-size: 1.5rem;
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
      text-align: center;
    }

    .dialog-header--warning {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--error-color, #db4437);
    }

    .dialog-header--warning ha-icon {
      --mdc-icon-size: 28px;
    }

    .dialog-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
      font-size: 16px;
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s;
      /* position:relative + overflow:hidden clip the ha-ripple surface to the
         button's rounded border (MdRipple geometry requirement). */
      position: relative;
      overflow: hidden;
    }

    .dialog-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
    }

    .dialog-btn ha-icon {
      --mdc-icon-size: 24px;
    }

    /* ── Log Drink popup (Master Tracker) ───── */

    .log-drink-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .log-drink-btn {
      flex-direction: column;
      gap: 6px;
      padding: 14px 8px;
      font-size: calc(14px + var(--pill-text-offset, 0px));
    }
    .log-drink-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .log-drink-name {
      font-weight: calc(550 * var(--pill-font-weight-boost, 1));
      text-align: center;
    }
    /* Predicted Low-band timestamp under each drink name ("Low: hh:mm" /
       "Low: —" while loading or when the drink would not lift body-mass
       above the Low band). Muted + smaller so the name stays primary. */
    .log-drink-low {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      color: var(--secondary-text-color, rgba(0,0,0,0.5));
      text-align: center;
    }

    /* ── Refill Dialog ──────────────────────── */

    .refill-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--divider-color, rgba(0,0,0,0.1));
      border-radius: var(--ha-card-border-radius, 12px);
      font-size: 18px;
      font-family: inherit;
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
      box-sizing: border-box;
    }

    .refill-input:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    .dialog-btn--muted {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      color: var(--secondary-text-color, #666);
    }

    .dialog-btn--muted:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .tools-dialog-descriptor {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      color: var(--primary-text-color, #222);
      line-height: 1.5;
      text-align: center;
    }

    /* Custom flexbox action bar replacing ha-dialog-footer. HA's native
       <ha-dialog-footer> forces right-aligned primaryAction/secondaryAction
       slots with hard-coded asymmetrical Shadow DOM padding that can't be
       cleanly overridden. This standard DOM flexbox centers the buttons as a
       pair, matching the card's original dialog layout. */
    .custom-action-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 20px;
      width: 100%;
    }
  `,e([_e({attribute:!1})],st.prototype,"hass",void 0),e([_e({attribute:!1})],st.prototype,"config",void 0),e([ue()],st.prototype,"_activePane",void 0),e([ue()],st.prototype,"_activeGraph",void 0),e([ue()],st.prototype,"_amountHistory",void 0),e([ue()],st.prototype,"_amountHistorySampled",void 0),e([ue()],st.prototype,"_doseHistory",void 0),e([ue()],st.prototype,"_showDeviceInfo",void 0),e([ue()],st.prototype,"_showRefillDialog",void 0),e([ue()],st.prototype,"_refillAmount",void 0),e([ue()],st.prototype,"_refillTarget",void 0),e([ue()],st.prototype,"_deviceInfoTarget",void 0),e([ue()],st.prototype,"_showLogDrinkDialog",void 0),e([ue()],st.prototype,"_logDrinkSubstance",void 0),e([ue()],st.prototype,"_drinkLowPredictions",void 0),e([ue()],st.prototype,"_logDrinkProfileTarget",void 0),e([ue()],st.prototype,"_showSleepDisruptionDialog",void 0),e([ue()],st.prototype,"_sleepDisruptionSubstance",void 0),e([ue()],st.prototype,"_showColorExplainerDialog",void 0),e([ue()],st.prototype,"_dailyAckActive",void 0),e([ue()],st.prototype,"_drinksAckActive",void 0),e([ue()],st.prototype,"_dailyAckCount",void 0),e([ue()],st.prototype,"_drinksAckCount",void 0),e([ue()],st.prototype,"_dailyFrozenState",void 0),e([ue()],st.prototype,"_drinksFrozenState",void 0),e([ue()],st.prototype,"_activeTimeframe",void 0),e([ue()],st.prototype,"_activeBarTimeframe",void 0),e([ue()],st.prototype,"_activeEffectivenessTimeframe",void 0),e([ue()],st.prototype,"_activeEffectivenessView",void 0),e([ue()],st.prototype,"_effectivenessHistory",void 0),e([ue()],st.prototype,"_effectivenessVisible",void 0),e([ue()],st.prototype,"_toolsDialog",void 0),e([ue()],st.prototype,"_overrideDialog",void 0),e([ue()],st.prototype,"_trackingOverrideDialog",void 0),e([ue()],st.prototype,"_tick",void 0),e([ue()],st.prototype,"_activeTrackerIndex",void 0),e([ue()],st.prototype,"_trackersError",void 0),e([ue()],st.prototype,"_showProfileSwitcher",void 0),e([ue()],st.prototype,"_activeMedicineIndex",void 0),e([ue()],st.prototype,"_medicinesError",void 0),e([ue()],st.prototype,"_showMedicineSwitcher",void 0),customElements.define("ax-dose-logger-card",st),window.customCards=window.customCards||[],window.customCards.push({type:"ax-dose-logger-card",name:"AX Dose Logger Card",preview:!0,description:"A custom card for the AX Dose Logger integration — track medications, view dose graphs, and monitor statistics.",documentationURL:"https://github.com/Axildor/AX-Dose-Logger-Card"});export{st as AxDoseLoggerCard};
