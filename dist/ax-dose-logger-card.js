/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

function computeDomain(entityId) {
    return entityId.substr(0, entityId.indexOf("."));
}

var NumberFormat;
(function (NumberFormat) {
    NumberFormat["language"] = "language";
    NumberFormat["system"] = "system";
    NumberFormat["comma_decimal"] = "comma_decimal";
    NumberFormat["decimal_comma"] = "decimal_comma";
    NumberFormat["space_comma"] = "space_comma";
    NumberFormat["none"] = "none";
})(NumberFormat || (NumberFormat = {}));
var TimeFormat;
(function (TimeFormat) {
    TimeFormat["language"] = "language";
    TimeFormat["system"] = "system";
    TimeFormat["am_pm"] = "12";
    TimeFormat["twenty_four"] = "24";
})(TimeFormat || (TimeFormat = {}));

// REF: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/use_am_pm.ts
/**
 * Checking if AM/PM time format is used within the browser.
 * @param locale Homeassistant frontend locale data
 * @returns
 */
const useAmPm = (locale) => {
    if (locale.time_format === TimeFormat.language ||
        locale.time_format === TimeFormat.system) {
        const testLanguage = locale.time_format === TimeFormat.language ? locale.language : undefined;
        const test = new Date().toLocaleString(testLanguage);
        return test.includes("AM") || test.includes("PM");
    }
    return locale.time_format === TimeFormat.am_pm;
};

//REF: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/format_date_time.ts
// August 9, 2021, 8:23 AM
/**
 * Formatting a dateObject to date with time e.g. August 9, 2021, 8:23 AM
 * @param dateObj The date to convert
 * @param locale The users's locale settings
 * @returns month and day like "August 9, 2021, 8:23 AM"
 */
const formatDateTime = (dateObj, locale) => formatDateTimeMem(locale).format(dateObj);
const formatDateTimeMem = (locale) => new Intl.DateTimeFormat(locale.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: useAmPm(locale) ? "numeric" : "2-digit",
    minute: "2-digit",
    hour12: useAmPm(locale),
});

//REF: https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/format_time.ts
/**
 * 9:15 PM or 21:15
 * @param dateObj The time to convert
 * @param locale  The users's locale settings
 * @returns Reformated time in hh:mm
 */
const formatTime = (dateObj, locale) => formatTimeMem(locale).format(dateObj);
const formatTimeMem = (locale) => new Intl.DateTimeFormat(locale.language, {
    hour: "numeric",
    minute: "2-digit",
    hour12: useAmPm(locale),
});
/** States that we consider "off". */
const STATES_OFF = ["closed", "locked", "off"];

// Polymer legacy event helpers used courtesy of the Polymer project.
//
// Copyright (c) 2017 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/**
 * Dispatches a custom event with an optional detail value.
 *
 * @param {string} type Name of event type.
 * @param {*=} detail Detail value containing event-specific
 *   payload.
 * @param {{ bubbles: (boolean|undefined),
 *           cancelable: (boolean|undefined),
 *           composed: (boolean|undefined) }=}
 *  options Object specifying options.  These may include:
 *  `bubbles` (boolean, defaults to `true`),
 *  `cancelable` (boolean, defaults to false), and
 *  `node` on which to fire the event (HTMLElement, defaults to `this`).
 * @return {Event} The new event that was fired.
 */
const fireEvent = (node, type, detail, options) => {
    options = options || {};
    // @ts-ignore
    detail = detail === null || detail === undefined ? {} : detail;
    const event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
};

const forwardHaptic = (hapticType) => {
    fireEvent(window, "haptic", hapticType);
};

const navigate = (_node, path, replace = false) => {
    if (replace) {
        history.replaceState(null, "", path);
    }
    else {
        history.pushState(null, "", path);
    }
    fireEvent(window, "location-changed", {
        replace
    });
};

const turnOnOffEntity = (hass, entityId, turnOn = true) => {
    const stateDomain = computeDomain(entityId);
    const serviceDomain = stateDomain === "group" ? "homeassistant" : stateDomain;
    let service;
    switch (stateDomain) {
        case "lock":
            service = turnOn ? "unlock" : "lock";
            break;
        case "cover":
            service = turnOn ? "open_cover" : "close_cover";
            break;
        default:
            service = turnOn ? "turn_on" : "turn_off";
    }
    return hass.callService(serviceDomain, service, { entity_id: entityId });
};

const toggleEntity = (hass, entityId) => {
    const turnOn = STATES_OFF.includes(hass.states[entityId].state);
    return turnOnOffEntity(hass, entityId, turnOn);
};

const handleActionConfig = (node, hass, config, actionConfig) => {
    if (!actionConfig) {
        actionConfig = {
            action: "more-info",
        };
    }
    if (actionConfig.confirmation &&
        (!actionConfig.confirmation.exemptions ||
            !actionConfig.confirmation.exemptions.some((e) => e.user === hass.user.id))) {
        forwardHaptic("warning");
        if (!confirm(actionConfig.confirmation.text ||
            `Are you sure you want to ${actionConfig.action}?`)) {
            return;
        }
    }
    switch (actionConfig.action) {
        case "more-info":
            if (config.entity || config.camera_image) {
                fireEvent(node, "hass-more-info", {
                    entityId: config.entity ? config.entity : config.camera_image,
                });
            }
            break;
        case "navigate":
            if (actionConfig.navigation_path) {
                navigate(node, actionConfig.navigation_path);
            }
            break;
        case "url":
            if (actionConfig.url_path) {
                window.open(actionConfig.url_path);
            }
            break;
        case "toggle":
            if (config.entity) {
                toggleEntity(hass, config.entity);
                forwardHaptic("success");
            }
            break;
        case "call-service": {
            if (!actionConfig.service) {
                forwardHaptic("failure");
                return;
            }
            const [domain, service] = actionConfig.service.split(".", 2);
            hass.callService(domain, service, actionConfig.service_data, actionConfig.target);
            forwardHaptic("success");
            break;
        }
        case "fire-dom-event": {
            fireEvent(node, "ll-custom", actionConfig);
        }
    }
};
const handleAction = (node, hass, config, action) => {
    let actionConfig;
    if (action === "double_tap" && config.double_tap_action) {
        actionConfig = config.double_tap_action;
    }
    else if (action === "hold" && config.hold_action) {
        actionConfig = config.hold_action;
    }
    else if (action === "tap" && config.tap_action) {
        actionConfig = config.tap_action;
    }
    handleActionConfig(node, hass, config, actionConfig);
};

// Lightweight localization helper for the AX Dose Logger card.
// Currently English-only; adding a new language is just adding
// another key to the `translations` object.
const translations = {
    en: {
        // ── Card-level ──
        'card.loading': 'Loading...',
        'card.placeholder_title': 'AX Dose Logger Card',
        'card.placeholder_subtitle': 'Please select a device in the visual editor to begin.',
        // ── Pane tabs ──
        'pane.daily': 'Daily',
        'pane.graphs': 'Graphs',
        'pane.stats': 'Stats',
        'pane.tools': 'Tools',
        'pane.caffeine': 'Caffeine',
        'pane.drinks': 'Drinks',
        'pane.inventory': 'Inventory',
        // ── Daily pane ──
        'daily.take_pill': 'Take Pill',
        'daily.limit_reached': 'LIMIT REACHED',
        'daily.last': 'Last',
        'daily.next': 'Next',
        'daily.overdue': 'Overdue',
        'daily.safe_to_take': 'Safe to take',
        'daily.pills_left': 'Pills left',
        'daily.na': 'N/A',
        // ── Graphs pane ──
        'graphs.bar_title': '{days}-day taken tracker',
        'graphs.line_title': 'Amount in Body',
        'graphs.empty_bar': 'No dose data yet',
        'graphs.empty_effectiveness': 'No effectiveness data yet',
        'graphs.effectiveness_title': 'Effectiveness',
        'graphs.effectiveness_avg': 'Avg',
        'graphs.effectiveness_individual': 'Individual',
        'graphs.loading_history': 'Loading history...',
        'graphs.timeframe_12h': '12H',
        'graphs.timeframe_24h': '24H',
        'graphs.timeframe_48h': '48H',
        'graphs.timeframe_7d': '7D',
        'graphs.timeframe_14d': '14D',
        'graphs.timeframe_30d': '30D',
        'graphs.timeframe_60d': '60D',
        'graphs.aria_prev': 'Previous graph',
        'graphs.aria_next': 'Next graph',
        // ── Stats pane ──
        'stats.total_doses': 'Total Doses',
        'stats.days_since_first_dose': 'Days Since First Dose',
        'stats.last_dose': 'Last Dose',
        'stats.strength': 'Strength',
        'stats.amount_in_body': 'Amount in Body',
        'stats.steady_state': 'Steady State',
        'stats.steady_state_reached': 'Reached ✓',
        'stats.steady_state_days': '{days} days',
        'stats.avg_7_day': '7-Day Average',
        'stats.avg_14_day': '14-Day Average',
        'stats.avg_30_day': '30-Day Average',
        'stats.avg_yearly': 'Yearly Average',
        'stats.avg_running': '{days}-Day Average',
        'stats.adherence_7_day': '7-Day Adherence',
        'stats.adherence_14_day': '14-Day Adherence',
        'stats.adherence_30_day': '30-Day Adherence',
        'stats.adherence_365_day': '365-Day Adherence',
        'stats.adherence_running': '{days}-Day Adherence',
        'stats.amount_last_24h': 'Amount in Last 24h',
        'stats.sleep_disruption': 'Sleep Disruption',
        'stats.estimated_low_time': 'Estimated Low Time',
        // ── Averages grid (short labels) ──
        'averages.avg_7_day': '7-Day Avg',
        'averages.avg_14_day': '14-Day Avg',
        'averages.avg_30_day': '30-Day Avg',
        'averages.avg_year': 'Year Avg',
        'averages.avg_running': '{days}-Day Avg',
        'averages.adh_7_day': '7d Adh',
        'averages.adh_14_day': '14d Adh',
        'averages.adh_30_day': '30d Adh',
        'averages.adh_365_day': '365d Adh',
        'averages.adh_running': '{days}d Adh',
        // ── Drinks pane (Master Tracker) ──
        'drinks.caffeine': 'Caffeine',
        'drinks.alcohol': 'Alcohol',
        'drinks.log_drink': 'Log Drink',
        'drinks.in_body': 'In Body',
        'drinks.disruption': 'Disruption',
        'drinks.sleep_disruption': 'Sleep Disruption',
        'drinks.redirect_caffeine': 'Please select the Caffeine device to view this drink.',
        'drinks.redirect_alcohol': 'Please select the Alcohol device to view this drink.',
        // ── Inventory pane (Master Tracker) ──
        'inventory.empty': 'No drinks of this category configured.',
        'inventory.avg_7_day': '7-Day Avg',
        // ── Caffeine pane (legacy scaffold, retained one release) ──
        'caffeine.placeholder': 'Caffeine tracking — coming soon',
        // ── Tracking pane ──
        'pane.tracking': 'Tracking',
        'tracking.today_label': "Today's {metric}",
        'tracking.not_set': 'Not set',
        'tracking.set_today': 'Set for today',
        'tracking.already_set_title': 'Already Set Today',
        'tracking.already_set_body': "You already set {metric} to {oldValue} today. Change to {newValue}?",
        'tracking.override': 'Override',
        'tracking.cancel': 'Cancel',
        // ── Tools pane ──
        'tools.adherence_header': 'Adherence Tools',
        'tools.general_header': 'General Tools',
        'tools.reset_adherence': 'Reset Adherence %',
        'tools.mark_adherence_taken': 'Mark Last Adherence Taken',
        'tools.reset_history': 'Reset History',
        'tools.undo_dose': 'Undo Dose',
        'tools.empty': 'No maintenance tools available for this medication.',
        // ── Tools dialog descriptors ──
        'tools.desc.reset_adherence': 'Clears the adherence percentage history for all windows. Does NOT affect Amount in Body, dose count, or any other sensor.',
        'tools.desc.mark_adherence_taken': 'Marks the most recent missed dose slot as taken for adherence calculation only. Does NOT add a dose to the pharmacokinetics model or dose count.',
        'tools.desc.reset_history': 'Clears ALL dose history across every sensor — adherence, Amount in Body, totals, and last dose. This cannot be undone.',
        'tools.desc.undo_dose': 'Removes the most recently logged dose from all sensors, including the pharmacokinetics model and adherence calculation.',
        'tools.drinks_header': 'Drink Maintenance',
        'tools.undo_drink': 'Undo {name}',
        'tools.reset_drink': 'Reset {name}',
        'tools.desc.undo_drink': "Removes the most recently logged drink of this granular device from the master tracker and this drink's own stats.",
        'tools.desc.reset_drink': 'Clears ALL dose history for this granular drink — totals, last dose, and averages. The master tracker keeps its aggregated history. This cannot be undone.',
        // ── Dialogs ──
        'dialog.warning': 'Warning',
        'dialog.cancel': 'Cancel',
        'dialog.confirm': 'Confirm',
        'dialog.refill.title': 'Refill Medication',
        'dialog.refill.placeholder': 'Enter number of pills',
        'dialog.refill.confirm': 'Refill',
        'dialog.refill.title_drink': 'Refill {name}',
        'dialog.log_drink.title': 'Log Drink',
        'dialog.log_drink.empty': 'No drinks of this category configured.',
        'dialog.override.body_scheduled': 'Your next scheduled dose is not until {time}. Take a dose now anyway?',
        'dialog.override.body_as_needed': 'Your next safe dose is not until {time}. Take a dose now anyway?',
        'dialog.override.confirm': 'Override',
        'dialog.device_info.button': 'To Device info',
        'dialog.device_info.aria': 'View device info',
        'dialog.refill.aria': 'Refill medication',
        // ── Sleep Disruption dialog (Master Tracker) ──
        'dialog.sleep_disruption.title': 'Sleep Disruption',
        'dialog.sleep_disruption.close': 'Close',
        'dialog.sleep_disruption.caffeine': [
            '### Caffeine Sleep Disruption',
            '',
            '* **None (0 - 10 mg):** Negligible impact. Normal sleep cycles and melatonin production.',
            '* **Low (11 - 30 mg):** Minor shift. Deep sleep remains mostly stable.',
            '* **Moderate (31 - 60 mg):** Hidden disruption. Measurable drop in deep sleep and an elevated resting heart rate.',
            '* **High (61+ mg):** Severe disruption. Increased tossing and turning, frequent micro-awakenings, and delayed sleep onset.',
            '* **Note on "Immunity":** Even if you easily fall asleep with caffeine in your system, it still chemically blocks your deep, restorative sleep phases. You are unconscious, but not resting.',
            '',
            '*See README for full biological breakdown.*',
        ].join('\n'),
        'dialog.sleep_disruption.alcohol': [
            '### Alcohol Sleep Disruption',
            '',
            '* **None (0 g):** Clean architecture. Normal resting heart rate and REM cycles.',
            '* **Low (1 - 10 g):** Minor rebound. Slight, brief elevation in heart rate during the night.',
            '* **Moderate (11 - 30 g):** Restless sleep. Mid-night awakenings, temperature dysregulation (sweating), and lowered Heart Rate Variability (HRV).',
            '* **High (31+ g):** Severe stress. Spiked heart rate for hours, frequent waking, and stressful REM rebound (vivid dreams).',
            '* **Note on "The Nightcap":** Using alcohol to fall asleep faster is a biological trap. You trade falling asleep quickly for destroying the restorative quality of the second half of your night.',
            '',
            '*See README for full biological breakdown.*',
        ].join('\n'),
        // ── Config form labels ──
        'config.device_id': 'Device',
        'config.big_text': 'Large Text',
        'config.take_pill_icon': 'Take Pill Icon',
        'config.take_pill_label': 'Take Pill Label',
        'config.safe_to_take_box': 'Safe to Take Box',
        'config.safe_to_take_entity': 'Safe to Take Entity',
        'config.safe_to_take_label': 'Safe to Take Label',
        'config.safe_to_take_icon': 'Safe to Take Icon',
        'config.safe_to_take_tap_action': 'Tap Action',
        'config.safe_to_take_hold_action': 'Hold Action',
        'config.safe_to_take_double_tap_action': 'Double Tap Action',
        'config.pills_left_label': 'Pills Left Label',
        'config.pills_left_icon': 'Pills Left Icon',
        'config.color_scheme': 'Color Scheme',
        'config.name': 'Name Override',
        'config.daily_panel': 'Daily Panel',
        'config.graphs_panel': 'Graphs Panel',
        'config.stats_panel': 'Stats Panel',
        'config.chips': 'Custom Chips',
        'config.chip_1': 'Chip 1 (optional)',
        'config.chip_1_label': 'Chip 1 Label',
        'config.chip_2': 'Chip 2 (optional)',
        'config.chip_2_label': 'Chip 2 Label',
        'config.chip_3': 'Chip 3 (optional)',
        'config.chip_3_label': 'Chip 3 Label',
        'config.chip_4': 'Chip 4 (optional)',
        'config.chip_4_label': 'Chip 4 Label',
        'config.graph_options': 'Graph',
        // (graph_options key retained for backward compat; graphs_panel is the active expandable name)
        'config.show_amount_in_body': 'Amount in Body Graph',
        'config.amount_in_body_default_timeframe': 'Amount in Body Default Timescale',
        'config.show_day_avg_boxes': 'Day Avg Boxes',
        'config.show_adherence_boxes': 'Adherence Boxes (If available)',
        'config.stats_3_columns': '3-Column Stats',
        'config.hide_nav_bar': 'Hide Navigation Bar',
        // ── Config form helpers ──
        'config.helper.device_id': 'Choose a medication device.',
        'config.helper.big_text': 'Enlarges all card text for easier reading.',
        'config.helper.take_pill_icon': 'Icon for the Take Pill button. Defaults to mdi:pill.',
        'config.helper.take_pill_label': 'Button text. Defaults to "Take Pill". E.g. "Inject Dose", "Apply Cream".',
        'config.helper.safe_to_take_box': 'Replace the box with any entity. Leave empty for the default sensor.',
        'config.helper.safe_to_take_entity': 'Any entity to show here. Leave empty for default.',
        'config.helper.safe_to_take_label': 'Custom label. Defaults to "Safe to take".',
        'config.helper.safe_to_take_icon': 'Icon on the Safe to Take box. Defaults to mdi:shield-check.',
        'config.helper.safe_to_take_tap_action': 'Defaults to more-info.',
        'config.helper.safe_to_take_hold_action': 'Long-press action.',
        'config.helper.safe_to_take_double_tap_action': 'Double-tap action.',
        'config.helper.pills_left_label': 'Defaults to "Pills left". E.g. "Amount Left (ml)", "Doses Left".',
        'config.helper.pills_left_icon': 'Icon on the Pills Left box. Defaults to mdi:pill.',
        'config.helper.color_scheme': 'Accent color for the card.',
        'config.helper.name': 'Leave empty to use the device name.',
        'config.helper.chip_label': "Leave empty to use the entity's name.",
        'config.helper.chip': 'Show as a chip on the Daily pane.',
        'config.helper.show_amount_in_body': 'Show in the Graphs pane.',
        'config.helper.amount_in_body_default_timeframe': 'Default timescale on card load.',
        'config.helper.show_day_avg_boxes': 'Show beneath the bar graph.',
        'config.helper.show_adherence_boxes': 'Show beneath the bar graph. Requires adherence sensors.',
        'config.helper.stats_3_columns': '3 columns instead of 2.',
        'config.helper.hide_nav_bar': 'Hide the pane navigation bar.',
        // ── Color scheme labels ──
        'color.default': 'Default (HA Theme)',
        'color.blue': 'Blue',
        'color.red': 'Red',
        'color.green': 'Green',
        'color.yellow': 'Yellow',
        'color.orange': 'Orange',
        'color.purple': 'Purple',
        'color.pink': 'Pink',
        'color.teal': 'Teal',
        'color.brown': 'Brown',
        'color.coral': 'Coral',
        'color.slate': 'Slate',
        'color.gold': 'Gold',
        'color.grey': 'Grey',
        // ── setConfig error ──
        'setconfig.error.device_required': 'A device is required for the AX Dose Logger card.',
        // ── aria-labels ──
        'aria.take_pill_safe': 'Take pill',
        'aria.take_pill_limit': 'Limit reached, override available',
        'aria.timeframe_12h': '12 hours',
        'aria.timeframe_24h': '24 hours',
        'aria.timeframe_48h': '48 hours',
        'aria.timeframe_7d': '7 days',
        'aria.timeframe_14d': '14 days',
        'aria.timeframe_30d': '30 days',
        'aria.timeframe_60d': '60 days',
        'aria.effectiveness_avg': 'Average of visible effectiveness trackers',
        'aria.effectiveness_individual': 'Individual effectiveness trackers',
    },
};
/**
 * Look up a localized string.
 * @param lang  BCP47 language code from hass.language (e.g. "en", "de")
 * @param key   Dot-separated key into the translation map
 * @param params  Optional { placeholder: value } for {placeholder} interpolation
 * @returns  The translated string, falling back to English, then to the key
 */
function localize(lang, key, params) {
    let str = translations[lang]?.[key] ?? translations.en[key] ?? key;
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            str = str.replace(`{${k}}`, String(v));
        }
    }
    return str;
}

// ──────────────────────────────────────────────
// Pure helpers for the AX Dose Logger Card
// ──────────────────────────────────────────────
// Stateless functions decoupled from the card instance, so they can be shared
// by the container (AxDoseLoggerCard) and the presentational panel components
// without each needing a `this` reference. The container's `_foo` private
// methods become one-line delegates to these (see ax-dose-logger-card.ts), and
// the panel components import them directly.
/**
 * Parse a state string to an integer display string. Returns the original
 * string untouched when it isn't a number (e.g. 'unavailable', 'unknown').
 */
function formatInteger(value) {
    const num = parseFloat(value);
    if (isNaN(num))
        return value;
    return Math.round(num).toString();
}
/**
 * Build a YYYY-MM-DD date key from a Date using LOCAL timezone components
 * (NOT .toISOString(), which shifts to UTC and mis-buckets late-night doses
 * for users ahead of UTC).
 */
function toLocalDateKey(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
/**
 * Bridge gaps in an amount-in-body history series so the polyline renders flat
 * holds + vertical steps instead of misleading diagonal slopes across flat
 * plateaus (HA's recorder discards same-value sensor reports, so a constant
 * value produces sparse points).
 *
 * For each gap > gapMs, inserts a hold point (previous value at nextTimestamp
 * − 1s) so the line stays flat until the value actually changes.
 */
function bridgeGaps(history, gapMs = 3 * 60 * 1000) {
    if (history.length < 2) {
        return history.map((p) => ({
            timestamp: new Date(p.timestamp).getTime(),
            value: p.value,
        }));
    }
    const bridged = [];
    for (let i = 0; i < history.length; i++) {
        const current = {
            timestamp: new Date(history[i].timestamp).getTime(),
            value: history[i].value,
        };
        if (i > 0) {
            const prev = bridged[bridged.length - 1];
            if (current.timestamp - prev.timestamp > gapMs) {
                bridged.push({
                    timestamp: current.timestamp - 1000,
                    value: prev.value,
                });
            }
        }
        bridged.push(current);
    }
    return bridged;
}
/**
 * Resolve a color-scheme name into an inline CSS custom-property string
 * overriding --primary-color + --rgb-primary-color. Returns '' for the default
 * scheme (lets HA's theme variables pass through).
 */
function getColorOverrides(scheme) {
    const schemes = {
        default: { primary: '', rgb: '' },
        blue: { primary: '#03a9f4', rgb: '3, 169, 244' },
        red: { primary: '#e53935', rgb: '229, 57, 53' },
        green: { primary: '#43a047', rgb: '67, 160, 71' },
        yellow: { primary: '#fdd835', rgb: '253, 216, 53' },
        orange: { primary: '#fb8c00', rgb: '251, 140, 0' },
        purple: { primary: '#7e57c2', rgb: '126, 87, 194' },
        pink: { primary: '#d81b60', rgb: '216, 27, 96' },
        teal: { primary: '#00897b', rgb: '0, 137, 123' },
        brown: { primary: '#795548', rgb: '121, 85, 72' },
        coral: { primary: '#ff7043', rgb: '255, 112, 67' },
        slate: { primary: '#546e7a', rgb: '84, 110, 122' },
        gold: { primary: '#daa520', rgb: '218, 165, 32' },
        grey: { primary: '#9e9e9e', rgb: '158, 158, 158' },
    };
    const colors = schemes[scheme || 'default'];
    if (!colors || !colors.primary)
        return '';
    return `--primary-color: ${colors.primary}; --rgb-primary-color: ${colors.rgb};`;
}
/**
 * Read a HA entity's state string. Returns 'unavailable' when the entity id is
 * missing, hass isn't set yet, or the entity doesn't exist in the states map.
 */
function getState(hass, entityId) {
    if (!entityId || !hass)
        return 'unavailable';
    const state = hass.states[entityId];
    return state ? state.state : 'unavailable';
}
/**
 * Read a HA entity state attribute by name. Returns undefined when the entity
 * id / attribute name is missing, hass isn't set yet, or the attribute isn't
 * present on the entity.
 */
function getAttr(hass, entityId, attr) {
    if (!entityId || !attr || !hass)
        return undefined;
    const state = hass.states[entityId];
    return state?.attributes?.[attr];
}

// ──────────────────────────────────────────────
// AX Dose Logger Card — Visual Editor module
// ──────────────────────────────────────────────
// Extracted from ax-dose-logger-card.ts to keep the main card file focused on
// the runtime dashboard experience. This module owns the two pieces of editor-
// only logic that previously lived on the card class:
//   1. buildEditorForm()       — the ha-form schema + computeLabel/computeHelper
//                                callbacks returned from getConfigForm().
//   2. installEditorGridAlignment() — injects `align-items: end` CSS into every
//                                ha-form shadow root so entity-picker + text-
//                                field grid pairs align by their bottom edges.
//
// Both are imported statically by the container (no dynamic import() → no
// code-splitting → HACS single-file delivery stays intact).
// ──────────────────────────────────────────────
// Grid-alignment CSS injection
// ──────────────────────────────────────────────
// Module-scoped observer so repeated installEditorGridAlignment() calls
// disconnect the previous observer before creating a new one (mirrors the
// previous private-static-field behavior on the card class).
let _formStyleObserver = null;
/**
 * Inject a `<style>` into every `ha-form` shadow root in the document so that
 * entity-picker + text-field pairs inside `type: 'grid'` containers align by
 * their bottom edges.
 *
 * Entity pickers render an external label above the control; text fields render
 * an internal floating label. In a CSS grid row, the text field's control box
 * sits higher than the entity picker's because the entity picker has extra
 * vertical space from the external label. `align-items: end` forces both grid
 * children to align by their bottom edges, so the physical input boxes line up.
 *
 * Uses a MutationObserver to catch `ha-form` elements that appear after the
 * card connects (the config editor dialog opens lazily). The style tag is
 * id-tagged so it's only injected once per shadow root.
 *
 * Called from the container's connectedCallback().
 */
function installEditorGridAlignment() {
    const STYLE_ID = 'ax-dose-grid-align-items-end';
    const CSS = `
    /* Align grid children by bottom edge so entity picker + text field
       control boxes line up despite different label rendering.
       ha-form renders type:grid containers as divs with display:grid
       in their inline style. */
    div[style*="display: grid"],
    div[style*="display:grid"] {
      align-items: end !important;
    }
  `;
    const injectInto = (root) => {
        if (root.querySelector(`#${STYLE_ID}`))
            return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = CSS;
        root.appendChild(style);
    };
    // Find all ha-form elements and inject into their shadow roots.
    const processForms = () => {
        document.querySelectorAll('ha-form').forEach((form) => {
            if (form.shadowRoot) {
                injectInto(form.shadowRoot);
            }
        });
    };
    // Process existing forms immediately.
    processForms();
    // Set up a MutationObserver to catch forms that appear later (config dialog).
    if (_formStyleObserver) {
        _formStyleObserver.disconnect();
    }
    _formStyleObserver = new MutationObserver(() => {
        processForms();
    });
    _formStyleObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}
// ──────────────────────────────────────────────
// Editor form schema
// ──────────────────────────────────────────────
/**
 * Build the ha-form schema object returned by AxDoseLoggerCard.getConfigForm().
 * HA renders the `<ha-form>` itself from this schema; the container just
 * delegates here so the ~280-line schema + callbacks live in this focused
 * editor module instead of the main card file.
 */
function buildEditorForm() {
    return {
        schema: [
            {
                name: 'device_id',
                required: true,
                selector: {
                    device: {
                        filter: { integration: 'ax_dose_logger' },
                    },
                },
            },
            {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                    {
                        name: 'big_text',
                        selector: { boolean: {} },
                    },
                    {
                        name: 'hide_nav_bar',
                        selector: { boolean: {} },
                    },
                ],
            },
            {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                    {
                        name: 'color_scheme',
                        selector: {
                            select: {
                                options: [
                                    { value: 'default', label: localize('en', 'color.default') },
                                    { value: 'blue', label: localize('en', 'color.blue') },
                                    { value: 'red', label: localize('en', 'color.red') },
                                    { value: 'green', label: localize('en', 'color.green') },
                                    { value: 'yellow', label: localize('en', 'color.yellow') },
                                    { value: 'orange', label: localize('en', 'color.orange') },
                                    { value: 'purple', label: localize('en', 'color.purple') },
                                    { value: 'pink', label: localize('en', 'color.pink') },
                                    { value: 'teal', label: localize('en', 'color.teal') },
                                    { value: 'brown', label: localize('en', 'color.brown') },
                                    { value: 'coral', label: localize('en', 'color.coral') },
                                    { value: 'slate', label: localize('en', 'color.slate') },
                                    { value: 'gold', label: localize('en', 'color.gold') },
                                    { value: 'grey', label: localize('en', 'color.grey') },
                                ],
                            },
                        },
                    },
                    {
                        name: 'name',
                        selector: { text: {} },
                    },
                ],
            },
            {
                type: 'expandable',
                name: 'daily_panel',
                flatten: true,
                schema: [
                    {
                        type: 'grid',
                        name: '',
                        column_min_width: '200px',
                        schema: [
                            {
                                name: 'take_pill_icon',
                                selector: { icon: {} },
                            },
                            {
                                name: 'take_pill_label',
                                selector: { text: {} },
                            },
                        ],
                    },
                    {
                        type: 'expandable',
                        name: 'safe_to_take_box',
                        title: 'Safe to Take Box',
                        flatten: true,
                        schema: [
                            {
                                name: 'safe_to_take_entity',
                                selector: {
                                    entity: {
                                        context: { filter_device_id: 'device_id' },
                                    },
                                },
                            },
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'safe_to_take_icon',
                                        selector: { icon: {} },
                                    },
                                    {
                                        name: 'safe_to_take_label',
                                        selector: { text: {} },
                                    },
                                ],
                            },
                            {
                                name: 'safe_to_take_tap_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                            {
                                name: 'safe_to_take_hold_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                            {
                                name: 'safe_to_take_double_tap_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                        ],
                    },
                    {
                        type: 'grid',
                        name: '',
                        column_min_width: '200px',
                        schema: [
                            {
                                name: 'pills_left_icon',
                                selector: { icon: {} },
                            },
                            {
                                name: 'pills_left_label',
                                selector: { text: {} },
                            },
                        ],
                    },
                    {
                        type: 'expandable',
                        name: 'chips',
                        title: 'Custom Chips',
                        flatten: true,
                        schema: [
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'chip_1',
                                        selector: {
                                            entity: {
                                                context: { filter_device_id: 'device_id' },
                                            },
                                        },
                                    },
                                    {
                                        name: 'chip_1_label',
                                        selector: { text: {} },
                                    },
                                ],
                            },
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'chip_2',
                                        selector: {
                                            entity: {
                                                context: { filter_device_id: 'device_id' },
                                            },
                                        },
                                    },
                                    {
                                        name: 'chip_2_label',
                                        selector: { text: {} },
                                    },
                                ],
                            },
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'chip_3',
                                        selector: {
                                            entity: {
                                                context: { filter_device_id: 'device_id' },
                                            },
                                        },
                                    },
                                    {
                                        name: 'chip_3_label',
                                        selector: { text: {} },
                                    },
                                ],
                            },
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'chip_4',
                                        selector: {
                                            entity: {
                                                context: { filter_device_id: 'device_id' },
                                            },
                                        },
                                    },
                                    {
                                        name: 'chip_4_label',
                                        selector: { text: {} },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: 'expandable',
                name: 'graphs_panel',
                flatten: true,
                schema: [
                    {
                        name: 'show_amount_in_body',
                        selector: { boolean: {} },
                    },
                    {
                        name: 'amount_in_body_default_timeframe',
                        selector: {
                            select: {
                                options: [
                                    { value: '12h', label: '12 Hours' },
                                    { value: '24h', label: '24 Hours' },
                                    { value: '48h', label: '48 Hours' },
                                    { value: '7d', label: '7 Days' },
                                    { value: '14d', label: '14 Days' },
                                    { value: '30d', label: '30 Days' },
                                ],
                            },
                        },
                    },
                    {
                        type: 'grid',
                        name: '',
                        column_min_width: '200px',
                        schema: [
                            {
                                name: 'show_day_avg_boxes',
                                selector: { boolean: {} },
                            },
                            {
                                name: 'show_adherence_boxes',
                                selector: { boolean: {} },
                            },
                        ],
                    },
                ],
            },
            {
                type: 'expandable',
                name: 'stats_panel',
                flatten: true,
                schema: [
                    {
                        name: 'stats_3_columns',
                        selector: { boolean: {} },
                    },
                ],
            },
        ],
        computeLabel: (schema, _data, hass) => {
            const lang = hass?.language || 'en';
            // Grid containers have an empty name and are pure layout — no visible
            // label. Returning '' here prevents the localize() 'config.' fallback
            // from leaking as visible text for layout-only schema nodes.
            if (schema.type === 'grid' || !schema.name) {
                return '';
            }
            // Chip entity + label fields: drop BOTH labels so the entity picker and
            // text field render at the same vertical level inside each chip grid row.
            // The entity picker's external "Chip N (optional)" label wraps to 2 lines
            // in the 200px column, making its cell taller than the paired text field
            // (which uses an internal floating label). Returning an EMPTY STRING (not
            // undefined) is the key: ha-form treats a falsy/undefined computeLabel
            // result as "no override" and falls back to the schema field name (which
            // renders as visible "Chip N (optional)" text). An empty string IS a
            // valid label value, so ha-form renders an empty label element with no
            // visible text and no 2-line wrap, equalizing cell heights. This mirrors
            // the grid-container guard above (which also returns '' to suppress
            // layout labels). The helper text under each field conveys role and
            // optionality; the entity-picker UI vs text-field UI distinguishes the
            // two columns. Reversible to Option B (keep chip_N_label) via a one-line
            // edit if per-slot identification is later needed.
            if (schema.name === 'chip_1' || schema.name === 'chip_1_label' ||
                schema.name === 'chip_2' || schema.name === 'chip_2_label' ||
                schema.name === 'chip_3' || schema.name === 'chip_3_label' ||
                schema.name === 'chip_4' || schema.name === 'chip_4_label') {
                return '';
            }
            return localize(lang, 'config.' + schema.name);
        },
        computeHelper: (schema, _data, hass) => {
            const lang = hass?.language || 'en';
            const name = schema.name;
            // Layout/container nodes (grid, expandable) and nodes without a selector
            // have no input control, so helper text does not apply. Without this
            // guard, localize() returns the raw 'config.helper.<name>' key for
            // containers (daily_panel, graphs_panel, stats_panel, chips,
            // safe_to_take_box) that have no translation defined, which then
            // renders as visible text under the expandable headers.
            if (schema.type === 'grid' ||
                schema.type === 'expandable' ||
                !schema.selector) {
                return '';
            }
            if (name?.startsWith('chip_') && name?.endsWith('_label')) {
                return localize(lang, 'config.helper.chip_label');
            }
            if (name?.startsWith('chip_')) {
                return localize(lang, 'config.helper.chip');
            }
            return localize(lang, 'config.helper.' + name);
        },
    };
}

// ──────────────────────────────────────────────
// AX Dose Logger Card — Stats Pane (Pane 3)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane3.
// Receives the resolved entities + a CardController and renders the read-only
// statistics grid. Calls back into the controller for more-info opens (click +
// keyboard). All formatting/computation is delegated to the controller so this
// component holds only the template + its CSS.
let AxDoseStatsPanel = class AxDoseStatsPanel extends i {
    get _lang() {
        return this.controller.lang;
    }
    get _config() {
        return this.controller.config;
    }
    render() {
        const c = this.controller;
        const e = this.entities;
        const rows = [];
        if (e.totalDoses)
            rows.push({ label: localize(this._lang, 'stats.total_doses'), value: c.getState(e.totalDoses), icon: 'mdi:counter', entityId: e.totalDoses });
        if (e.daysSinceFirstDose)
            rows.push({ label: localize(this._lang, 'stats.days_since_first_dose'), value: c.getState(e.daysSinceFirstDose), icon: 'mdi:calendar-start', entityId: e.daysSinceFirstDose });
        if (e.lastDose)
            rows.push({ label: localize(this._lang, 'stats.last_dose'), value: c.computeTimeSinceLastDose(e), icon: 'mdi:clock-outline', entityId: e.lastDose });
        const strengthUnit = c.getStrengthUnit(e);
        if (e.strength)
            rows.push({ label: localize(this._lang, 'stats.strength'), value: c.formatInteger(c.getState(e.strength)) + ' ' + strengthUnit, icon: 'mdi:scale', entityId: e.strength });
        if (e.amountInBody)
            rows.push({ label: localize(this._lang, 'stats.amount_in_body'), value: c.getState(e.amountInBody) + ' ' + strengthUnit, icon: 'mdi:chart-bell-curve', entityId: e.amountInBody });
        if (e.steadyState) {
            const ss = c.getState(e.steadyState);
            const display = (ss === '0.0' || ss === '0') ? localize(this._lang, 'stats.steady_state_reached') : localize(this._lang, 'stats.steady_state_days', { days: ss });
            rows.push({ label: localize(this._lang, 'stats.steady_state'), value: display, icon: 'mdi:chart-timeline-variant', entityId: e.steadyState });
        }
        // Avg / Adherence rows mirror the Graph panel's progressive reveal driven
        // by days-since-first-dose. When the sensor is absent, all rows show.
        const { hasDaysSensor: hasDays, daysSince: days } = c.daysSinceReveal(e);
        if (e.avg7Days && (!hasDays || days >= 7))
            rows.push({ label: localize(this._lang, 'stats.avg_7_day'), value: c.getState(e.avg7Days), icon: 'mdi:chart-line', entityId: e.avg7Days });
        if (e.avg14Days && (!hasDays || days >= 14))
            rows.push({ label: localize(this._lang, 'stats.avg_14_day'), value: c.getState(e.avg14Days), icon: 'mdi:chart-line', entityId: e.avg14Days });
        if (e.avg30Days && (!hasDays || days >= 30))
            rows.push({ label: localize(this._lang, 'stats.avg_30_day'), value: c.getState(e.avg30Days), icon: 'mdi:chart-line', entityId: e.avg30Days });
        // Year slot doubles as the running elapsed-days average until 365 days pass.
        if (e.avgYearly && (!hasDays || days > 0)) {
            const label = (hasDays && days < 365) ? localize(this._lang, 'stats.avg_running', { days }) : localize(this._lang, 'stats.avg_yearly');
            rows.push({ label, value: c.getState(e.avgYearly), icon: 'mdi:chart-line', entityId: e.avgYearly });
        }
        if (e.adherence7Days && (!hasDays || days >= 7))
            rows.push({ label: localize(this._lang, 'stats.adherence_7_day'), value: c.getState(e.adherence7Days) + '%', icon: 'mdi:check-decagram', entityId: e.adherence7Days });
        if (e.adherence14Days && (!hasDays || days >= 14))
            rows.push({ label: localize(this._lang, 'stats.adherence_14_day'), value: c.getState(e.adherence14Days) + '%', icon: 'mdi:check-decagram', entityId: e.adherence14Days });
        if (e.adherence30Days && (!hasDays || days >= 30))
            rows.push({ label: localize(this._lang, 'stats.adherence_30_day'), value: c.getState(e.adherence30Days) + '%', icon: 'mdi:check-decagram', entityId: e.adherence30Days });
        // 365d slot doubles as the running elapsed-days adherence until 365 days pass.
        if (e.adherence365Days && (!hasDays || days > 0)) {
            const label = (hasDays && days < 365) ? localize(this._lang, 'stats.adherence_running', { days }) : localize(this._lang, 'stats.adherence_365_day');
            rows.push({ label, value: c.getState(e.adherence365Days) + '%', icon: 'mdi:check-decagram', entityId: e.adherence365Days });
        }
        // ── Master Tracker (Caffeine/Alcohol) extra rows ──
        // These fields are only populated by the master-tracker branch of
        // _computeEntities; medicine + granular drink devices leave them
        // undefined so the guards skip the rows.
        if (e.amountLast24h) {
            const v = c.getState(e.amountLast24h);
            rows.push({ label: localize(this._lang, 'stats.amount_last_24h'), value: (v === 'unknown' || v === 'unavailable' ? '-' : v + ' ' + c.getStrengthUnit(e)), icon: 'mdi:calendar-clock', entityId: e.amountLast24h });
        }
        if (e.sleepDisruption) {
            const v = c.getState(e.sleepDisruption);
            rows.push({ label: localize(this._lang, 'stats.sleep_disruption'), value: (v === 'unknown' || v === 'unavailable' ? '-' : v), icon: 'mdi:bed-clock', entityId: e.sleepDisruption });
        }
        if (e.estimatedLowTime) {
            const v = c.getState(e.estimatedLowTime);
            let display = '-';
            if (v && v !== 'unknown' && v !== 'unavailable') {
                const dt = new Date(v);
                if (!isNaN(dt.getTime()))
                    display = dt.toLocaleString();
            }
            rows.push({ label: localize(this._lang, 'stats.estimated_low_time'), value: display, icon: 'mdi:clock-alert-outline', entityId: e.estimatedLowTime });
        }
        return b `
      <div class="pane pane-stats">
        <div class="stats-grid ${this._config?.stats_3_columns ? 'three-col' : ''}">
          ${rows.map((row) => b `
            <div
              class="stat-cell ${row.entityId ? 'clickable' : ''}"
              role=${row.entityId ? 'button' : A}
              tabindex=${row.entityId ? '0' : A}
              @click=${row.entityId ? () => this.controller.openMoreInfo(row.entityId) : undefined}
              @keydown=${row.entityId ? (ev) => this.controller.onStatCellKeydown(ev, row.entityId) : undefined}
            >
              <div class="stat-cell-header">
                <ha-icon icon="${row.icon}"></ha-icon>
                <span class="stat-cell-label">${row.label}</span>
              </div>
              <span class="stat-cell-value">${row.value === 'unavailable' ? '-' : row.value}</span>
            </div>
          `)}
        </div>
      </div>
    `;
    }
};
AxDoseStatsPanel.styles = i$3 `
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
      font-weight: 600;
      color: var(--primary-text-color, #222);
    }
  `;
__decorate([
    n({ attribute: false })
], AxDoseStatsPanel.prototype, "controller", void 0);
__decorate([
    n({ attribute: false })
], AxDoseStatsPanel.prototype, "entities", void 0);
__decorate([
    n({ attribute: false })
], AxDoseStatsPanel.prototype, "hass", void 0);
AxDoseStatsPanel = __decorate([
    t('ax-dose-stats-panel')
], AxDoseStatsPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Tools Pane (Pane 4)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane4.
// Renders the maintenance button grid (Adherence Tools + General Tools). Each
// button click opens a shared confirmation dialog via controller.openToolsDialog
// (the dialog itself stays on the container, which owns _toolsDialog state).
// The onConfirm closure (the actual button.press service call) is authored here
// because it's the panel's job; the container just hosts the dialog surface.
let AxDoseToolsPanel = class AxDoseToolsPanel extends i {
    get _lang() {
        return this.controller.lang;
    }
    // Each handler opens the shared tools confirmation dialog (hosted by the
    // container) with a localized title + descriptor + an onConfirm closure that
    // fires the matching button.press service call. Mirrors the original
    // _handleAdherenceReset / _handleAdherenceCover / _handleResetHistory /
    // _handleUndoDoseConfirm methods on the container.
    _handleAdherenceReset(entities) {
        if (!this.controller.hass || !entities.adherenceResetButton)
            return;
        this.controller.openToolsDialog(localize(this._lang, 'tools.reset_adherence'), localize(this._lang, 'tools.desc.reset_adherence'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.adherenceResetButton });
        });
    }
    _handleAdherenceCover(entities) {
        if (!this.controller.hass || !entities.adherenceCoverButton)
            return;
        this.controller.openToolsDialog(localize(this._lang, 'tools.mark_adherence_taken'), localize(this._lang, 'tools.desc.mark_adherence_taken'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.adherenceCoverButton });
        });
    }
    _handleResetHistory(entities) {
        if (!this.controller.hass || !entities.resetButton)
            return;
        this.controller.openToolsDialog(localize(this._lang, 'tools.reset_history'), localize(this._lang, 'tools.desc.reset_history'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.resetButton });
        });
    }
    _handleUndoDoseConfirm(entities) {
        if (!this.controller.hass || !entities.undoButton)
            return;
        this.controller.openToolsDialog(localize(this._lang, 'tools.undo_dose'), localize(this._lang, 'tools.desc.undo_dose'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.undoButton });
        });
    }
    // ── Master Tracker per-granular-drink tools ──
    // When the selected device is a Master Tracker, render a per-granular-drink
    // list of Undo + Reset buttons (one row per granular drink of the
    // substance). Each action opens the shared tools confirmation dialog.
    _handleDrinkUndo(drink) {
        if (!this.controller.hass || !drink.undoButtonEntityId)
            return;
        this.controller.openToolsDialog(localize(this._lang, 'tools.undo_drink', { name: drink.name }), localize(this._lang, 'tools.desc.undo_drink'), () => { this.controller.undoDrink(drink.undoButtonEntityId); });
    }
    _handleDrinkReset(drink) {
        if (!this.controller.hass || !drink.resetButtonEntityId)
            return;
        this.controller.openToolsDialog(localize(this._lang, 'tools.reset_drink', { name: drink.name }), localize(this._lang, 'tools.desc.reset_drink'), () => { this.controller.resetDrink(drink.resetButtonEntityId); });
    }
    _renderMasterTools() {
        const substance = this.entities.substance;
        if (!substance) {
            return b `<div class="tools-panel"><div class="tools-empty">${localize(this._lang, 'tools.empty')}</div></div>`;
        }
        const drinks = this.controller.getDrinksOfSubstance(substance);
        const substanceIcon = substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee';
        if (drinks.length === 0) {
            return b `<div class="tools-panel"><div class="tools-empty">${localize(this._lang, 'tools.empty')}</div></div>`;
        }
        return b `
      <div class="tools-panel">
        <div class="tools-section-header">${localize(this._lang, 'tools.drinks_header')}</div>
        ${drinks.map((d) => b `
          <div class="drink-tool-row">
            <div class="drink-tool-name">
              <ha-icon icon="${substanceIcon}"></ha-icon>
              <span>${d.name}</span>
            </div>
            <div class="drink-tool-actions">
              ${d.undoButtonEntityId ? b `
                <button class="tool-btn danger drink-tool-btn" @click=${() => this._handleDrinkUndo(d)}>
                  <ha-icon icon="mdi:undo"></ha-icon>
                  <span>${localize(this._lang, 'tools.undo_dose')}</span>
                </button>
              ` : A}
              ${d.resetButtonEntityId ? b `
                <button class="tool-btn danger drink-tool-btn" @click=${() => this._handleDrinkReset(d)}>
                  <ha-icon icon="mdi:history"></ha-icon>
                  <span>${localize(this._lang, 'tools.reset_history')}</span>
                </button>
              ` : A}
            </div>
          </div>
        `)}
      </div>
    `;
    }
    render() {
        // Master Tracker branch: per-granular-drink Undo/Reset list.
        if (this.entities.deviceType === 'drink_master') {
            return this._renderMasterTools();
        }
        const e = this.entities;
        const hasAdhTools = !!(e.adherenceResetButton || e.adherenceCoverButton);
        const hasGenTools = !!(e.resetButton || e.undoButton);
        if (!hasAdhTools && !hasGenTools) {
            return b `
        <div class="tools-panel">
          <div class="tools-empty">${localize(this._lang, 'tools.empty')}</div>
        </div>
      `;
        }
        return b `
      <div class="tools-panel">
        ${hasAdhTools ? b `
          <div class="tools-section-header">${localize(this._lang, 'tools.adherence_header')}</div>
          <div class="tools-grid">
            ${e.adherenceResetButton ? b `
              <button
                class="tool-btn danger"
                @click=${() => this._handleAdherenceReset(e)}
              >
                <ha-icon icon="mdi:percent-circle-outline"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_adherence')}</span>
              </button>
            ` : A}
            ${e.adherenceCoverButton ? b `
              <button
                class="tool-btn"
                @click=${() => this._handleAdherenceCover(e)}
              >
                <ha-icon icon="mdi:check-underline-circle"></ha-icon>
                <span>${localize(this._lang, 'tools.mark_adherence_taken')}</span>
              </button>
            ` : A}
          </div>
        ` : A}

        ${hasGenTools ? b `
          <div class="tools-section-header tools-section-header--spaced">${localize(this._lang, 'tools.general_header')}</div>
          <div class="tools-grid">
            ${e.resetButton ? b `
              <button
                class="tool-btn danger"
                @click=${() => this._handleResetHistory(e)}
              >
                <ha-icon icon="mdi:history"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_history')}</span>
              </button>
            ` : A}
            ${e.undoButton ? b `
              <button
                class="tool-btn danger"
                @click=${() => this._handleUndoDoseConfirm(e)}
              >
                <ha-icon icon="mdi:undo"></ha-icon>
                <span>${localize(this._lang, 'tools.undo_dose')}</span>
              </button>
            ` : A}
          </div>
        ` : A}
      </div>
    `;
    }
};
AxDoseToolsPanel.styles = i$3 `
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
      font-weight: 600;
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
      transition: background 0.2s, transform 0.1s;
    }

    .tool-btn ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .tool-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .tool-btn:active {
      transform: scale(0.98);
    }

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
      font-weight: 600;
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
  `;
__decorate([
    n({ attribute: false })
], AxDoseToolsPanel.prototype, "controller", void 0);
__decorate([
    n({ attribute: false })
], AxDoseToolsPanel.prototype, "entities", void 0);
__decorate([
    n({ attribute: false })
], AxDoseToolsPanel.prototype, "hass", void 0);
AxDoseToolsPanel = __decorate([
    t('ax-dose-tools-panel')
], AxDoseToolsPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Tracking Pane (Pane 5)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane5.
// Renders one ha-slider per tracking metric with a Set/Not-set badge and value.
// The slider @change calls controller.handleTrackingChange, which owns the
// _pendingTracking race-guard + the override-dialog state on the container —
// so this panel holds only the template + CSS; no state machine lives here.
let AxDoseTrackingPanel = class AxDoseTrackingPanel extends i {
    get _lang() {
        return this.controller.lang;
    }
    render() {
        const c = this.controller;
        const metrics = this.entities.metrics;
        if (!metrics.length) {
            return b `
        <div class="tracking-panel">
          <div class="tracking-empty">${localize(this._lang, 'tools.empty')}</div>
        </div>
      `;
        }
        return b `
      <div class="tracking-panel">
        ${metrics.map((m) => {
            const state = c.getState(m.entityId);
            const attrs = c.getAttr(m.entityId, 'logged_today');
            const isLogged = attrs === true || attrs === 'True' || attrs === 'true';
            const currentValue = state === 'unavailable' || state === 'unknown' ? null : parseFloat(state);
            const displayValue = currentValue !== null ? currentValue : 0;
            const todayLabel = localize(this._lang, 'tracking.today_label', { metric: m.label });
            return b `
            <div class="tracking-row">
              <div class="tracking-header">
                <span class="tracking-label">${todayLabel}</span>
                ${isLogged
                ? b `<span class="tracking-badge tracking-badge--set">${localize(this._lang, 'tracking.set_today')}</span>`
                : b `<span class="tracking-badge tracking-badge--unset">${localize(this._lang, 'tracking.not_set')}</span>`}
              </div>
              <div class="tracking-slider-row">
                <div class="tracking-slider-wrapper">
                  <ha-slider
                    .value=${displayValue}
                    .min=${0}
                    .max=${10}
                    .step=${1}
                    .disabled=${false}
                    pin
                    @change=${(e) => this.controller.handleTrackingChange(m, e.target.value)}
                  ></ha-slider>
                  <div class="tracking-scale">
                    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => b `
                      <span class="tracking-scale-tick">${n}</span>
                    `)}
                  </div>
                </div>
                <span class="tracking-value">${currentValue !== null ? currentValue : '—'}</span>
              </div>
            </div>
          `;
        })}
      </div>
    `;
    }
};
AxDoseTrackingPanel.styles = i$3 `
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
      font-weight: 500;
      color: var(--primary-text-color, #222);
    }

    .tracking-badge {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 500;
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
      font-weight: 600;
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
  `;
__decorate([
    n({ attribute: false })
], AxDoseTrackingPanel.prototype, "controller", void 0);
__decorate([
    n({ attribute: false })
], AxDoseTrackingPanel.prototype, "entities", void 0);
__decorate([
    n({ attribute: false })
], AxDoseTrackingPanel.prototype, "hass", void 0);
AxDoseTrackingPanel = __decorate([
    t('ax-dose-tracking-panel')
], AxDoseTrackingPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Daily Pane (Pane 1)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane1.
// The highest event-surface pane: med-name (device-info dialog), take-pill
// button (press / override dialog), safe-to-take box (tap/hold/double-tap
// actions), pills-left stat-pill (refill dialog), custom chips. Every action
// calls back into the controller so the container owns the dialog state.
let AxDoseDailyPanel = class AxDoseDailyPanel extends i {
    get _lang() {
        return this.controller.lang;
    }
    render() {
        const c = this.controller;
        const e = this.entities;
        // Button limit logic — always uses the REAL pills_safe_to_take sensor,
        // never the display entity, so swapping the box doesn't affect safety.
        const safeState = c.getState(e.pillsSafeToTake);
        const safeCount = parseInt(safeState, 10);
        const isLimitReached = !isNaN(safeCount) && safeCount <= 0;
        const timeSince = c.computeTimeSinceLastDose(e);
        const nextDose = c.computeNextDose(e);
        const overTime = c.computeOverTime(e);
        const pillsLeft = c.getState(e.pillsLeft);
        const chipEntities = c.getChipEntities();
        // Display entity for the Safe to Take box (may differ from the real sensor).
        const displayEntity = c.getSafeBoxEntity(e);
        const displayState = c.getState(displayEntity);
        const displayIsUnknown = displayState === 'unknown' || displayState === 'unavailable' || displayState === undefined;
        const isSwapped = !!(c.config?.safe_to_take_entity && c.config.safe_to_take_entity !== e.pillsSafeToTake);
        // Action config for the Safe to Take box. When the user configured custom
        // tap/hold/double-tap actions, handleAction fires them. When no tap_action
        // is configured, the click falls back to more-info on the display entity
        // (v1 default behavior). hasHold/hasDoubleClick gate the action handler so
        // a plain click doesn't trigger hold/double-tap logic.
        const safeBoxActionConfig = {
            entity: displayEntity,
            tap_action: c.config?.safe_to_take_tap_action,
            hold_action: c.config?.safe_to_take_hold_action,
            double_tap_action: c.config?.safe_to_take_double_tap_action,
        };
        const hasCustomTap = !!c.config?.safe_to_take_tap_action;
        const hasHold = !!c.config?.safe_to_take_hold_action;
        const hasDblClick = !!c.config?.safe_to_take_double_tap_action;
        const safeBoxClickable = !!displayEntity || hasCustomTap || hasHold || hasDblClick;
        return b `
      <div class="pane pane-daily">
        <div class="med-name"
             role="button" tabindex="0"
             aria-label=${localize(this._lang, 'dialog.device_info.aria')}
             @click=${() => c.showDeviceInfo()}
             @keydown=${(ev) => c.onKeyActivate(ev, () => c.showDeviceInfo())}
        >${c.getMedName(e)}</div>

        <div class="daily-main">
          <button
            class="take-pill-btn ${isLimitReached ? 'danger' : 'safe'}"
            aria-label=${isLimitReached
            ? localize(this._lang, 'aria.take_pill_limit')
            : (c.config?.take_pill_label || localize(this._lang, 'aria.take_pill_safe'))}
            @click=${() => c.handleTakePill(e)}
          >
            <ha-icon icon="${isLimitReached ? 'mdi:alert' : (c.config?.take_pill_icon || 'mdi:pill')}"></ha-icon>
            <span class="take-label">${isLimitReached ? localize(this._lang, 'daily.limit_reached') : (c.config?.take_pill_label || localize(this._lang, 'daily.take_pill'))}</span>
            <span class="take-sub">${isLimitReached
            ? (overTime
                ? b `<span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span> \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.overdue')}: ${overTime}</span>`
                : b `<span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span> \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.next')}: ${nextDose}</span>`)
            : (overTime
                ? b `<span class="take-sub-segment">${localize(this._lang, 'daily.overdue')}: ${overTime}</span>`
                : b `<span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span>`)}</span>
          </button>

          <div class="stats-column">
            <div class="stat-pill ${safeBoxClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${safeBoxClickable ? '0' : A}
                 aria-label=${localize(this._lang, 'daily.safe_to_take')}
                 @click=${safeBoxClickable ? (ev) => c.handleSafeBoxAction(ev, 'tap', safeBoxActionConfig, displayEntity) : null}
                 @keydown=${safeBoxClickable ? (ev) => c.onKeyActivate(ev, () => c.handleSafeBoxAction(null, 'tap', safeBoxActionConfig, displayEntity)) : null}
                 @contextmenu=${hasHold ? (ev) => { ev.preventDefault(); c.handleSafeBoxAction(null, 'hold', safeBoxActionConfig, displayEntity); } : null}
                 @dblclick=${hasDblClick ? () => c.handleSafeBoxAction(null, 'double_tap', safeBoxActionConfig, displayEntity) : null}>
              <ha-icon icon="${c.config?.safe_to_take_icon || 'mdi:shield-check'}"></ha-icon>
              <span class="stat-label">${c.config?.safe_to_take_label || localize(this._lang, 'daily.safe_to_take')}</span>
              <span class="stat-value">${displayIsUnknown
            ? localize(this._lang, 'daily.na')
            : (isSwapped ? (displayState ? displayState.charAt(0).toUpperCase() + displayState.slice(1) : '') : c.formatInteger(safeState))}</span>
            </div>
            <div class="stat-pill ${e.addRefill ? 'clickable' : ''}"
                 role="button"
                 tabindex="0"
                 aria-label=${localize(this._lang, 'dialog.refill.aria')}
                 @click=${e.addRefill ? () => c.showRefillDialog() : null}
                 @keydown=${e.addRefill ? (ev) => c.onKeyActivate(ev, () => c.showRefillDialog()) : null}>
              <ha-icon icon="${c.config?.pills_left_icon || 'mdi:pill'}"></ha-icon>
              <span class="stat-label">${c.config?.pills_left_label || localize(this._lang, 'daily.pills_left')}</span>
              <span class="stat-value">${pillsLeft === 'unavailable' ? '-' : c.formatInteger(pillsLeft)}</span>
            </div>
          </div>
        </div>

        ${chipEntities.length > 0
            ? b `
              <div class="chips-row">
                ${chipEntities.map((chip) => {
                const chipState = c.getState(chip.entityId);
                const chipName = chip.label
                    || c.hass?.states[chip.entityId]?.attributes?.friendly_name
                    || chip.entityId;
                return b `
                    <div class="chip">
                      <span class="chip-name">${chipName}</span>
                      <span class="chip-value">${chipState}</span>
                    </div>
                  `;
            })}
              </div>
            `
            : A}
      </div>
    `;
    }
};
AxDoseDailyPanel.styles = i$3 `
    .pane-daily {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .med-name {
      font-size: calc(20px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      text-align: center;
      cursor: pointer;
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
      transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      flex: 1;
    }

    .take-pill-btn:active {
      transform: scale(0.96);
    }

    .take-pill-btn.safe {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
    }

    .take-pill-btn.safe:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
    }

    .take-pill-btn.danger {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
      color: var(--error-color, #db4437);
    }

    .take-pill-btn.danger:hover {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.2);
    }

    .take-pill-btn ha-icon {
      --mdc-icon-size: 28px;
      margin-bottom: 2px;
    }

    .take-label {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 550;
    }

    .take-sub {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: 450;
      opacity: 0.9;
    }

    .take-sub-segment {
      white-space: nowrap;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: var(--ha-card-border-radius, 12px);
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
    }

    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-left: auto;
    }

    .stat-pill.clickable {
      cursor: pointer;
    }

    .stat-pill.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .chips-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .chip {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 6px;
      background: var(--chip-background, rgba(128,128,128,0.08));
      border-radius: 10px;
    }

    .chip-name {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    .chip-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
    }
  `;
__decorate([
    n({ attribute: false })
], AxDoseDailyPanel.prototype, "controller", void 0);
__decorate([
    n({ attribute: false })
], AxDoseDailyPanel.prototype, "entities", void 0);
__decorate([
    n({ attribute: false })
], AxDoseDailyPanel.prototype, "hass", void 0);
AxDoseDailyPanel = __decorate([
    t('ax-dose-daily-panel')
], AxDoseDailyPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Graphs Pane (Pane 2)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane2 +
// _renderBarGraph + _renderLineGraph + _renderTimeframeChips +
// _renderBarTimeframeChips + _renderAveragesGrid. The largest template in the
// card. Reads amount/dose history + active timeframes from the controller
// props and calls back for timeframe changes + carousel navigation. The actual
// history fetching stays on the container (updated() lifecycle).
var AxDoseGraphsPanel_1;
let AxDoseGraphsPanel = AxDoseGraphsPanel_1 = class AxDoseGraphsPanel extends i {
    constructor() {
        super(...arguments);
        // Graph-local state mirrored from the container as reactive props. The
        // graphs pane reads container @state (history fetch results, active
        // timeframe / carousel index) through these props instead of via
        // controller getters, because the controller object reference never
        // changes (it is the card itself) so getter reads would never trigger a
        // panel re-render. Binding them here lets timeframe-chip clicks, carousel
        // nav, and async history-fetch completion re-render the panel immediately.
        this.amountHistory = [];
        this.doseHistory = [];
        this.activeGraph = 0;
        this.activeTimeframe = '48h';
        this.activeBarTimeframe = '14d';
        // Effectiveness-graph state (mirrored from the container as reactive props,
        // same rationale as amountHistory/doseHistory above). The effectiveness
        // slide is gated on entities.metrics.length > 0; these props are read only
        // when that slide is active.
        this.activeEffectivenessTimeframe = '14d';
        this.activeEffectivenessView = 'avg';
        this.effectivenessHistory = {};
        this.effectivenessVisible = new Set();
    }
    get _lang() {
        return this.controller.lang;
    }
    get _config() {
        return this.controller.config;
    }
    // Timeframe helpers — read the controller's active timeframe state.
    _getBarTimeframeDays() {
        switch (this.activeBarTimeframe) {
            case '30d': return 30;
            case '60d': return 60;
            default: return 14;
        }
    }
    _getTimeframeHours() {
        switch (this.activeTimeframe) {
            case '12h': return 12;
            case '24h': return 24;
            case '7d': return 168;
            case '14d': return 336;
            case '30d': return 720;
            default: return 48;
        }
    }
    render() {
        const c = this.controller;
        const e = this.entities;
        const dailyBuckets = c.bucketByDay(this._getBarTimeframeDays());
        const hasAmountInBody = e.amountInBody &&
            c.getState(e.amountInBody) !== '0' &&
            c.getState(e.amountInBody) !== 'unknown' &&
            c.getState(e.amountInBody) !== 'unavailable';
        // Determine available slides. The effectiveness slide auto-appears when the
        // device has any effectiveness number entities (standard or custom).
        const slides = ['bar'];
        if (hasAmountInBody && (this._config?.show_amount_in_body !== false)) {
            slides.push('line');
        }
        if (e.metrics.length > 0) {
            slides.push('effectiveness');
        }
        // Clamp active graph index
        const activeIdx = Math.min(this.activeGraph, slides.length - 1);
        const activeSlide = slides[activeIdx];
        const slideTitle = activeSlide === 'bar'
            ? localize(this._lang, 'graphs.bar_title', { days: this._getBarTimeframeDays() })
            : activeSlide === 'line'
                ? localize(this._lang, 'graphs.line_title')
                : localize(this._lang, 'graphs.effectiveness_title');
        return b `
      <div class="pane pane-graphs">
        ${slides.length > 1 ? b `
          <div class="carousel-nav">
            <button
              class="nav-btn"
              aria-label=${localize(this._lang, 'graphs.aria_prev')}
              @click=${() => c.setActiveGraph((activeIdx - 1 + slides.length) % slides.length)}
              ?disabled=${slides.length <= 1}
            >
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <span class="nav-title">${slideTitle}</span>
            <button
              class="nav-btn"
              aria-label=${localize(this._lang, 'graphs.aria_next')}
              @click=${() => c.setActiveGraph((activeIdx + 1) % slides.length)}
              ?disabled=${slides.length <= 1}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        ` : b `
          <div class="carousel-nav">
            <span class="nav-title">${slideTitle}</span>
          </div>
        `}

        <div class="graph-container">
          ${activeSlide === 'bar'
            ? this._renderBarGraph(dailyBuckets)
            : activeSlide === 'line'
                ? this._renderLineGraph(e)
                : this._renderEffectivenessGraph(e)}
        </div>

        ${activeSlide === 'bar' ? this._renderAveragesGrid(e) : A}
      </div>
    `;
    }
    _renderBarGraph(buckets) {
        this.controller;
        const maxCount = Math.max(...buckets.map((b) => b.count), 1);
        const hasData = buckets.some((b) => b.count > 0);
        const dayCount = this._getBarTimeframeDays();
        if (!hasData) {
            return b `
        <div class="bar-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderBarTimeframeChips()}
          </div>
          <div class="graph-placeholder">
            <ha-icon icon="mdi:chart-bar"></ha-icon>
            <span>${localize(this._lang, 'graphs.empty_bar')}</span>
          </div>
        </div>
      `;
        }
        const w$1 = 320;
        const h = 180;
        const padLeft = 32;
        const padRight = 8;
        const padTop = 28;
        const padBottom = 8;
        const chartW = w$1 - padLeft - padRight;
        const chartH = h - padTop - padBottom;
        const barGap = 2;
        const barW = (chartW - barGap * (buckets.length - 1)) / buckets.length;
        // Label decimation: show every Nth label to keep 60-bar view readable
        let labelStep;
        if (dayCount <= 14)
            labelStep = 1; // 14D: every day
        else if (dayCount <= 30)
            labelStep = 2; // 30D: every 2 days
        else
            labelStep = 5; // 60D: every 5 days
        return b `
      <div class="bar-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderBarTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${w$1} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
          ${[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = padTop + chartH * (1 - fraction);
            return w `
              <line x1="${padLeft}" y1="${y}" x2="${w$1 - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(11px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${Math.round(maxCount * fraction)}</text>
            `;
        })}

          ${buckets.map((bucket, i) => {
            const barH = Math.max((bucket.count / maxCount) * chartH, bucket.count > 0 ? 2 : 0);
            const x = padLeft + i * (barW + barGap);
            const y = padTop + chartH - barH;
            return w `
              <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="2"
                    fill="var(--primary-color)" opacity="0.85">
                <title>${bucket.label}: ${bucket.count} dose${bucket.count !== 1 ? 's' : ''}</title>
              </rect>
            `;
        })}

          <!-- Baseline -->
          <line x1="${padLeft}" y1="${h - padBottom}" x2="${w$1 - padRight}" y2="${h - padBottom}"
                stroke="var(--divider-color)" stroke-width="1"/>
        </svg>
        <div class="bar-labels">
          ${buckets.map((bucket, i) => b `
            <span>${i % labelStep === 0 ? bucket.label : ''}</span>
          `)}
        </div>
      </div>
    `;
    }
    _renderTimeframeChips() {
        const c = this.controller;
        const timeframes = [
            { id: '12h', labelKey: 'graphs.timeframe_12h', ariaKey: 'aria.timeframe_12h' },
            { id: '24h', labelKey: 'graphs.timeframe_24h', ariaKey: 'aria.timeframe_24h' },
            { id: '48h', labelKey: 'graphs.timeframe_48h', ariaKey: 'aria.timeframe_48h' },
            { id: '7d', labelKey: 'graphs.timeframe_7d', ariaKey: 'aria.timeframe_7d' },
            { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
            { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
        ];
        return timeframes.map((tf) => b `
      <button
        class="timeframe-chip ${this.activeTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => c.handleTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
    }
    _renderBarTimeframeChips() {
        const c = this.controller;
        const timeframes = [
            { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
            { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
            { id: '60d', labelKey: 'graphs.timeframe_60d', ariaKey: 'aria.timeframe_60d' },
        ];
        return timeframes.map((tf) => b `
      <button
        class="timeframe-chip ${this.activeBarTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => c.handleBarTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
    }
    _renderLineGraph(entities) {
        const c = this.controller;
        const amountInBody = c.getState(entities.amountInBody);
        const rawHistory = this.amountHistory;
        const w$1 = 320;
        // h bumped 180 -> 200 so chartH (h - padTop - padBottom) matches the bar
        // graph's 144 (180-28-8), giving all three graphs an equally-tall Y axis.
        const h = 200;
        const padLeft = 36;
        const padRight = 8;
        const padTop = 28;
        const padBottom = 28;
        const chartW = w$1 - padLeft - padRight;
        const chartH = h - padTop - padBottom;
        if (rawHistory.length === 0) {
            return b `
        <div class="line-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderTimeframeChips()}
          </div>
          <svg viewBox="0 0 ${w$1} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: ${w$1}/${h}">
            <text x="${w$1 / 2}" y="${h / 2}" text-anchor="middle"
                  style="font-size: calc(14px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${localize(this._lang, 'graphs.loading_history')}</text>
          </svg>
        </div>
      `;
        }
        const now = new Date();
        const timeframeHours = this._getTimeframeHours();
        const startTime = new Date(now.getTime() - timeframeHours * 60 * 60 * 1000);
        // Bridge gaps in history so the polyline renders flat holds + vertical
        // steps instead of diagonal slopes across sparse recorder data.
        const bridgedHistory = bridgeGaps(rawHistory);
        // Find max value for Y-axis scaling
        const values = bridgedHistory.map((p) => p.value);
        const maxAmount = Math.max(...values, 1);
        // Build polyline points from gap-bridged history
        const polylinePoints = bridgedHistory.map((p) => {
            const fraction = Math.max(0, Math.min(1, (p.timestamp - startTime.getTime()) / (timeframeHours * 60 * 60 * 1000)));
            const x = padLeft + fraction * chartW;
            const y = padTop + chartH * (1 - p.value / maxAmount);
            return `${x},${y}`;
        }).join(' ');
        // Compute Y position for the current-amount dashed line
        const currentAmountNum = parseFloat(amountInBody);
        const currentY = (amountInBody && amountInBody !== 'unavailable' && !isNaN(currentAmountNum))
            ? Math.max(padTop, Math.min(padTop + chartH, padTop + chartH * (1 - currentAmountNum / maxAmount)))
            : padTop;
        const currentLabelY = Math.max(padTop + 8, currentY - 5);
        // Dynamic time indicators based on timeframe.
        // Tick marks (visual only) and text labels are built separately so they
        // can have different densities — e.g. 12H shows hourly tick marks but text
        // labels only every 2 hours for readability.
        const tickMarks = [];
        const timeLabels = [];
        const totalHours = this._getTimeframeHours();
        if (totalHours <= 12) {
            // 12H: tick marks every 1h, text labels every 2h
            for (let hh = 0; hh <= totalHours; hh += 1) {
                const fraction = hh / totalHours;
                tickMarks.push({ x: padLeft + fraction * chartW });
            }
            for (let hh = 0; hh <= totalHours; hh += 2) {
                const fraction = hh / totalHours;
                timeLabels.push({ label: `-${totalHours - hh}h`, x: padLeft + fraction * chartW });
            }
        }
        else if (totalHours <= 24) {
            // 24H: tick marks every 2h, text labels every 4h
            for (let hh = 0; hh <= totalHours; hh += 2) {
                const fraction = hh / totalHours;
                tickMarks.push({ x: padLeft + fraction * chartW });
            }
            for (let hh = 0; hh <= totalHours; hh += 4) {
                const fraction = hh / totalHours;
                timeLabels.push({ label: `-${totalHours - hh}h`, x: padLeft + fraction * chartW });
            }
        }
        else if (totalHours <= 48) {
            // 48H: tick marks every 3h, text labels every 6h
            for (let hh = 0; hh <= totalHours; hh += 3) {
                const fraction = hh / totalHours;
                tickMarks.push({ x: padLeft + fraction * chartW });
            }
            for (let hh = 0; hh <= totalHours; hh += 6) {
                const fraction = hh / totalHours;
                timeLabels.push({ label: `-${totalHours - hh}h`, x: padLeft + fraction * chartW });
            }
        }
        else {
            // 7D/14D/30D: tick marks and labels in days
            const totalDays = totalHours / 24;
            let labelStep;
            let tickStep;
            if (totalDays <= 7) {
                labelStep = 1;
                tickStep = 0.5;
            } // 7D: ticks every 12h, labels every 1d
            else if (totalDays <= 14) {
                labelStep = 2;
                tickStep = 1;
            } // 14D: ticks every 1d, labels every 2d
            else {
                labelStep = 5;
                tickStep = 2;
            } // 30D: ticks every 2d, labels every 5d
            for (let d = 0; d <= totalDays; d += tickStep) {
                const fraction = d / totalDays;
                tickMarks.push({ x: padLeft + fraction * chartW });
            }
            for (let d = 0; d <= totalDays; d += labelStep) {
                const fraction = d / totalDays;
                timeLabels.push({ label: `-${Math.round(totalDays - d)}d`, x: padLeft + fraction * chartW });
            }
        }
        return b `
      <div class="line-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${w$1} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: ${w$1}/${h}">
          <!-- Y-axis grid lines and labels -->
          ${[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = padTop + chartH * (1 - fraction);
            return w `
              <line x1="${padLeft}" y1="${y}" x2="${w$1 - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(11px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${(maxAmount * fraction).toFixed(1)}</text>
            `;
        })}

          <!-- History polyline -->
          <polyline points="${polylinePoints}"
                    fill="none" stroke="var(--primary-color)" stroke-width="1.5"
                    stroke-linejoin="round" opacity="0.8"/>

          <!-- Current amount dashed line -->
          ${amountInBody && amountInBody !== 'unavailable' ? w `
            <line x1="${padLeft}" y1="${currentY}" x2="${w$1 - padRight}" y2="${currentY}"
                  stroke="var(--primary-color)" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"/>
            <text x="${padLeft}" y="${currentLabelY}" style="font-size: calc(12px + var(--pill-text-offset, 0px))" fill="var(--primary-color)">
              Current: ${amountInBody} ${c.getStrengthUnit(entities)}
            </text>
          ` : A}

          <!-- X-axis baseline -->
          <line x1="${padLeft}" y1="${h - padBottom}" x2="${w$1 - padRight}" y2="${h - padBottom}"
                stroke="var(--divider-color)" stroke-width="1"/>

          <!-- X-axis tick marks (visual only, no text) -->
          ${tickMarks.map((tm) => w `
            <line x1="${tm.x}" y1="${h - padBottom}" x2="${tm.x}" y2="${h - padBottom + 3}"
                  stroke="var(--divider-color)" stroke-width="0.5" opacity="0.6"/>
          `)}

          <!-- X-axis time labels (with slightly longer tick) -->
          ${timeLabels.map((tl) => w `
            <line x1="${tl.x}" y1="${h - padBottom}" x2="${tl.x}" y2="${h - padBottom + 4}"
                  stroke="var(--divider-color)" stroke-width="1"/>
            <text x="${tl.x}" y="${h - 6}" text-anchor="middle"
                  style="font-size: calc(11px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${tl.label}</text>
          `)}
        </svg>
      </div>
    `;
    }
    // ── Effectiveness graph ─────────────────────
    // Daily-locked effectiveness metrics → one point per metric per day. The HA
    // recorder is the source of multi-day history (the integration's own store
    // only keeps today's value). Unlogged days were filtered out by the fetch,
    // so the polyline naturally gaps on those days (svg M move, no L line). The
    // 0–10 scale is fixed (backend PillEffectivenessSlider), so the Y-axis is
    // always 0–10.
    _getEffectivenessTimeframeDays() {
        switch (this.activeEffectivenessTimeframe) {
            case '30d': return 30;
            case '60d': return 60;
            default: return 14;
        }
    }
    _renderEffectivenessTimeframeChips() {
        const c = this.controller;
        const timeframes = [
            { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
            { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
            { id: '60d', labelKey: 'graphs.timeframe_60d', ariaKey: 'aria.timeframe_60d' },
        ];
        return timeframes.map((tf) => b `
      <button
        class="timeframe-chip ${this.activeEffectivenessTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => c.handleEffectivenessTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
    }
    // Stable color for a metricKey. Index is the metric's position in the sorted
    // list of all metric keys, so toggling visibility doesn't reassign colors.
    _metricColor(metricKey, allKeys) {
        const idx = allKeys.indexOf(metricKey);
        const colors = AxDoseGraphsPanel_1.METRIC_COLORS;
        return colors[(idx < 0 ? 0 : idx) % colors.length];
    }
    // Resample a metric's raw history into one value per day. Effectiveness is
    // daily-locked so there's at most a few points per day; we take the last
    // known value of each calendar day. Days with no points stay absent → gaps.
    _bucketByDay(series, days) {
        const buckets = new Map();
        if (!series.length)
            return buckets;
        const now = new Date();
        for (let d = 0; d < days; d++) {
            const day = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
            const key = day.toISOString().slice(0, 10);
            let dayValue = null;
            for (const p of series) {
                const pd = new Date(p.timestamp);
                if (pd.toISOString().slice(0, 10) === key) {
                    dayValue = p.value; // later points overwrite → last wins
                }
            }
            if (dayValue !== null)
                buckets.set(key, dayValue);
        }
        return buckets;
    }
    _renderEffectivenessGraph(entities) {
        this.controller;
        const metrics = entities.metrics;
        const days = this._getEffectivenessTimeframeDays();
        const allKeys = metrics.map((m) => m.metricKey).sort();
        const visibleMetrics = metrics.filter((m) => this.effectivenessVisible.has(m.metricKey));
        const dayMaps = new Map();
        let hasAnyData = false;
        for (const m of metrics) {
            const series = this.effectivenessHistory[m.metricKey] || [];
            const dm = this._bucketByDay(series, days);
            dayMaps.set(m.metricKey, dm);
            if (dm.size > 0)
                hasAnyData = true;
        }
        const now = new Date();
        const dayLabels = [];
        let labelStep;
        if (days <= 14)
            labelStep = 1;
        else if (days <= 30)
            labelStep = 2;
        else
            labelStep = 5;
        for (let d = days - 1; d >= 0; d -= 1) {
            const day = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
            const key = day.toISOString().slice(0, 10);
            // Day-of-month only (no month) so the font can be bigger and the date
            // numbers stay uniform with the Day tracker bar graph.
            const label = d % labelStep === 0
                ? `${day.getDate()}`
                : '';
            dayLabels.push({ key, label });
        }
        const w$1 = 320;
        // h bumped 180 -> 196 so chartH (h - padTop - padBottom = 196-28-24 = 144)
        // matches the bar graph's 144, giving all three graphs an equally-tall
        // Y axis.
        const h = 196;
        const padLeft = 28;
        const padRight = 8;
        // padTop matches the bar/line graphs (28) so the absolutely-positioned
        // timeframe chips (top: 4px) don't overlap the chart area.
        const padTop = 28;
        // padBottom makes room for the in-SVG date tick marks + labels (like the
        // Amount-in-Body line graph), not a separate .bar-labels div.
        const padBottom = 24;
        const chartW = w$1 - padLeft - padRight;
        const chartH = h - padTop - padBottom;
        const maxVal = 10;
        const avgSeries = [];
        for (const { key } of dayLabels) {
            const vals = [];
            for (const m of visibleMetrics) {
                const dm = dayMaps.get(m.metricKey);
                const v = dm?.get(key);
                if (typeof v === 'number')
                    vals.push(v);
            }
            avgSeries.push(vals.length ? { key, value: vals.reduce((a, b) => a + b, 0) / vals.length } : null);
        }
        const buildSegments = (points) => {
            const segments = [];
            let current = [];
            for (const p of points) {
                if (p === null) {
                    if (current.length) {
                        segments.push(current.join(' '));
                        current = [];
                    }
                }
                else {
                    current.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
                }
            }
            if (current.length)
                segments.push(current.join(' '));
            return segments;
        };
        const mapToPoints = (dm) => {
            return dayLabels.map((dl, i) => {
                const v = dm.get(dl.key);
                if (typeof v !== 'number')
                    return null;
                const x = padLeft + (i / Math.max(dayLabels.length - 1, 1)) * chartW;
                const y = padTop + chartH * (1 - v / maxVal);
                return { x, y };
            });
        };
        const showViewToggle = metrics.length > 1;
        const showTrackerRow = metrics.length > 1;
        if (!hasAnyData) {
            return b `
        <div class="bar-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderEffectivenessTimeframeChips()}
          </div>
          <div class="graph-placeholder">
            <ha-icon icon="mdi:clipboard-list"></ha-icon>
            <span>${localize(this._lang, 'graphs.empty_effectiveness')}</span>
          </div>
          ${this._renderEffectivenessBottomBar(metrics, allKeys, showViewToggle, showTrackerRow)}
        </div>
      `;
        }
        const chartBody = this.activeEffectivenessView === 'avg'
            ? (() => {
                const pts = avgSeries.map((a, i) => a
                    ? { x: padLeft + (i / Math.max(dayLabels.length - 1, 1)) * chartW, y: padTop + chartH * (1 - a.value / maxVal) }
                    : null);
                const segs = buildSegments(pts);
                return b `
            ${segs.map((s) => w `<polyline points="${s}" fill="none" stroke="var(--primary-color)" stroke-width="1.8" stroke-linejoin="round" opacity="0.9"/>`)}
            ${pts.map((p, i) => p ? w `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.2" fill="var(--primary-color)"><title>${dayLabels[i].key} : ${avgSeries[i].value.toFixed(1)} (avg)</title></circle>` : A)}
          `;
            })()
            : b `
          ${visibleMetrics.map((m) => {
                const color = this._metricColor(m.metricKey, allKeys);
                const dm = dayMaps.get(m.metricKey);
                const pts = mapToPoints(dm);
                const segs = buildSegments(pts);
                return b `
              ${segs.map((s) => w `<polyline points="${s}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" opacity="0.85"/>`)}
              ${pts.map((p, i) => p ? w `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2" fill="${color}"><title>${m.label} — ${dayLabels[i].key} : ${dm.get(dayLabels[i].key)}</title></circle>` : A)}
            `;
            })}
        `;
        return b `
      <div class="bar-graph-wrapper effectiveness-wrapper">
        <div class="timeframe-chips">
          ${this._renderEffectivenessTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${w$1} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: ${w$1}/${h}">
          ${Array.from({ length: maxVal + 1 }, (_, v) => v).map((v) => {
            const y = padTop + chartH * (1 - v / maxVal);
            // Lighter gridline for interior values; the 0 and max lines are
            // drawn by the explicit baseline below + the top edge, so only
            // label every integer and use a faint line for the in-between
            // values so the chart isn't visually crowded.
            return w `
              <line x1="${padLeft}" y1="${y}" x2="${w$1 - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="${v === 0 ? 0 : 0.35}"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(10px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${v}</text>
            `;
        })}
          ${chartBody}
          <line x1="${padLeft}" y1="${h - padBottom}" x2="${w$1 - padRight}" y2="${h - padBottom}"
                stroke="var(--divider-color)" stroke-width="1"/>
          ${dayLabels.map((dl, i) => {
            const x = padLeft + (i / Math.max(dayLabels.length - 1, 1)) * chartW;
            const baseline = h - padBottom;
            return w `
              ${dl.label ? w `
                <line x1="${x}" y1="${baseline}" x2="${x}" y2="${baseline + 4}"
                      stroke="var(--divider-color)" stroke-width="1"/>
                <text x="${x}" y="${baseline + 15}" text-anchor="middle"
                      style="font-size: calc(10px + var(--pill-text-offset, 0px))"
                      fill="var(--secondary-text-color)">${dl.label}</text>
              ` : w `
                <line x1="${x}" y1="${baseline}" x2="${x}" y2="${baseline + 3}"
                      stroke="var(--divider-color)" stroke-width="0.5" opacity="0.6"/>
              `}
            `;
        })}
        </svg>
        ${this._renderEffectivenessBottomBar(metrics, allKeys, showViewToggle, showTrackerRow)}
      </div>
    `;
    }
    // Bottom control bar: the Avg/Individual view toggle and the per-tracker
    // chips sit on ONE line, separated by a thin vertical divider. This keeps
    // the graph's control surface compact and avoids a two-row stack. When
    // there's only one metric (no view toggle, no tracker row), nothing renders.
    _renderEffectivenessBottomBar(metrics, allKeys, showViewToggle, showTrackerRow) {
        if (!showViewToggle && !showTrackerRow)
            return A;
        const c = this.controller;
        const view = this.activeEffectivenessView;
        const mkTab = (v, labelKey, ariaKey) => b `
      <button
        class="eff-view-tab ${view === v ? 'active' : ''}"
        role="tab"
        aria-selected=${view === v}
        aria-label=${localize(this._lang, ariaKey)}
        @click=${() => c.setEffectivenessView(v)}
      >${localize(this._lang, labelKey)}</button>
    `;
        return b `
      <div class="eff-bottom-bar">
        ${showViewToggle ? b `
          <div class="eff-view-toggle" role="tablist">
            ${mkTab('avg', 'graphs.effectiveness_avg', 'aria.effectiveness_avg')}
            ${mkTab('individual', 'graphs.effectiveness_individual', 'aria.effectiveness_individual')}
          </div>
          <span class="eff-bottom-separator"></span>
        ` : A}
        ${showTrackerRow ? b `
          <div class="eff-tracker-row">
            ${metrics.map((m) => {
            const color = this._metricColor(m.metricKey, allKeys);
            const on = this.effectivenessVisible.has(m.metricKey);
            return b `
                <button
                  class="eff-tracker-chip ${on ? 'on' : 'off'}"
                  aria-pressed=${on}
                  aria-label=${m.label}
                  @click=${() => c.toggleEffectivenessMetric(m.metricKey)}
                >
                  <span class="eff-swatch" style="background:${color}"></span>
                  <span class="eff-tracker-label">${m.label}</span>
                </button>
              `;
        })}
          </div>
        ` : A}
      </div>
    `;
    }
    _renderAveragesGrid(entities) {
        const c = this.controller;
        const items = [];
        const { hasDaysSensor, daysSince } = c.daysSinceReveal(entities);
        if (this._config?.show_day_avg_boxes !== false) {
            if (entities.avg7Days && (!hasDaysSensor || daysSince >= 7))
                items.push({ label: localize(this._lang, 'averages.avg_7_day'), value: c.getState(entities.avg7Days) });
            if (entities.avg14Days && (!hasDaysSensor || daysSince >= 14))
                items.push({ label: localize(this._lang, 'averages.avg_14_day'), value: c.getState(entities.avg14Days) });
            if (entities.avg30Days && (!hasDaysSensor || daysSince >= 30))
                items.push({ label: localize(this._lang, 'averages.avg_30_day'), value: c.getState(entities.avg30Days) });
            // Year slot doubles as the running elapsed-days average until 365 days pass.
            // The avgYearly sensor already computes min(days_since_start, 365), so its
            // value IS the running average from the first dose until the year mark.
            if (entities.avgYearly && (!hasDaysSensor || daysSince > 0)) {
                const label = (hasDaysSensor && daysSince < 365) ? localize(this._lang, 'averages.avg_running', { days: daysSince }) : localize(this._lang, 'averages.avg_year');
                items.push({ label, value: c.getState(entities.avgYearly) });
            }
        }
        if (this._config?.show_adherence_boxes !== false) {
            if (entities.adherence7Days && (!hasDaysSensor || daysSince >= 7))
                items.push({ label: localize(this._lang, 'averages.adh_7_day'), value: c.getState(entities.adherence7Days) + '%' });
            if (entities.adherence14Days && (!hasDaysSensor || daysSince >= 14))
                items.push({ label: localize(this._lang, 'averages.adh_14_day'), value: c.getState(entities.adherence14Days) + '%' });
            if (entities.adherence30Days && (!hasDaysSensor || daysSince >= 30))
                items.push({ label: localize(this._lang, 'averages.adh_30_day'), value: c.getState(entities.adherence30Days) + '%' });
            // 365d slot doubles as the running elapsed-days adherence until 365 days pass.
            if (entities.adherence365Days && (!hasDaysSensor || daysSince > 0)) {
                const label = (hasDaysSensor && daysSince < 365) ? localize(this._lang, 'averages.adh_running', { days: daysSince }) : localize(this._lang, 'averages.adh_365_day');
                items.push({ label, value: c.getState(entities.adherence365Days) + '%' });
            }
        }
        if (items.length === 0)
            return A;
        return b `
      <div class="averages-grid">
        ${items.map((item) => b `
          <div class="avg-cell">
            <span class="avg-label">${item.label}</span>
            <span class="avg-value">${item.value === 'unavailable' ? '-' : item.value}</span>
          </div>
        `)}
      </div>
    `;
    }
};
// Stable per-metric color palette. Indexed by sorted metricKey position so a
// metric keeps the same color across re-renders and visibility toggles. The
// first 8 metrics get distinct hues; extras cycle. Colors are hex (not HA
// CSS vars) because there is no multi-hue HA token set — the existing line
// graph used only --primary-color for its single series.
AxDoseGraphsPanel.METRIC_COLORS = [
    '#03a9f4', '#4caf50', '#ff9800', '#e91e63',
    '#9c27b0', '#00bcd4', '#ffc107', '#795548',
];
AxDoseGraphsPanel.styles = i$3 `
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
      font-weight: 500;
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
      right: 4px;
      display: flex;
      gap: 2px;
      z-index: 1;
    }

    .timeframe-chip {
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: none;
      font-family: inherit;
      transition: color 0.2s, background 0.2s;
      line-height: 1.4;
    }

    .timeframe-chip:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
    }

    .timeframe-chip.active {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
      font-weight: 600;
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
      font-weight: 600;
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
      font-weight: 500;
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
      font-weight: 600;
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
  `;
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "controller", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "entities", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "amountHistory", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "doseHistory", void 0);
__decorate([
    n({ type: Number })
], AxDoseGraphsPanel.prototype, "activeGraph", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "activeTimeframe", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "activeBarTimeframe", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "activeEffectivenessTimeframe", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "activeEffectivenessView", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "effectivenessHistory", void 0);
__decorate([
    n({ attribute: false })
], AxDoseGraphsPanel.prototype, "effectivenessVisible", void 0);
AxDoseGraphsPanel = AxDoseGraphsPanel_1 = __decorate([
    t('ax-dose-graphs-panel')
], AxDoseGraphsPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Drinks Pane (Master Tracker, Pane "drinks")
// ──────────────────────────────────────────────
// Shown when the selected device is a Master Tracker (Caffeine Tracker /
// Alcohol Tracker). Layout mirrors the Daily pane exactly:
//   - Centered .drinks-title (20px, weight 600, opens device-info dialog)
//     — identical to Daily's .med-name.
//   - .daily-main two-column row:
//       Left  (.log-drink-btn, flex:1): tinted-primary "Log Drink" button
//              styled like Daily's .take-pill-btn.safe (icon + label column).
//       Right (.stats-column, flex:1, gap 10px): two .stat-pill boxes
//              using Daily's transparency + 15px uppercase label / 18px
//              weight-600 value:
//                Top    "In Body"         — entities.amountInBody + unit (mg/g)
//                Bottom "Sleep Disruption" — entities.sleepDisruption state
//   No chips row (Drinks master has no chip config). Estimated Low Time was
//   intentionally removed to keep exactly 2 right boxes, identical to Daily.
let AxDoseDrinksPanel = class AxDoseDrinksPanel extends i {
    get _lang() {
        return this.controller.lang;
    }
    render() {
        const c = this.controller;
        const e = this.entities;
        const substance = e.substance;
        const substanceLabel = substance === 'alcohol'
            ? localize(this._lang, 'drinks.alcohol')
            : localize(this._lang, 'drinks.caffeine');
        // Default icon by substance — mirrors Daily's per-state icon convention.
        // A user-configurable log_drink_icon override is planned but not yet wired
        // into the config schema; this default covers both substances.
        const logDrinkIcon = substance === 'alcohol'
            ? 'mdi:glass-mug-variant'
            : 'mdi:coffee';
        // "Last" counter — identical to Daily's take-sub. The resolver populates
        // entities.lastDose for drink masters from the pk_model body-mass sensor's
        // last_dose_time attribute (see ax-dose-logger-card.ts), so the controller
        // helper works here without any backend change. Drink masters have no
        // Next/Overdue concept (no schedule), so the sub-line is the single
        // "Last: …" segment, matching Daily's simplest branch.
        const timeSince = c.computeTimeSinceLastDose(e);
        // In Body value — master body-mass sensor + substance unit (mg/g).
        // Card displays the value rounded to 0 decimals (integer); the backend
        // sensor stores 1 decimal (see drink_master.py), but the card box shows
        // a clean integer for compactness.
        const unit = c.getStrengthUnit(e);
        const rawBody = e.amountInBody ? c.getState(e.amountInBody) : '';
        const bodyKnown = !!(e.amountInBody && rawBody && rawBody !== 'unknown' && rawBody !== 'unavailable');
        const bodyNum = parseFloat(rawBody);
        const inBodyValue = bodyKnown
            ? `${isNaN(bodyNum) ? rawBody : Math.round(bodyNum)} ${unit}`
            : localize(this._lang, 'daily.na');
        // Sleep Disruption readout (None/Low/Moderate/High) — title-cased first
        // letter, matching the swapped Safe-to-Take box display convention.
        const rawSleep = e.sleepDisruption ? c.getState(e.sleepDisruption) : '';
        const sleepKnown = !!(e.sleepDisruption && rawSleep && rawSleep !== 'unknown' && rawSleep !== 'unavailable');
        const sleepValue = sleepKnown
            ? (rawSleep.charAt(0).toUpperCase() + rawSleep.slice(1))
            : localize(this._lang, 'daily.na');
        return b `
      <div class="pane pane-drinks">
        <div class="drinks-title"
             role="button" tabindex="0"
             aria-label=${localize(this._lang, 'dialog.device_info.aria')}
             @click=${() => c.showDeviceInfo()}
             @keydown=${(ev) => c.onKeyActivate(ev, () => c.showDeviceInfo())}
        >${substanceLabel}</div>

        <div class="daily-main">
          <button
            class="log-drink-btn safe"
            aria-label=${localize(this._lang, 'drinks.log_drink')}
            ?disabled=${!substance}
            @click=${() => substance && c.showLogDrinkDialog(substance)}
          >
            <ha-icon icon="${logDrinkIcon}"></ha-icon>
            <span class="take-label">${localize(this._lang, 'drinks.log_drink')}</span>
            <span class="take-sub"><span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span></span>
          </button>

          <div class="stats-column">
            <div class="stat-pill"
                 role="button"
                 tabindex="0"
                 aria-label=${localize(this._lang, 'drinks.in_body')}
                 @click=${e.amountInBody ? () => c.openMoreInfo(e.amountInBody) : null}
                 @keydown=${e.amountInBody ? (ev) => c.onKeyActivate(ev, () => c.openMoreInfo(e.amountInBody)) : null}>
              <ha-icon icon="mdi:chart-bell-curve"></ha-icon>
              <span class="stat-label">${localize(this._lang, 'drinks.in_body')}</span>
              <span class="stat-value">${inBodyValue}</span>
            </div>
            <div class="stat-pill"
                 role="button"
                 tabindex="0"
                 aria-label=${localize(this._lang, 'drinks.disruption')}
                 @click=${e.sleepDisruption && substance ? () => c.showSleepDisruptionDialog(substance) : null}
                 @keydown=${e.sleepDisruption && substance ? (ev) => c.onKeyActivate(ev, () => c.showSleepDisruptionDialog(substance)) : null}>
              <ha-icon icon="mdi:sleep"></ha-icon>
              <span class="stat-label">${localize(this._lang, 'drinks.disruption')}</span>
              <span class="stat-value">${sleepValue}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    }
};
AxDoseDrinksPanel.styles = i$3 `
    .pane-drinks {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .drinks-title {
      font-size: calc(20px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      text-align: center;
      cursor: pointer;
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
      transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      flex: 1;
    }

    .log-drink-btn:active {
      transform: scale(0.96);
    }

    .log-drink-btn.safe {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
    }

    .log-drink-btn.safe:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
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
      font-weight: 550;
    }

    /* ── .take-sub — verbatim from daily-panel.ts ── */
    .take-sub {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: 450;
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
      padding: 12px 14px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: var(--ha-card-border-radius, 12px);
      cursor: pointer;
    }

    .stat-pill:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
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
    }

    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-left: auto;
    }
  `;
__decorate([
    n({ attribute: false })
], AxDoseDrinksPanel.prototype, "controller", void 0);
__decorate([
    n({ attribute: false })
], AxDoseDrinksPanel.prototype, "entities", void 0);
__decorate([
    n({ attribute: false })
], AxDoseDrinksPanel.prototype, "hass", void 0);
AxDoseDrinksPanel = __decorate([
    t('ax-dose-drinks-panel')
], AxDoseDrinksPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Inventory Pane (Master Tracker, Pane "inventory")
// ──────────────────────────────────────────────
// 2-column grid, one row per granular drink of the master's substance:
//   col 1: clickable refill box (drink name + stock value) → opens the
//          refill dialog targeted at that drink's add_stock number entity.
//   col 2: 7-day avg + trailing-dynamic-to-365-day avg (reuses the medicine
//          "Running N-Day Avg" reveal logic via drinkDaysSinceReveal, reading
//          history_start_date on the 365-day avg sensor).
let AxDoseInventoryPanel = class AxDoseInventoryPanel extends i {
    get _lang() {
        return this.controller.lang;
    }
    render() {
        const c = this.controller;
        const substance = this.entities.substance;
        if (!substance)
            return A;
        const drinks = c.getDrinksOfSubstance(substance);
        if (drinks.length === 0) {
            return b `
        <div class="pane pane-inventory">
          <div class="inv-empty">
            <ha-icon icon="mdi:package-variant-closed"></ha-icon>
            <span>${localize(this._lang, 'inventory.empty')}</span>
          </div>
        </div>
      `;
        }
        const substanceIcon = substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee';
        return b `
      <div class="pane pane-inventory">
        <div class="inv-grid">
          ${drinks.map((d) => this._renderRow(d, substanceIcon))}
        </div>
      </div>
    `;
    }
    _renderRow(d, substanceIcon) {
        const c = this.controller;
        // Column 1 — refill box.
        const stockState = d.stockEntityId ? c.getState(d.stockEntityId) : '';
        const stockNum = parseInt(stockState, 10);
        const stockDisplay = isNaN(stockNum) ? '-' : c.formatInteger(String(stockNum));
        const canRefill = !!d.addStockEntityId;
        // Column 2 — averages.
        const avg7 = d.avg7EntityId ? c.getState(d.avg7EntityId) : '';
        const avg7Display = (avg7 && avg7 !== 'unknown' && avg7 !== 'unavailable') ? avg7 : '-';
        const { hasDaysSensor, daysSince } = c.drinkDaysSinceReveal(d.avg365EntityId);
        const avg365 = d.avg365EntityId ? c.getState(d.avg365EntityId) : '';
        const avg365Display = (avg365 && avg365 !== 'unknown' && avg365 !== 'unavailable') ? avg365 : '-';
        // Trailing dynamic label: "Running N-Day Avg" until 365 days, then "Year Avg".
        const trailingLabel = (hasDaysSensor && daysSince < 365)
            ? localize(this._lang, 'stats.avg_running', { days: String(daysSince) })
            : localize(this._lang, 'stats.avg_yearly');
        return b `
      <div class="inv-row">
        <div
          class="stat-pill ${canRefill ? 'clickable' : ''}"
          role=${canRefill ? 'button' : A}
          tabindex=${canRefill ? '0' : A}
          aria-label=${localize(this._lang, 'dialog.refill.aria')}
          @click=${canRefill && d.addStockEntityId ? () => c.showRefillDialogFor(d.addStockEntityId, d.name) : null}
          @keydown=${canRefill ? (ev) => c.onKeyActivate(ev, () => d.addStockEntityId && c.showRefillDialogFor(d.addStockEntityId, d.name)) : null}
        >
          <ha-icon icon="${substanceIcon}"></ha-icon>
          <span class="stat-label">${d.name}</span>
          <span class="stat-value">${stockDisplay}</span>
        </div>
        <div class="avg-cell">
          <div class="avg-line">
            <span class="avg-label">${localize(this._lang, 'inventory.avg_7_day')}</span>
            <span class="avg-value">${avg7Display}</span>
          </div>
          <div class="avg-line">
            <span class="avg-label">${trailingLabel}</span>
            <span class="avg-value">${avg365Display}</span>
          </div>
        </div>
      </div>
    `;
    }
};
AxDoseInventoryPanel.styles = i$3 `
    /* ── Container parity with .pane-daily / .pane-drinks ── */
    .pane-inventory {
      display: flex;
      flex-direction: column;
      gap: 12px;
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

    .inv-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .inv-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    /* ── .stat-pill — verbatim from daily-panel.ts / drinks-panel.ts ──
       (primary-tinted transparency, no border, 12px 14px padding, 8px gap,
       20px primary-tinted icon at opacity 0.7). */
    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: var(--ha-card-border-radius, 12px);
    }
    .stat-pill.clickable {
      cursor: pointer;
    }
    .stat-pill.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }
    .stat-pill.clickable:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .stat-pill ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    /* ── .stat-label — Daily/Drinks parity for size/color/letter-spacing,
       with a per-element case override: text-transform: uppercase is
       intentionally OMITTED because col-1's label is the drink's configured
       proper-noun name ("Coffee", "Espresso"), which should keep its
       natural case. The sub-labels in .avg-cell below keep natural case
       too (they were never uppercased). */
    .stat-label {
      flex: 1;
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      letter-spacing: 0.5px;
    }

    /* ── .stat-value — verbatim from daily-panel.ts / drinks-panel.ts ── */
    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-left: auto;
    }

    /* ── .avg-cell — col-2 averages box. No Daily equivalent; adopts the
       same primary-tinted transparency surface as .stat-pill for parity,
       keeps its two-row .avg-line internal layout. Padding/gap compressed
       (12px→10px / 6px→4px) and .avg-value sized 18px→16px so the cell's
       natural height matches the Stats panel's .stat-cell (~72px); the
       col-1 .stat-pill stretches to the same height via grid
       align-items: stretch, so both Inventory boxes match the Stats box
       height. */
    .avg-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
      padding: 10px 14px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
    }
    .avg-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .avg-label {
      font-size: calc(13px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
    }
    /* ── .avg-value — sized to match .stat-value for visual parity ── */
    .avg-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-left: auto;
    }

    @media (max-width: 380px) {
      .inv-row { grid-template-columns: 1fr; }
    }
  `;
__decorate([
    n({ attribute: false })
], AxDoseInventoryPanel.prototype, "controller", void 0);
__decorate([
    n({ attribute: false })
], AxDoseInventoryPanel.prototype, "entities", void 0);
__decorate([
    n({ attribute: false })
], AxDoseInventoryPanel.prototype, "hass", void 0);
AxDoseInventoryPanel = __decorate([
    t('ax-dose-inventory-panel')
], AxDoseInventoryPanel);

// ──────────────────────────────────────────────
// AxDoseLoggerCard — Main Card Class (Container)
// ──────────────────────────────────────────────
class AxDoseLoggerCard extends i {
    constructor() {
        super(...arguments);
        this._activePane = 'daily';
        this._activeGraph = 0;
        this._amountHistory = [];
        this._doseHistory = [];
        this._showDeviceInfo = false;
        this._showRefillDialog = false;
        this._refillAmount = '';
        // Refill dialog target. When undefined the dialog targets the medicine
        // device's own addRefill entity (entities.addRefill); when set (Master
        // Tracker Inventory panel) it targets a specific granular drink's
        // add_stock number entity + shows that drink's name in the header.
        this._refillTarget = null;
        // Log Drink popup (Master Tracker Drinks panel). When open, shows a grid of
        // granular drink buttons for the master's substance; pressing one calls
        // button.press on that drink's DrinkLogButton and closes the dialog.
        this._showLogDrinkDialog = false;
        this._logDrinkSubstance = null;
        // Sleep Disruption popup (Master Tracker Drinks panel). When open, renders
        // a substance-aware markdown description of how the current body-mass load
        // affects sleep (caffeine vs alcohol), via HA's native ha-markdown element.
        this._showSleepDisruptionDialog = false;
        this._sleepDisruptionSubstance = null;
        this._activeTimeframe = '48h';
        this._activeBarTimeframe = '14d';
        // Effectiveness-graph state. Mirrors the bar/line graph pattern but keyed
        // separately so the three carousel slides don't clobber each other's chips.
        // _effectivenessHistory is keyed by metricKey; _effectivenessVisible is the
        // set of metricKeys currently toggled on (defaults to all metrics). The view
        // toggle ('avg' | 'individual') only matters when metrics.length > 1; the
        // panel hides it for single-metric devices.
        this._activeEffectivenessTimeframe = '14d';
        this._activeEffectivenessView = 'avg';
        this._effectivenessHistory = {};
        this._effectivenessVisible = new Set();
        this._toolsDialog = null;
        // Pill-limit override warning dialog (#6): replaces the synchronous native
        // confirm() box. When non-null, _renderOverrideDialog() shows an ha-dialog
        // asking the user to confirm taking a pill past the safe limit. The body text
        // and time source branch by tracking type: scheduled meds show the next
        // designated dose time (next_dose sensor); As Needed meds show when the
        // rolling safety window resets (window_expires_at attribute).
        this._overrideDialog = null;
        // Tracking override warning dialog: when user tries to change a daily-locked
        // tracking value that has already been set today, this dialog asks for confirmation.
        this._trackingOverrideDialog = null;
        // Tracks entity IDs that have been set but whose HA state hasn't propagated yet.
        // Prevents the override-dialog race condition: without this, a second drag before
        // the first set_value completes would read stale logged_today=false and bypass
        // the override dialog. Cleared in updated() once HA confirms logged_today=true.
        this._pendingTracking = new Set();
        // ── Render-performance optimization ─────────
        // _tick: bumped every 30s by a timer so time-relative panes (daily/stats)
        // refresh their "Xh XXm" countdowns without re-rendering on every system-wide
        // state change. Previously the whole card re-rendered on every HA state tick;
        // with shouldUpdate gating, this timer is what keeps the countdowns live.
        this._tick = 0;
        this._tickTimer = null;
        // Entity-resolution cache (#5): _resolveEntities() previously did an O(n) scan
        // of every HA entity on every render. Cache the result and only re-resolve when
        // the configured device_id changes or the hass.entities registry reference
        // changes (HA replaces this object when the entity registry is updated).
        this._resolvedEntities = null;
        this._resolvedDeviceId = '';
        this._resolvedEntitiesRef = null;
        // In-flight fetch management (#3 + #4):
        //  - Separate per-fetch-type tokens prevent cross-stream invalidation. When
        //    both _fetchAmountHistory and _fetchDoseHistory fire on pane entry, a
        //    shared token caused the second call's ++ to invalidate the first call's
        //    result. Each fetch now captures its own token; after `await`, if the
        //    token no longer matches, the result is discarded. disconnectedCallback
        //    bumps both tokens to invalidate all in-flight fetches on disconnect.
        this._amountFetchToken = 0;
        this._doseFetchToken = 0;
        this._effectivenessFetchToken = 0;
    }
    // ── Configuration ──────────────────────────
    setConfig(config) {
        // Backward compat: convert legacy chips[] array to flat chip_N fields
        const raw = config;
        if (Array.isArray(raw.chips)) {
            const chips = raw.chips;
            const mapped = {};
            chips.forEach((c, i) => {
                if (c)
                    mapped[`chip_${i + 1}`] = c;
            });
            const { chips: _chips, ...rest } = raw;
            config = { ...rest, ...mapped };
        }
        // HA contract: throw on invalid config so HA renders an error card with
        // the message. We check for null/undefined (key missing in YAML) but NOT
        // empty string — getStubConfig() returns { device_id: '' } when the card
        // is first added in the visual editor, and that stub case should render
        // the friendly "Please select a device" placeholder in render(), not an
        // error card.
        if (config.device_id == null) {
            throw new Error(localize('en', 'setconfig.error.device_required'));
        }
        const prevDeviceId = this.config?.device_id;
        // Store the raw user config without baking in defaults (#18). All read
        // sites already use the `!== false` pattern (treating undefined as true),
        // so the defaults were redundant — and baking them in polluted persisted
        // YAML and masked future default changes. Now the stored config contains
        // only what the user explicitly set.
        this.config = config;
        // If the device changed, the cached entity map is stale — drop it so the
        // next _resolveEntities() call re-scans for the new device's entities.
        if (prevDeviceId !== this.config.device_id) {
            this._invalidateEntityCache();
        }
    }
    // ── Entity Resolution ──────────────────────
    /**
     * Returns the resolved entity map for the configured device, using a cache
     * so the O(n) scan of hass.entities only runs when the device_id or the
     * entity registry reference actually changes (HA replaces the `entities`
     * object when the registry is updated). Callers that need a fresh scan
     * (e.g. after a config change) should call _invalidateEntityCache() first.
     */
    _resolveEntities() {
        if (!this.hass || !this.config) {
            return { medicationName: 'Medication', metrics: [] };
        }
        const deviceId = this.config.device_id;
        const entitiesRef = this.hass.entities;
        if (this._resolvedEntities &&
            this._resolvedDeviceId === deviceId &&
            this._resolvedEntitiesRef === entitiesRef) {
            return this._resolvedEntities;
        }
        const result = this._computeEntities(deviceId);
        this._resolvedEntities = result;
        this._resolvedDeviceId = deviceId;
        this._resolvedEntitiesRef = entitiesRef;
        return result;
    }
    /** Force the next _resolveEntities() call to re-scan. */
    _invalidateEntityCache() {
        this._resolvedEntities = null;
        this._resolvedEntitiesRef = null;
    }
    _computeEntities(deviceId) {
        const result = { medicationName: 'Medication', metrics: [] };
        if (!this.hass)
            return result;
        // Extract medication name from device registry
        if (this.hass.devices?.[deviceId]?.name) {
            result.medicationName = this.hass.devices[deviceId].name;
        }
        // Iterate all entities to find those belonging to this device
        for (const [entityId, entityInfo] of Object.entries(this.hass.entities)) {
            if (entityInfo.device_id !== deviceId)
                continue;
            // Fallback: extract medication name from first matching entity
            if (result.medicationName === 'Medication' && entityInfo.name) {
                result.medicationName = entityInfo.name;
            }
            // Categorize by domain and suffix
            if (entityId.startsWith('sensor.')) {
                if (entityId.endsWith('_total_doses'))
                    result.totalDoses = entityId;
                else if (entityId.endsWith('_last_dose'))
                    result.lastDose = entityId;
                else if (entityId.endsWith('_pills_safe_to_take'))
                    result.pillsSafeToTake = entityId;
                else if (entityId.endsWith('_amount_in_body'))
                    result.amountInBody = entityId;
                else if (entityId.endsWith('_next_dose'))
                    result.nextDose = entityId;
                else if (entityId.endsWith('_overdue'))
                    result.overdue = entityId;
                else if (entityId.endsWith('_avg_daily_doses_7_days'))
                    result.avg7Days = entityId;
                else if (entityId.endsWith('_avg_daily_doses_14_days'))
                    result.avg14Days = entityId;
                else if (entityId.endsWith('_avg_daily_doses_30_days'))
                    result.avg30Days = entityId;
                else if (entityId.endsWith('_avg_daily_doses_365_days') || entityId.endsWith('_avg_daily_doses_yearly'))
                    result.avgYearly = entityId;
                else if (entityId.endsWith('_adherence_7_days'))
                    result.adherence7Days = entityId;
                else if (entityId.endsWith('_adherence_14_days'))
                    result.adherence14Days = entityId;
                else if (entityId.endsWith('_adherence_30_days'))
                    result.adherence30Days = entityId;
                else if (entityId.endsWith('_adherence_365_days'))
                    result.adherence365Days = entityId;
                else if (entityId.endsWith('_days_since_first_dose'))
                    result.daysSinceFirstDose = entityId;
                else if (entityId.endsWith('_days_to_steady_state'))
                    result.steadyState = entityId;
                else if (entityId.endsWith('_strength'))
                    result.strength = entityId;
            }
            else if (entityId.startsWith('button.')) {
                if (entityId.endsWith('_take'))
                    result.takeButton = entityId;
                else if (entityId.endsWith('_reset_history'))
                    result.resetButton = entityId;
                else if (entityId.endsWith('_undo_dose'))
                    result.undoButton = entityId;
                else if (entityId.endsWith('_reset_adherence'))
                    result.adherenceResetButton = entityId;
                else if (entityId.endsWith('_cover_last_missed'))
                    result.adherenceCoverButton = entityId;
            }
            else if (entityId.startsWith('number.')) {
                if (entityId.endsWith('_pills_left'))
                    result.pillsLeft = entityId;
                else if (entityId.endsWith('_add_refill'))
                    result.addRefill = entityId;
                else if (entityId.endsWith('_effectiveness')) {
                    // Effectiveness tracking slider — collect for the Tracking pane
                    // Entity ID pattern: number.{device}_{metric_slug}_effectiveness
                    // metric_label is the clean metric name (e.g. "Pain") exposed by the backend
                    // — friendly_name includes the device prefix (e.g. "Ibuprofen Pain Effectiveness")
                    const metricLabel = this._getAttr(entityId, 'metric_label');
                    const label = metricLabel || entityInfo.name?.replace(/\s+Effectiveness$/i, '') || entityId;
                    const metricKey = this._getAttr(entityId, 'metric_key') || '';
                    result.metrics.push({ entityId, label, metricKey });
                }
            }
        }
        // ── Master Tracker (Caffeine/Alcohol) + granular drink detection ──
        // Master tracker entities use different suffixes (drink_master_*,
        // sleep_disruption, estimated_low_time) than medicine entities, so the
        // suffix loop above does not populate ResolvedEntities for them.  Detect
        // them by state attributes (`drink_master: True` for masters,
        // `device_type: "drink"` for granular drinks) and populate the master
        // fields.  Granular drink devices set deviceType='drink' so render() can
        // show the redirect placeholder.
        let isMaster = false;
        let isGranularDrink = false;
        for (const [entityId, entityInfo] of Object.entries(this.hass.entities)) {
            if (entityInfo.device_id !== deviceId)
                continue;
            const drinkMaster = this._getAttr(entityId, 'drink_master');
            const dt = (this._getAttr(entityId, 'device_type') || '').toLowerCase();
            if (drinkMaster === true) {
                isMaster = true;
                const substance = (this._getAttr(entityId, 'substance') || '').toLowerCase();
                if (substance === 'caffeine' || substance === 'alcohol')
                    result.substance = substance;
                // Body-mass sensor: has pk_model attribute + no window_days.
                if (this._getAttr(entityId, 'pk_model') && this._getAttr(entityId, 'window_days') === undefined) {
                    result.amountInBody = entityId;
                }
                // Avg sensors: have window_days attribute.
                const wd = this._getAttr(entityId, 'window_days');
                if (wd !== undefined && wd !== null) {
                    if (wd === 7)
                        result.avg7Days = entityId;
                    else if (wd === 14)
                        result.avg14Days = entityId;
                    else if (wd === 30)
                        result.avg30Days = entityId;
                    else if (wd === 365)
                        result.avgYearly = entityId;
                }
                // Master-specific sensors are classified by the backend `role` STATE
                // ATTRIBUTE, NOT entity_id suffix. HA derives entity_id from
                // slugify(translated_name), so the old suffix matches (e.g.
                // `.sleep_disruption_caffeine`, `.drink_master_last_dose_caffeine`,
                // `_daily_amount_`) never matched the name-derived entity_ids
                // (sensor.caffeine_tracker_sleep_disruption, …_last_caffeine,
                // …_amount_in_last_24h) → Disruption showed N/A, Last showed "Never",
                // Amount-in-24h was undefined. State attributes survive renames and
                // are present on hass.states (unlike unique_id, which the
                // list_for_display websocket omits).
                const masterRole = this._getAttr(entityId, 'role');
                if (masterRole === 'daily_amount')
                    result.amountLast24h = entityId;
                else if (masterRole === 'sleep_disruption')
                    result.sleepDisruption = entityId;
                else if (masterRole === 'estimated_low_time')
                    result.estimatedLowTime = entityId;
                // Dedicated Master Tracker last-dose TIMESTAMP sensor — its state IS
                // the last-dose timestamp (single source of truth), so the Daily
                // panel's computeTimeSinceLastDose helper works unchanged for masters.
                else if (masterRole === 'last_dose')
                    result.lastDose = entityId;
                // totalDoses maps to the body-mass sensor, which still carries the
                // dose_count attribute for the Stats panel's total-doses row.
                if (this._getAttr(entityId, 'dose_count') !== undefined && this._getAttr(entityId, 'pk_model')) {
                    result.totalDoses = entityId;
                }
            }
            else if (dt === 'drink') {
                isGranularDrink = true;
                const substance = (this._getAttr(entityId, 'substance') || '').toLowerCase();
                if (substance === 'caffeine' || substance === 'alcohol')
                    result.substance = substance;
            }
        }
        if (isMaster) {
            result.deviceType = 'drink_master';
        }
        else if (isGranularDrink) {
            result.deviceType = 'drink';
        }
        return result;
    }
    // ── Chip Helpers ───────────────────────────
    _getChipEntities() {
        if (!this.config)
            return [];
        const chips = [];
        for (const key of ['chip_1', 'chip_2', 'chip_3', 'chip_4']) {
            const val = this.config[key];
            if (val) {
                const labelKey = `${key}_label`;
                chips.push({ entityId: val, label: this.config[labelKey] });
            }
        }
        return chips;
    }
    // ── State Helpers ──────────────────────────
    _getState(entityId) {
        return getState(this.hass, entityId);
    }
    _getAttr(entityId, attr) {
        return getAttr(this.hass, entityId, attr);
    }
    _getStrengthUnit(entities) {
        // Medicine devices expose a `strength` sensor with a `strength_unit` attr.
        // Master Trackers have no strength sensor; read the native unit off the
        // body-mass (amountInBody) sensor instead so alcohol masters show "g" and
        // caffeine masters show "mg" in the Graph + Stats panels.
        const unit = this._getAttr(entities.strength, 'strength_unit');
        if (typeof unit === 'string' && unit)
            return unit;
        const bodyUnit = this._getAttr(entities.amountInBody, 'unit_of_measurement');
        return (typeof bodyUnit === 'string' && bodyUnit) ? bodyUnit : 'mg';
    }
    _formatInteger(value) {
        return formatInteger(value);
    }
    // ── Color Scheme ───────────────────────────
    _getColorOverrides() {
        return getColorOverrides(this.config?.color_scheme);
    }
    // ── Dose History ───────────────────────────
    _toLocalDateKey(d) {
        return toLocalDateKey(d);
    }
    _bucketByDay(dayCount = 14) {
        const buckets = {};
        // Count doses per day from custom API data
        // Each entry is [iso_timestamp, strength]
        // Use local timezone for date bucketing (NOT .toISOString() which shifts to UTC)
        for (const entry of this._doseHistory) {
            const key = this._toLocalDateKey(new Date(entry[0]));
            buckets[key] = (buckets[key] || 0) + 1;
        }
        const result = [];
        const now = new Date();
        for (let i = dayCount - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = this._toLocalDateKey(d);
            result.push({
                date: key,
                label: d.getDate().toString(),
                count: buckets[key] || 0,
            });
        }
        return result;
    }
    // ── Computed Values ────────────────────────
    _computeNextDose(entities) {
        const state = this._getState(entities.nextDose);
        if (state === 'unavailable' || state === 'unknown')
            return 'Unavailable';
        try {
            const next = new Date(state);
            const now = new Date();
            if (isNaN(next.getTime()) || next <= now)
                return 'now';
            const diffMs = Math.max(0, next.getTime() - now.getTime());
            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            if (hours > 0)
                return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
        catch (e) {
            console.warn('[ax-dose-logger-card] _computeNextDose failed:', e);
            return 'Unavailable';
        }
    }
    /**
     * For scheduled medications, returns how long the user is PAST their
     * scheduled next-dose time, formatted as "Xh XXm". Returns null when:
     *   - tracking_type is "As Needed" (no preset schedule)
     *   - next_dose is unavailable/unknown
     *   - next_dose is still in the future (not yet overdue)
     */
    _computeOverTime(entities) {
        const trackingType = this._getAttr(entities.nextDose, 'tracking_type');
        if (trackingType === 'As Needed')
            return null;
        const state = this._getState(entities.overdue);
        if (state === 'unavailable' || state === 'unknown' || !state)
            return null;
        const seconds = parseFloat(state);
        if (isNaN(seconds) || seconds <= 0)
            return null;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0)
            return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }
    /**
     * Compute a human-readable label for when the pill-limit rolling window
     * resets (i.e. when safe_to_take will increment). Reads the
     * `window_expires_at` attribute exposed by the Pills Safe to Take sensor.
     * Falls back to the next_dose sensor for back-compat with older backends
     * that don't expose window_expires_at.
     */
    _computeWindowExpiry(entities) {
        const expiresAt = this._getAttr(entities.pillsSafeToTake, 'window_expires_at');
        if (expiresAt && typeof expiresAt === 'string') {
            try {
                const exp = new Date(expiresAt);
                const now = new Date();
                if (!isNaN(exp.getTime()) && exp > now) {
                    const diffMs = exp.getTime() - now.getTime();
                    const hours = Math.floor(diffMs / 3600000);
                    const minutes = Math.floor((diffMs % 3600000) / 60000);
                    if (hours > 0)
                        return `${hours}h ${minutes}m`;
                    return `${minutes}m`;
                }
            }
            catch (e) {
                console.warn('[ax-dose-logger-card] _computeWindowExpiry failed:', e);
                // fall through to next_dose fallback
            }
        }
        return this._computeNextDose(entities);
    }
    /**
     * Format an absolute Date as a locale-aware clock time for the override
     * dialog. Same-day times use formatTime (e.g. "2:30 PM"); cross-day times
     * (next dose is tomorrow+) use formatDateTime so the date is visible.
     * Falls back to toLocaleTimeString() if hass.locale is unavailable.
     */
    _formatOverrideTime(date) {
        if (!this.hass?.locale)
            return date.toLocaleTimeString();
        const now = new Date();
        const sameDay = date.getFullYear() === now.getFullYear()
            && date.getMonth() === now.getMonth()
            && date.getDate() === now.getDate();
        return sameDay
            ? formatTime(date, this.hass.locale)
            : formatDateTime(date, this.hass.locale);
    }
    _computeTimeSinceLastDose(entities) {
        const state = this._getState(entities.lastDose);
        if (state === 'unavailable' || state === 'unknown' || state === 'None' || !state) {
            return 'Never';
        }
        try {
            const last = new Date(state);
            const now = new Date();
            if (isNaN(last.getTime()))
                return 'Never';
            const diffMs = Math.max(0, now.getTime() - last.getTime());
            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            if (hours > 0)
                return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
        catch (e) {
            console.warn('[ax-dose-logger-card] _computeTimeSinceLastDose failed:', e);
            return 'Never';
        }
    }
    // ── Computed Values: Timeframe ─────────────
    _getTimeframeHours() {
        switch (this._activeTimeframe) {
            case '12h': return 12;
            case '24h': return 24;
            case '7d': return 168;
            case '14d': return 336;
            case '30d': return 720;
            default: return 48;
        }
    }
    // ── Actions ────────────────────────────────
    _handleTakePill(entities) {
        if (!this.hass || !entities.takeButton)
            return;
        const safeState = this._getState(entities.pillsSafeToTake);
        const safeCount = parseInt(safeState, 10);
        if (!isNaN(safeCount) && safeCount <= 0) {
            // Pill limit reached: show the HA-native override confirmation dialog
            // instead of the synchronous browser confirm() box (#6). The actual
            // button.press call happens in the dialog's Confirm handler.
            //
            // Body text + time source branch by tracking type:
            //   - Scheduled (regular_interval / time_of_day / cyclic): show the next
            //     designated dose time from the next_dose sensor.
            //   - As Needed (PRN): show when the rolling safety window resets via the
            //     window_expires_at attribute on the pills_safe_to_take sensor.
            // tracking_type is normalized defensively (snake_case "as_needed" and
            // legacy title-case "As Needed") since the backend stores snake_case
            // (const.py) but older deployments may expose title-case.
            const tt = (this._getAttr(entities.nextDose, 'tracking_type') || '').toLowerCase();
            const isAsNeeded = tt === 'as_needed' || tt === 'as needed';
            let timeLabel;
            let bodyKey;
            if (isAsNeeded) {
                const expiresAt = this._getAttr(entities.pillsSafeToTake, 'window_expires_at');
                const expDate = expiresAt ? new Date(expiresAt) : null;
                if (expDate && !isNaN(expDate.getTime())) {
                    timeLabel = this._formatOverrideTime(expDate);
                    bodyKey = 'dialog.override.body_as_needed';
                }
                else {
                    // Fallback: backend without window_expires_at — show relative duration.
                    timeLabel = this._computeWindowExpiry(entities);
                    bodyKey = 'dialog.override.body_as_needed';
                }
            }
            else {
                const nextDoseState = this._getState(entities.nextDose);
                const nextDate = (nextDoseState && nextDoseState !== 'unavailable' && nextDoseState !== 'unknown')
                    ? new Date(nextDoseState) : null;
                if (nextDate && !isNaN(nextDate.getTime()) && nextDate > new Date()) {
                    timeLabel = this._formatOverrideTime(nextDate);
                    bodyKey = 'dialog.override.body_scheduled';
                }
                else {
                    // Fallback: next_dose unavailable or already past — relative duration.
                    timeLabel = this._computeWindowExpiry(entities);
                    bodyKey = 'dialog.override.body_scheduled';
                }
            }
            this._overrideDialog = { timeLabel, bodyKey, entities };
            return;
        }
        this.hass.callService('button', 'press', {
            entity_id: entities.takeButton,
        });
    }
    _handleUndoDose(entities) {
        if (!this.hass || !entities.undoButton)
            return;
        this.hass.callService('button', 'press', {
            entity_id: entities.undoButton,
        });
    }
    _handleRefill(entities) {
        if (!this.hass)
            return;
        // Target is the Master Tracker Inventory override when set, otherwise the
        // medicine device's own addRefill entity.
        const targetEntityId = this._refillTarget?.addStockEntityId ?? entities.addRefill;
        if (!targetEntityId)
            return;
        const value = parseFloat(this._refillAmount);
        if (isNaN(value) || value <= 0)
            return;
        this.hass.callService('number', 'set_value', {
            entity_id: targetEntityId,
            value: value,
        });
        this._showRefillDialog = false;
        this._refillAmount = '';
        this._refillTarget = null;
    }
    // ── Master Tracker Drinks actions ──────────
    // Enumerate every granular drink device of a substance for the Log Drink
    // popup, Inventory panel, and Tools panel.  Groups hass.entities by
    // device_id after filtering on platform + device_type='drink' state attr +
    // matching substance, then resolves each device's log/undo/reset buttons,
    // stock + add_stock numbers, and 7/365-day avg sensors.
    //
    // Classification uses the backend `role` STATE ATTRIBUTE (set in
    // _attr_extra_state_attributes on each granular entity), NOT the entity_id
    // suffix. HA derives entity_id from slugify(translated_name)
    // (async_generate_entity_id + util.slugify), and every drink entity sets
    // _attr_has_entity_name = True, so the entity_id is the slugified *name*
    // (e.g. DrinkStockNumber → number.coffee_inventory), NOT the unique_id stem
    // (_drink_stock) — an entity_id-suffix match silently misses every entity
    // except DrinkLogButton (whose "Log Drink" name coincidentally slugifies to
    // log_drink). unique_id is NOT present on hass.entities either (HA's
    // list_for_display websocket omits it — see _as_display_dict), so matching
    // unique_id stems also fails. State attributes ARE present on
    // hass.states[entityId].attributes, integration-controlled, and survive
    // renames — the same approach already proven by device_type/substance/
    // pk_model. Avg sensors also carry window_days to distinguish 7/365.
    _getDrinksOfSubstance(substance) {
        if (!this.hass)
            return [];
        const byDevice = {};
        for (const [entityId, entityInfo] of Object.entries(this.hass.entities)) {
            if (entityInfo.platform !== 'ax_dose_logger')
                continue;
            const deviceId = entityInfo.device_id;
            if (!deviceId)
                continue;
            const dt = (this._getAttr(entityId, 'device_type') || '').toLowerCase();
            if (dt !== 'drink')
                continue;
            const sub = (this._getAttr(entityId, 'substance') || '').toLowerCase();
            if (sub !== substance)
                continue;
            const info = byDevice[deviceId] ?? {
                deviceId,
                name: this.hass.devices?.[deviceId]?.name || entityInfo.name || entityId,
                substance,
            };
            // Classify by the backend `role` state attribute (+ window_days for avg
            // sensors). Store entity_id for state lookups / service calls.
            const role = this._getAttr(entityId, 'role');
            if (entityId.startsWith('button.')) {
                if (role === 'log')
                    info.logButtonEntityId = entityId;
                else if (role === 'undo')
                    info.undoButtonEntityId = entityId;
                else if (role === 'reset')
                    info.resetButtonEntityId = entityId;
            }
            else if (entityId.startsWith('number.')) {
                if (role === 'stock')
                    info.stockEntityId = entityId;
                else if (role === 'add_stock')
                    info.addStockEntityId = entityId;
            }
            else if (entityId.startsWith('sensor.')) {
                if (role === 'avg') {
                    const wd = this._getAttr(entityId, 'window_days');
                    if (wd === 7)
                        info.avg7EntityId = entityId;
                    else if (wd === 365)
                        info.avg365EntityId = entityId;
                }
            }
            byDevice[deviceId] = info;
        }
        return Object.values(byDevice).sort((a, b) => a.name.localeCompare(b.name));
    }
    // Days-since reveal for a granular drink, reading the history_start_date
    // attribute on its 365-day avg sensor (DrinkAvgDosesSensor exposes it).
    _drinkDaysSinceReveal(avg365EntityId) {
        if (!avg365EntityId)
            return { hasDaysSensor: false, daysSince: 0 };
        const startIso = this._getAttr(avg365EntityId, 'history_start_date');
        if (!startIso)
            return { hasDaysSensor: false, daysSince: 0 };
        const start = new Date(startIso);
        if (isNaN(start.getTime()))
            return { hasDaysSensor: false, daysSince: 0 };
        const days = Math.floor((Date.now() - start.getTime()) / 86400000);
        return { hasDaysSensor: true, daysSince: Math.max(0, days) };
    }
    _logDrink(logButtonEntityId) {
        if (!this.hass || !logButtonEntityId)
            return;
        this.hass.callService('button', 'press', { entity_id: logButtonEntityId });
        this._showLogDrinkDialog = false;
        this._logDrinkSubstance = null;
    }
    _undoDrink(undoButtonEntityId) {
        if (!this.hass || !undoButtonEntityId)
            return;
        this.hass.callService('button', 'press', { entity_id: undoButtonEntityId });
    }
    _resetDrink(resetButtonEntityId) {
        if (!this.hass || !resetButtonEntityId)
            return;
        this.hass.callService('button', 'press', { entity_id: resetButtonEntityId });
    }
    // ── Tools Actions ──────────────────────────
    _openToolsDialog(title, descriptor, onConfirm) {
        this._toolsDialog = { title, descriptor, onConfirm };
    }
    _closeToolsDialog() {
        this._toolsDialog = null;
    }
    _handleTimeframeChange(timeframe) {
        if (timeframe === this._activeTimeframe)
            return;
        this._activeTimeframe = timeframe;
    }
    // Convenience getter for the current HA language code (BCP47). Falls back
    // to 'en' when hass is not yet set (e.g. during initial render).
    get _lang() {
        return this.hass?.language || 'en';
    }
    // ── CardController public accessors ─────────
    // Public read-only views of the container's private @state, exposed to the
    // presentational panel components via the CardController contract (see
    // src/types.ts). Panels read these props instead of touching the container's
    // private fields directly.
    get lang() {
        return this._lang;
    }
    get activeTimeframe() {
        return this._activeTimeframe;
    }
    get activeBarTimeframe() {
        return this._activeBarTimeframe;
    }
    get activeGraph() {
        return this._activeGraph;
    }
    get amountHistory() {
        return this._amountHistory;
    }
    get doseHistory() {
        return this._doseHistory;
    }
    get activeEffectivenessTimeframe() {
        return this._activeEffectivenessTimeframe;
    }
    get activeEffectivenessView() {
        return this._activeEffectivenessView;
    }
    get effectivenessHistory() {
        return this._effectivenessHistory;
    }
    get effectivenessVisible() {
        return this._effectivenessVisible;
    }
    // ── CardController thin action methods ───────
    // These were previously inlined as direct @state mutations inside pane
    // templates (e.g. @click=${() => this._showRefillDialog = true}). Now that
    // panes are presentational components, they call back through the controller
    // so the container owns the state mutation.
    showRefillDialog() {
        this._showRefillDialog = true;
        this._refillAmount = '';
        this._refillTarget = null;
    }
    showRefillDialogFor(addStockEntityId, drinkName) {
        this._refillTarget = { addStockEntityId, drinkName };
        this._showRefillDialog = true;
        this._refillAmount = '';
    }
    showDeviceInfo() {
        this._showDeviceInfo = true;
    }
    showLogDrinkDialog(substance) {
        this._logDrinkSubstance = substance;
        this._showLogDrinkDialog = true;
    }
    showSleepDisruptionDialog(substance) {
        this._sleepDisruptionSubstance = substance;
        this._showSleepDisruptionDialog = true;
    }
    setActiveGraph(idx) {
        this._activeGraph = idx;
    }
    // Keyboard activation helper for clickable <div> elements that use
    // role="button". Fires the handler on Enter or Space (standard button
    // behavior) so they're accessible to keyboard and screen-reader users.
    _onKeyActivate(e, handler) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handler();
        }
    }
    // ── CardController public method aliases ────
    // The container keeps its private _-prefixed methods as the implementation
    // (the existing ~49 internal call sites stay untouched, keeping this step
    // low-risk). These public aliases expose them through the CardController
    // contract so the presentational panel components (added in later steps)
    // can call back into the container without touching its private surface.
    // Each alias is a one-line delegate; behavior is unchanged.
    getState(entityId) { return this._getState(entityId); }
    getAttr(entityId, attr) { return this._getAttr(entityId, attr); }
    getStrengthUnit(entities) { return this._getStrengthUnit(entities); }
    getMedName(entities) { return this._getMedName(entities); }
    getSafeBoxEntity(entities) { return this._getSafeBoxEntity(entities); }
    getChipEntities() { return this._getChipEntities(); }
    formatInteger(value) { return this._formatInteger(value); }
    computeNextDose(entities) { return this._computeNextDose(entities); }
    computeOverTime(entities) { return this._computeOverTime(entities); }
    computeTimeSinceLastDose(entities) { return this._computeTimeSinceLastDose(entities); }
    bucketByDay(dayCount) { return this._bucketByDay(dayCount); }
    daysSinceReveal(entities) { return this._daysSinceReveal(entities); }
    getDrinksOfSubstance(substance) { return this._getDrinksOfSubstance(substance); }
    drinkDaysSinceReveal(avg365EntityId) { return this._drinkDaysSinceReveal(avg365EntityId); }
    logDrink(logButtonEntityId) { this._logDrink(logButtonEntityId); }
    undoDrink(undoButtonEntityId) { this._undoDrink(undoButtonEntityId); }
    resetDrink(resetButtonEntityId) { this._resetDrink(resetButtonEntityId); }
    handleTakePill(entities) { this._handleTakePill(entities); }
    handleUndoDose(entities) { this._handleUndoDose(entities); }
    handleRefill(entities) { this._handleRefill(entities); }
    openToolsDialog(title, descriptor, onConfirm) { this._openToolsDialog(title, descriptor, onConfirm); }
    openMoreInfo(entityId) { this._openMoreInfo(entityId); }
    handleSafeBoxAction(e, kind, cfg, entity) { this._handleSafeBoxAction(e, kind, cfg, entity); }
    handleTimeframeChange(timeframe) { this._handleTimeframeChange(timeframe); }
    handleBarTimeframeChange(timeframe) {
        if (timeframe === this._activeBarTimeframe)
            return;
        this._activeBarTimeframe = timeframe;
    }
    handleEffectivenessTimeframeChange(timeframe) {
        if (timeframe === this._activeEffectivenessTimeframe)
            return;
        this._activeEffectivenessTimeframe = timeframe;
    }
    setEffectivenessView(view) {
        if (view === this._activeEffectivenessView)
            return;
        this._activeEffectivenessView = view;
    }
    toggleEffectivenessMetric(metricKey) {
        // Mutate a fresh Set so Lit detects the reference change (a Set mutation
        // in place would not trigger re-render since @state compares references).
        const next = new Set(this._effectivenessVisible);
        if (next.has(metricKey))
            next.delete(metricKey);
        else
            next.add(metricKey);
        this._effectivenessVisible = next;
    }
    handleTrackingChange(metric, rawValue) { this._handleTrackingChange(metric, rawValue); }
    onKeyActivate(e, handler) { this._onKeyActivate(e, handler); }
    onStatCellKeydown(e, entityId) { this._onStatCellKeydown(e, entityId); }
    navigateToDevice() { this._navigateToDevice(); }
    // ── Pane Switching ─────────────────────────
    _handlePaneChange(paneId) {
        if (paneId === this._activePane)
            return; // Guard: skip redundant execution
        this._activePane = paneId;
        // Tell HA's layout engine to re-measure the card height. card-resize is
        // non-destructive (unlike ll-rebuild, which tears down and recreates the
        // element) — the @state pane survives, so no sessionStorage persistence
        // or rebuild-flag coordination is needed (#16). Lit auto-renders on the
        // @state mutation above, so no manual requestUpdate() is needed (#17).
        this.updateComplete.then(() => {
            this.dispatchEvent(new CustomEvent('card-resize', { bubbles: true, composed: true }));
        });
    }
    // ── Device Info Dialog ─────────────────────
    _navigateToDevice() {
        if (!this.config?.device_id)
            return;
        window.history.pushState(null, '', `/config/devices/device/${this.config.device_id}`);
        window.dispatchEvent(new CustomEvent('location-changed'));
    }
    _renderDeviceInfoDialog(entities) {
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._showDeviceInfo = false; }}
      >
        <div slot="header" class="dialog-header">${this._getMedName(entities)}</div>
        <div class="dialog-body dialog-body--center">
          <button class="dialog-btn" @click=${() => { this._navigateToDevice(); this._showDeviceInfo = false; }}>
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>${localize(this._lang, 'dialog.device_info.button')}</span>
          </button>
        </div>
      </ha-dialog>
    `;
    }
    _renderRefillDialog(entities) {
        // Header shows the drink name when refilling a granular drink from the
        // Master Tracker Inventory panel; otherwise the generic refill title.
        const header = this._refillTarget
            ? localize(this._lang, 'dialog.refill.title_drink', { name: this._refillTarget.drinkName })
            : localize(this._lang, 'dialog.refill.title');
        const close = () => { this._showRefillDialog = false; this._refillAmount = ''; this._refillTarget = null; };
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">${header}</div>
        <div class="dialog-body">
          <input
            type="number"
            class="refill-input"
            .value=${this._refillAmount}
            @input=${(e) => this._refillAmount = e.target.value}
            placeholder=${localize(this._lang, 'dialog.refill.placeholder')}
            min="1"
            step="1"
          />
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${close}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
          <button class="dialog-btn" @click=${() => this._handleRefill(entities)}>
            ${localize(this._lang, 'dialog.refill.confirm')}
          </button>
        </div>
      </ha-dialog>
    `;
    }
    // Log Drink popup (Master Tracker Drinks panel). Shows a grid of granular
    // drink buttons for the master's substance; pressing one calls button.press
    // on that drink's DrinkLogButton and closes the dialog.
    _renderLogDrinkDialog() {
        const substance = this._logDrinkSubstance;
        if (!substance)
            return A;
        const drinks = this._getDrinksOfSubstance(substance);
        const close = () => { this._showLogDrinkDialog = false; this._logDrinkSubstance = null; };
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">${localize(this._lang, 'dialog.log_drink.title')}</div>
        <div class="dialog-body">
          ${drinks.length === 0
            ? b `<div class="tools-dialog-descriptor">${localize(this._lang, 'dialog.log_drink.empty')}</div>`
            : b `<div class="log-drink-grid">
                ${drinks.map((d) => b `
                  <button
                    class="dialog-btn log-drink-btn"
                    ?disabled=${!d.logButtonEntityId}
                    @click=${() => d.logButtonEntityId && this._logDrink(d.logButtonEntityId)}
                  >
                    <ha-icon icon=${substance === 'caffeine' ? 'mdi:coffee' : 'mdi:glass-wine'}></ha-icon>
                    <span>${d.name}</span>
                  </button>
                `)}
              </div>`}
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${close}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
        </div>
      </ha-dialog>
    `;
    }
    // Pill-limit override warning dialog (#6). Rendered when _overrideDialog is
    // non-null (set by _handleTakePill when the safe-to-take count is <= 0).
    // Confirm presses the take-button; Cancel/ESC just closes.
    _renderOverrideDialog() {
        const dlg = this._overrideDialog;
        if (!dlg)
            return A;
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._overrideDialog = null; }}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'dialog.warning')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${localize(this._lang, dlg.bodyKey, { time: dlg.timeLabel })}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${() => { this._overrideDialog = null; }}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${() => {
            if (this.hass && dlg.entities.takeButton) {
                this.hass.callService('button', 'press', {
                    entity_id: dlg.entities.takeButton,
                });
            }
            this._overrideDialog = null;
        }}>
            ${localize(this._lang, 'dialog.override.confirm')}
          </button>
        </div>
      </ha-dialog>
    `;
    }
    // ── Pane 1: Daily ──────────────────────────
    _getMedName(entities) {
        let name = this.config?.name || entities.medicationName;
        const strengthState = this._getState(entities.strength);
        const strengthNum = parseFloat(strengthState);
        if (entities.strength && !isNaN(strengthNum) && strengthNum !== 0
            && strengthState !== 'unknown' && strengthState !== 'unavailable') {
            name += ` - ${this._formatInteger(strengthState)} ${this._getStrengthUnit(entities)}`;
        }
        return name;
    }
    // Resolve the entity to display in the Safe to Take box. If the user
    // configured a replacement (safe_to_take_entity), use it; otherwise fall
    // back to the auto-resolved pills_safe_to_take sensor. The Take Pill
    // button's LIMIT REACHED logic is decoupled and always uses the real
    // pillsSafeToTake sensor (see isLimitReached below).
    _getSafeBoxEntity(entities) {
        return this.config?.safe_to_take_entity || entities.pillsSafeToTake;
    }
    // Fire the configured tap/hold/double-tap action for the Safe to Take box.
    // When the requested action has a user-configured ActionConfig, delegate to
    // custom-card-helpers' handleAction (standard HA action dispatch). When no
    // tap_action is configured, fall back to more-info on the display entity
    // (v1 default behavior). hold/double_tap with no config are no-ops.
    _handleSafeBoxAction(_e, action, config, displayEntity) {
        if (!this.hass)
            return;
        const actionKey = `${action}_action`;
        const actionConfig = config[actionKey];
        if (actionConfig) {
            handleAction(this, this.hass, config, action);
        }
        else if (action === 'tap' && displayEntity) {
            // No custom tap action → default to more-info (backward compat).
            this._openMoreInfo(displayEntity);
        }
        // hold/double_tap with no config and no fallback → no-op.
    }
    // ── Pane 2: Graphs ─────────────────────────
    async _fetchAmountHistory(entities) {
        if (!this.hass || !entities.amountInBody)
            return;
        const entityId = entities.amountInBody;
        const now = new Date();
        const startTime = new Date(now.getTime() - this._getTimeframeHours() * 60 * 60 * 1000).toISOString();
        const endTime = now.toISOString();
        // Race guard (#4): capture the token at entry; after `await`, discard the
        // result if a newer fetch (or disconnect) has bumped it. This ensures only
        // the latest timeframe/pane change's result is written to _amountHistory.
        const token = ++this._amountFetchToken;
        try {
            // Use HA's authenticated REST helper (#2) instead of raw fetch + manual
            // access-token extraction. Path is relative to /api/. minimal_response +
            // significant_changes_only (#19) shrink the payload by dropping attributes
            // and unchanged states the card never reads from history.
            const data = await this.hass.callApi('GET', `history/period/${startTime}?filter_entity_id=${entityId}&end_time=${endTime}&minimal_response&significant_changes_only=1`);
            // Discard if a newer fetch started or the card was disconnected mid-flight.
            if (token !== this._amountFetchToken)
                return;
            // data is an array of arrays: [[{entity_id, state, last_changed, attributes}, ...]]
            if (data && data[0]) {
                const filteredData = data[0]
                    .filter((entry) => entry.state && !isNaN(parseFloat(entry.state)))
                    .map((entry) => ({
                    timestamp: entry.last_changed,
                    value: parseFloat(entry.state)
                }));
                // Decimation: cap SVG nodes at MAX_NODES to protect render performance
                const MAX_NODES = 800;
                const step = Math.ceil(filteredData.length / MAX_NODES);
                this._amountHistory = step > 1
                    ? filteredData.filter((_, index) => index % step === 0)
                    : filteredData;
            }
        }
        catch (e) {
            // callApi throws on non-2xx; log for debuggability without breaking UX.
            console.warn('[ax-dose-logger-card] amount history fetch failed:', e);
        }
    }
    async _fetchDoseHistory(entities) {
        if (!this.hass || !this.config?.device_id)
            return;
        const deviceId = this.config.device_id;
        // Same race guard as _fetchAmountHistory (both are triggered together on
        // pane entry; a new pane/timeframe change invalidates both via the token).
        const token = ++this._doseFetchToken;
        try {
            const data = await this.hass.callApi('GET', `ax_dose_logger/history/${deviceId}`);
            // Discard if a newer fetch started or the card was disconnected mid-flight.
            if (token !== this._doseFetchToken)
                return;
            // data is [[iso_timestamp, strength], ...]
            if (Array.isArray(data)) {
                this._doseHistory = data;
            }
        }
        catch (e) {
            // Custom endpoint may not be available on older backends; log for debug.
            console.warn('[ax-dose-logger-card] dose history fetch failed:', e);
        }
    }
    // Effectiveness history fetch — batched single call for ALL effectiveness
    // entities of the device (comma-separated filter_entity_id), split per
    // entity on the client. Effectiveness entities are daily-locked number
    // entities (state changes only when the user logs a value), so the recorder
    // is the source of multi-day history. unknown/unavailable states are
    // dropped so the graph renders gaps on unlogged days instead of zeros.
    // Mirrors _fetchAmountHistory's race-guard token + minimal_response +
    // significant_changes_only optimizations, but covers N entities per call.
    async _fetchEffectivenessHistory(entities) {
        if (!this.hass || !entities.metrics.length)
            return;
        const entityIds = entities.metrics.map((m) => m.entityId).join(',');
        const now = new Date();
        const days = this._activeEffectivenessTimeframe === '30d' ? 30
            : this._activeEffectivenessTimeframe === '60d' ? 60 : 14;
        const startTime = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
        const endTime = now.toISOString();
        const token = ++this._effectivenessFetchToken;
        try {
            const data = await this.hass.callApi('GET', `history/period/${startTime}?filter_entity_id=${entityIds}&end_time=${endTime}&minimal_response&significant_changes_only=1`);
            if (token !== this._effectivenessFetchToken)
                return;
            // data is an array of arrays, one per requested entity (order matches
            // filter_entity_id order). Map each entity's history to its metricKey.
            const result = {};
            if (Array.isArray(data)) {
                entities.metrics.forEach((metric, idx) => {
                    const series = data[idx];
                    if (!Array.isArray(series))
                        return;
                    result[metric.metricKey] = series
                        .filter((entry) => entry.state && !isNaN(parseFloat(entry.state)))
                        .map((entry) => ({
                        timestamp: entry.last_changed,
                        value: parseFloat(entry.state),
                    }));
                });
            }
            this._effectivenessHistory = result;
            // Initialize the visible set to all metrics on first fetch (or when the
            // metric set changed since last fetch, e.g. a custom metric was added
            // in the options flow). We compare against the existing visible set so
            // a user's per-tracker toggles survive timeframe changes.
            const allKeys = entities.metrics.map((m) => m.metricKey);
            const knownKeys = allKeys.filter((k) => this._effectivenessVisible.has(k));
            if (knownKeys.length !== allKeys.length || knownKeys.length === 0) {
                this._effectivenessVisible = new Set(allKeys);
            }
        }
        catch (e) {
            console.warn('[ax-dose-logger-card] effectiveness history fetch failed:', e);
        }
    }
    // Shared progressive-reveal resolver for avg/adherence boxes and stats rows.
    // Days since first dose drives which windows are shown. When the entity is
    // absent (older backend), hasDaysSensor=false and daysSince=-1 so callers
    // fall back to showing all boxes/rows (no regression for existing installs).
    _daysSinceReveal(entities) {
        const daysSinceRaw = this._getState(entities.daysSinceFirstDose);
        const hasDaysSensor = !!entities.daysSinceFirstDose && daysSinceRaw !== 'unavailable';
        const daysSince = hasDaysSensor ? (parseInt(daysSinceRaw) || 0) : -1;
        return { hasDaysSensor, daysSince };
    }
    // ── Pane 3: Stats ──────────────────────────
    // Open the native HA more-info dialog for an entity. Uses the canonical
    // `hass-more-info` event (same pattern as every stock Lovelace card via
    // custom-card-helpers' handleAction). fireEvent defaults to bubbles+composed,
    // which is what HA's more-info dialog listener expects.
    _openMoreInfo(entityId) {
        fireEvent(this, 'hass-more-info', { entityId });
    }
    // Keyboard activation for accessible stat cells (Enter / Space).
    _onStatCellKeydown(e, entityId) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            this._openMoreInfo(entityId);
        }
    }
    // ── Pane 4: Tools ──────────────────────────
    _renderSleepDisruptionDialog() {
        const substance = this._sleepDisruptionSubstance;
        if (!substance)
            return A;
        const close = () => { this._showSleepDisruptionDialog = false; this._sleepDisruptionSubstance = null; };
        const mdKey = substance === 'alcohol'
            ? 'dialog.sleep_disruption.alcohol'
            : 'dialog.sleep_disruption.caffeine';
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">
          <ha-icon icon="mdi:sleep"></ha-icon>
          ${localize(this._lang, 'dialog.sleep_disruption.title')}
        </div>
        <div class="dialog-body">
          <ha-markdown .content=${localize(this._lang, mdKey)}></ha-markdown>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn" @click=${close}>
            <ha-icon icon="mdi:close"></ha-icon>
            <span>${localize(this._lang, 'dialog.sleep_disruption.close')}</span>
          </button>
        </div>
      </ha-dialog>
    `;
    }
    _renderToolsDialog() {
        const dialog = this._toolsDialog;
        if (!dialog)
            return A;
        const onConfirm = () => {
            dialog.onConfirm();
            this._closeToolsDialog();
        };
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${() => this._closeToolsDialog()}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'dialog.warning')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">${dialog.descriptor}</div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${() => this._closeToolsDialog()}>
            <ha-icon icon="mdi:close"></ha-icon>
            <span>${localize(this._lang, 'dialog.cancel')}</span>
          </button>
          <button class="dialog-btn" @click=${onConfirm}>
            <ha-icon icon="mdi:check"></ha-icon>
            <span>${localize(this._lang, 'dialog.confirm')}</span>
          </button>
        </div>
      </ha-dialog>
    `;
    }
    // ── Pane 5: Metrics ──────────────────────────
    _handleTrackingChange(metric, rawValue) {
        const newValue = parseFloat(rawValue);
        if (isNaN(newValue))
            return;
        const state = this._getState(metric.entityId);
        const attrs = this._getAttr(metric.entityId, 'logged_today');
        const isLogged = attrs === true || attrs === 'True' || attrs === 'true'
            || this._pendingTracking.has(metric.entityId);
        if (isLogged) {
            // Already logged today (or pending) — show override dialog
            const oldValue = parseFloat(state);
            this._trackingOverrideDialog = {
                metricKey: metric.metricKey,
                metricLabel: metric.label,
                oldValue: isNaN(oldValue) ? 0 : oldValue,
                newValue,
                entityId: metric.entityId,
            };
        }
        else {
            // Not yet logged — set directly via the number entity
            // Track locally to prevent race condition before HA state propagates
            this._pendingTracking.add(metric.entityId);
            if (this.hass) {
                this.hass.callService('number', 'set_value', {
                    entity_id: metric.entityId,
                    value: newValue,
                });
            }
        }
    }
    _renderTrackingOverrideDialog() {
        const dlg = this._trackingOverrideDialog;
        if (!dlg)
            return A;
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._trackingOverrideDialog = null; }}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'tracking.already_set_title')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${localize(this._lang, 'tracking.already_set_body', {
            metric: localize(this._lang, 'tracking.today_label', { metric: dlg.metricLabel }),
            oldValue: String(dlg.oldValue),
            newValue: String(dlg.newValue),
        })}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${() => { this._trackingOverrideDialog = null; }}>
            ${localize(this._lang, 'tracking.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${() => {
            if (this.hass) {
                this.hass.callService('ax_dose_logger', 'set_metric', {
                    entity_id: dlg.entityId,
                    value: dlg.newValue,
                    override: true,
                });
            }
            this._trackingOverrideDialog = null;
        }}>
            ${localize(this._lang, 'tracking.override')}
          </button>
        </div>
      </ha-dialog>
    `;
    }
    // ── Pane Selector ──────────────────────────
    _renderPaneSelector(entities) {
        const hasMetrics = entities.metrics.length > 0;
        let panes;
        if (entities.deviceType === 'drink_master') {
            panes = [
                { id: 'drinks', labelKey: 'pane.drinks', icon: entities.substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee' },
                { id: 'graphs', labelKey: 'pane.graphs', icon: 'mdi:chart-bar' },
                { id: 'inventory', labelKey: 'pane.inventory', icon: 'mdi:package-variant-closed' },
                { id: 'stats', labelKey: 'pane.stats', icon: 'mdi:clipboard-list' },
                { id: 'tools', labelKey: 'pane.tools', icon: 'mdi:wrench' },
            ];
        }
        else {
            panes = [
                { id: 'daily', labelKey: 'pane.daily', icon: 'mdi:pill' },
                { id: 'graphs', labelKey: 'pane.graphs', icon: 'mdi:chart-bar' },
                { id: 'stats', labelKey: 'pane.stats', icon: 'mdi:clipboard-list' },
                ...(hasMetrics ? [{ id: 'tracking', labelKey: 'pane.tracking', icon: 'mdi:chart-sankey' }] : []),
                { id: 'tools', labelKey: 'pane.tools', icon: 'mdi:wrench' },
            ];
        }
        return b `
      <div class="pane-selector">
        ${panes.map(pane => {
            const label = localize(this._lang, pane.labelKey);
            const isTools = pane.id === 'tools';
            return b `
            <button
              class="pane-btn ${this._activePane === pane.id ? 'active' : ''} ${isTools ? 'tools' : ''}"
              aria-label=${label}
              @click=${() => this._handlePaneChange(pane.id)}
            >
              <ha-icon icon="${pane.icon}"></ha-icon>
              ${isTools ? A : b `<span>${label}</span>`}
            </button>
          `;
        })}
      </div>
    `;
    }
    // ── Main Render ────────────────────────────
    render() {
        if (!this.config || !this.hass) {
            return b `<ha-card><div class="card-content">${localize('en', 'card.loading')}</div></ha-card>`;
        }
        // Graceful fallback when the card is first added and no device is selected
        if (!this.config.device_id) {
            return b `
        <ha-card>
          <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
            <ha-icon icon="mdi:cog" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
            <div style="font-size: 16px; font-weight: 500; color: var(--primary-text-color);">${localize(this._lang, 'card.placeholder_title')}</div>
            <div style="font-size: 14px; color: var(--secondary-text-color);">${localize(this._lang, 'card.placeholder_subtitle')}</div>
          </div>
        </ha-card>
      `;
        }
        const entities = this._resolveEntities();
        // Granular drink device: render a single redirect placeholder pane and no
        // nav bar. The user must select the Master Tracker (Caffeine/Alcohol)
        // device to get the full Drinks card.
        if (entities.deviceType === 'drink') {
            const substanceLabel = entities.substance === 'alcohol'
                ? localize(this._lang, 'drinks.redirect_alcohol')
                : localize(this._lang, 'drinks.redirect_caffeine');
            return b `
        <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text === true ? '0px' : '-2px'};">
          <div class="card-content">
            <div class="caffeine-placeholder">
              <ha-icon icon=${entities.substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee'}></ha-icon>
              <span>${substanceLabel}</span>
            </div>
          </div>
        </ha-card>
      `;
        }
        // Auto-fallback: if the user is on the tracking pane but no tracking items exist
        // (e.g. they were removed in the options flow), fall back to the daily pane.
        if (this._activePane === 'tracking' && entities.metrics.length === 0) {
            this._activePane = 'daily';
        }
        // Auto-fallback: master-tracker panes only exist on master trackers;
        // medicine-only panes only exist on medicine devices. If the device was
        // switched (or a stale _activePane lingers from a prior device), bounce
        // to the device's first pane.
        const isMaster = entities.deviceType === 'drink_master';
        const masterPanes = ['drinks', 'inventory'];
        const medicinePanes = ['daily', 'tracking'];
        if (isMaster && medicinePanes.includes(this._activePane))
            this._activePane = 'drinks';
        if (!isMaster && masterPanes.includes(this._activePane))
            this._activePane = 'daily';
        return b `
      <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text === true ? '0px' : '-2px'};">
        <div class="card-content">
          ${this._activePane === 'daily' ? b `<ax-dose-daily-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-daily-panel>` : A}
          ${this._activePane === 'graphs' ? b `<ax-dose-graphs-panel .controller=${this} .entities=${entities} .hass=${this.hass} .amountHistory=${this._amountHistory} .doseHistory=${this._doseHistory} .activeGraph=${this._activeGraph} .activeTimeframe=${this._activeTimeframe} .activeBarTimeframe=${this._activeBarTimeframe} .activeEffectivenessTimeframe=${this._activeEffectivenessTimeframe} .activeEffectivenessView=${this._activeEffectivenessView} .effectivenessHistory=${this._effectivenessHistory} .effectivenessVisible=${this._effectivenessVisible}></ax-dose-graphs-panel>` : A}
          ${this._activePane === 'stats' ? b `<ax-dose-stats-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-stats-panel>` : A}
          ${this._activePane === 'drinks' ? b `<ax-dose-drinks-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-drinks-panel>` : A}
          ${this._activePane === 'inventory' ? b `<ax-dose-inventory-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-inventory-panel>` : A}
          ${this._activePane === 'tools' ? b `<ax-dose-tools-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-tools-panel>` : A}
          ${this._activePane === 'tracking' ? b `<ax-dose-tracking-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-tracking-panel>` : A}
        </div>
        ${this.config?.hide_nav_bar !== true ? this._renderPaneSelector(entities) : A}
        ${this._showDeviceInfo ? this._renderDeviceInfoDialog(entities) : A}
        ${this._showRefillDialog ? this._renderRefillDialog(entities) : A}
        ${this._showLogDrinkDialog ? this._renderLogDrinkDialog() : A}
        ${this._showSleepDisruptionDialog ? this._renderSleepDisruptionDialog() : A}
        ${this._toolsDialog ? this._renderToolsDialog() : A}
        ${this._overrideDialog ? this._renderOverrideDialog() : A}
        ${this._trackingOverrideDialog ? this._renderTrackingOverrideDialog() : A}
      </ha-card>
    `;
    }
    // ── Lifecycle ──────────────────────────────
    connectedCallback() {
        super.connectedCallback();
        // Inject CSS into ha-form shadow roots to align entity picker + text field
        // pairs in grid containers. The implementation lives in the editor module
        // (src/ax-dose-logger-editor.ts) since this is editor-only logic.
        installEditorGridAlignment();
        // Reset to defaults on every connection. With ll-rebuild removed (#16),
        // the element is no longer destroyed/recreated on pane switch, so @state
        // survives naturally. The only time connectedCallback fires is on a
        // genuine view entry (navigate to the dashboard) or initial load — both
        // should start on the daily pane. Lit auto-renders on the @state
        // mutations below, so no manual requestUpdate() is needed (#17).
        this._activePane = 'daily';
        this._activeGraph = 0;
        // Apply configured default timescale for the Amount in Body graph,
        // falling back to '48h' if unset or invalid. Useful for medications
        // (e.g. caffeine, paracetamol) where a shorter window is more informative.
        const validTimeframes = ['12h', '24h', '48h', '7d', '14d', '30d'];
        const configuredTf = this.config?.amount_in_body_default_timeframe;
        this._activeTimeframe = (configuredTf && validTimeframes.includes(configuredTf)) ? configuredTf : '48h';
        this._activeBarTimeframe = '14d';
        this._activeEffectivenessTimeframe = '14d';
        this._activeEffectivenessView = 'avg';
        this._effectivenessHistory = {};
        this._effectivenessVisible = new Set();
        // Clear any dialog that was open when the card was disconnected. Lit
        // pauses reactive updates while an element is detached, so a dialog
        // flag set to false just before navigation may not have flushed its
        // DOM removal before disconnect — leaving ha-dialog's MDC overlay in
        // an "open" state that re-appears on back-navigation. Resetting here
        // guarantees a clean slate on every view entry and covers all four
        // dialogs (device-info, refill, tools, override).
        this._showDeviceInfo = false;
        this._showRefillDialog = false;
        this._refillAmount = '';
        this._refillTarget = null;
        this._showLogDrinkDialog = false;
        this._logDrinkSubstance = null;
        this._showSleepDisruptionDialog = false;
        this._sleepDisruptionSubstance = null;
        this._toolsDialog = null;
        this._overrideDialog = null;
        // Start a 30s tick so time-relative panes (daily/stats) refresh their
        // "Xh XXm" countdowns. Previously the whole card re-rendered on every
        // system-wide state change; with shouldUpdate gating, this timer keeps
        // the countdowns live without that cost.
        this._startTickTimer();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._stopTickTimer();
        // Invalidate any in-flight fetch so it can't write state to a detached
        // element. Bumping the token makes every pending _fetchAmountHistory /
        // _fetchDoseHistory result discard itself after its `await` resolves.
        this._amountFetchToken++;
        this._doseFetchToken++;
        this._effectivenessFetchToken++;
    }
    _startTickTimer() {
        if (this._tickTimer !== null)
            return;
        this._tickTimer = window.setInterval(() => {
            this._tick += 1;
        }, 30000);
    }
    _stopTickTimer() {
        if (this._tickTimer !== null) {
            window.clearInterval(this._tickTimer);
            this._tickTimer = null;
        }
    }
    /**
     * Render gating (#1): only re-render when something this card actually
     * depends on changed, instead of on every system-wide HA state tick.
     *
     * - config / internal @state changes always re-render.
     * - _tick re-renders so the daily & stats panes' "Xh XXm" countdowns stay
     *   live (the underlying timestamp sensors don't change every minute).
     * - hass changes only re-render when one of this card's resolved entities
     *   (or a configured chip entity) has a new state object reference.
     */
    shouldUpdate(changedProps) {
        if (!this.config || !this.hass) {
            return changedProps.has('config') || changedProps.has('hass');
        }
        // Any internal reactive state change (pane, timeframe, dialogs, history,
        // graph index) always triggers a render.
        for (const key of [
            'config',
            '_activePane',
            '_activeGraph',
            '_activeTimeframe',
            '_activeBarTimeframe',
            '_amountHistory',
            '_doseHistory',
            '_activeEffectivenessTimeframe',
            '_activeEffectivenessView',
            '_effectivenessHistory',
            '_effectivenessVisible',
            '_showDeviceInfo',
            '_showRefillDialog',
            '_refillAmount',
            '_refillTarget',
            '_showLogDrinkDialog',
            '_logDrinkSubstance',
            '_showSleepDisruptionDialog',
            '_sleepDisruptionSubstance',
            '_toolsDialog',
            '_overrideDialog',
            '_trackingOverrideDialog',
        ]) {
            if (changedProps.has(key))
                return true;
        }
        // The 30s tick refreshes time-relative panes (daily/stats). The graphs and
        // tools panes don't depend on wall-clock time, so skip the tick there to
        // avoid needless SVG re-renders.
        if (changedProps.has('_tick') && (this._activePane === 'daily' || this._activePane === 'stats' || this._activePane === 'drinks' || this._activePane === 'inventory')) {
            return true;
        }
        if (changedProps.has('hass')) {
            const oldHass = changedProps.get('hass');
            return this._relevantStateChanged(oldHass);
        }
        return false;
    }
    /**
     * Compare the current hass state for every entity this card reads (resolved
     * medication entities + configured chip entities) against the previous hass
     * snapshot. Returns true if any of them changed (by state object reference,
     * which HA replaces on every state update).
     */
    _relevantStateChanged(oldHass) {
        if (!this.hass)
            return false;
        if (!oldHass)
            return true;
        const entities = this._resolveEntities();
        const watchedIds = [];
        for (const value of Object.values(entities)) {
            if (typeof value === 'string' && value)
                watchedIds.push(value);
        }
        // Include configured chip entities (they may belong to other devices).
        for (const chip of this._getChipEntities()) {
            if (chip.entityId)
                watchedIds.push(chip.entityId);
        }
        const cur = this.hass.states;
        const prev = oldHass.states;
        for (const id of watchedIds) {
            const curState = cur[id];
            const prevState = prev[id];
            // A state object reference change means HA updated this entity.
            if (curState !== prevState)
                return true;
            // Also catch the entity disappearing/appearing between snapshots.
            if ((curState === undefined) !== (prevState === undefined))
                return true;
        }
        return false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (this._activePane === 'graphs' && this.config && this.hass) {
            const entities = this._resolveEntities();
            if (changedProperties.has('_activePane')) {
                this._fetchAmountHistory(entities);
                this._fetchDoseHistory(entities);
                if (entities.metrics.length) {
                    this._effectivenessHistory = {};
                    this._fetchEffectivenessHistory(entities);
                }
            }
            else if (changedProperties.has('_activeTimeframe')) {
                this._amountHistory = [];
                this._fetchAmountHistory(entities);
            }
            else if (changedProperties.has('_activeEffectivenessTimeframe')) {
                if (entities.metrics.length) {
                    this._effectivenessHistory = {};
                    this._fetchEffectivenessHistory(entities);
                }
            }
            else if (changedProperties.has('hass')) {
                // A relevant entity changed while the graphs pane is open (shouldUpdate
                // already gated on _relevantStateChanged, so a watched sensor — lastDose,
                // total, amountInBody, an effectiveness number — actually updated, not a
                // system-wide state tick). Re-fetch so the bar/line/effectiveness graphs
                // reflect a just-taken dose (or undo/reset) without requiring the user to
                // navigate away and back. The per-fetch race-guard tokens discard any
                // in-flight stale results after their `await` resolves, and the REST
                // endpoint reads in-memory store data (no DB query), so this is cheap.
                // Note: this branch does NOT fire on the _tick timer (shouldUpdate
                // excludes _tick for the graphs pane), so there is no periodic polling.
                this._fetchDoseHistory(entities);
                this._fetchAmountHistory(entities);
                if (entities.metrics.length) {
                    this._fetchEffectivenessHistory(entities);
                }
            }
        }
        // Clean up _pendingTracking: once HA confirms logged_today=true for an
        // entity, remove it from the pending set so future changes use the real
        // attribute instead of the optimistic local flag.
        if (this.hass && this._pendingTracking.size > 0) {
            for (const entityId of this._pendingTracking) {
                const isLogged = this._getAttr(entityId, 'logged_today') === true;
                if (isLogged)
                    this._pendingTracking.delete(entityId);
            }
        }
    }
    // ── Sizing ─────────────────────────────────
    getCardSize() {
        // Dynamic sizing based on active pane to prevent overlap
        switch (this._activePane) {
            case 'graphs': return 8;
            case 'stats': return 7;
            case 'tools': return 6;
            case 'tracking': return 6;
            case 'drinks': return 6;
            case 'inventory': return 8;
            default: return 5; // daily
        }
    }
    getGridOptions() {
        // HA sections-view grid options. Per HA docs, omitting `rows` lets the
        // card ignore grid row snapping (auto-height) — the documented way to
        // achieve what the previous undocumented `rows: 'auto'` attempted.
        // `min_rows: 4` ensures a reasonable minimum height (≈248px, matching
        // the smallest pane — daily at getCardSize() = 5 ≈ 250px). Static
        // options (not dynamic per-pane) avoid grid layout shifts on pane switch.
        return {
            columns: 12,
            min_rows: 4,
        };
    }
    // ── Editor Linkage ─────────────────────────
    static getConfigForm() {
        // The ~280-line schema + computeLabel/computeHelper callbacks live in the
        // editor module (src/ax-dose-logger-editor.ts) so the main card file stays
        // focused on runtime dashboard logic. HA renders <ha-form> from this schema.
        return buildEditorForm();
    }
    static getStubConfig() {
        return {
            device_id: '',
            show_amount_in_body: true,
        };
    }
}
// ── Styles ─────────────────────────────────
AxDoseLoggerCard.styles = i$3 `
    :host {
      display: block;
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
      font-weight: 500;
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
      justify-content: center;
    }

    /* Dialog header (slot="header" for HA 2026.3+ Material 3 compatibility).
       Pre-2026.3 used the .heading property / slot="heading"; HA 2026.3
       renamed the slot to "header". Using the slot element works on both. */
    .dialog-header {
      font-size: 1.5rem;
      font-weight: 500;
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
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s;
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
  `;
__decorate([
    n({ attribute: false })
], AxDoseLoggerCard.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], AxDoseLoggerCard.prototype, "config", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_activePane", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_activeGraph", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_amountHistory", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_doseHistory", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_showDeviceInfo", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_showRefillDialog", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_refillAmount", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_refillTarget", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_showLogDrinkDialog", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_logDrinkSubstance", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_showSleepDisruptionDialog", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_sleepDisruptionSubstance", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_activeTimeframe", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_activeBarTimeframe", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_activeEffectivenessTimeframe", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_activeEffectivenessView", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_effectivenessHistory", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_effectivenessVisible", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_toolsDialog", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_overrideDialog", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_trackingOverrideDialog", void 0);
__decorate([
    r()
], AxDoseLoggerCard.prototype, "_tick", void 0);
// ──────────────────────────────────────────────
// Registrations
// ──────────────────────────────────────────────
customElements.define('ax-dose-logger-card', AxDoseLoggerCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'ax-dose-logger-card',
    name: 'AX Dose Logger Card',
    preview: true,
    description: 'A custom card for the AX Dose Logger integration — track medications, view dose graphs, and monitor statistics.',
    documentationURL: 'https://github.com/Axildor/AX-Dose-Logger-Card',
});

export { AxDoseLoggerCard };
