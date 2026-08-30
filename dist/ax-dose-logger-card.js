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
const t$3=globalThis,e$3=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),o$5=new WeakMap;let n$4 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$5.set(s,t));}return t}toString(){return this.cssText}};const r$6=t=>new n$4("string"==typeof t?t:t+"",void 0,s$3),i$5=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$4(o,t,s$3)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$3=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$6(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$4,defineProperty:e$2,getOwnPropertyDescriptor:h$2,getOwnPropertyNames:r$5,getOwnPropertySymbols:o$4,getPrototypeOf:n$3}=Object,a$1=globalThis,c$2=a$1.trustedTypes,l$1=c$2?c$2.emptyScript:"",p$2=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$2=(t,s)=>!i$4(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$2};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$2(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$3(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$5(t),...o$4(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$3(s));}else void 0!==s&&i.push(c$3(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$2)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$2?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$3=t=>t,s$2=t$2.trustedTypes,e$1=s$2?s$2.createPolicy("lit-html",{createHTML:t=>t}):void 0,h$1="$lit$",o$3=`lit$${Math.random().toFixed(9).slice(2)}$`,n$2="?"+o$3,r$4=`<${n$2}>`,l=document,c$1=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f$1="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${f$1}(?:([^\\s"'>=/]+)(${f$1}*=${f$1}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m$1:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p$1):void 0!==u[3]&&(c=p$1):c===p$1?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p$1:'"'===u[3]?$:g):c===$||c===g?c=p$1:c===_||c===m$1?c=v:(c=p$1,n=void 0);const x=c===p$1&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$4:d>=0?(e.push(a),s.slice(0,d)+h$1+s.slice(d)+o$3+x):s+o$3+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h$1)){const i=v[a++],s=r.getAttribute(t).split(o$3),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$3)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$3),i=t.length-1;if(i>0){r.textContent=s$2?s$2.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c$1()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c$1());}}}else if(8===r.nodeType)if(r.data===n$2)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$3,t+1));)d.push({type:7,index:l}),t+=o$3.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c$1()),this.O(c$1()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$3(t).nextSibling;i$3(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c$1(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s$1=globalThis;let i$2 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$2._$litElement$=true,i$2["finalized"]=true,s$1.litElementHydrateSupport?.({LitElement:i$2});const o$2=s$1.litElementPolyfillSupport;o$2?.({LitElement:i$2});(s$1.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o$1={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$2},r$3=(t=o$1,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n$1(t){return (e,o)=>"object"==typeof o?r$3(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r$2(r){return n$1({...r,state:true,attribute:false})}

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
        // ── Multi-Tracker State Machine (Phase 2) ──
        'card.trackers_error_title': 'Invalid Drink Tracker selection',
        'card.trackers_error_generic': 'The selected Drink Trackers are invalid. Please reconfigure in the visual editor.',
        'card.trackers_error_not_master': 'One or more selected devices are not Drink Tracker devices. Please select only Caffeine Tracker or Alcohol Tracker devices.',
        'card.trackers_error_mixed_substance': 'All selected Drink Trackers must be the same substance (Caffeine OR Alcohol). Please select only one substance.',
        'card.trackers_placeholder_title': 'Select Drink Trackers',
        'card.trackers_placeholder_subtitle': 'Please select Caffeine Tracker or Alcohol Tracker devices in the visual editor.',
        'card.profile_switcher_title': 'Switch profile',
        // ── Multi-Medicine State Machine ──
        'card.medicines_error_title': 'Invalid Medicine selection',
        'card.medicines_error_generic': 'The selected Medicines are invalid. Please reconfigure in the visual editor.',
        'card.medicines_error_not_medicine': 'One or more selected devices are not medicine devices (or are Drink Trackers). Please select only medicine devices.',
        'card.medicine_switcher_title': 'Switch medicine',
        // ── Pane tabs ──
        'pane.daily': 'Daily',
        'pane.graphs': 'Graphs',
        'pane.stats': 'Stats',
        'pane.tools': 'Tools',
        'pane.drinks': 'Drinks',
        'pane.inventory': 'Inventory',
        // ── Daily pane ──
        'daily.take_pill': 'Take Pill',
        'daily.limit_reached': 'LIMIT REACHED',
        'daily.24h_limit_reached': '24H LIMIT REACHED',
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
        'stats.low_timestamp': 'Low - Timestamp',
        'stats.low_hours_until': 'Low - Hours Until',
        'stats.days_left': 'Days left',
        'stats.days_left_est': 'Est. days left',
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
        'drinks.default_profile': 'Default',
        'drinks.log_drink': 'Log Drink',
        'drinks.in_body': 'In Body',
        'drinks.disruption': 'Disruption',
        'drinks.sleep_disruption': 'Sleep Disruption',
        'drinks.redirect_caffeine': 'Please select the Caffeine device to view this drink.',
        'drinks.redirect_alcohol': 'Please select the Alcohol device to view this drink.',
        // ── Inventory pane (Master Tracker) ──
        'inventory.empty': 'No drinks of this category configured.',
        'inventory.avg_7_day': '7-Day Average',
        'inventory.left': 'Left',
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
        'tools.dose_header': 'Dose Tools',
        'tools.general_header': 'General Tools',
        'tools.reset_adherence': 'Reset Adherence %',
        'tools.reset_averages': 'Reset Averages',
        'tools.mark_adherence_taken': 'Mark Last Adherence Taken',
        'tools.skip_dose': 'Skip Dose',
        'tools.reset_history': 'Reset History',
        'tools.undo_dose': 'Undo Dose',
        'tools.empty': 'No maintenance tools available for this medication.',
        // ── Tools dialog descriptors ──
        'tools.desc.reset_adherence': 'Clears the adherence percentage history for all windows. Does NOT affect Amount in Body, dose count, or any other sensor.',
        'tools.desc.reset_averages': 'Resets the 7/14/30/365-day averages only. Doses logged before the reset stop counting toward the averages; no dose data is deleted — Total Doses, Amount in Body, and Adherence % are untouched.',
        'tools.desc.mark_adherence_taken': 'Marks the most recent missed dose slot as taken for adherence calculation only. Does NOT add a dose to the pharmacokinetics model or dose count.',
        'tools.desc.skip_dose': 'Skips the current missed scheduled dose slot — clears the overdue alarm and advances the next-dose schedule WITHOUT logging a dose. Amount in Body, pill inventory, total doses, and last dose are untouched. Adherence stays penalized; press "Mark Last Adherence Taken" afterwards for a prescriber-directed skip.',
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
        'dialog.log_drink.predicted_low': 'Low',
        'dialog.log_drink.predicted_low_dash': 'Low: —',
        'dialog.log_drink.select_profile': 'Who is logging this?',
        'dialog.log_drink.back': 'Back',
        'dialog.log_drink.unknown_profile': 'Unknown profile',
        'dialog.override.body_scheduled': 'Your next scheduled dose is not until {time}. Take a dose now anyway?',
        'dialog.override.body_as_needed': 'Your next safe dose is not until {time}. Take a dose now anyway?',
        'dialog.override.body_window': 'Your dose limit resets at {time}. Take a dose now anyway?',
        'dialog.override.body_24h_exceeded': 'You have already exceeded the 24h strength limit for this medication ({time}). Taking another dose increases the risk of adverse effects. Press Override to log the dose anyway.',
        'dialog.override.body_24h_would_exceed': 'Your next dose ({next} {unit}) would push the 24h total to {projected} {unit}, exceeding the {limit} {unit} limit (currently {current} {unit}). Press Override to log the dose anyway.',
        'dialog.override.confirm': 'Override',
        'dialog.device_info.button': 'To Device info',
        'dialog.device_info.aria': 'View device info',
        'dialog.refill.aria': 'Refill medication',
        // ── Medical Color Indicators explainer popup (device-info dialog) ──
        'dialog.device_info.color_indicators': 'Medical Color Indicators',
        'dialog.device_info.color_indicators_aria': 'Open the medical color indicators explainer',
        'dialog.color_indicators.title': 'Medical Color Indicators',
        'dialog.color_indicators.close': 'Close',
        'dialog.color_indicators.explainer': [
            '### Button State Indicator Colors',
            '',
            'The Take Pill and Log Drink buttons use a fixed color matrix to encode the system\'s current status. Each color means a specific medical state:',
            '',
            '| Color | State | When active |',
            '|-------|-------|-------------|',
            '| **Red** | Limit Reached | Daily limit reached / cooldown active |',
            '| **Blue** | Dose Due | Scheduled dose due (within the first half of the on-time window) |',
            '| **Amber** | Overdue Warning | Overdue (past half the on-time window) |',
            '| **Green** | Logged Dose Indicator | Transient flash after a successful press |',
            '',
            'These indicator colors are **fixed** — they are not affected by the card\'s Color Scheme setting.',
            '',
            'The **on-time window** is the on-time buffer you configured for the medication (in minutes). The button stays blue for the **first half** of the window (on-time, no rush) and turns amber at the **halfway point** — a proactive heads-up that the window is closing. This applies to **all scheduled medications**, whether or not adherence tracking is enabled.',
            '',
            '### Color Scheme Conflict',
            '',
            'The idle button\'s background is tinted by your chosen **Color Scheme** accent. Four scheme colors match (or closely approximate) the four indicators above, so choosing one of them can make the *idle* button resemble an *active* medical state at a glance:',
            '',
            '- **Red** matches Limit Reached',
            '- **Blue** matches Dose Due (exact)',
            '- **Orange** matches Overdue Amber (near)',
            '- **Green** matches Logged (exact)',
            '',
            'In the Color Scheme dropdown these four are listed last and marked with a trailing `*`. The active-state coloring still overrides correctly when a dose is actually due/overdue/limit-reached — this is a **readability** concern for the idle state, not a functional bug. Pick a non-starred color if you want the indicators to stay unambiguous.',
        ].join('\n'),
        // ── Sleep Disruption dialog (Master Tracker) ──
        'dialog.sleep_disruption.title': 'Sleep Disruption',
        'dialog.sleep_disruption.close': 'Close',
        'dialog.sleep_disruption.disruption_label': 'Sleep Disruption',
        'dialog.sleep_disruption.low_timestamp_label': 'Low - Timestamp',
        'dialog.sleep_disruption.low_hours_until_label': 'Low - Hours Until',
        'dialog.sleep_disruption.not_applicable': '—',
        'dialog.sleep_disruption.caffeine': [
            '### Caffeine Sleep Disruption',
            '',
            '* **None (0 - 10 mg):** Negligible impact. Normal sleep cycles and melatonin production.',
            '* **Low (11 - 30 mg):** Minor shift. Deep sleep remains mostly stable.',
            '* **Moderate (31 - 60 mg):** Hidden disruption. Measurable drop in deep sleep and an elevated resting heart rate.',
            '* **High (61+ mg):** Severe disruption. Increased tossing and turning, frequent micro-awakenings, and delayed sleep onset.',
            '* **Note on "Immunity":** Even if you easily fall asleep with caffeine in your system, it still chemically blocks your deep, restorative sleep phases. You are unconscious, but not resting.',
            '',
            '[See README for full biological breakdown.](https://github.com/Axildor/AX-Dose-Logger#caffeine--sleep-disruption-bands)',
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
            '[See README for full biological breakdown.](https://github.com/Axildor/AX-Dose-Logger#alcohol--sleep-disruption-bands)',
        ].join('\n'),
        // ── Config form labels ──
        // ('config.device_id' removed — the single Medicine Picker was replaced by
        // the Medicines Picker (config.medicine_devices); no schema field named
        // device_id remains in the editor.)
        'config.big_text': 'Large Text',
        'config.bold_text': 'Bold Text',
        'config.default_view': 'Default View',
        'config.take_pill_icon': 'Take Pill Icon',
        'config.take_pill_label': 'Take Pill Label',
        'config.safe_to_take_box': 'Top Box',
        'config.safe_to_take_entity': 'Override Entity',
        'config.safe_to_take_label': 'Override Label',
        'config.safe_to_take_icon': 'Override Icon',
        'config.safe_to_take_show_amount_in_body': 'Amount in body instead of Safe to take',
        'config.safe_to_take_tap_action': 'Tap Action',
        'config.safe_to_take_hold_action': 'Hold Action',
        'config.safe_to_take_double_tap_action': 'Double Tap Action',
        'config.pills_left_label': 'Override Label',
        'config.pills_left_icon': 'Override Icon',
        'config.pills_left_box': 'Bottom Box',
        'config.pills_left_show_days_left': 'Days left instead of Pills left',
        'config.pills_left_entity': 'Override Entity',
        'config.pills_left_tap_action': 'Tap Action',
        'config.pills_left_hold_action': 'Hold Action',
        'config.pills_left_double_tap_action': 'Double Tap Action',
        // ── Drinks Panel config labels (mirror the Daily Panel fields) ──
        'config.drinks_panel': 'Drinks Tab',
        'config.log_drink_icon': 'Log Drink Icon',
        'config.log_drink_label': 'Log Drink Label',
        'config.in_body_box': 'Top Box',
        'config.in_body_entity': 'Override Entity',
        'config.in_body_label': 'Override Label',
        'config.in_body_icon': 'Override Icon',
        'config.in_body_tap_action': 'Tap Action',
        'config.in_body_hold_action': 'Hold Action',
        'config.in_body_double_tap_action': 'Double Tap Action',
        'config.disruption_box': 'Bottom Box',
        'config.disruption_mode': 'Time to Low',
        'config.disruption_entity': 'Override Entity',
        'config.disruption_label': 'Override Label',
        'config.disruption_icon': 'Override Icon',
        'config.disruption_tap_action': 'Tap Action',
        'config.disruption_hold_action': 'Hold Action',
        'config.disruption_double_tap_action': 'Double Tap Action',
        'config.disruption_mode_disruption': 'Sleep Disruption',
        'config.disruption_mode_low_timestamp': 'Low - Timestamp',
        'config.disruption_mode_low_hours_until': 'Low - Hours Until',
        'config.drink_chips': 'Custom Boxes',
        // ── M2M Multi-User — Multi-Tracker State Machine ──
        'config.drink_tracker_devices': 'Drink Tracker Picker',
        // ── Multi-Medicine State Machine ──
        'config.medicine_devices': 'Medicines Picker',
        // Drink box field labels (the box titles reuse config.chip_N_box above)
        'config.drink_chip_1': 'Box 1 (optional)',
        'config.drink_chip_1_label': 'Box 1 Label',
        'config.drink_chip_1_icon': 'Box 1 Icon',
        'config.drink_chip_1_show_icon': 'Show Icon',
        'config.drink_chip_1_tap_action': 'Tap Action',
        'config.drink_chip_1_hold_action': 'Hold Action',
        'config.drink_chip_1_double_tap_action': 'Double Tap Action',
        'config.drink_chip_2': 'Box 2 (optional)',
        'config.drink_chip_2_label': 'Box 2 Label',
        'config.drink_chip_2_icon': 'Box 2 Icon',
        'config.drink_chip_2_show_icon': 'Show Icon',
        'config.drink_chip_2_tap_action': 'Tap Action',
        'config.drink_chip_2_hold_action': 'Hold Action',
        'config.drink_chip_2_double_tap_action': 'Double Tap Action',
        'config.drink_chip_3': 'Box 3 (optional)',
        'config.drink_chip_3_label': 'Box 3 Label',
        'config.drink_chip_3_icon': 'Box 3 Icon',
        'config.drink_chip_3_show_icon': 'Show Icon',
        'config.drink_chip_3_tap_action': 'Tap Action',
        'config.drink_chip_3_hold_action': 'Hold Action',
        'config.drink_chip_3_double_tap_action': 'Double Tap Action',
        'config.drink_chip_4': 'Box 4 (optional)',
        'config.drink_chip_4_label': 'Box 4 Label',
        'config.drink_chip_4_icon': 'Box 4 Icon',
        'config.drink_chip_4_show_icon': 'Show Icon',
        'config.drink_chip_4_tap_action': 'Tap Action',
        'config.drink_chip_4_hold_action': 'Hold Action',
        'config.drink_chip_4_double_tap_action': 'Double Tap Action',
        'config.color_scheme': 'Color Scheme',
        'config.name': 'Name Override',
        'config.daily_panel': 'Daily Tab',
        'config.graphs_panel': 'Graphs Tab',
        'config.stats_panel': 'Stats Tab',
        'config.settings_panel': 'Settings Tab',
        'config.show_color_indicator_explainer': 'Color Explainer Button',
        'config.confirm_tool_actions': 'Confirm Tool Actions',
        'config.helper.confirm_tool_actions': 'Show a confirmation popup before running any Tools tab action. On by default.',
        'config.chips': 'Custom Boxes',
        // Custom Box entity picker neutral label (the "Box N" expandable header
        // already conveys identity; this groups the entity + overrides below it).
        'config.box_settings': 'Settings',
        // ── Button State Matrix (Prosumer UI) — config labels ──
        // Submenu header (shared by Daily + Drinks Button expandables).
        'config.button': 'Button',
        // Daily (Take Pill button) — per-state style + icon_style + ack layout/duration.
        // Labels use patient-facing terminology (not internal state-machine jargon):
        // "Limit Reached" (lockout), "Take Pill" (execution-requested), "Overdue
        // Warning" (latency), "Logged Dose Indicator" (ack flash). Config keys are
        // unchanged — only the user-facing label text changed.
        'config.take_button_lockout_style': 'Limit Reached Style',
        'config.take_button_lockout_icon_style': 'Limit Reached Icon Style',
        'config.take_button_execution_style': 'Take Pill Style',
        'config.take_button_execution_icon_style': 'Take Pill Icon Style',
        'config.take_button_latency_style': 'Overdue Warning Style',
        'config.take_button_latency_icon_style': 'Overdue Warning Icon Style',
        'config.take_button_ack_layout': 'Logged Dose Indicator Style',
        'config.take_button_ack_duration_ms': 'Logged Animation Duration (ms)',
        'config.take_button_ring_speed': 'Glow / Ring Speed',
        // Drinks (Log Drink button) — lockout + ack only (no schedule).
        'config.drink_button_lockout_style': 'Limit Reached Style',
        'config.drink_button_lockout_icon_style': 'Limit Reached Icon Style',
        'config.drink_button_ack_layout': 'Logged Dose Indicator Style',
        'config.drink_button_ack_duration_ms': 'Logged Animation Duration (ms)',
        'config.drink_button_ring_speed': 'Glow / Ring Speed',
        // ── Button State Matrix — 6 Style option labels (Default sentinel + 5 visual) ──
        'button_style.auto': 'Default',
        'button_style.full': 'Full Button',
        'button_style.border': 'Border Only',
        'button_style.none': 'No Color',
        'button_style.ring': 'Rotating Ring',
        'button_style.glow': 'Ambilight Glow',
        // ── Icon Style option labels (Default sentinel + 4 visual: 2x2 matrix) ──
        'icon_style.auto': 'Default',
        'icon_style.none': 'None',
        'icon_style.color': 'Colored',
        'icon_style.color_pulse': 'Colored + Pulse',
        'icon_style.pulse': 'Pulse Only',
        // ── ACK (Logged) flash layout option labels (3 options) ──
        'ack_layout.top': 'Top tick mark and text',
        'ack_layout.inline': 'Tick mark and text inline',
        'ack_layout.big': 'Big tick mark',
        // ── Rotating ring speed option labels (3 options) ──
        'ring_speed.slow': 'Slow',
        'ring_speed.medium': 'Medium',
        'ring_speed.fast': 'Fast',
        // ACK transient flash text ("Logged") rendered via the ack overlay element.
        'button.ack_text': 'Logged',
        // Box expandable titles (layer 3 — nested collapsable menus)
        'config.chip_1_box': 'Box 1',
        'config.chip_2_box': 'Box 2',
        'config.chip_3_box': 'Box 3',
        'config.chip_4_box': 'Box 4',
        // Box field labels (entity + icon + label are label-suppressed in
        // computeLabel; the action fields keep their visible labels below)
        'config.chip_1': 'Box 1 (optional)',
        'config.chip_1_label': 'Box 1 Label',
        'config.chip_1_icon': 'Box 1 Icon',
        'config.chip_1_show_icon': 'Show Icon',
        'config.chip_1_tap_action': 'Tap Action',
        'config.chip_1_hold_action': 'Hold Action',
        'config.chip_1_double_tap_action': 'Double Tap Action',
        'config.chip_2': 'Box 2 (optional)',
        'config.chip_2_label': 'Box 2 Label',
        'config.chip_2_icon': 'Box 2 Icon',
        'config.chip_2_show_icon': 'Show Icon',
        'config.chip_2_tap_action': 'Tap Action',
        'config.chip_2_hold_action': 'Hold Action',
        'config.chip_2_double_tap_action': 'Double Tap Action',
        'config.chip_3': 'Box 3 (optional)',
        'config.chip_3_label': 'Box 3 Label',
        'config.chip_3_icon': 'Box 3 Icon',
        'config.chip_3_show_icon': 'Show Icon',
        'config.chip_3_tap_action': 'Tap Action',
        'config.chip_3_hold_action': 'Hold Action',
        'config.chip_3_double_tap_action': 'Double Tap Action',
        'config.chip_4': 'Box 4 (optional)',
        'config.chip_4_label': 'Box 4 Label',
        'config.chip_4_icon': 'Box 4 Icon',
        'config.chip_4_show_icon': 'Show Icon',
        'config.chip_4_tap_action': 'Tap Action',
        'config.chip_4_hold_action': 'Hold Action',
        'config.chip_4_double_tap_action': 'Double Tap Action',
        'config.show_amount_in_body': 'Amount in Body Graph',
        'config.amount_in_body_default_timeframe': 'Amount in Body Default Timescale',
        'config.show_day_avg_boxes': 'Day Avg Boxes',
        'config.show_adherence_boxes': 'Adherence Boxes (If available)',
        'config.stats_3_columns': '3-Column Stats',
        'config.hide_nav_bar': 'Hide Navigation Bar',
        'config.helper.bold_text': 'Makes all card text bolder for better readability.',
        'config.helper.default_view': 'Falls back to Daily if invalid.',
        // ── Config form helpers ──
        'config.helper.big_text': 'Enlarges all card text for easier reading.',
        'config.helper.take_pill_icon': 'Icon for the Take Pill button. Defaults to mdi:pill.',
        'config.helper.take_pill_label': 'Button text. Defaults to "Take Pill". E.g. "Inject Dose", "Apply Cream".',
        'config.helper.safe_to_take_box': 'Replace the box with any entity, or switch to the Amount in Body sensor. Leave empty for the default Safe to Take sensor.',
        'config.helper.safe_to_take_entity': 'Any entity to show here. Leave empty for default. Overridden by the Amount in body toggle.',
        'config.helper.safe_to_take_label': 'Custom label. Defaults to "Safe to take" or "Amount in Body" depending on the toggle.',
        'config.helper.safe_to_take_icon': 'Icon on the box. Defaults to mdi:shield-check or mdi:chart-bell-curve depending on the toggle.',
        'config.helper.safe_to_take_show_amount_in_body': 'Show the Amount in Body sensor instead of Safe to take. The Take Pill limit check still uses the real Safe to Take sensor.',
        'config.helper.safe_to_take_tap_action': 'Defaults to more-info.',
        'config.helper.safe_to_take_hold_action': 'Long-press action.',
        'config.helper.safe_to_take_double_tap_action': 'Double-tap action.',
        'config.helper.pills_left_label': 'Defaults to "Pills left". E.g. "Amount Left (ml)", "Doses Left".',
        'config.helper.pills_left_icon': 'Icon on the Pills Left box. Defaults to mdi:pill.',
        'config.helper.pills_left_box': 'Replace the box with any entity, or switch to the Days left sensor. Leave empty for the default sensor.',
        'config.helper.pills_left_show_days_left': 'Show the Days left sensor instead of Pills left. Keeps the Refill dialog as the default tap.',
        'config.helper.pills_left_entity': 'Any entity to show here. Leave empty for default. Overridden by the Days Left toggle.',
        'config.helper.pills_left_tap_action': 'Defaults to the Refill dialog. A custom action overrides it.',
        'config.helper.pills_left_hold_action': 'Long-press action.',
        'config.helper.pills_left_double_tap_action': 'Double-tap action.',
        // ── Drinks Panel config helpers (mirror the Daily Panel helpers) ──
        'config.helper.drinks_panel': 'Drink Tracker (Caffeine / Alcohol) card settings.',
        'config.helper.log_drink_icon': 'Icon for the Log Drink button. Defaults to mdi:coffee / mdi:glass-mug-variant.',
        'config.helper.log_drink_label': 'Button text. Defaults to "Log Drink".',
        'config.helper.in_body_box': 'Replace the box with any entity. Leave empty for the default sensor.',
        'config.helper.in_body_entity': 'Any entity to show here. Leave empty for default.',
        'config.helper.in_body_label': 'Custom label. Defaults to "In Body".',
        'config.helper.in_body_icon': 'Icon on the box. Defaults to mdi:chart-bell-curve.',
        'config.helper.in_body_tap_action': 'Defaults to more-info.',
        'config.helper.in_body_hold_action': 'Long-press action.',
        'config.helper.in_body_double_tap_action': 'Double-tap action.',
        'config.helper.disruption_box': 'Show Sleep Disruption state, or switch to the Low - Timestamp / Low - Hours Until sensor. Or replace with any entity.',
        'config.helper.disruption_mode': 'Show Sleep Disruption state, or switch to the Low - Timestamp (HH:MM) or Low - Hours Until (countdown) sensor. Defaults to Sleep Disruption.',
        'config.helper.disruption_entity': 'Any entity to show here. Leave empty for default. Overridden by the Time to Low selector.',
        'config.helper.disruption_label': 'Custom label. Defaults to "Disruption", "Low - Timestamp", or "Low - Hours Until" depending on the selector.',
        'config.helper.disruption_icon': 'Icon on the box. Defaults to mdi:sleep, mdi:clock-outline, or mdi:timer-sand depending on the selector.',
        'config.helper.disruption_tap_action': 'Defaults to the Sleep Disruption popup (Sleep Disruption mode) or more-info (Low modes).',
        'config.helper.disruption_hold_action': 'Long-press action.',
        'config.helper.disruption_double_tap_action': 'Double-tap action.',
        'config.helper.drink_chips': 'Show as a box on the Drinks tab.',
        // ── M2M Multi-User — Multi-Tracker helper ──
        'config.helper.drink_tracker_devices': 'Choose Caffeine or Alcohol Tracker devices. Multiple can be selected (all must be the same substance). Leave empty for a single medicine card.',
        // ── Multi-Medicine State Machine helper ──
        'config.helper.medicine_devices': 'Choose one or more medicine devices. Multiple devices combine into one card with a title switcher. Do NOT select Caffeine/Alcohol Trackers here — use the Drink Tracker Picker below.',
        'config.helper.drink_chip': 'Show as a box on the Drinks tab.',
        'config.helper.drink_chip_label': "Leave empty to use the entity's name.",
        'config.helper.color_scheme': 'Accent color for the card. *Press card title for more info on indicator colors and the starred colors.',
        'config.helper.name': 'Leave empty to use the device name.',
        'config.helper.chip_label': "Leave empty to use the entity's name.",
        'config.helper.chip': 'Show as a box on the Daily tab.',
        // Box override helpers (icon + actions)
        'config.helper.chip_icon': "Override the box icon. Leave empty for the entity's default icon.",
        'config.helper.chip_show_icon': 'Display an icon on this box. Off by default. When on, the box grows taller to fit the icon above the label — useful to make boxes larger for a button-like layout.',
        'config.helper.chip_tap_action': 'Defaults to more-info on the entity.',
        'config.helper.chip_hold_action': 'Long-press action.',
        'config.helper.chip_double_tap_action': 'Double-tap action.',
        'config.helper.show_amount_in_body': 'Show in the Graphs tab.',
        'config.helper.amount_in_body_default_timeframe': 'Default timescale on card load.',
        'config.helper.show_day_avg_boxes': 'Show beneath the bar graph.',
        'config.helper.show_adherence_boxes': 'Show beneath the bar graph. Requires adherence sensors.',
        'config.helper.stats_3_columns': '3 columns instead of 2.',
        'config.helper.hide_nav_bar': 'Hide the tab navigation bar.',
        'config.helper.show_color_indicator_explainer': 'Show a Medical Color Indicators button in the device-info popup.',
        // ── Button State Matrix helpers ──
        // Daily (Take Pill) per-state helpers. Terminology aligned with the
        // renamed labels (Limit Reached / Take Pill / Overdue Warning / Logged
        // Dose Indicator). 'auto' (Default sentinel) resolves to the per-state
        // default at runtime. See plans/icon-style-dropdown-separation-plan.md.
        'config.helper.take_button_lockout_style': 'Visual style when the daily limit is reached (Full Button, Border Only, No Color, Rotating Ring, or Ambilight Glow). Default: Full Button.',
        'config.helper.take_button_lockout_icon_style': 'Icon color and pulse when the limit is reached. Default: None.',
        'config.helper.take_button_execution_style': 'Visual style when a scheduled dose is due (within the first half of the on-time window) (Full Button, Border Only, No Color, Rotating Ring, or Ambilight Glow). Default: No Color.',
        'config.helper.take_button_execution_icon_style': 'Icon color and pulse when a dose is due. Default: Colored.',
        'config.helper.take_button_latency_style': 'Visual style when the dose is overdue (past half the on-time window) (Full Button, Border Only, No Color, Rotating Ring, or Ambilight Glow). Default: Border Only.',
        'config.helper.take_button_latency_icon_style': 'Icon color and pulse when overdue. Default: Colored + Pulse.',
        'config.helper.take_button_ack_layout': 'Layout of the transient "Logged" flash after pressing the button. Default: Top tick mark and text.',
        'config.helper.take_button_ack_duration_ms': 'How long the "Logged" flash appears, in milliseconds. Default: 3000.',
        'config.helper.take_button_ring_speed': 'Speed of the rotating ring and ambilight glow breathing animation. Default: Medium.',
        // Drinks (Log Drink) per-state helpers.
        'config.helper.drink_button_lockout_style': 'Visual style when the substance daily limit is reached (Full Button, Border Only, No Color, Rotating Ring, or Ambilight Glow). Default: Full Button.',
        'config.helper.drink_button_lockout_icon_style': 'Icon color and pulse when the limit is reached. Default: None.',
        'config.helper.drink_button_ack_layout': 'Layout of the transient "Logged" flash after logging a drink. Default: Top tick mark and text.',
        'config.helper.drink_button_ack_duration_ms': 'How long the "Logged" flash appears, in milliseconds. Default: 3000.',
        'config.helper.drink_button_ring_speed': 'Speed of the rotating ring and ambilight glow breathing animation. Default: Medium.',
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
        'aria.take_pill_24h_limit': '24h strength limit reached, override available',
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

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r$1=o=>void 0===o.strings,m={},p=(o,t=m)=>o._$AH=t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={CHILD:2},e=t=>(...e)=>({_$litDirective$:t,values:e});let i$1 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=(i,t)=>{const e=i._$AN;if(void 0===e)return  false;for(const i of e)i._$AO?.(t,false),s(i,t);return  true},o=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t;}while(0===e?.size)},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),c(t);}};function h(i){ void 0!==this._$AN?(o(this),this._$AM=i,r(this)):this._$AM=i;}function n(i,t=false,e=0){const r=this._$AH,h=this._$AN;if(void 0!==h&&0!==h.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s(r[i],false),o(r[i]);else null!=r&&(s(r,false),o(r));else s(this,i);}const c=i=>{i.type==t.CHILD&&(i._$AP??=n,i._$AQ??=h);};class f extends i$1{constructor(){super(...arguments),this._$AN=void 0;}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU;}_$AO(i,t=true){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(s(this,i),o(this));}setValue(t){if(r$1(this._$Ct))this._$Ct._$AI(t,this);else {const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0);}}disconnected(){}reconnected(){}}

// ──────────────────────────────────────────────
// AX Dose Logger Card — Delayed-action directive
// ──────────────────────────────────────────────
// Wraps a click callback in a short setTimeout so the <ha-ripple> press
// animation has time to render before the controller fires the action and
// triggers a Lit re-render (which would otherwise interrupt MdRipple's
// requestAnimationFrame chain and truncate the ripple).
//
// The delay (110ms) is deliberately shorter than HA's stock actionHandler
// disambiguation window (~250ms) per user request — enough to let the
// ripple visibly expand past its peak, but not so long that the action
// feels sluggish.
//
// Implemented as a Lit AsyncDirective so the event-listener wrapper is
// STABLE across re-renders (Lit memoizes the directive instance per
// binding position), which:
//   1. Avoids re-binding @click on every render (Lit diffs listener
//      identity; a stable wrapper means no add/removeEventListener churn).
//   2. Keeps the clearTimeout dedup correct across re-renders — the timer
//      handle lives on the directive instance, not in a per-render closure,
//      so a second rapid click always sees + cancels the first timer.
//   3. Auto-cleans the pending timer when the host element is disconnected
//      (disconnected() lifecycle), preventing a stale callback firing on a
//      detached element.
//
// Usage in Lit templates (replaces a raw `@click`):
//   @click=${delayedAction(() => c.handleTakePill(e))}
//
// For elements that also need hold/double-tap, keep the separate
// @contextmenu / @dblclick bindings — those are user-intent-disambiguated
// by the browser and do not interfere with the ripple.
/** Delay in ms before the wrapped action fires. */
const RIPPLE_ACTION_DELAY_MS = 110;
/**
 * AsyncDirective that binds a stable click listener which fires the latest
 * callback after RIPPLE_ACTION_DELAY_MS.
 *
 * The directive instance is memoized by Lit for the lifetime of the binding
 * position (the `@click=${…}` part), so the listener wrapper returned from
 * `render()` is the SAME function reference across re-renders. Only the
 * callback it dispatches to is updated (via the `_latest` field), which is
 * what we want: no listener churn, correct timer dedup, auto-cleanup.
 *
 * The wrapper cancels any pending timer on a second rapid press so that the
 * action fires once per click even during rapid tapping — and because the
 * timer handle lives on the directive instance (not a per-render closure),
 * the dedup works correctly even when a re-render happens between two
 * rapid clicks (the bug the prior inline-closure implementation had).
 */
class DelayedActionDirective extends f {
    constructor(partInfo) {
        super(partInfo);
        /** Latest callback to fire when the timer expires. Updated on every
         *  render via update() so the wrapper always dispatches the fresh
         *  callback (which may close over newer entity state). */
        this._latest = null;
        // Bind the wrapper to this instance once. The same function reference
        // is returned from render() on every update → Lit does NOT re-bind the
        // @click listener (it diffs listener identity and skips if unchanged).
        this._wrapper = (ev) => {
            if (this._timer !== undefined) {
                clearTimeout(this._timer);
            }
            this._timer = window.setTimeout(() => {
                this._timer = undefined;
                // Defensive: the timer may fire after the host element was
                // disconnected (disconnectedCallback clears the timer, but a
                // native setTimeout callback already queued before the clear
                // could still run in the same microtask). Guard with isConnected.
                if (!this.isConnected)
                    return;
                this._latest?.(ev);
            }, RIPPLE_ACTION_DELAY_MS);
        };
    }
    /**
     * Called by Lit on the initial render AND every subsequent update of the
     * @click part. Returns the stable wrapper so Lit keeps the same listener
     * bound, and refreshes _latest so the wrapper dispatches the newest
     * callback (which closes over the current render's state).
     */
    render(callback) {
        this._latest = callback;
        return this._wrapper;
    }
    /**
     * Called by Lit on every update (including the first). Mirrors render()
     * but runs after the part is committed. We update _latest here as well so
     * the freshest callback is in place regardless of which hook Lit uses.
     */
    update(_part, [callback]) {
        this._latest = callback;
        return this.render(callback);
    }
    /**
     * Lit lifecycle hook — fired when the host element is disconnected or the
     * part is removed. Cancels any pending timer so a stale callback can't
     * fire on a detached element (which would call requestUpdate / mutate
     * @state on an element no longer in the DOM).
     */
    disconnected() {
        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }
        // Drop the callback reference so a queued timer callback (cleared
        // above, but defense-in-depth) can't reach a stale closure.
        this._latest = null;
        super.disconnected();
    }
    /**
     * Reconnected lifecycle hook — Lit reuses the directive instance when the
     * host element is re-attached, so _wrapper stays stable. No action needed
     * beyond the base class; the next render() will refresh _latest.
     */
    reconnected() {
        super.reconnected();
    }
}
/**
 * The directive factory. Use in Lit templates:
 *   @click=${delayedAction(() => doThing())}
 *
 * Lit memoizes the directive instance per binding position, so the same
 * DelayedActionDirective (and its stable _wrapper) is reused across
 * re-renders — only the callback argument is refreshed.
 */
const delayedAction = e(DelayedActionDirective);

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
/**
 * Convert an amount-in-body line-graph timeframe id to hours.
 * Shared by the container (_fetchAmountHistory) and the graphs panel
 * (render), so both use the same mapping without duplicating the switch.
 */
function getTimeframeHours(timeframe) {
    switch (timeframe) {
        case '12h': return 12;
        case '24h': return 24;
        case '7d': return 168;
        case '14d': return 336;
        case '30d': return 720;
        default: return 48;
    }
}
/**
 * Resolve a ButtonStateInput to a single ButtonState per the matrix precedence.
 * Pure + side-effect-free so both panels share one code path.
 */
function resolveButtonState(input) {
    // ACK is now a pure overlay driven by the panel's `ackActive` flag (rendered
    // via a dedicated `.ack-flash::after` rule). It no longer collapses the
    // resolved state, so the button keeps its true color (lockout/idle/
    // execution/latency) underneath the ack flash. Fixes the "green Take Pill
    // lingering for several seconds after an override press" bug where the ack
    // recolored the whole button green and the recomputed post-ack state fell
    // to 'idle' (theme default) until the backend pushed the new
    // pillsSafeToTake. The 'ack' value stays in the ButtonState union for type
    // compat; it is simply never returned here.
    if (input.isLockedOut)
        return 'lockout';
    if (input.is24hLimitReached)
        return 'limit_24h';
    if (input.isScheduled) {
        // Not yet due: the next scheduled slot is still in the future
        // (isDueNow === false) and the overdue sensor hasn't started counting
        // (overdueSeconds <= 0). Show idle (theme default, no color) until the
        // slot actually arrives. This fixes the bug where every scheduled med
        // showed the blue "Dose Due" (execution) state for the entire interval
        // between doses, not just when due — most visible on long-interval
        // schedules (bi-daily cyclic). The overdue sensor alone can't
        // distinguish "not yet due" from "freshly due" (both read 0), so the
        // next_dose timestamp (via isDueNow) is the authoritative "has the
        // slot arrived" signal.
        if (!input.isDueNow && input.overdueSeconds <= 0) {
            return 'idle';
        }
        // Overdue warning (latency) appears at half the grace period — proactive
        // heads-up before adherence expires. The first half of the grace window
        // stays in the execution state (on-time per adherence, no rush). This
        // fixes the disconnect where the card warned "overdue" at 0 seconds while
        // the adherence system still considered the dose on-time.
        if (input.overdueSeconds > (input.graceHours * 3600) / 2)
            return 'latency';
        return 'execution';
    }
    return 'idle';
}
/**
 * Map a backend Dose Status enum sensor state to a ButtonState.
 *
 * The backend PillDoseStatusSensor computes the same precedence chain as
 * resolveButtonState() (limit_reached → limit_24h → not_due/due/overdue →
 * ok) with point-in-time timers, so the card can consume it directly as the
 * single source of truth instead of re-deriving the state from 4 entities.
 *
 * Returns null for unavailable/unknown/empty states so the caller can fall
 * back to the legacy derivation (older backends without the sensor).
 * 'ok' (As-Needed available) maps to 'idle' — the card's no-color default
 * for an available PRN med, matching the legacy resolver's as-needed path.
 */
function mapDoseStatusToButtonState(status) {
    if (!status || status === 'unavailable' || status === 'unknown')
        return null;
    switch (status) {
        case 'limit_reached':
            return 'lockout';
        case 'limit_24h':
            return 'limit_24h';
        case 'overdue':
            return 'latency';
        case 'due':
            return 'execution';
        case 'not_due':
        case 'ok':
            return 'idle';
        default:
            // Unrecognized enum value (future backend state) — fail open to the
            // legacy derivation rather than guessing.
            return null;
    }
}
/** Fixed duration (ms) of the ACK overlay press-in intro (ax-btn-ack-intro /
 *  ax-drink-btn-ack-intro CSS keyframes). The container freezes the resolved
 *  ButtonState for this long after an ACK trigger so the underlying state
 *  transition (e.g. idle to lockout) is hidden behind the overlay by the time
 *  it commits. Mirrors the CSS keyframe duration exactly — update both
 *  together. Fixed (not proportional to ack_duration_ms). */
const ACK_INTRO_MS = 240;

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
// Button State Matrix — shared select options
// ──────────────────────────────────────────────
// The 6 Style options (Default sentinel + 5 visual) used by every per-state
// Style dropdown in the Daily and Drinks "Button" submenus. 'auto' is a
// sentinel that resolves to the per-state default at runtime. Kept module-
// scoped so the schema below references one source of truth (adding/
// reordering an option here updates both submenus). Labels come from
// localize('button_style.*'). See plans/icon-style-dropdown-separation-plan.md
// + plans/ambilight-glow-style-plan.md (the 6th 'glow' option).
function _buttonStyleOptions() {
    return [
        { value: 'auto', label: localize('en', 'button_style.auto') },
        { value: 'full', label: localize('en', 'button_style.full') },
        { value: 'border', label: localize('en', 'button_style.border') },
        { value: 'none', label: localize('en', 'button_style.none') },
        { value: 'ring', label: localize('en', 'button_style.ring') },
        { value: 'glow', label: localize('en', 'button_style.glow') },
    ];
}
// The 5 Icon Style options (Default sentinel + 4 visual) used by every
// per-state Icon Style dropdown. 'auto' resolves to the per-state default
// at runtime. The 4 visual options form a 2x2 matrix (color on/off x pulse
// on/off). Kept module-scoped alongside _buttonStyleOptions. Labels come
// from localize('icon_style.*'). See plans/icon-style-dropdown-separation-plan.md.
function _iconStyleOptions() {
    return [
        { value: 'auto', label: localize('en', 'icon_style.auto') },
        { value: 'none', label: localize('en', 'icon_style.none') },
        { value: 'color', label: localize('en', 'icon_style.color') },
        { value: 'color_pulse', label: localize('en', 'icon_style.color_pulse') },
        { value: 'pulse', label: localize('en', 'icon_style.pulse') },
    ];
}
// The 3 "Logged" (ACK) flash layout options for the take/drink button
// _ack_layout dropdown. Kept module-scoped alongside _buttonStyleOptions so
// all submenus reference one source of truth. Labels come from
// localize('ack_layout.*'). See plans/glow-speed-and-ack-style-plan.md §2.3.
function _ackLayoutOptions() {
    return [
        { value: 'top', label: localize('en', 'ack_layout.top') },
        { value: 'inline', label: localize('en', 'ack_layout.inline') },
        { value: 'big', label: localize('en', 'ack_layout.big') },
    ];
}
// The 3 rotating-ring speed options for the take/drink button _ring_speed
// dropdown. 'medium' (4s) is the default. Labels come from
// localize('ring_speed.*'). See plans/icon-style-dropdown-separation-plan.md.
function _ringSpeedOptions() {
    return [
        { value: 'slow', label: localize('en', 'ring_speed.slow') },
        { value: 'medium', label: localize('en', 'ring_speed.medium') },
        { value: 'fast', label: localize('en', 'ring_speed.fast') },
    ];
}
// ──────────────────────────────────────────────
// Grid-alignment CSS injection
// ──────────────────────────────────────────────
// Module-scoped observer + reference count. The observer is module-scoped so
// repeated installEditorGridAlignment() calls reuse a single observer (one
// process-wide is enough — HA opens at most one card config dialog at a time).
// A reference count guards against premature auto-cleanup when multiple card
// instances on the same dashboard open their editors in quick succession (the
// closing of one editor must not disconnect the observer while another is open).
let _formStyleObserver = null;
let _formStyleRefcount = 0;
/**
 * Inject a `<style>` into `ha-form` shadow roots **inside a config dialog**
 * so that entity-picker + text-field pairs inside `type: 'grid'` containers
 * align by their bottom edges.
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
 * Called from the container's static getConfigForm() — i.e. only when the
 * user opens the visual editor, not on every dashboard load (was previously
 * in connectedCallback, which installed the observer for every card instance
 * on every dashboard view and never disconnected it → memory leak + needless
 * document-wide DOM scanning). The observer auto-cleans when the config
 * dialog is removed from the DOM, using a **reference count** so that if two
 * card instances' editors are open (or one closes while another is opening),
 * the observer is only disconnected when the last reference is released — not
 * when a transient "0 forms" state occurs during a dialog swap. uninstall-
 * EditorGridAlignment() is available for explicit cleanup if ever needed.
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
    // Find ha-form elements that are inside an ha-dialog (config editor scope)
    // and inject into their shadow roots. Returns the count of scoped forms so
    // the caller can detect "dialog closed" and self-clean the observer.
    // Only forms inside a dialog receive the injection so we don't pollute
    // ha-form elements used in other dashboard surfaces (N2 cross-card fix).
    const processForms = () => {
        const dialogs = document.querySelectorAll('ha-dialog');
        let scopedFormCount = 0;
        dialogs.forEach((dialog) => {
            const forms = dialog.querySelectorAll('ha-form');
            forms.forEach((form) => {
                if (form.shadowRoot) {
                    injectInto(form.shadowRoot);
                    scopedFormCount++;
                }
            });
        });
        return scopedFormCount;
    };
    // Process existing forms immediately.
    processForms();
    // Bump the reference count — each installEditorGridAlignment() call (one
    // per getConfigForm() invocation, i.e. one per editor open) holds a ref.
    // The observer is only disconnected when the count drops to 0, so a
    // concurrent editor closing while another is open won't prematurely tear
    // down the observer (N6 concurrent-editor race fix).
    _formStyleRefcount++;
    // Set up a MutationObserver to catch forms that appear later (the config
    // dialog's ha-form may render asynchronously after the dialog opens).
    if (_formStyleObserver) {
        // Observer already exists (another editor is open or the prior one's
        // observer hasn't been cleaned up yet) — reuse it, don't disconnect.
        return;
    }
    _formStyleObserver = new MutationObserver(() => {
        const formCount = processForms();
        // Auto-cleanup: when no scoped ha-form remains inside any ha-dialog, the
        // config dialog has closed. Decrement the reference count and disconnect
        // only when no references remain (guards against the concurrent-editor
        // race where one dialog closes while another is still open — N6 fix).
        if (formCount === 0) {
            _formStyleRefcount = Math.max(0, _formStyleRefcount - 1);
            if (_formStyleRefcount === 0) {
                _formStyleObserver?.disconnect();
                _formStyleObserver = null;
            }
        }
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
            // ── Top row: Medicines (multi-device) — the ONLY medicine picker ──
            // Medicine device multi-select for the all-in-one medicine card.
            // This replaced the former single `device_id` picker (removed — its
            // required:true blocked saving a multi-picker-only config, and the
            // two pickers were redundant). Legacy configs that persisted
            // `device_id` are lazily migrated into `medicine_devices` in
            // setConfig() on first load, so no existing card breaks. The selector
            // is unfiltered (HA's static ha-form device selector cannot filter by
            // a custom device model); the card validates each selected device at
            // load — it must be an ax_dose_logger device that is NOT a Drink
            // Tracker (no drink_master: True entity on it) and must resolve at
            // least one entity — rendering an error placeholder on mismatch.
            // See plans/medicine-multi-select-plan.md.
            {
                name: 'medicine_devices',
                selector: {
                    device: {
                        multiple: true,
                        filter: { integration: 'ax_dose_logger' },
                    },
                },
            },
            // ── Middle row: Drink Trackers (multi-device) ──
            // Drink Tracker device multi-select (the Caffeine Tracker / Alcohol
            // Tracker virtual devices). When populated (≥1 device), the card runs
            // the multi-profile state machine and ignores the Medicine Device
            // selector above. When empty/absent, the card falls back to the
            // Medicine Device (single medicine / granular drink card — unchanged
            // behavior). The selector is unfiltered (HA's static ha-form device
            // selector cannot filter by a custom device model); the card resolves
            // each selected device to its single `drink_master: True` body-mass
            // sensor and validates single-substance at load, rendering an error
            // placeholder on mismatch. Lazy migration from the legacy
            // `drink_master_entities` (entity IDs) and `drink_target_profile`
            // (Profile Lock UUID) is handled in setConfig() + _resolveTrackers().
            // See plans/drink-tracker-selector-rename-plan.md.
            {
                name: 'drink_tracker_devices',
                selector: {
                    device: {
                        multiple: true,
                        filter: { integration: 'ax_dose_logger' },
                    },
                },
            },
            // ── Below both selectors: Name Override ──
            {
                name: 'name',
                selector: { text: {} },
            },
            // ── Row 2: Color Scheme | Default View ──
            // Color Scheme shares a row with Default View; its one-line helper
            // ("*Press card title for more info...") points to the in-card
            // Medical Color Indicators popup (opened via the device-info dialog
            // when the Color Explainer Button toggle is ON). The four colliding
            // colors are listed last and marked with ` *`. Option `value` strings
            // are unchanged, so reordering needs no config migration. See plans/
            // color-scheme-indicator-conflict-plan.md +
            // color-indicators-explainer-popup-plan.md.
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
                                    { value: 'yellow', label: localize('en', 'color.yellow') },
                                    { value: 'purple', label: localize('en', 'color.purple') },
                                    { value: 'pink', label: localize('en', 'color.pink') },
                                    { value: 'teal', label: localize('en', 'color.teal') },
                                    { value: 'brown', label: localize('en', 'color.brown') },
                                    { value: 'coral', label: localize('en', 'color.coral') },
                                    { value: 'slate', label: localize('en', 'color.slate') },
                                    { value: 'gold', label: localize('en', 'color.gold') },
                                    { value: 'grey', label: localize('en', 'color.grey') },
                                    // Indicator-conflicting colors (see helper text):
                                    { value: 'red', label: localize('en', 'color.red') + ' *' },
                                    { value: 'blue', label: localize('en', 'color.blue') + ' *' },
                                    { value: 'orange', label: localize('en', 'color.orange') + ' *' },
                                    { value: 'green', label: localize('en', 'color.green') + ' *' },
                                ],
                            },
                        },
                    },
                    {
                        name: 'default_view',
                        selector: {
                            select: {
                                options: [
                                    { value: 'daily', label: localize('en', 'pane.daily') },
                                    { value: 'graphs', label: localize('en', 'pane.graphs') },
                                    { value: 'stats', label: localize('en', 'pane.stats') },
                                    { value: 'drinks', label: localize('en', 'pane.drinks') },
                                    { value: 'inventory', label: localize('en', 'pane.inventory') },
                                    { value: 'tools', label: localize('en', 'pane.tools') },
                                    { value: 'tracking', label: localize('en', 'pane.tracking') },
                                ],
                            },
                        },
                    },
                ],
            },
            // ── Row 3: Color Explainer Button | Hide Navigation Bar ──
            {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                    {
                        name: 'show_color_indicator_explainer',
                        default: true,
                        selector: { boolean: {} },
                    },
                    {
                        name: 'hide_nav_bar',
                        selector: { boolean: {} },
                    },
                ],
            },
            // ── Row 4: Large Text | Bold Text ──
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
                        name: 'bold_text',
                        selector: { boolean: {} },
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
                        title: 'Top Box',
                        flatten: true,
                        schema: [
                            {
                                name: 'safe_to_take_show_amount_in_body',
                                selector: { boolean: {} },
                            },
                            {
                                name: 'safe_to_take_entity',
                                selector: { entity: {} },
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
                        type: 'expandable',
                        name: 'pills_left_box',
                        title: 'Bottom Box',
                        flatten: true,
                        schema: [
                            {
                                name: 'pills_left_show_days_left',
                                selector: { boolean: {} },
                            },
                            {
                                name: 'pills_left_entity',
                                selector: { entity: {} },
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
                                name: 'pills_left_tap_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                            {
                                name: 'pills_left_hold_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                            {
                                name: 'pills_left_double_tap_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                        ],
                    },
                    {
                        type: 'expandable',
                        name: 'chips',
                        title: 'Custom Boxes',
                        flatten: true,
                        schema: [
                            // ── Layer 3: each chip gets its own collapsable menu with the
                            //    full override suite (entity + icon/label + 3 ui_actions),
                            //    mirroring the Safe to Take / Pills Left box expandables.
                            //    The expandable header "Chip N" conveys identity, so the
                            //    entity field's external label is suppressed in
                            //    computeLabel below (no redundant "Chip N (optional)" text).
                            {
                                type: 'expandable',
                                name: 'chip_1_box',
                                title: localize('en', 'config.chip_1_box'),
                                flatten: true,
                                schema: [
                                    {
                                        name: 'chip_1_show_icon',
                                        label: localize('en', 'config.chip_1_show_icon'),
                                        helper: localize('en', 'config.helper.chip_show_icon'),
                                        selector: { boolean: {} },
                                    },
                                    {
                                        name: 'chip_1',
                                        selector: { entity: {} },
                                    },
                                    {
                                        type: 'grid',
                                        name: '',
                                        column_min_width: '180px',
                                        schema: [
                                            {
                                                name: 'chip_1_icon',
                                                selector: { icon: {} },
                                            },
                                            {
                                                name: 'chip_1_label',
                                                selector: { text: {} },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'chip_1_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'chip_1_hold_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'chip_1_double_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                ],
                            },
                            {
                                type: 'expandable',
                                name: 'chip_2_box',
                                title: localize('en', 'config.chip_2_box'),
                                flatten: true,
                                schema: [
                                    {
                                        name: 'chip_2_show_icon',
                                        label: localize('en', 'config.chip_2_show_icon'),
                                        helper: localize('en', 'config.helper.chip_show_icon'),
                                        selector: { boolean: {} },
                                    },
                                    {
                                        name: 'chip_2',
                                        selector: { entity: {} },
                                    },
                                    {
                                        type: 'grid',
                                        name: '',
                                        column_min_width: '180px',
                                        schema: [
                                            {
                                                name: 'chip_2_icon',
                                                selector: { icon: {} },
                                            },
                                            {
                                                name: 'chip_2_label',
                                                selector: { text: {} },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'chip_2_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'chip_2_hold_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'chip_2_double_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                ],
                            },
                            {
                                type: 'expandable',
                                name: 'chip_3_box',
                                title: localize('en', 'config.chip_3_box'),
                                flatten: true,
                                schema: [
                                    {
                                        name: 'chip_3_show_icon',
                                        label: localize('en', 'config.chip_3_show_icon'),
                                        helper: localize('en', 'config.helper.chip_show_icon'),
                                        selector: { boolean: {} },
                                    },
                                    {
                                        name: 'chip_3',
                                        selector: { entity: {} },
                                    },
                                    {
                                        type: 'grid',
                                        name: '',
                                        column_min_width: '180px',
                                        schema: [
                                            {
                                                name: 'chip_3_icon',
                                                selector: { icon: {} },
                                            },
                                            {
                                                name: 'chip_3_label',
                                                selector: { text: {} },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'chip_3_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'chip_3_hold_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'chip_3_double_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                ],
                            },
                            {
                                type: 'expandable',
                                name: 'chip_4_box',
                                title: localize('en', 'config.chip_4_box'),
                                flatten: true,
                                schema: [
                                    {
                                        name: 'chip_4_show_icon',
                                        label: localize('en', 'config.chip_4_show_icon'),
                                        helper: localize('en', 'config.helper.chip_show_icon'),
                                        selector: { boolean: {} },
                                    },
                                    {
                                        name: 'chip_4',
                                        selector: { entity: {} },
                                    },
                                    {
                                        type: 'grid',
                                        name: '',
                                        column_min_width: '180px',
                                        schema: [
                                            {
                                                name: 'chip_4_icon',
                                                selector: { icon: {} },
                                            },
                                            {
                                                name: 'chip_4_label',
                                                selector: { text: {} },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'chip_4_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'chip_4_hold_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'chip_4_double_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                ],
                            },
                        ],
                    },
                    // ── Button State Matrix (Daily — Take Pill button) ──
                    // Restructured into nested flatten-expandables, one per aspect, so
                    // each Style dropdown + its Icon Style dropdown are visually grouped
                    // (grid pairs them side-by-side) and a section header makes the
                    // boundary between aspects clear. All select selectors use
                    // mode:'dropdown' so the 3-option selects (ack_layout, ring_speed)
                    // render as a single dropdown box instead of 3 stacked radio buttons
                    // (HA auto-selects LIST mode for <=3 options with no explicit mode).
                    // All fields default to 'auto' (the per-state default sentinel) so the
                    // editor pre-populates the control when the stored config value is
                    // undefined — 'auto' resolves to the per-state default at runtime.
                    // Defaults: Lockout=full+none, Execution=none+color,
                    // Latency=border+color_pulse, ACK layout=top / duration=3000ms,
                    // ring=medium. See plans/icon-style-dropdown-separation-plan.md.
                    {
                        type: 'expandable',
                        name: 'take_button_box',
                        title: localize('en', 'config.button'),
                        flatten: true,
                        schema: [
                            // Flat list of aspect grids — no nested expandables (2x nesting
                            // only: Button -> grid). Each Style dropdown + its Icon Style
                            // dropdown are paired side-by-side in a grid so the grouping is
                            // obvious at a glance. The label names (Limit Reached Style, Take
                            // Pill Style, etc.) convey the aspect identity without titles.
                            // ── Limit Reached: style + icon_style ──
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'take_button_lockout_style',
                                        default: 'auto',
                                        selector: {
                                            select: { options: _buttonStyleOptions(), mode: 'dropdown' },
                                        },
                                    },
                                    {
                                        name: 'take_button_lockout_icon_style',
                                        default: 'auto',
                                        selector: {
                                            select: { options: _iconStyleOptions(), mode: 'dropdown' },
                                        },
                                    },
                                ],
                            },
                            // ── Take Pill: style + icon_style ──
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'take_button_execution_style',
                                        default: 'auto',
                                        selector: {
                                            select: { options: _buttonStyleOptions(), mode: 'dropdown' },
                                        },
                                    },
                                    {
                                        name: 'take_button_execution_icon_style',
                                        default: 'auto',
                                        selector: {
                                            select: { options: _iconStyleOptions(), mode: 'dropdown' },
                                        },
                                    },
                                ],
                            },
                            // ── Overdue Warning: style + icon_style ──
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'take_button_latency_style',
                                        default: 'auto',
                                        selector: {
                                            select: { options: _buttonStyleOptions(), mode: 'dropdown' },
                                        },
                                    },
                                    {
                                        name: 'take_button_latency_icon_style',
                                        default: 'auto',
                                        selector: {
                                            select: { options: _iconStyleOptions(), mode: 'dropdown' },
                                        },
                                    },
                                ],
                            },
                            // ── Logged Dose Indicator: layout + duration ──
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'take_button_ack_layout',
                                        default: 'top',
                                        selector: {
                                            select: { options: _ackLayoutOptions(), mode: 'dropdown' },
                                        },
                                    },
                                    {
                                        name: 'take_button_ack_duration_ms',
                                        default: 3000,
                                        selector: { number: { min: 500, max: 10000, step: 100 } },
                                    },
                                ],
                            },
                            // ── Rotating Ring: speed ──
                            {
                                name: 'take_button_ring_speed',
                                default: 'medium',
                                selector: {
                                    select: { options: _ringSpeedOptions(), mode: 'dropdown' },
                                },
                            },
                        ],
                    },
                ],
            },
            // ── Drinks Panel (Master Tracker) — mirrors the Daily Panel ──
            // Same three-box override structure: Top Box (In Body — entity swap +
            // icon/label + actions), Bottom Box (Disruption — Time to Low 3-option
            // select + entity swap + icon/label + actions), and Custom Boxes (4×
            // entity + label pairs). The Bottom Box uses a single 3-option select
            // ('disruption' / 'low_timestamp' / 'low_hours_until') instead of the
            // Daily Bottom Box boolean toggle — the cleanest expression of three
            // mutually-exclusive display modes (user-confirmed Option A).
            {
                type: 'expandable',
                name: 'drinks_panel',
                flatten: true,
                schema: [
                    {
                        type: 'grid',
                        name: '',
                        column_min_width: '200px',
                        schema: [
                            {
                                name: 'log_drink_icon',
                                selector: { icon: {} },
                            },
                            {
                                name: 'log_drink_label',
                                selector: { text: {} },
                            },
                        ],
                    },
                    // Profile Lock removed — subsumed by the Drink Trackers device
                    // multi-select below the Medicine Device selector. N=1 is the new
                    // "lock"; N>1 shows the header profile switcher. Migration handles
                    // legacy drink_target_profile / drink_master_entities configs
                    // transparently in setConfig() + _resolveTrackers().
                    {
                        type: 'expandable',
                        name: 'in_body_box',
                        title: 'Top Box',
                        flatten: true,
                        schema: [
                            {
                                name: 'in_body_entity',
                                selector: { entity: {} },
                            },
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'in_body_icon',
                                        selector: { icon: {} },
                                    },
                                    {
                                        name: 'in_body_label',
                                        selector: { text: {} },
                                    },
                                ],
                            },
                            {
                                name: 'in_body_tap_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                            {
                                name: 'in_body_hold_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                            {
                                name: 'in_body_double_tap_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                        ],
                    },
                    {
                        type: 'expandable',
                        name: 'disruption_box',
                        title: 'Bottom Box',
                        flatten: true,
                        schema: [
                            {
                                name: 'disruption_mode',
                                selector: {
                                    select: {
                                        options: [
                                            { value: 'disruption', label: localize('en', 'config.disruption_mode_disruption') },
                                            { value: 'low_timestamp', label: localize('en', 'config.disruption_mode_low_timestamp') },
                                            { value: 'low_hours_until', label: localize('en', 'config.disruption_mode_low_hours_until') },
                                        ],
                                    },
                                },
                            },
                            {
                                name: 'disruption_entity',
                                selector: { entity: {} },
                            },
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'disruption_icon',
                                        selector: { icon: {} },
                                    },
                                    {
                                        name: 'disruption_label',
                                        selector: { text: {} },
                                    },
                                ],
                            },
                            {
                                name: 'disruption_tap_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                            {
                                name: 'disruption_hold_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                            {
                                name: 'disruption_double_tap_action',
                                selector: {
                                    ui_action: {},
                                },
                            },
                        ],
                    },
                    {
                        type: 'expandable',
                        name: 'drink_chips',
                        title: 'Custom Boxes',
                        flatten: true,
                        schema: [
                            // ── Layer 3: each drink chip gets its own collapsable menu with
                            //    the full override suite (entity + icon/label + 3 ui_actions),
                            //    mirroring the Daily Panel chip_N_box expandables above.
                            {
                                type: 'expandable',
                                name: 'drink_chip_1_box',
                                title: localize('en', 'config.chip_1_box'),
                                flatten: true,
                                schema: [
                                    {
                                        name: 'drink_chip_1_show_icon',
                                        label: localize('en', 'config.drink_chip_1_show_icon'),
                                        helper: localize('en', 'config.helper.chip_show_icon'),
                                        selector: { boolean: {} },
                                    },
                                    {
                                        name: 'drink_chip_1',
                                        selector: { entity: {} },
                                    },
                                    {
                                        type: 'grid',
                                        name: '',
                                        column_min_width: '180px',
                                        schema: [
                                            {
                                                name: 'drink_chip_1_icon',
                                                selector: { icon: {} },
                                            },
                                            {
                                                name: 'drink_chip_1_label',
                                                selector: { text: {} },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'drink_chip_1_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'drink_chip_1_hold_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'drink_chip_1_double_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                ],
                            },
                            {
                                type: 'expandable',
                                name: 'drink_chip_2_box',
                                title: localize('en', 'config.chip_2_box'),
                                flatten: true,
                                schema: [
                                    {
                                        name: 'drink_chip_2_show_icon',
                                        label: localize('en', 'config.drink_chip_2_show_icon'),
                                        helper: localize('en', 'config.helper.chip_show_icon'),
                                        selector: { boolean: {} },
                                    },
                                    {
                                        name: 'drink_chip_2',
                                        selector: { entity: {} },
                                    },
                                    {
                                        type: 'grid',
                                        name: '',
                                        column_min_width: '180px',
                                        schema: [
                                            {
                                                name: 'drink_chip_2_icon',
                                                selector: { icon: {} },
                                            },
                                            {
                                                name: 'drink_chip_2_label',
                                                selector: { text: {} },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'drink_chip_2_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'drink_chip_2_hold_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'drink_chip_2_double_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                ],
                            },
                            {
                                type: 'expandable',
                                name: 'drink_chip_3_box',
                                title: localize('en', 'config.chip_3_box'),
                                flatten: true,
                                schema: [
                                    {
                                        name: 'drink_chip_3_show_icon',
                                        label: localize('en', 'config.drink_chip_3_show_icon'),
                                        helper: localize('en', 'config.helper.chip_show_icon'),
                                        selector: { boolean: {} },
                                    },
                                    {
                                        name: 'drink_chip_3',
                                        selector: { entity: {} },
                                    },
                                    {
                                        type: 'grid',
                                        name: '',
                                        column_min_width: '180px',
                                        schema: [
                                            {
                                                name: 'drink_chip_3_icon',
                                                selector: { icon: {} },
                                            },
                                            {
                                                name: 'drink_chip_3_label',
                                                selector: { text: {} },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'drink_chip_3_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'drink_chip_3_hold_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'drink_chip_3_double_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                ],
                            },
                            {
                                type: 'expandable',
                                name: 'drink_chip_4_box',
                                title: localize('en', 'config.chip_4_box'),
                                flatten: true,
                                schema: [
                                    {
                                        name: 'drink_chip_4_show_icon',
                                        label: localize('en', 'config.drink_chip_4_show_icon'),
                                        helper: localize('en', 'config.helper.chip_show_icon'),
                                        selector: { boolean: {} },
                                    },
                                    {
                                        name: 'drink_chip_4',
                                        selector: { entity: {} },
                                    },
                                    {
                                        type: 'grid',
                                        name: '',
                                        column_min_width: '180px',
                                        schema: [
                                            {
                                                name: 'drink_chip_4_icon',
                                                selector: { icon: {} },
                                            },
                                            {
                                                name: 'drink_chip_4_label',
                                                selector: { text: {} },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'drink_chip_4_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'drink_chip_4_hold_action',
                                        selector: { ui_action: {} },
                                    },
                                    {
                                        name: 'drink_chip_4_double_tap_action',
                                        selector: { ui_action: {} },
                                    },
                                ],
                            },
                        ],
                    },
                    // ── Button State Matrix (Drinks — Log Drink button) ──
                    // Restructured into nested flatten-expandables (mirrors the Daily
                    // Take Pill button structure). Only 3 aspects: Limit Reached,
                    // Logged Dose Indicator, Rotating Ring (drinks are PRN with no
                    // schedule, so Take Pill and Overdue Warning are omitted). All
                    // selects use mode:'dropdown'. Style + Icon Style default to 'auto'
                    // (the per-state default sentinel), which resolves at runtime.
                    // Defaults: Lockout=full+none, ACK layout=top / duration=3000ms,
                    // ring=medium. See plans/icon-style-dropdown-separation-plan.md.
                    {
                        type: 'expandable',
                        name: 'drink_button_box',
                        title: localize('en', 'config.button'),
                        flatten: true,
                        schema: [
                            // Flat list of aspect grids — no nested expandables (2x nesting
                            // only: Button -> grid). Mirrors the Daily Take Pill button
                            // structure. Each Style dropdown + its Icon Style dropdown are
                            // paired side-by-side in a grid so the grouping is obvious.
                            // ── Limit Reached: style + icon_style ──
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'drink_button_lockout_style',
                                        default: 'auto',
                                        selector: {
                                            select: { options: _buttonStyleOptions(), mode: 'dropdown' },
                                        },
                                    },
                                    {
                                        name: 'drink_button_lockout_icon_style',
                                        default: 'auto',
                                        selector: {
                                            select: { options: _iconStyleOptions(), mode: 'dropdown' },
                                        },
                                    },
                                ],
                            },
                            // ── Logged Dose Indicator: layout + duration ──
                            {
                                type: 'grid',
                                name: '',
                                column_min_width: '200px',
                                schema: [
                                    {
                                        name: 'drink_button_ack_layout',
                                        default: 'top',
                                        selector: {
                                            select: { options: _ackLayoutOptions(), mode: 'dropdown' },
                                        },
                                    },
                                    {
                                        name: 'drink_button_ack_duration_ms',
                                        default: 3000,
                                        selector: { number: { min: 500, max: 10000, step: 100 } },
                                    },
                                ],
                            },
                            // ── Rotating Ring: speed ──
                            {
                                name: 'drink_button_ring_speed',
                                default: 'medium',
                                selector: {
                                    select: { options: _ringSpeedOptions(), mode: 'dropdown' },
                                },
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
                        default: true,
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
                                default: true,
                            },
                            {
                                name: 'show_adherence_boxes',
                                selector: { boolean: {} },
                                default: true,
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
            // ── Settings Tab ──
            // General card behavior toggles. Currently holds the confirm-action
            // toggle for the Tools tab (default ON); the container checks this
            // via a negative-false test so existing configs keep the confirmation
            // popup without migration. The schema `default: true` makes ha-form
            // render the toggle ON when the field is undefined (existing configs),
            // without baking the value into persisted config (decision #18).
            {
                type: 'expandable',
                name: 'settings_panel',
                flatten: true,
                schema: [
                    {
                        name: 'confirm_tool_actions',
                        selector: { boolean: {} },
                        default: true,
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
            // Custom Box entity picker: label as "Settings" rather than the
            // localized "Box N (optional)" — the nested expandable header "Box N"
            // already conveys identity, so the entity picker gets a neutral
            // "Settings" label that groups the entity + icon/label overrides below
            // it.  Returning a non-empty string is required: ha-form treats an
            // empty-string (or undefined) computeLabel return as "no label" and
            // falls back to humanizing the schema field name (chip_1 → "Chip 1"),
            // which is the stale text we are replacing.  "Settings" is non-empty
            // so it overrides the humanize fallback cleanly.  The icon/label
            // override fields are NOT touched here: they render their "Box N Icon"
            // / "Box N Label" labels (paired in a grid) so the user can tell the
            // icon-override picker apart from the label-override picker.  The
            // tap/hold/double_tap action fields likewise keep their labels.
            if (schema.name === 'chip_1' || schema.name === 'chip_2' ||
                schema.name === 'chip_3' || schema.name === 'chip_4') {
                return localize(lang, 'config.box_settings');
            }
            // Drink Custom Box entity picker: same "Settings" label as the
            // Daily-panel Custom Boxes above (the nested "Box N" expandable header
            // conveys identity).  Icon/label override fields render.
            if (schema.name === 'drink_chip_1' || schema.name === 'drink_chip_2' ||
                schema.name === 'drink_chip_3' || schema.name === 'drink_chip_4') {
                return localize(lang, 'config.box_settings');
            }
            return localize(lang, 'config.' + schema.name);
        },
        computeHelper: (schema, _data, hass) => {
            const lang = hass?.language || 'en';
            const name = schema.name;
            // Layout/container nodes (grid, expandable) and nodes without a selector
            // have no input control, so helper text does not apply. Without this
            // guard, localize() returns the raw 'config.helper.<name>' key for
            // containers (daily_panel, drinks_panel, graphs_panel, stats_panel,
            // chips, drink_chips, safe_to_take_box, pills_left_box, in_body_box,
            // disruption_box, chip_1_box..chip_4_box, drink_chip_1_box..drink_chip_4_box)
            // that have no translation defined, which then renders as visible text
            // under the expandable headers. (Also applies to settings_panel.)
            if (schema.type === 'grid' ||
                schema.type === 'expandable' ||
                !schema.selector) {
                return '';
            }
            // Chip icon fields: helper explains the default-icon fallback.
            if (name?.startsWith('chip_') && name?.endsWith('_icon')) {
                return localize(lang, 'config.helper.chip_icon');
            }
            // Chip action fields: tap helper notes the more-info default; hold /
            // double_tap use the generic action helper.
            if (name?.startsWith('chip_') && name?.endsWith('_tap_action')) {
                return localize(lang, 'config.helper.chip_tap_action');
            }
            if (name?.startsWith('chip_') && (name?.endsWith('_hold_action') || name?.endsWith('_double_tap_action'))) {
                return localize(lang, 'config.helper.chip_hold_action');
            }
            if (name?.startsWith('chip_') && name?.endsWith('_label')) {
                return localize(lang, 'config.helper.chip_label');
            }
            if (name?.startsWith('chip_')) {
                return localize(lang, 'config.helper.chip');
            }
            // Drink chip icon + action fields: same helpers as the Daily chips.
            if (name?.startsWith('drink_chip_') && name?.endsWith('_icon')) {
                return localize(lang, 'config.helper.chip_icon');
            }
            if (name?.startsWith('drink_chip_') && name?.endsWith('_tap_action')) {
                return localize(lang, 'config.helper.chip_tap_action');
            }
            if (name?.startsWith('drink_chip_') && (name?.endsWith('_hold_action') || name?.endsWith('_double_tap_action'))) {
                return localize(lang, 'config.helper.chip_hold_action');
            }
            if (name?.startsWith('drink_chip_') && name?.endsWith('_label')) {
                return localize(lang, 'config.helper.drink_chip_label');
            }
            if (name?.startsWith('drink_chip_')) {
                return localize(lang, 'config.helper.drink_chip');
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
let AxDoseStatsPanel = class AxDoseStatsPanel extends i$2 {
    constructor() {
        super(...arguments);
        // 30s tick from the container — a reactive trigger so the panel re-renders
        // to refresh time-relative rows even when hass/entities/controller refs are
        // unchanged. The panel doesn't read this value; it just needs to change.
        this.tick = 0;
    }
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
        if (e.daysLeft) {
            // Days-left inventory-burn sensor. Scheduled medicine → "Days left"
            // (integer, config-derived doses/day); As Needed + drinks + master →
            // "Est. days left" (empirical 7-day average). The backend sets the
            // `estimation` state attribute; the resolver mirrors it onto
            // daysLeftEst so this row picks the matching label. Whole-number
            // display via formatInteger matches the Amount in Body discipline.
            const v = c.getState(e.daysLeft);
            let display = '-';
            if (v && v !== 'unknown' && v !== 'unavailable' && v !== 'None') {
                const formatted = c.formatInteger(v);
                display = (formatted && formatted !== 'unknown' && formatted !== 'unavailable') ? formatted + ' days' : '-';
            }
            const label = e.daysLeftEst
                ? localize(this._lang, 'stats.days_left_est')
                : localize(this._lang, 'stats.days_left');
            rows.push({ label, value: display, icon: 'mdi:calendar-clock', entityId: e.daysLeft });
        }
        if (e.lastDose)
            rows.push({ label: localize(this._lang, 'stats.last_dose'), value: c.computeTimeSinceLastDose(e), icon: 'mdi:clock-outline', entityId: e.lastDose });
        const strengthUnit = c.getStrengthUnit(e);
        if (e.strength)
            rows.push({ label: localize(this._lang, 'stats.strength'), value: c.formatInteger(c.getState(e.strength)) + ' ' + strengthUnit, icon: 'mdi:scale', entityId: e.strength });
        if (e.amountInBody) {
            // When elimination is disabled (half_life = 0) the backend emits
            // `unknown` (N/A) instead of a meaningless accumulating value —
            // render a bare dash rather than "unknown mg".
            const aibRaw = c.getState(e.amountInBody);
            const aibDisplay = (aibRaw === 'unknown' || aibRaw === 'unavailable' || !aibRaw)
                ? '-'
                : c.formatInteger(aibRaw) + ' ' + strengthUnit;
            rows.push({ label: localize(this._lang, 'stats.amount_in_body'), value: aibDisplay, icon: 'mdi:chart-bell-curve', entityId: e.amountInBody });
        }
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
                if (!isNaN(dt.getTime())) {
                    // HH:MM only (24-hour, no date, no seconds) — the backend keeps the
                    // TIMESTAMP device class so automations + the history graph still see
                    // the full datetime; the card surfaces just the time for compactness.
                    display = dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
                }
            }
            rows.push({ label: localize(this._lang, 'stats.low_timestamp'), value: display, icon: 'mdi:clock-alert-outline', entityId: e.estimatedLowTime });
        }
        if (e.lowHoursUntil) {
            const v = c.getState(e.lowHoursUntil);
            let display = '-';
            if (v && v !== 'unknown' && v !== 'unavailable' && v !== 'None') {
                const num = parseFloat(v);
                // No unit suffix — the "Low - Hours Until" label already conveys the
                // unit (hours). The backend keeps UnitOfTime.HOURS for automations /
                // history; the card surfaces only the numeric value.
                if (!isNaN(num))
                    display = String(num);
            }
            rows.push({ label: localize(this._lang, 'stats.low_hours_until'), value: display, icon: 'mdi:timer-sand', entityId: e.lowHoursUntil });
        }
        return b `
      <div class="pane pane-stats">
        <div class="stats-grid ${this._config?.stats_3_columns ? 'three-col' : ''}">
          ${rows.map((row) => b `
            <div
              class="stat-cell ${row.entityId ? 'clickable' : ''}"
              role=${row.entityId ? 'button' : A}
              tabindex=${row.entityId ? '0' : A}
              @click=${row.entityId ? delayedAction(() => this.controller.openMoreInfo(row.entityId)) : undefined}
              @keydown=${row.entityId ? (ev) => this.controller.onStatCellKeydown(ev, row.entityId) : undefined}
            >
              ${row.entityId ? b `<ha-ripple></ha-ripple>` : A}
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
AxDoseStatsPanel.styles = i$5 `
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
  `;
__decorate([
    n$1({ attribute: false })
], AxDoseStatsPanel.prototype, "controller", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseStatsPanel.prototype, "entities", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseStatsPanel.prototype, "hass", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseStatsPanel.prototype, "tick", void 0);
AxDoseStatsPanel = __decorate([
    t$1('ax-dose-stats-panel')
], AxDoseStatsPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Tools Pane (Pane 4)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane4.
// Renders the maintenance button grid in three sections:
//   1. Adherence Tools — Reset Adherence %, Mark Last Adherence Taken.
//   2. Dose Tools       — Skip Dose, Undo Dose.
//   3. General Tools    — Reset History.
// Each button click goes through controller.runToolAction, which respects the
// `confirm_tool_actions` config: when ON (default) it opens the shared tools
// confirmation dialog (hosted on the container, which owns _toolsDialog
// state); when OFF the action fires immediately with no popup. The onConfirm
// closure (the actual button.press service call) is authored here because it's
// the panel's job; the container just hosts the dialog surface.
let AxDoseToolsPanel = class AxDoseToolsPanel extends i$2 {
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
        this.controller.runToolAction(localize(this._lang, 'tools.reset_adherence'), localize(this._lang, 'tools.desc.reset_adherence'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.adherenceResetButton });
        });
    }
    _handleAdherenceCover(entities) {
        if (!this.controller.hass || !entities.adherenceCoverButton)
            return;
        this.controller.runToolAction(localize(this._lang, 'tools.mark_adherence_taken'), localize(this._lang, 'tools.desc.mark_adherence_taken'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.adherenceCoverButton });
        });
    }
    _handleSkipDose(entities) {
        if (!this.controller.hass || !entities.skipButton)
            return;
        this.controller.runToolAction(localize(this._lang, 'tools.skip_dose'), localize(this._lang, 'tools.desc.skip_dose'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.skipButton });
        });
    }
    _handleResetHistory(entities) {
        if (!this.controller.hass || !entities.resetButton)
            return;
        this.controller.runToolAction(localize(this._lang, 'tools.reset_history'), localize(this._lang, 'tools.desc.reset_history'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.resetButton });
        });
    }
    _handleResetAverages(entities) {
        if (!this.controller.hass || !entities.averagesResetButton)
            return;
        this.controller.runToolAction(localize(this._lang, 'tools.reset_averages'), localize(this._lang, 'tools.desc.reset_averages'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entities.averagesResetButton });
        });
    }
    _handleUndoDoseConfirm(entities) {
        if (!this.controller.hass || !entities.undoButton)
            return;
        this.controller.runToolAction(localize(this._lang, 'tools.undo_dose'), localize(this._lang, 'tools.desc.undo_dose'), () => {
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
        this.controller.runToolAction(localize(this._lang, 'tools.undo_drink', { name: drink.name }), localize(this._lang, 'tools.desc.undo_drink'), () => { this.controller.undoDrink(drink.undoButtonEntityId); });
    }
    _handleDrinkReset(drink) {
        if (!this.controller.hass || !drink.resetButtonEntityId)
            return;
        this.controller.runToolAction(localize(this._lang, 'tools.reset_drink', { name: drink.name }), localize(this._lang, 'tools.desc.reset_drink'), () => { this.controller.resetDrink(drink.resetButtonEntityId); });
    }
    _handleResetAveragesEntity(entityId) {
        if (!this.controller.hass || !entityId)
            return;
        this.controller.runToolAction(localize(this._lang, 'tools.reset_averages'), localize(this._lang, 'tools.desc.reset_averages'), () => {
            this.controller.hass.callService('button', 'press', { entity_id: entityId });
        });
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
        ${this.entities.averagesResetButton ? b `
          <div class="tools-section-header">${localize(this._lang, 'tools.general_header')}</div>
          <div class="tools-grid">
            <button
              class="tool-btn"
              @click=${delayedAction(() => this._handleResetAveragesEntity(this.entities.averagesResetButton))}
            >
              <ha-ripple></ha-ripple>
              <ha-icon icon="mdi:chart-bell-curve-remove"></ha-icon>
              <span>${localize(this._lang, 'tools.reset_averages')}</span>
            </button>
          </div>
        ` : A}
        <div class="tools-section-header ${this.entities.averagesResetButton ? 'tools-section-header--spaced' : ''}">${localize(this._lang, 'tools.drinks_header')}</div>
        ${drinks.map((d) => b `
          <div class="drink-tool-row">
            <div class="drink-tool-name">
              <ha-icon icon="${substanceIcon}"></ha-icon>
              <span>${d.name}</span>
            </div>
            <div class="drink-tool-actions">
              ${d.undoButtonEntityId ? b `
                <button class="tool-btn danger drink-tool-btn" @click=${delayedAction(() => this._handleDrinkUndo(d))}>
                  <ha-ripple></ha-ripple>
                  <ha-icon icon="mdi:undo"></ha-icon>
                  <span>${localize(this._lang, 'tools.undo_dose')}</span>
                </button>
              ` : A}
              ${d.resetButtonEntityId ? b `
                <button class="tool-btn danger drink-tool-btn" @click=${delayedAction(() => this._handleDrinkReset(d))}>
                  <ha-ripple></ha-ripple>
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
        const hasDoseTools = !!(e.skipButton || e.undoButton);
        const hasGenTools = !!(e.resetButton || e.averagesResetButton);
        if (!hasAdhTools && !hasDoseTools && !hasGenTools) {
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
                class="tool-btn"
                @click=${delayedAction(() => this._handleAdherenceReset(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:percent-circle-outline"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_adherence')}</span>
              </button>
            ` : A}
            ${e.adherenceCoverButton ? b `
              <button
                class="tool-btn"
                @click=${delayedAction(() => this._handleAdherenceCover(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:check-underline-circle"></ha-icon>
                <span>${localize(this._lang, 'tools.mark_adherence_taken')}</span>
              </button>
            ` : A}
          </div>
        ` : A}

        ${hasDoseTools ? b `
          <div class="tools-section-header tools-section-header--spaced">${localize(this._lang, 'tools.dose_header')}</div>
          <div class="tools-grid">
            ${e.skipButton ? b `
              <button
                class="tool-btn"
                @click=${delayedAction(() => this._handleSkipDose(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:skip-next"></ha-icon>
                <span>${localize(this._lang, 'tools.skip_dose')}</span>
              </button>
            ` : A}
            ${e.undoButton ? b `
              <button
                class="tool-btn"
                @click=${delayedAction(() => this._handleUndoDoseConfirm(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:undo"></ha-icon>
                <span>${localize(this._lang, 'tools.undo_dose')}</span>
              </button>
            ` : A}
          </div>
        ` : A}

        ${hasGenTools ? b `
          <div class="tools-section-header tools-section-header--spaced">${localize(this._lang, 'tools.general_header')}</div>
          <div class="tools-grid">
            ${e.averagesResetButton ? b `
              <button
                class="tool-btn"
                @click=${delayedAction(() => this._handleResetAverages(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:chart-bell-curve-remove"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_averages')}</span>
              </button>
            ` : A}
            ${e.resetButton ? b `
              <button
                class="tool-btn danger"
                @click=${delayedAction(() => this._handleResetHistory(e))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:history"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_history')}</span>
              </button>
            ` : A}
          </div>
        ` : A}
      </div>
    `;
    }
};
AxDoseToolsPanel.styles = i$5 `
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
  `;
__decorate([
    n$1({ attribute: false })
], AxDoseToolsPanel.prototype, "controller", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseToolsPanel.prototype, "entities", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseToolsPanel.prototype, "hass", void 0);
AxDoseToolsPanel = __decorate([
    t$1('ax-dose-tools-panel')
], AxDoseToolsPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Tracking Pane (Pane 5)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane5.
// Renders one ha-slider per tracking metric with a Set/Not-set badge and value.
// The slider @change calls controller.handleTrackingChange, which owns the
// _pendingTracking race-guard + the override-dialog state on the container —
// so this panel holds only the template + CSS; no state machine lives here.
let AxDoseTrackingPanel = class AxDoseTrackingPanel extends i$2 {
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
AxDoseTrackingPanel.styles = i$5 `
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
  `;
__decorate([
    n$1({ attribute: false })
], AxDoseTrackingPanel.prototype, "controller", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseTrackingPanel.prototype, "entities", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseTrackingPanel.prototype, "hass", void 0);
AxDoseTrackingPanel = __decorate([
    t$1('ax-dose-tracking-panel')
], AxDoseTrackingPanel);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=e(class extends i$1{constructor(){super(...arguments),this.key=A;}render(r,t){return this.key=r,t}update(r,[t,e]){return t!==this.key&&(p(r),this.key=t),e}});

// ──────────────────────────────────────────────
// AX Dose Logger Card — Daily Pane (Pane 1)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane1.
// The highest event-surface pane: take-pill button (press / override
// dialog), safe-to-take box (tap/hold/double-tap actions), pills-left
// stat-pill (refill dialog), custom chips. The medicine title is rendered
// by the card container (ax-dose-logger-card.ts) as a unified .card-title-row
// shown on every pane — no title markup here. Every action calls back into
// the controller so the container owns the dialog state.
let AxDoseDailyPanel = class AxDoseDailyPanel extends i$2 {
    constructor() {
        super(...arguments);
        // 30s tick from the container — a reactive trigger so the panel re-renders
        // to refresh "Xh XXm" countdowns even when hass/entities/controller refs are
        // unchanged. The panel doesn't read this value; it just needs to change.
        this.tick = 0;
        // ── Button State Matrix (Prosumer UI) ──
        // Resolved ButtonState from the container's _computeDailyButtonState(). The
        // panel maps it to a CSS class string using the per-state style option +
        // icon style option from the card config. 'idle' renders no state class
        // default). See plans/button-state-matrix-plan.md.
        this.buttonState = 'idle';
        // Transient ACK flag from the container (mirrors buttonState==='ack' but
        // kept separate so the panel can drive the ack-duration CSS var even when
        // the state resolver already collapsed to 'ack').
        this.ackActive = false;
        // Rapid successive-click count from the container. 0 means no ACK active,
        // 1 means first press (no suffix rendered), 2 and above means "Logged {n}x".
        // Drives the ack-text suffix on top/inline layouts and the Nx badge on the
        // big layout. See plans/rapid-click-count-plan.md.
        this.ackCount = 0;
    }
    get _lang() {
        return this.controller.lang;
    }
    /**
     * Build the CSS class string for the Take Pill button from the resolved
     * ButtonState + the per-state style option + pulse toggle in the card
     * config. Maps the 4 style options (full / border / none / ring) + 4
     * icon style options (none / color / color_pulse / pulse) onto
     * state-color class pairs. The 'auto' sentinel resolves to the per-state
     * default at runtime. The 'idle' state renders only the base button (no
     * color override). Returns the full class list including the base
     * 'take-pill-btn'.
     */
    _takeButtonClasses() {
        const state = this.buttonState;
        const cfg = this.controller.config;
        // Per-state defaults (used when value is 'auto' or undefined).
        const STATE_DEFAULTS = {
            lockout: { style: 'full', iconStyle: 'none' },
            execution: { style: 'none', iconStyle: 'color' },
            latency: { style: 'border', iconStyle: 'color_pulse' },
        };
        // State → color token + configured style + icon_style (auto resolves).
        let style = 'none';
        let iconStyle = 'none';
        if (state === 'lockout' || state === 'limit_24h') {
            // limit_24h inherits ALL lockout style config (same red color, same
            // CSS classes, same take_button_lockout_style/_icon_style fields).
            // Only the label + override dialog text differ.
            const d = STATE_DEFAULTS.lockout;
            style = cfg?.take_button_lockout_style ?? d.style;
            if (style === 'auto')
                style = d.style;
            iconStyle = cfg?.take_button_lockout_icon_style ?? d.iconStyle;
            if (iconStyle === 'auto')
                iconStyle = d.iconStyle;
        }
        else if (state === 'execution') {
            const d = STATE_DEFAULTS.execution;
            style = cfg?.take_button_execution_style ?? d.style;
            if (style === 'auto')
                style = d.style;
            iconStyle = cfg?.take_button_execution_icon_style ?? d.iconStyle;
            if (iconStyle === 'auto')
                iconStyle = d.iconStyle;
        }
        else if (state === 'latency') {
            const d = STATE_DEFAULTS.latency;
            style = cfg?.take_button_latency_style ?? d.style;
            if (style === 'auto')
                style = d.style;
            iconStyle = cfg?.take_button_latency_icon_style ?? d.iconStyle;
            if (iconStyle === 'auto')
                iconStyle = d.iconStyle;
        }
        else {
            // idle — no color, no style option (theme default).
            return this.ackActive ? 'take-pill-btn ack-flash' : 'take-pill-btn';
        }
        // State → color name.
        const color = (state === 'lockout' || state === 'limit_24h') ? 'red'
            : state === 'execution' ? 'blue'
                : state === 'latency' ? 'amber'
                    : 'green'; // ack
        // Style option → class fragments (5 options; auto already resolved).
        const classes = ['take-pill-btn', `state-${state}`];
        if (style === 'full')
            classes.push(`full-${color}`);
        if (style === 'border')
            classes.push(`border-${color}`);
        if (style === 'ring')
            classes.push(`ring-${color}`);
        if (style === 'glow')
            classes.push(`style-none`); // glow renders on the wrapper backdrop, not the button face
        if (style === 'none')
            classes.push(`style-none`);
        // Icon Style option → class fragments (2x2 matrix; auto resolved).
        if (iconStyle === 'color' || iconStyle === 'color_pulse')
            classes.push(`icon-${color}`);
        if (iconStyle === 'color_pulse' || iconStyle === 'pulse')
            classes.push('pulse');
        // ACK overlay is a pure flash layered on top of the true state — it does
        //    not recolor the button, so the real state stays correct underneath.
        if (this.ackActive)
            classes.push('ack-flash');
        return classes.join(' ');
    }
    /** Resolve the rotating ring animation duration (CSS string) from the
     *  per-button ring_speed config. 'medium' (4s) is the default. Shared by
     *  the ring sweep and the ambilight glow breathing animation. See plans/
     *  ambilight-glow-style-plan.md. */
    _ringDuration() {
        const speed = this.controller.config?.take_button_ring_speed ?? 'medium';
        return speed === 'slow' ? '6s' : speed === 'medium' ? '4s' : '2.2s';
    }
    /** Resolve the wrapper class for the ambilight glow backdrop. Returns ''
     *  when the resolved style is not 'glow' (backdrop hidden, no GPU layer).
     *  The glow-{color} class goes on the WRAPPER (not the button) because the
     *  button has overflow:hidden which would clip the bleeding backdrop. See
     *  plans/architecture-rollback-z-axis-stacking-plan.md. */
    _takeGlowWrapClass() {
        const state = this.buttonState;
        const cfg = this.controller.config;
        // Re-resolve the style using the same defaults as _takeButtonClasses.
        let style = 'none';
        if (state === 'lockout' || state === 'limit_24h') {
            style = cfg?.take_button_lockout_style ?? 'full';
            if (style === 'auto')
                style = 'full';
        }
        else if (state === 'execution') {
            style = cfg?.take_button_execution_style ?? 'none';
            if (style === 'auto')
                style = 'none';
        }
        else if (state === 'latency') {
            style = cfg?.take_button_latency_style ?? 'border';
            if (style === 'auto')
                style = 'border';
        }
        else {
            return ''; // idle — no glow
        }
        if (style !== 'glow')
            return '';
        const color = (state === 'lockout' || state === 'limit_24h') ? 'red'
            : state === 'execution' ? 'blue'
                : state === 'latency' ? 'amber' : 'green';
        return `glow-${color}`;
    }
    /** Resolve the ACK (Logged) flash layout from the per-button ack_layout
     *  config. 'top' is the default and mirrors the normal button layout. */
    _ackLayout() {
        return this.controller.config?.take_button_ack_layout ?? 'top';
    }
    /** Resolve the ACK (Logged) flash label text, appending the rapid-click
     *  count suffix ("Logged 2x", "Logged 3x" …) when the count is 2 or more.
     *  The first press (count 1) shows the bare "Logged" with no suffix so no
     *  "1x" is rendered. See plans/rapid-click-count-plan.md. */
    _ackLabelText() {
        const base = localize(this._lang, 'button.ack_text'); // "Logged"
        return this.ackCount >= 2 ? `${base} ${this.ackCount}x` : base;
    }
    render() {
        const c = this.controller;
        const e = this.entities;
        // safeState powers the Safe to Take box display value below. The lockout
        // detection (safeCount <= 0) now lives in the container's
        // _computeDailyButtonState so this panel stays presentational; the
        // resolved buttonState prop drives the Take Pill button styling.
        const safeState = c.getState(e.pillsSafeToTake);
        const timeSince = c.computeTimeSinceLastDose(e);
        const nextDose = c.computeNextDose(e);
        const overTime = c.computeOverTime(e);
        const chipEntities = c.getChipEntities();
        // Display entity for the Pills Left box. Priority:
        //   1. pills_left_show_days_left === true → backend days_left sensor
        //   2. pills_left_entity configured (≠ default sensor) → user's entity
        //   3. default → pills_left number entity
        // (controller.getPillsLeftBoxEntity resolves this; mirrored on the Safe to
        // Take box pattern. The days-left toggle wins over an arbitrary entity
        // swap so the two overrides are mutually unambiguous.)
        const pillsLeftShowDays = c.config?.pills_left_show_days_left === true;
        const pillsLeftDisplayEntity = c.getPillsLeftBoxEntity(e);
        const pillsLeftDisplayState = c.getState(pillsLeftDisplayEntity);
        const pillsLeftUnknown = pillsLeftDisplayState === 'unknown' || pillsLeftDisplayState === 'unavailable' || pillsLeftDisplayState === undefined;
        const pillsLeftIsSwapped = !!(c.config?.pills_left_entity && c.config.pills_left_entity !== e.pillsLeft && !pillsLeftShowDays);
        // Action config for the Pills Left box. When the user configured custom
        // tap/hold/double-tap actions, handleAction fires them. When no tap_action
        // is configured, the tap falls back to the Refill dialog (the card-internal
        // default for ALL display modes — "Refill dialog" can't be expressed in the
        // ui_action dropdown, so it stays the built-in default that a custom action
        // overrides), then to more-info on the display entity. hasHold/hasDblClick
        // gate the action handler so a plain click doesn't trigger them.
        const pillsLeftActionConfig = {
            entity: pillsLeftDisplayEntity,
            tap_action: c.config?.pills_left_tap_action,
            hold_action: c.config?.pills_left_hold_action,
            double_tap_action: c.config?.pills_left_double_tap_action,
        };
        const plHasCustomTap = !!c.config?.pills_left_tap_action;
        const plHasHold = !!c.config?.pills_left_hold_action;
        const plHasDblClick = !!c.config?.pills_left_double_tap_action;
        const pillsLeftClickable = plHasCustomTap || plHasHold || plHasDblClick || !!pillsLeftDisplayEntity || !!e.addRefill;
        // Tap fallback: Refill dialog when an add-refill entity exists (retain the
        // existing refill-by-tap UX across all display modes), else more-info on the
        // display entity.
        const pillsLeftTapFallback = () => {
            if (e.addRefill) {
                c.showRefillDialog();
            }
            else if (pillsLeftDisplayEntity) {
                c.openMoreInfo(pillsLeftDisplayEntity);
            }
        };
        // Default label/icon switch to the days-left variants when the toggle is on.
        const pillsLeftDefaultLabel = pillsLeftShowDays
            ? localize(this._lang, e.daysLeftEst ? 'stats.days_left_est' : 'stats.days_left')
            : localize(this._lang, 'daily.pills_left');
        const pillsLeftDefaultIcon = pillsLeftShowDays ? 'mdi:calendar-month' : 'mdi:pill';
        // Display entity for the top box (Safe to Take / Amount in Body). May
        // differ from the real pillsSafeToTake sensor (toggle on → amountInBody).
        const topShowAmountInBody = c.config?.safe_to_take_show_amount_in_body === true;
        const displayEntity = c.getSafeBoxEntity(e);
        const displayState = c.getState(displayEntity);
        const displayIsUnknown = displayState === 'unknown' || displayState === 'unavailable' || displayState === undefined;
        const isSwapped = !!(c.config?.safe_to_take_entity && c.config.safe_to_take_entity !== e.pillsSafeToTake);
        // Default label/icon switch to the Amount in Body variants when the
        // toggle is on (mirrors the pillsLeftDefaultLabel/Icon pattern below).
        const topDefaultLabel = topShowAmountInBody
            ? localize(this._lang, 'stats.amount_in_body')
            : localize(this._lang, 'daily.safe_to_take');
        const topDefaultIcon = topShowAmountInBody ? 'mdi:chart-bell-curve' : 'mdi:shield-check';
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
        <div class="daily-main">
          <div class="take-pill-wrap${this._takeGlowWrapClass() ? ' ' + this._takeGlowWrapClass() : ''}"
               style=${`--ring-duration: ${this._ringDuration()}`}
          >
            <div class="glow-backdrop"></div>
            <button
              class=${this._takeButtonClasses()}
              style=${this.ackActive ? `--ack-duration: ${this.controller.config?.take_button_ack_duration_ms ?? 3000}ms` : ''}
              aria-label=${this.buttonState === 'lockout'
            ? localize(this._lang, 'aria.take_pill_limit')
            : this.buttonState === 'limit_24h'
                ? localize(this._lang, 'aria.take_pill_24h_limit')
                : (c.config?.take_pill_label || localize(this._lang, 'aria.take_pill_safe'))}
              @click=${delayedAction(() => c.handleTakePill(e))}
            >
              <div class="ring-track"></div>
              <ha-ripple></ha-ripple>
            <ha-icon icon="${(this.buttonState === 'lockout' || this.buttonState === 'limit_24h') ? 'mdi:alert' : (c.config?.take_pill_icon || 'mdi:pill')}"></ha-icon>
            <span class="take-label">${this.buttonState === 'lockout'
            ? localize(this._lang, 'daily.limit_reached')
            : this.buttonState === 'limit_24h'
                ? localize(this._lang, 'daily.24h_limit_reached')
                : (c.config?.take_pill_label || localize(this._lang, 'daily.take_pill'))}</span>
            <span class="take-sub"><span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span>${overTime
            ? b ` \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.overdue')}: ${overTime}</span>`
            : (nextDose !== 'Unavailable' && nextDose !== 'now'
                ? b ` \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.next')}: ${nextDose}</span>`
                : A)}</span>
            ${this.ackActive ? i(this.ackCount, b `
              <div class="ack-flash ack-${this._ackLayout()}${this.ackCount >= 2 ? ' ack-repeat' : ''}">
                <ha-icon icon="mdi:check-bold" class="ack-icon"></ha-icon>
                ${this._ackLayout() !== 'big'
            ? b `<span class="ack-text">${this._ackLabelText()}</span>`
            : (this.ackCount >= 2
                ? b `<span class="ack-count-badge">${this.ackCount}x</span>`
                : A)}
              </div>
            `) : A}
            </button>
          </div>

          <div class="stats-column">
            <div class="stat-pill ${safeBoxClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${safeBoxClickable ? '0' : A}
                 aria-label=${c.config?.safe_to_take_label || topDefaultLabel}
                 @click=${safeBoxClickable ? delayedAction((ev) => c.handleSafeBoxAction(ev, 'tap', safeBoxActionConfig, displayEntity)) : null}
                 @keydown=${safeBoxClickable ? (ev) => c.onKeyActivate(ev, () => c.handleSafeBoxAction(null, 'tap', safeBoxActionConfig, displayEntity)) : null}
                 @contextmenu=${hasHold ? (ev) => { ev.preventDefault(); c.handleSafeBoxAction(null, 'hold', safeBoxActionConfig, displayEntity); } : null}
                 @dblclick=${hasDblClick ? () => c.handleSafeBoxAction(null, 'double_tap', safeBoxActionConfig, displayEntity) : null}>
              ${safeBoxClickable ? b `<ha-ripple></ha-ripple>` : A}
               <ha-icon icon="${c.config?.safe_to_take_icon || topDefaultIcon}"></ha-icon>
              <span class="stat-label">${c.config?.safe_to_take_label || topDefaultLabel}</span>
              <span class="stat-value">${displayIsUnknown
            ? localize(this._lang, 'daily.na')
            : (topShowAmountInBody && !isSwapped
                ? (() => {
                    // Toggle ON default → Amount in Body value formatted
                    // Math.round(num) + strength unit, mirroring the Drinks
                    // panel In Body box (drinks-panel.ts:81).
                    const aibNum = parseFloat(displayState);
                    const unit = c.getStrengthUnit(e);
                    return isNaN(aibNum) ? displayState : `${Math.round(aibNum)}${unit ? ' ' + unit : ''}`;
                })()
                : (isSwapped
                    ? (displayState
                        ? (isNaN(parseFloat(displayState))
                            ? displayState.charAt(0).toUpperCase() + displayState.slice(1)
                            : c.formatInteger(displayState) + (c.getAttr(displayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(displayEntity, 'unit_of_measurement') : ''))
                        : '')
                    : c.formatInteger(safeState)))}</span>
            </div>
            <div class="stat-pill ${pillsLeftClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${pillsLeftClickable ? '0' : A}
                 aria-label=${c.config?.pills_left_label || pillsLeftDefaultLabel}
                 @click=${pillsLeftClickable ? delayedAction((ev) => c.handlePillsLeftBoxAction(ev, 'tap', pillsLeftActionConfig, pillsLeftDisplayEntity, pillsLeftTapFallback)) : null}
                 @keydown=${pillsLeftClickable ? (ev) => c.onKeyActivate(ev, () => c.handlePillsLeftBoxAction(null, 'tap', pillsLeftActionConfig, pillsLeftDisplayEntity, pillsLeftTapFallback)) : null}
                 @contextmenu=${plHasHold ? (ev) => { ev.preventDefault(); c.handlePillsLeftBoxAction(null, 'hold', pillsLeftActionConfig, pillsLeftDisplayEntity); } : null}
                 @dblclick=${plHasDblClick ? () => c.handlePillsLeftBoxAction(null, 'double_tap', pillsLeftActionConfig, pillsLeftDisplayEntity) : null}>
              ${pillsLeftClickable ? b `<ha-ripple></ha-ripple>` : A}
               <ha-icon icon="${c.config?.pills_left_icon || pillsLeftDefaultIcon}"></ha-icon>
              <span class="stat-label">${c.config?.pills_left_label || pillsLeftDefaultLabel}</span>
              <span class="stat-value">${pillsLeftUnknown
            ? localize(this._lang, 'daily.na')
            : (pillsLeftShowDays
                ? c.formatInteger(pillsLeftDisplayState)
                : (pillsLeftIsSwapped
                    ? (pillsLeftDisplayState
                        ? (isNaN(parseFloat(pillsLeftDisplayState))
                            ? pillsLeftDisplayState.charAt(0).toUpperCase() + pillsLeftDisplayState.slice(1)
                            : c.formatInteger(pillsLeftDisplayState) + (c.getAttr(pillsLeftDisplayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(pillsLeftDisplayEntity, 'unit_of_measurement') : ''))
                        : '')
                    : (pillsLeftDisplayState === 'unavailable' ? '-' : c.formatInteger(pillsLeftDisplayState))))}</span>
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
                const chipUnit = c.getAttr(chip.entityId, 'unit_of_measurement');
                const chipDeviceClass = c.getAttr(chip.entityId, 'device_class');
                // Icon: configured override > entity's own icon attribute > neutral default.
                // Only rendered when the per-chip show_icon toggle is on (default off).
                const chipIcon = chip.icon
                    || c.hass?.states[chip.entityId]?.attributes?.icon
                    || 'mdi:chip';
                // Device-class-aware value: timestamp sensors render HH:MM (24-hour)
                // so a TIMESTAMP-class entity surfaced as a chip does not show its
                // year (the formatInteger parseFloat bug — parseFloat('2026-...') → 2026).
                // Mirrors the Disruption box low_timestamp mode + the Stats panel row.
                let chipValue;
                if (chipDeviceClass === 'timestamp') {
                    const dt = new Date(chipState);
                    chipValue = isNaN(dt.getTime())
                        ? localize(this._lang, 'daily.na')
                        : dt.toLocaleTimeString(this._lang, { hour: '2-digit', minute: '2-digit', hour12: false });
                }
                else {
                    chipValue = c.formatInteger(chipState) + (chipUnit ? ' ' + chipUnit : '');
                }
                const chipActionCfg = {
                    entity: chip.entityId,
                    tap_action: chip.tapAction,
                    hold_action: chip.holdAction,
                    double_tap_action: chip.doubleTapAction,
                };
                const hasHold = !!chip.holdAction;
                const hasDblClick = !!chip.doubleTapAction;
                return b `
                    <div class="chip clickable${chip.showIcon ? ' with-icon' : ''}"
                      role="button"
                      tabindex="0"
                      aria-label=${chipName}
                      @click=${delayedAction((ev) => c.handleChipAction(ev, 'tap', chipActionCfg, chip.entityId))}
                      @keydown=${(ev) => c.onKeyActivate(ev, () => c.handleChipAction(null, 'tap', chipActionCfg, chip.entityId))}
                      @contextmenu=${hasHold ? (ev) => { ev.preventDefault(); c.handleChipAction(null, 'hold', chipActionCfg, chip.entityId); } : null}
                      @dblclick=${hasDblClick ? () => c.handleChipAction(null, 'double_tap', chipActionCfg, chip.entityId) : null}>
                      <ha-ripple></ha-ripple>
                       ${chip.showIcon
                    ? b `<ha-icon icon=${chipIcon} class="chip-icon"></ha-icon>`
                    : A}
                      <span class="chip-name">${chipName}</span>
                      <span class="chip-value">${chipValue}</span>
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
AxDoseDailyPanel.styles = i$5 `
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
  `;
__decorate([
    n$1({ attribute: false })
], AxDoseDailyPanel.prototype, "controller", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDailyPanel.prototype, "entities", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDailyPanel.prototype, "hass", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDailyPanel.prototype, "tick", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDailyPanel.prototype, "buttonState", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDailyPanel.prototype, "ackActive", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDailyPanel.prototype, "ackCount", void 0);
AxDoseDailyPanel = __decorate([
    t$1('ax-dose-daily-panel')
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
let AxDoseGraphsPanel = AxDoseGraphsPanel_1 = class AxDoseGraphsPanel extends i$2 {
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
        // Delegates to the shared helper (same mapping as the container's
        // _getTimeframeHours) so the timeframe→hours logic lives in one place.
        return getTimeframeHours(this.activeTimeframe);
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
        // Current Amount-in-Body value, appended to the slide title as plain text
        // (e.g. "Amount in Body: 99 mg") — mirrors the Daily panel's stat-pill
        // label+value format. Renders ONLY on the Amount-in-Body (line) slide,
        // gated on a parseable current value. The matching SVG dashed line inside
        // the chart is computed separately in _renderLineGraph and is unaffected.
        const amountInBodyState = activeSlide === 'line' ? c.getState(e.amountInBody) : '';
        const currentAmountNum = parseFloat(amountInBodyState);
        const hasCurrent = activeSlide === 'line'
            && amountInBodyState
            && amountInBodyState !== 'unavailable'
            && !isNaN(currentAmountNum);
        const currentUnit = hasCurrent ? c.getStrengthUnit(e) : '';
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
            <span class="nav-title">${slideTitle}${hasCurrent
            ? `: ${Math.round(currentAmountNum)} ${currentUnit}`
            : ''}</span>
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
            <span class="nav-title">${slideTitle}${hasCurrent
            ? `: ${Math.round(currentAmountNum)} ${currentUnit}`
            : ''}</span>
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
        // h bumped 180 -> 188 so chartH (h - padTop - padBottom = 188-36-8 = 144)
        // matches the line/effectiveness graphs, AND padTop=36 clears the top-left
        // timeframe chips from the top Y-axis label/gridline.
        const h = 188;
        const padLeft = 32;
        const padRight = 8;
        const padTop = 36;
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
        <svg viewBox="0 0 ${w$1} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/188">
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
        // h bumped 200 -> 208 and padTop 28 -> 36 so chartH (h - padTop - padBottom
        // = 208-36-28 = 144) still matches the bar/effectiveness graphs' 144, AND
        // padTop=36 clears the top-left timeframe chips from the top Y-axis
        // label/gridline.
        const h = 208;
        const padLeft = 36;
        const padRight = 8;
        const padTop = 36;
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
        // Compute Y position for the current-amount dashed line. The matching
        // "Current" value label is rendered as an HTML chip in the top-right of
        // .line-graph-wrapper (see the return template) instead of an SVG <text>
        // here, so it can't overlap the polyline and matches the timeframe chips'
        // styling on the opposite side.
        const currentAmountNum = parseFloat(amountInBody);
        const hasCurrent = amountInBody && amountInBody !== 'unavailable' && !isNaN(currentAmountNum);
        const currentY = hasCurrent
            ? Math.max(padTop, Math.min(padTop + chartH, padTop + chartH * (1 - currentAmountNum / maxAmount)))
            : padTop;
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

          <!-- Current amount dashed line (label rendered as an HTML chip in
               the top-right of .line-graph-wrapper so it can't overlap the
               polyline) -->
          ${hasCurrent ? w `
            <line x1="${padLeft}" y1="${currentY}" x2="${w$1 - padRight}" y2="${currentY}"
                  stroke="var(--primary-color)" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"/>
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
        // h bumped 196 -> 204 and padTop 28 -> 36 so chartH (h - padTop - padBottom
        // = 204-36-24 = 144) still matches the bar/line graphs' 144, AND padTop=36
        // clears the top-left timeframe chips from the top Y-axis label/gridline.
        const h = 204;
        const padLeft = 28;
        const padRight = 8;
        // padTop matches the bar/line graphs (36) so the absolutely-positioned
        // timeframe chips (top: 4px, now on the left) don't overlap the chart area.
        const padTop = 36;
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
AxDoseGraphsPanel.styles = i$5 `
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
  `;
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "controller", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "entities", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "hass", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "amountHistory", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "doseHistory", void 0);
__decorate([
    n$1({ type: Number })
], AxDoseGraphsPanel.prototype, "activeGraph", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "activeTimeframe", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "activeBarTimeframe", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "activeEffectivenessTimeframe", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "activeEffectivenessView", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "effectivenessHistory", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseGraphsPanel.prototype, "effectivenessVisible", void 0);
AxDoseGraphsPanel = AxDoseGraphsPanel_1 = __decorate([
    t$1('ax-dose-graphs-panel')
], AxDoseGraphsPanel);

// ──────────────────────────────────────────────
// AX Dose Logger Card — Drinks Pane (Master Tracker, Pane "drinks")
// ──────────────────────────────────────────────
// Shown when the selected device is a Master Tracker (Caffeine Tracker /
// Alcohol Tracker). Layout mirrors the Daily pane exactly:
//   - Title row is rendered by the card container (ax-dose-logger-card.ts)
//     as a unified Substance - Profile row shown on every pane.
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
let AxDoseDrinksPanel = class AxDoseDrinksPanel extends i$2 {
    constructor() {
        super(...arguments);
        // 30s tick from the container — a reactive trigger so the panel re-renders
        // to refresh "Xh XXm" countdowns even when hass/entities/controller refs are
        // unchanged. The panel doesn't read this value; it just needs to change.
        this.tick = 0;
        // ── Button State Matrix (Prosumer UI) — Drinks ──
        // Drinks are PRN/as-needed with no schedule, so only lockout + ack states
        // are possible. Resolved by the container's _computeDrinksButtonState.
        this.buttonState = 'idle';
        this.ackActive = false;
        // Rapid successive-click count from the container. 0 means no ACK active,
        // 1 means first press (no suffix rendered), 2 and above means "Logged {n}x".
        // Drives the ack-text suffix on top/inline layouts and the Nx badge on the
        // big layout. Mirrors the Daily panel. See plans/rapid-click-count-plan.md.
        this.ackCount = 0;
    }
    get _lang() {
        return this.controller.lang;
    }
    /**
     * Build the CSS class string for the Log Drink button from the resolved
     * ButtonState + the per-state style + icon_style options. Mirrors the
     * Daily panel's _takeButtonClasses but only handles lockout + ack (the two
     * states possible for PRN drinks). 'auto' resolves to the per-state default
     * at runtime. 'idle' renders only the base button.
     */
    _logDrinkButtonClasses() {
        const state = this.buttonState;
        const cfg = this.controller.config;
        // Per-state default (used when value is 'auto' or undefined).
        const STATE_DEFAULTS = {
            lockout: { style: 'full', iconStyle: 'none' },
        };
        let style = 'none';
        let iconStyle = 'none';
        if (state === 'lockout') {
            const d = STATE_DEFAULTS.lockout;
            style = cfg?.drink_button_lockout_style ?? d.style;
            if (style === 'auto')
                style = d.style;
            iconStyle = cfg?.drink_button_lockout_icon_style ?? d.iconStyle;
            if (iconStyle === 'auto')
                iconStyle = d.iconStyle;
        }
        else {
            // idle — no color, no style option (theme default).
            return this.ackActive ? 'log-drink-btn ack-flash' : 'log-drink-btn';
        }
        const color = state === 'lockout' ? 'red' : 'green';
        const classes = ['log-drink-btn', `state-${state}`];
        if (style === 'full')
            classes.push(`full-${color}`);
        if (style === 'border')
            classes.push(`border-${color}`);
        if (style === 'ring')
            classes.push(`ring-${color}`);
        if (style === 'glow')
            classes.push(`style-none`); // glow renders on the wrapper backdrop, not the button face
        if (style === 'none')
            classes.push('style-none');
        if (iconStyle === 'color' || iconStyle === 'color_pulse')
            classes.push(`icon-${color}`);
        if (iconStyle === 'color_pulse' || iconStyle === 'pulse')
            classes.push('pulse');
        // ACK overlay is a pure flash layered on top of the true state — it does
        //    not recolor the button, so the real state stays correct underneath.
        if (this.ackActive)
            classes.push('ack-flash');
        return classes.join(' ');
    }
    /** Resolve the rotating ring animation duration (CSS string) from the
     *  per-button ring_speed config. 'medium' (4s) is the default. Shared by
     *  the ring sweep and the ambilight glow breathing. Mirrors daily-panel. */
    _ringDuration() {
        const speed = this.controller.config?.drink_button_ring_speed ?? 'medium';
        return speed === 'slow' ? '6s' : speed === 'medium' ? '4s' : '2.2s';
    }
    /** Resolve the wrapper class for the ambilight glow backdrop. Returns ''
     *  when the resolved style is not 'glow' (backdrop hidden, no GPU layer).
     *  Mirrors daily-panel._takeGlowWrapClass. See plans/
     *  architecture-rollback-z-axis-stacking-plan.md. */
    _logDrinkGlowWrapClass() {
        const state = this.buttonState;
        const cfg = this.controller.config;
        let style = 'none';
        if (state === 'lockout') {
            style = cfg?.drink_button_lockout_style ?? 'full';
            if (style === 'auto')
                style = 'full';
        }
        else {
            return ''; // idle — no glow
        }
        if (style !== 'glow')
            return '';
        const color = state === 'lockout' ? 'red' : 'green';
        return `glow-${color}`;
    }
    /** Resolve the ACK (Logged) flash layout from the per-button ack_layout
     *  config. 'top' is the default and mirrors the normal button layout. */
    _ackLayout() {
        return this.controller.config?.drink_button_ack_layout ?? 'top';
    }
    /** Resolve the ACK (Logged) flash label text, appending the rapid-click
     *  count suffix ("Logged 2x", "Logged 3x" …) when the count is 2 or more.
     *  The first press (count 1) shows the bare "Logged" with no suffix so no
     *  "1x" is rendered. Mirrors the Daily panel's _ackLabelText. */
    _ackLabelText() {
        const base = localize(this._lang, 'button.ack_text'); // "Logged"
        return this.ackCount >= 2 ? `${base} ${this.ackCount}x` : base;
    }
    render() {
        const c = this.controller;
        const e = this.entities;
        const substance = e.substance;
        const cfg = c.config;
        // Log Drink button overrides — icon/label fall back to substance-aware
        // defaults when unset (mdi:coffee for caffeine, mdi:glass-mug-variant for
        // alcohol; "Log Drink" label). Mirrors the Daily panel's take_pill_icon /
        // take_pill_label overrides.
        const logDrinkIcon = cfg?.log_drink_icon
            || (substance === 'alcohol' ? 'mdi:glass-mug-variant' : 'mdi:coffee');
        const logDrinkLabel = cfg?.log_drink_label || localize(this._lang, 'drinks.log_drink');
        // "Last" counter — identical to Daily's take-sub. The resolver populates
        // entities.lastDose for drink masters from the dedicated
        // DrinkMasterLastDoseSensor (see ax-dose-logger-card.ts), so the controller
        // helper works here without any backend change. Drink masters have no
        // Next/Overdue concept (no schedule), so the sub-line is the single
        // "Last: …" segment, matching Daily's simplest branch.
        const timeSince = c.computeTimeSinceLastDose(e);
        // ── In Body box — full override parity with the Daily Safe to Take box ──
        // Display entity: configured in_body_entity wins; else the default
        // amountInBody sensor. Swapped numeric → formatInteger + unit attr;
        // swapped non-numeric → title-case. Default → Math.round + substance unit
        // (mg/g) rounded to 0 decimals for compactness (unchanged from prior).
        const inBodyDisplayEntity = c.getInBodyBoxEntity(e);
        const inBodyRaw = inBodyDisplayEntity ? c.getState(inBodyDisplayEntity) : '';
        const inBodyUnknown = !inBodyRaw || inBodyRaw === 'unknown' || inBodyRaw === 'unavailable';
        const inBodyIsSwapped = !!(cfg?.in_body_entity && cfg.in_body_entity !== e.amountInBody);
        const inBodyUnit = c.getStrengthUnit(e);
        const inBodyBodyNum = parseFloat(inBodyRaw);
        const inBodyValue = inBodyUnknown
            ? localize(this._lang, 'daily.na')
            : (inBodyIsSwapped
                ? (isNaN(inBodyBodyNum)
                    ? (inBodyRaw.charAt(0).toUpperCase() + inBodyRaw.slice(1))
                    : c.formatInteger(inBodyRaw) + (c.getAttr(inBodyDisplayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(inBodyDisplayEntity, 'unit_of_measurement') : ''))
                : `${isNaN(inBodyBodyNum) ? inBodyRaw : Math.round(inBodyBodyNum)} ${inBodyUnit}`);
        const inBodyActionConfig = {
            entity: inBodyDisplayEntity,
            tap_action: cfg?.in_body_tap_action,
            hold_action: cfg?.in_body_hold_action,
            double_tap_action: cfg?.in_body_double_tap_action,
        };
        const ibHasCustomTap = !!cfg?.in_body_tap_action;
        const ibHasHold = !!cfg?.in_body_hold_action;
        const ibHasDblClick = !!cfg?.in_body_double_tap_action;
        const inBodyClickable = ibHasCustomTap || ibHasHold || ibHasDblClick || !!inBodyDisplayEntity;
        // ── Disruption box — Time to Low 3-option mode select + entity swap ──
        // Mode priority (mirrors Pills Left Box days-left toggle): built-in mode
        // swap wins over disruption_entity. 'disruption' (default) → Sleep
        // Disruption state (None/Low/Moderate/High, title-cased); 'low_timestamp'
        // → Low - Timestamp sensor formatted HH:MM; 'low_hours_until' → Low -
        // Hours Until countdown sensor formatted X h. An entity swap follows the
        // same numeric/title-case convention as the In Body box.
        const disruptionMode = cfg?.disruption_mode || 'disruption';
        const disruptionDisplayEntity = c.getDisruptionBoxEntity(e);
        const disruptionRaw = disruptionDisplayEntity ? c.getState(disruptionDisplayEntity) : '';
        const disruptionUnknown = !disruptionRaw || disruptionRaw === 'unknown' || disruptionRaw === 'unavailable';
        const disruptionIsSwapped = !!(cfg?.disruption_entity && cfg.disruption_entity !== e.sleepDisruption
            && disruptionMode === 'disruption');
        // Display value per mode.
        let disruptionValue = localize(this._lang, 'daily.na');
        if (!disruptionUnknown) {
            if (disruptionIsSwapped) {
                const num = parseFloat(disruptionRaw);
                disruptionValue = isNaN(num)
                    ? (disruptionRaw.charAt(0).toUpperCase() + disruptionRaw.slice(1))
                    : c.formatInteger(disruptionRaw) + (c.getAttr(disruptionDisplayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(disruptionDisplayEntity, 'unit_of_measurement') : '');
            }
            else if (disruptionMode === 'low_timestamp') {
                // Low - Timestamp sensor state is a full ISO datetime; display HH:MM
                // (24-hour) matching the Stats panel format.
                const dt = new Date(disruptionRaw);
                disruptionValue = isNaN(dt.getTime())
                    ? localize(this._lang, 'daily.na')
                    : dt.toLocaleTimeString(this._lang, { hour: '2-digit', minute: '2-digit', hour12: false });
            }
            else if (disruptionMode === 'low_hours_until') {
                // Low - Hours Until is a DURATION (hours) numeric; display the raw
                // number only — the "Low - Hours Until" label already conveys the unit.
                const num = parseFloat(disruptionRaw);
                disruptionValue = isNaN(num) ? localize(this._lang, 'daily.na') : String(num);
            }
            else {
                // disruption (default) → title-cased state.
                disruptionValue = disruptionRaw.charAt(0).toUpperCase() + disruptionRaw.slice(1);
            }
        }
        // Default icon/label switch per mode.
        const disruptionDefaultIcon = disruptionMode === 'low_timestamp'
            ? 'mdi:clock-outline'
            : (disruptionMode === 'low_hours_until' ? 'mdi:timer-sand' : 'mdi:sleep');
        const disruptionDefaultLabel = disruptionMode === 'low_timestamp'
            ? localize(this._lang, 'stats.low_timestamp')
            : (disruptionMode === 'low_hours_until' ? localize(this._lang, 'stats.low_hours_until') : localize(this._lang, 'drinks.disruption'));
        const disruptionActionConfig = {
            entity: disruptionDisplayEntity,
            tap_action: cfg?.disruption_tap_action,
            hold_action: cfg?.disruption_hold_action,
            double_tap_action: cfg?.disruption_double_tap_action,
        };
        const dHasCustomTap = !!cfg?.disruption_tap_action;
        const dHasHold = !!cfg?.disruption_hold_action;
        const dHasDblClick = !!cfg?.disruption_double_tap_action;
        // Tap fallback: the Sleep Disruption popup opens for ALL three disruption
        // modes (disruption / low_timestamp / low_hours_until) as long as a
        // substance is resolved — the popup now shows all three values in its
        // summary, so it's useful regardless of which mode the box is in.  Falls
        // back to more-info on the display entity only when no substance is set.
        const disruptionTapFallback = () => {
            if (substance) {
                c.showSleepDisruptionDialog(substance);
            }
            else if (disruptionDisplayEntity) {
                c.openMoreInfo(disruptionDisplayEntity);
            }
        };
        const disruptionClickable = dHasCustomTap || dHasHold || dHasDblClick || !!disruptionDisplayEntity || !!substance;
        // ── Custom chips (Drinks panel) — parallel to the Daily panel chips ──
        const drinkChipEntities = c.getDrinkChipEntities();
        return b `
      <div class="pane pane-drinks">

        <div class="daily-main">
          <div class="log-drink-wrap${this._logDrinkGlowWrapClass() ? ' ' + this._logDrinkGlowWrapClass() : ''}"
               style=${`--ring-duration: ${this._ringDuration()}`}
          >
            <div class="glow-backdrop"></div>
            <button
              class=${this._logDrinkButtonClasses()}
              style=${this.ackActive ? `--ack-duration: ${this.controller.config?.drink_button_ack_duration_ms ?? 3000}ms` : ''}
              aria-label=${logDrinkLabel}
              ?disabled=${!substance}
              @click=${delayedAction(() => substance && c.showLogDrinkDialog(substance))}
            >
              <div class="ring-track"></div>
              <ha-ripple ?disabled=${!substance}></ha-ripple>
            <ha-icon icon="${logDrinkIcon}"></ha-icon>
            <span class="take-label">${logDrinkLabel}</span>
            <span class="take-sub"><span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span></span>
            ${this.ackActive ? i(this.ackCount, b `
              <div class="ack-flash ack-${this._ackLayout()}${this.ackCount >= 2 ? ' ack-repeat' : ''}">
                <ha-icon icon="mdi:check-bold" class="ack-icon"></ha-icon>
                ${this._ackLayout() !== 'big'
            ? b `<span class="ack-text">${this._ackLabelText()}</span>`
            : (this.ackCount >= 2
                ? b `<span class="ack-count-badge">${this.ackCount}x</span>`
                : A)}
              </div>
            `) : A}
            </button>
          </div>

          <div class="stats-column">
            <div class="stat-pill ${inBodyClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${inBodyClickable ? '0' : A}
                 aria-label=${cfg?.in_body_label || localize(this._lang, 'drinks.in_body')}
                 @click=${inBodyClickable ? delayedAction((ev) => c.handleInBodyBoxAction(ev, 'tap', inBodyActionConfig, inBodyDisplayEntity)) : null}
                 @keydown=${inBodyClickable ? (ev) => c.onKeyActivate(ev, () => c.handleInBodyBoxAction(null, 'tap', inBodyActionConfig, inBodyDisplayEntity)) : null}
                 @contextmenu=${ibHasHold ? (ev) => { ev.preventDefault(); c.handleInBodyBoxAction(null, 'hold', inBodyActionConfig, inBodyDisplayEntity); } : null}
                 @dblclick=${ibHasDblClick ? () => c.handleInBodyBoxAction(null, 'double_tap', inBodyActionConfig, inBodyDisplayEntity) : null}>
              ${inBodyClickable ? b `<ha-ripple></ha-ripple>` : A}
               <ha-icon icon="${cfg?.in_body_icon || 'mdi:chart-bell-curve'}"></ha-icon>
              <span class="stat-label">${cfg?.in_body_label || localize(this._lang, 'drinks.in_body')}</span>
              <span class="stat-value">${inBodyValue}</span>
            </div>
            <div class="stat-pill ${disruptionClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${disruptionClickable ? '0' : A}
                 aria-label=${cfg?.disruption_label || disruptionDefaultLabel}
                 @click=${disruptionClickable ? delayedAction((ev) => c.handleDisruptionBoxAction(ev, 'tap', disruptionActionConfig, disruptionDisplayEntity, disruptionTapFallback)) : null}
                 @keydown=${disruptionClickable ? (ev) => c.onKeyActivate(ev, () => c.handleDisruptionBoxAction(null, 'tap', disruptionActionConfig, disruptionDisplayEntity, disruptionTapFallback)) : null}
                 @contextmenu=${dHasHold ? (ev) => { ev.preventDefault(); c.handleDisruptionBoxAction(null, 'hold', disruptionActionConfig, disruptionDisplayEntity); } : null}
                 @dblclick=${dHasDblClick ? () => c.handleDisruptionBoxAction(null, 'double_tap', disruptionActionConfig, disruptionDisplayEntity) : null}>
              ${disruptionClickable ? b `<ha-ripple></ha-ripple>` : A}
               <ha-icon icon="${cfg?.disruption_icon || disruptionDefaultIcon}"></ha-icon>
              <span class="stat-label">${cfg?.disruption_label || disruptionDefaultLabel}</span>
              <span class="stat-value">${disruptionValue}</span>
            </div>
          </div>
        </div>

        ${drinkChipEntities.length > 0
            ? b `
              <div class="chips-row">
                ${drinkChipEntities.map((chip) => {
                const chipState = c.getState(chip.entityId);
                const chipName = chip.label
                    || c.hass?.states[chip.entityId]?.attributes?.friendly_name
                    || chip.entityId;
                const chipUnit = c.getAttr(chip.entityId, 'unit_of_measurement');
                const chipDeviceClass = c.getAttr(chip.entityId, 'device_class');
                // Icon: configured override > entity's own icon attribute > neutral default.
                // Only rendered when the per-chip show_icon toggle is on (default off).
                const chipIcon = chip.icon
                    || c.hass?.states[chip.entityId]?.attributes?.icon
                    || 'mdi:chip';
                // Device-class-aware value: timestamp sensors render HH:MM (24-hour)
                // so a TIMESTAMP-class entity surfaced as a chip does not show its
                // year (the formatInteger parseFloat bug — parseFloat('2026-...') → 2026).
                // Mirrors the Disruption box low_timestamp mode + the Stats panel row.
                let chipValue;
                if (chipDeviceClass === 'timestamp') {
                    const dt = new Date(chipState);
                    chipValue = isNaN(dt.getTime())
                        ? localize(this._lang, 'daily.na')
                        : dt.toLocaleTimeString(this._lang, { hour: '2-digit', minute: '2-digit', hour12: false });
                }
                else {
                    chipValue = c.formatInteger(chipState) + (chipUnit ? ' ' + chipUnit : '');
                }
                const chipActionCfg = {
                    entity: chip.entityId,
                    tap_action: chip.tapAction,
                    hold_action: chip.holdAction,
                    double_tap_action: chip.doubleTapAction,
                };
                const hasHold = !!chip.holdAction;
                const hasDblClick = !!chip.doubleTapAction;
                return b `
                    <div class="chip clickable${chip.showIcon ? ' with-icon' : ''}"
                      role="button"
                      tabindex="0"
                      aria-label=${chipName}
                      @click=${delayedAction((ev) => c.handleDrinkChipAction(ev, 'tap', chipActionCfg, chip.entityId))}
                      @keydown=${(ev) => c.onKeyActivate(ev, () => c.handleDrinkChipAction(null, 'tap', chipActionCfg, chip.entityId))}
                      @contextmenu=${hasHold ? (ev) => { ev.preventDefault(); c.handleDrinkChipAction(null, 'hold', chipActionCfg, chip.entityId); } : null}
                      @dblclick=${hasDblClick ? () => c.handleDrinkChipAction(null, 'double_tap', chipActionCfg, chip.entityId) : null}>
                      <ha-ripple></ha-ripple>
                       ${chip.showIcon
                    ? b `<ha-icon icon=${chipIcon} class="chip-icon"></ha-icon>`
                    : A}
                      <span class="chip-name">${chipName}</span>
                      <span class="chip-value">${chipValue}</span>
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
AxDoseDrinksPanel.styles = i$5 `
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
  `;
__decorate([
    n$1({ attribute: false })
], AxDoseDrinksPanel.prototype, "controller", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDrinksPanel.prototype, "entities", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDrinksPanel.prototype, "hass", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDrinksPanel.prototype, "tick", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDrinksPanel.prototype, "buttonState", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDrinksPanel.prototype, "ackActive", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseDrinksPanel.prototype, "ackCount", void 0);
AxDoseDrinksPanel = __decorate([
    t$1('ax-dose-drinks-panel')
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
let AxDoseInventoryPanel = class AxDoseInventoryPanel extends i$2 {
    constructor() {
        super(...arguments);
        // 30s tick from the container — a reactive trigger so the panel re-renders
        // to refresh time-relative content even when hass/entities/controller refs
        // are unchanged. The panel doesn't read this value; it just needs to change.
        this.tick = 0;
    }
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
        // Column 1 — refill box (2 lines: drink name + stock | Est. days left + value).
        const stockState = d.stockEntityId ? c.getState(d.stockEntityId) : '';
        // Unit of measurement from the drink's stock entity (e.g. "Bags", "Cups").
        // Composes the label as "Name Unit Left" (e.g. "Tea Bags Left"); falls
        // back to "Name Left" when the unit is absent.
        const stockUnit = d.stockEntityId ? c.getAttr(d.stockEntityId, 'unit_of_measurement') : '';
        const unitSegment = (typeof stockUnit === 'string' && stockUnit) ? ` ${stockUnit}` : '';
        const leftLabel = `${d.name}${unitSegment} ${localize(this._lang, 'inventory.left')}`;
        const stockNum = parseInt(stockState, 10);
        const stockDisplay = isNaN(stockNum) ? '-' : c.formatInteger(String(stockNum));
        const canRefill = !!d.addStockEntityId;
        // Per-drink "Est. days left" (DrinkDaysLeftSensor). Plain number, no unit
        // suffix (mirrors the master Stats panel's days-left value discipline but
        // without the "days" text — the label already conveys the unit).
        const daysLeftState = d.daysLeftEntityId ? c.getState(d.daysLeftEntityId) : '';
        let daysLeftDisplay = '-';
        if (daysLeftState && daysLeftState !== 'unknown' && daysLeftState !== 'unavailable' && daysLeftState !== 'None') {
            const num = parseFloat(daysLeftState);
            if (!isNaN(num))
                daysLeftDisplay = c.formatInteger(daysLeftState);
        }
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
          @click=${canRefill && d.addStockEntityId ? delayedAction(() => c.showRefillDialogFor(d.addStockEntityId, d.name)) : null}
          @keydown=${canRefill ? (ev) => c.onKeyActivate(ev, () => d.addStockEntityId && c.showRefillDialogFor(d.addStockEntityId, d.name)) : null}
        >
          ${canRefill ? b `<ha-ripple></ha-ripple>` : A}
          <div class="stat-pill-header">
            <ha-icon icon="${substanceIcon}"></ha-icon>
            <div class="stat-text">
              <div class="stat-line">
                <span class="stat-label">${leftLabel}</span>
                <span class="stat-value">${stockDisplay}</span>
              </div>
              <div class="stat-line">
                <span class="stat-sublabel">${localize(this._lang, 'stats.days_left_est')}</span>
                <span class="stat-subvalue">${daysLeftDisplay}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="avg-cell"
             role="button" tabindex="0"
             aria-label=${localize(this._lang, 'dialog.device_info.aria')}
             @click=${delayedAction(() => c.showDeviceInfoFor(d.deviceId, d.name))}
             @keydown=${(ev) => c.onKeyActivate(ev, () => c.showDeviceInfoFor(d.deviceId, d.name))}
        >
           <ha-ripple></ha-ripple>
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
AxDoseInventoryPanel.styles = i$5 `
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
  `;
__decorate([
    n$1({ attribute: false })
], AxDoseInventoryPanel.prototype, "controller", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseInventoryPanel.prototype, "entities", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseInventoryPanel.prototype, "hass", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseInventoryPanel.prototype, "tick", void 0);
AxDoseInventoryPanel = __decorate([
    t$1('ax-dose-inventory-panel')
], AxDoseInventoryPanel);

// ──────────────────────────────────────────────
// Button State Matrix — config migration (old *_style + *_pulse -> new
// *_style + *_icon_style, and *_glow_speed -> *_ring_speed). Runs in
// setConfig() so existing user configs are migrated transparently.
// Idempotent: a no-op once the new *_icon_style field is present.
// See plans/icon-style-dropdown-separation-plan.md §5-6.
// ──────────────────────────────────────────────
function _migrateOneButtonState(raw, prefix) {
    const oldStyle = raw[`${prefix}_style`];
    const oldPulse = raw[`${prefix}_pulse`];
    // Skip if the new field is already present (post-migration) or neither old
    // field exists.
    if (raw[`${prefix}_icon_style`] !== undefined)
        return;
    if (oldStyle === undefined && oldPulse === undefined)
        return;
    // Detect legacy icon-composite style names (icon, icon_border, icon_glow).
    const hasIcon = oldStyle === 'icon' || oldStyle === 'icon_border' || oldStyle === 'icon_glow';
    // Modern styles (full, border, none, ring, glow, auto) with no legacy pulse
    // field are already in the new format — skip migration. This is critical
    // for idempotency: HA's visual editor omits the *_icon_style field when it
    // is at its default ('auto'), so the earlier guard (line 55) does NOT fire
    // after a style-only change. Without this guard, migration would re-run
    // every time the user changes the style dropdown, injecting
    // icon_style='none' into the stored config and causing the editor to show
    // 'none' instead of 'auto'. By returning early for modern configs, we
    // ensure only truly legacy configs (those with *_pulse or icon-composite
    // style names) are migrated.
    if (oldPulse === undefined && !hasIcon)
        return;
    // Map old style -> new style (strip icon component from legacy names).
    // NOTE: 'glow' is NO LONGER remapped — it is a valid ButtonStateStyle as of
    // the Ambilight Glow feature. Legacy 'glow' (which meant the old rotating
    // ring) is left as 'glow' so those users get the new Ambilight Glow style
    // instead of a silent downgrade to 'ring'. The old ring is still available
    // by explicitly selecting 'ring' in the editor.
    const newStyle = oldStyle === 'icon' ? 'none'
        : oldStyle === 'icon_border' ? 'border'
            : oldStyle === 'icon_glow' ? 'ring'
                : oldStyle; // full, border, none, ring, glow unchanged
    // Map old pulse + icon presence -> new icon_style.
    let iconStyle;
    if (hasIcon) {
        iconStyle = oldPulse ? 'color_pulse' : 'color';
    }
    else {
        iconStyle = oldPulse ? 'pulse' : 'none';
    }
    raw[`${prefix}_style`] = newStyle;
    raw[`${prefix}_icon_style`] = iconStyle;
    delete raw[`${prefix}_pulse`];
}
function _migrateButtonStateConfig(raw) {
    // Daily — 3 states
    _migrateOneButtonState(raw, 'take_button_lockout');
    _migrateOneButtonState(raw, 'take_button_execution');
    _migrateOneButtonState(raw, 'take_button_latency');
    // Drinks — 1 state
    _migrateOneButtonState(raw, 'drink_button_lockout');
    // Ring speed rename (glow_speed -> ring_speed).
    if (raw.take_button_glow_speed !== undefined && raw.take_button_ring_speed === undefined) {
        raw.take_button_ring_speed = raw.take_button_glow_speed;
        delete raw.take_button_glow_speed;
    }
    if (raw.drink_button_glow_speed !== undefined && raw.drink_button_ring_speed === undefined) {
        raw.drink_button_ring_speed = raw.drink_button_glow_speed;
        delete raw.drink_button_glow_speed;
    }
}
// ──────────────────────────────────────────────
// AxDoseLoggerCard — Main Card Class (Container)
// ──────────────────────────────────────────────
class AxDoseLoggerCard extends i$2 {
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
        // Device-info dialog target. When undefined the dialog shows the Master
        // Tracker (or medicine) device name + navigates to the card's configured
        // device; when set (Inventory panel averages-box click) it shows the
        // granular drink's name + navigates to that drink's own device page.
        this._deviceInfoTarget = null;
        // Log Drink popup (Master Tracker Drinks panel). When open, shows a grid of
        // granular drink buttons for the master's substance; pressing one calls
        // button.press on that drink's DrinkLogButton and closes the dialog.
        this._showLogDrinkDialog = false;
        this._logDrinkSubstance = null;
        // Predicted Low-band timestamp per drink (Log Drink popup). Keyed by the
        // drink's logButtonEntityId; value is the ISO low_time string or null.
        // Populated on dialog open via the backend predict_low REST endpoint so the
        // user sees the predicted impact ("Low: hh:mm") before pressing a drink.
        // "Low: —" (null) means the drink would not lift body-mass above the Low
        // band, so there is no predicted descent — an explicit "safe" signal.
        this._drinkLowPredictions = {};
        // Race-guard token for the predict_low fetches (mirrors _amountFetchToken).
        // Not @state() — a race-guard token has no rendering impact; making it
        // reactive caused unnecessary shouldUpdate evaluations on every increment.
        this._predictLowToken = 0;
        // M2M profile-picker sub-step (Log Drink popup). When non-null, the popup
        // switches from the drink grid to a profile sub-list for the tapped shared
        // drink (2+ allowed_profiles). Each row is a profile-name button; tapping
        // one calls _logDrink with that profile's UUID. The Back button clears this
        // to return to the drink grid. Reset to null on dialog close.
        this._logDrinkProfileTarget = null;
        // Sleep Disruption popup (Master Tracker Drinks panel). When open, renders
        // a substance-aware markdown description of how the current body-mass load
        // affects sleep (caffeine vs alcohol), via HA's native ha-markdown element.
        this._showSleepDisruptionDialog = false;
        this._sleepDisruptionSubstance = null;
        // Medical Color Indicators explainer popup. Opened via a button in the
        // device-info dialog (when show_color_indicator_explainer is not false).
        // ha-dialog + ha-markdown, mirroring the Sleep Disruption popup pattern.
        this._showColorExplainerDialog = false;
        // ── Button State Matrix — transient ACK (logged) flash flags ──
        // Set true on a successful button.press of the Take Pill / Log Drink button
        // and auto-cleared after the configured ack_duration_ms (default 3000) via
        // a non-blocking setTimeout. Passed to the panels as reactive props so the
        // green "Logged" flash renders + reverts. The timer handles are NOT @state
        // (no rendering impact); only the boolean flags are reactive.
        // Rapid successive clicks: while the ACK flag is true, each additional
        // press increments the paired counter and resets the fade timer so the
        // overlay text updates to "Logged 2x", "Logged 3x" etc. The counter is
        // coupled to the ACK flag lifecycle — 0 means inactive, 1 means first
        // press (no suffix rendered), 2 and above means "Logged {n}x". When the
        // timer expires the flag flips false AND the counter resets to 0 in the
        // same tick. See plans/rapid-click-count-plan.md.
        this._dailyAckActive = false;
        this._drinksAckActive = false;
        this._dailyAckCount = 0;
        this._drinksAckCount = 0;
        // Frozen button state held for the ACK intro window (ACK_INTRO_MS) so the
        // underlying state transition (e.g. idle to lockout) is hidden behind the
        // overlay by the time it commits. Captured at ACK-trigger time from the live
        // entities (pre-press state); cleared by a release timer that then requests
        // a re-render so the resolver reads live state again.
        this._dailyFrozenState = null;
        this._drinksFrozenState = null;
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
        // Extra context for the 24h limit override dialog body placeholders
        // (current amount, limit, next dose strength, projected total, unit).
        // Only populated when bodyKey is a 24h_limit variant; null otherwise.
        this._overrideDialogExtras = null;
        // Tracking override warning dialog: when user tries to change a daily-locked
        // tracking value that has already been set today, this dialog asks for confirmation.
        this._trackingOverrideDialog = null;
        // Tracks entity IDs that have been set but whose HA state hasn't propagated yet.
        // Prevents the override-dialog race condition: without this, a second drag before
        // the first set_value completes would read stale logged_today=false and bypass
        // the override dialog. Cleared in updated() once HA confirms logged_today=true.
        this._pendingTracking = new Set();
        // Connection flag (N3 defense-in-depth): set true in connectedCallback,
        // false in disconnectedCallback. Timer callbacks that mutate @state and
        // call requestUpdate() check this flag before acting, so even if a
        // setTimeout callback was already queued before disconnectedCallback's
        // clearTimeout ran, it can't mutate state on a detached element. The
        // existing clearTimeout calls in disconnectedCallback are the primary
        // guard; this is belt-and-suspenders for the microtask-race edge case.
        this._connected = false;
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
        // Cache for _getDrinksOfSubstance() — mirrors the _resolvedEntities cache
        // pattern. DrinkInfo stores only entity IDs (stable identifiers), not
        // entity states, so the cache is valid until the entity registry reference
        // changes (HA replaces hass.entities on registry updates). Without this
        // cache the method did a full O(n) entity scan on every call, including
        // inside _relevantStateChanged() on every HA state change while the
        // inventory pane was active.
        this._drinksCache = null;
        // Cache for _getProfileNameMap() — mirrors the _drinksCache pattern. The
        // map stores only stable UUID→name pairs (read from the Master Tracker
        // sensor attributes), so it is valid until the entity registry reference
        // changes (HA replaces hass.entities on registry updates). Used by the
        // Log Drink popup profile picker + the multi-tracker header switcher.
        this._profilesCache = null;
        // ── Multi-Tracker State Machine (Phase 2) ──
        // Resolved tracker array + active index. Built once per drink_tracker_devices
        // config change or hass.entities registry change. The active tracker's
        // ResolvedEntities drives ALL panels (zero panel-internal change — the state
        // machine swaps the entity bundle ahead of the panels). _activeTrackerIndex is
        // @state so a profile switch re-renders; it is persisted to localStorage keyed
        // by a hash of drink_tracker_devices so a shared dashboard remembers each
        // browser's last view. _trackersError is @state so a mixed-substance /
        // non-tracker-device validation failure renders the error placeholder.
        this._activeTrackerIndex = 0;
        this._resolvedTrackers = [];
        this._trackersError = null;
        this._trackersCache = null;
        // Header profile-switcher popup (shown only when N>1).
        this._showProfileSwitcher = false;
        // Legacy Profile Lock UUID stashed by setConfig migration for lazy
        // resolution in _resolveTrackers (setConfig runs before hass is available).
        // Consumed once then cleared; auto-discovery takes over if the UUID is dead.
        this._legacyProfileLock = null;
        // Legacy drink_master_entities (entity IDs) stashed by setConfig migration
        // for lazy resolution to drink_tracker_devices (device IDs) in
        // _resolveTrackers. setConfig runs before hass is available, so the
        //   entity→device mapping (hass.entities[id].device_id) cannot run there.
        //   Consumed once then cleared; auto-discovery takes over for dead entities.
        this._legacyMasterEntities = null;
        // ── Multi-Medicine State Machine ──
        // Mirrors the multi-tracker machine above for the all-in-one medicine card
        // (medicine_devices populated). The active medicine's ResolvedEntities
        // drives ALL panels via the same entity-swap seam (zero panel-internal
        // change). _activeMedicineIndex is @state so a switch re-renders; it is
        // persisted to localStorage keyed by a hash of medicine_devices.
        // _medicinesError is @state so a validation failure (Drink Tracker device
        // selected, or a dead device) renders the error placeholder.
        // See plans/medicine-multi-select-plan.md.
        this._activeMedicineIndex = 0;
        this._resolvedMedicines = [];
        this._medicinesError = null;
        this._medicinesCache = null;
        // Header medicine-switcher popup (shown only when N>1).
        this._showMedicineSwitcher = false;
        // One-shot flag for the legacy device_id → medicine_devices migration
        // (runs in willUpdate once hass is available; see _migrateLegacyDeviceId).
        this._legacyDeviceIdMigrated = false;
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
        // Debounce timer for graphs-pane history re-fetch on hass change. Rapid
        // successive state changes (e.g. take-pill + state propagation) coalesce
        // into one fetch after the debounce delay instead of firing 3 fetches
        // (2 of which hit the recorder DB) per state change. The per-fetch race-
        // guard tokens still discard stale results from superseded fetches.
        this._graphsRefetchTimer = null;
    }
    // ── Configuration ──────────────────────────
    setConfig(config) {
        // Defensive shallow clone: HA's Lovelace editor may pass a frozen
        // (Object.freeze) config object to setConfig, especially during live
        // editing. The migration code below mutates the config in place, which
        // would throw "Cannot assign to read only property" on a frozen object.
        // Clone once at the entry point so all downstream code owns a writable
        // copy. A shallow clone is sufficient — all nested button-state config
        // lives at the top level (take_button_*, drink_button_*), and the only
        // nested structure (chips[]) is handled separately below.
        config = { ...config };
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
        // Migrate old button-state config (7-style + pulse -> 4-style + 4-icon_style,
        // glow_speed -> ring_speed). Idempotent. See plans/
        // icon-style-dropdown-separation-plan.md §5-6.
        _migrateButtonStateConfig(config);
        // ── Phase 2 → Phase 3: Multi-Tracker migration (device-driven) ──
        // The selector is now drink_tracker_devices (device IDs). Two legacy
        // fields migrate lazily in _resolveTrackers (setConfig runs before hass
        // is available, so entity→device / UUID→device resolution can't happen
        // here):
        //   - drink_master_entities (entity IDs) → stashed on _legacyMasterEntities
        //     for lazy resolution to drink_tracker_devices device IDs.
        //   - drink_target_profile (Profile Lock UUID) → stashed on
        //     _legacyProfileLock for lazy resolution to a single device ID.
        // Both legacy fields are deleted from config immediately so they don't
        // linger in persisted YAML; the active-profile default replaces the lock
        // (N=1 = the new "lock"). Dead entities/UUIDs fall through to
        // auto-discovery. See plans/drink-tracker-selector-rename-plan.md.
        const raw2 = config;
        // Normalize drink_tracker_devices to an array (HA may store a single
        // string when the user picks one device in the multi-select).
        if (typeof raw2.drink_tracker_devices === 'string') {
            raw2.drink_tracker_devices = raw2.drink_tracker_devices ? [raw2.drink_tracker_devices] : [];
        }
        else if (!Array.isArray(raw2.drink_tracker_devices)) {
            raw2.drink_tracker_devices = [];
        }
        // Normalize medicine_devices to an array (same HA multi-select quirk).
        // See plans/medicine-multi-select-plan.md.
        if (typeof raw2.medicine_devices === 'string') {
            raw2.medicine_devices = raw2.medicine_devices ? [raw2.medicine_devices] : [];
        }
        else if (!Array.isArray(raw2.medicine_devices)) {
            raw2.medicine_devices = [];
        }
        // Stash legacy drink_master_entities (entity IDs) for lazy migration.
        if (Array.isArray(raw2.drink_master_entities) && raw2.drink_master_entities.length > 0 &&
            raw2.drink_tracker_devices.length === 0) {
            this._legacyMasterEntities = raw2.drink_master_entities
                .filter((e) => typeof e === 'string' && e);
        }
        else if (typeof raw2.drink_master_entities === 'string' && raw2.drink_master_entities &&
            raw2.drink_tracker_devices.length === 0) {
            this._legacyMasterEntities = [raw2.drink_master_entities];
        }
        delete raw2.drink_master_entities;
        // Stash legacy Profile Lock UUID for lazy migration (only when no
        // tracker devices and no legacy entity IDs are already queued).
        if (raw2.drink_target_profile &&
            raw2.drink_tracker_devices.length === 0 &&
            !this._legacyMasterEntities) {
            this._legacyProfileLock = String(raw2.drink_target_profile);
        }
        delete raw2.drink_target_profile;
        // HA contract: throw on invalid config so HA renders an error card with
        // the message. We check for null/undefined (key missing in YAML) but NOT
        // empty string — getStubConfig() returns { medicine_devices: [] } when
        // the card is first added in the visual editor, and that stub case should
        // render the friendly "Please select a device" placeholder in render(),
        // not an error card. A multi-tracker card may legitimately have no
        // medicine devices, so the check is skipped when drink_tracker_devices is
        // set (or a legacy migration is pending). A legacy device_id-only config
        // also passes (it migrates into medicine_devices in willUpdate).
        if (config.device_id == null &&
            !config.drink_tracker_devices?.length &&
            !config.medicine_devices?.length &&
            !this._legacyMasterEntities) {
            throw new Error(localize('en', 'setconfig.error.device_required'));
        }
        const prevDeviceId = this.config?.device_id;
        const prevTrackersKey = this._trackerConfigKey();
        const prevMedicinesKey = this._medicineConfigKey();
        // Store the raw user config without baking in defaults (#18). All read
        // sites already use the `!== false` pattern (treating undefined as true),
        // so the defaults were redundant — and baking them in polluted persisted
        // YAML and masked future default changes. Now the stored config contains
        // only what the user explicitly set.
        this.config = config;
        // If the device changed OR the trackers/medicines config changed, the
        // cached entity map is stale — drop it so the next _resolveEntities()
        // call re-scans.
        if (prevDeviceId !== this.config.device_id ||
            prevTrackersKey !== this._trackerConfigKey() ||
            prevMedicinesKey !== this._medicineConfigKey()) {
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
        // ── Multi-medicine state machine ──
        // When medicine_devices is populated, return the active medicine's
        // pre-computed entities (same entity-swap seam as the tracker machine —
        // panels need zero internal change). Validation failures set
        // _medicinesError; the caller (render) checks it and shows the error
        // placeholder instead. See plans/medicine-multi-select-plan.md.
        if (this._isMultiMedicineMode()) {
            const medicines = this._resolveMedicines();
            if (medicines.length === 0) {
                return { medicationName: 'Medication', metrics: [] };
            }
            const idx = Math.min(this._activeMedicineIndex, medicines.length - 1);
            this._resolvedEntities = medicines[idx].entities;
            this._resolvedDeviceId = medicines[idx].deviceId;
            this._resolvedEntitiesRef = this.hass.entities;
            return this._resolvedEntities;
        }
        // ── Multi-tracker state machine (Phase 3) ──
        // When drink_tracker_devices is populated, return the active tracker's
        // pre-computed entities. The trackers array (built by _resolveTrackers)
        // already calls _computeEntities per tracker, so this is a cache hit — no
        // duplicate O(n) scan. Switching profile invalidates _resolvedEntities so
        // the next call re-resolves. Validation failures set _trackersError; the
        // caller (render) checks _trackersError and shows the placeholder instead.
        if (this._isMultiTrackerMode()) {
            const trackers = this._resolveTrackers();
            if (trackers.length === 0) {
                return { medicationName: 'Medication', metrics: [] };
            }
            const idx = Math.min(this._activeTrackerIndex, trackers.length - 1);
            this._resolvedEntities = trackers[idx].entities;
            this._resolvedDeviceId = trackers[idx].deviceId;
            this._resolvedEntitiesRef = this.hass.entities;
            return this._resolvedEntities;
        }
        // ── Single-device (legacy) path ──
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
    /** Force the next _resolveEntities() call to re-scan. Also clears the
      *  drinks-of-substance + profile-name caches so a device_id change
      *  re-scans granular drinks and profiles. */
    _invalidateEntityCache() {
        this._resolvedEntities = null;
        this._resolvedEntitiesRef = null;
        this._drinksCache = null;
        this._profilesCache = null;
        this._trackersCache = null;
    }
    // ── Multi-Tracker State Machine (Phase 2/3) ──
    // The card has two modes:
    //   - Multi-tracker (state machine): drink_tracker_devices populated (≥1).
    //     _resolveTrackers() builds the array; _resolveEntities() returns the
    //     active tracker's entities; panels render unchanged.
    //   - Single device (legacy): drink_tracker_devices empty → fall back to
    //     device_id. _resolveEntities() uses the original device_id path.
    //
    // Auto-discovery (P2.2): when drink_tracker_devices is empty/absent AND the
    // configured device_id is NOT a Drink Tracker device, scan hass.entities for
    // all drink_master: True entities (collecting their device IDs). If the
    // found set is a single substance → auto-whitelist all of them. If multiple
    // substances → render the "please select" placeholder (do NOT silently mix
    // substances). When the configured device_id IS a Drink Tracker device
    // (legacy master card), the single-device path is used (migration in
    // setConfig converts it to the multi-tracker array so this branch is the
    // zero-config fallback only).
    /** True when the card is running the multi-tracker state machine. */
    _isMultiTrackerMode() {
        return Array.isArray(this.config?.drink_tracker_devices) &&
            (this.config.drink_tracker_devices.length > 0);
    }
    /** Resolve the configured Drink Tracker devices into ResolvedTracker[].
     *  Cached keyed by the hass.entities reference + a config-derived key (so a
     *  config change forces a rebuild). For each selected device, resolves its
     *  single `drink_master: True` body-mass entity and validates single-substance.
     *  Sets _trackersError on failure and returns an empty array so render()
     *  shows the error placeholder. */
    _resolveTrackers() {
        if (!this.hass || !this.config)
            return [];
        const entitiesRef = this.hass.entities;
        const configKey = this._trackerConfigKey();
        // Cache hit.
        if (this._trackersCache &&
            this._trackersCache.entitiesRef === entitiesRef &&
            this._trackersCache.configKey === configKey &&
            this._resolvedTrackers.length > 0) {
            return this._resolvedTrackers;
        }
        let deviceIds = Array.isArray(this.config.drink_tracker_devices)
            ? this.config.drink_tracker_devices.slice()
            : [];
        // ── Lazy legacy migrations (hass is now available) ──
        // Both stashes were queued by setConfig (which runs pre-hass). Resolve
        // them to device IDs here, persist into drink_tracker_devices, and clear.
        // Dead entities / UUIDs are skipped (don't hard-fail); auto-discovery
        // takes over if the stash resolves to nothing.
        if (deviceIds.length === 0 && this._legacyMasterEntities) {
            const legacyEntityIds = this._legacyMasterEntities;
            this._legacyMasterEntities = null;
            const migrated = [];
            for (const entityId of legacyEntityIds) {
                if (!entityId)
                    continue;
                const info = this.hass.entities[entityId];
                if (!info)
                    continue; // dead entity — skip
                if (this._getAttr(entityId, 'drink_master') !== true)
                    continue; // not a tracker
                if (info.device_id)
                    migrated.push(info.device_id);
            }
            if (migrated.length > 0) {
                deviceIds = migrated;
                // Persist the migration so the array is saved on next config write.
                this.config.drink_tracker_devices = migrated;
            }
        }
        if (deviceIds.length === 0 && this._legacyProfileLock) {
            const lockUuid = this._legacyProfileLock;
            this._legacyProfileLock = null;
            for (const [entityId, info] of Object.entries(this.hass.entities)) {
                if (this._getAttr(entityId, 'drink_master') === true &&
                    this._getAttr(entityId, 'profile_id') === lockUuid &&
                    info.device_id) {
                    deviceIds = [info.device_id];
                    // Persist the migration so the array is saved on next config write.
                    this.config.drink_tracker_devices = deviceIds;
                    break;
                }
            }
        }
        // ── Auto-discovery fallback (zero-config) ──
        if (deviceIds.length === 0) {
            // _effectiveDeviceId() returns '' in multi-medicine mode (medicines are
            // never trackers, so discovery must not hijack that mode) and the legacy
            // device_id otherwise.
            const did = this._effectiveDeviceId();
            // Only auto-discover when there is no explicit non-tracker device
            // selected. A configured medicine / granular-drink card must NOT be
            // hijacked by a global scan for Drink Tracker devices — that would
            // render the mixed-substance error placeholder instead of the medicine
            // card when the install also has Caffeine + Alcohol trackers. Empty
            // device_id (zero-config) and a device_id that IS a Drink Tracker
            // (legacy master card) both legitimately fall through to discovery.
            if (!did || this._masterEntityForDevice(did)) {
                deviceIds = this._autoDiscoverMasterDevices();
            }
        }
        // Build trackers, validating each device.
        const trackers = [];
        const seenSubstances = new Set();
        for (const deviceId of deviceIds) {
            if (!deviceId)
                continue;
            const entityId = this._masterEntityForDevice(deviceId);
            if (!entityId) {
                // Not a Drink Tracker device (no drink_master: True entity on it).
                this._trackersError = localize(this._lang, 'card.trackers_error_not_master');
                this._resolvedTrackers = [];
                this._trackersCache = { entitiesRef, configKey };
                return [];
            }
            const substance = (this._getAttr(entityId, 'substance') || '').toLowerCase();
            if (substance !== 'caffeine' && substance !== 'alcohol') {
                this._trackersError = localize(this._lang, 'card.trackers_error_not_master');
                this._resolvedTrackers = [];
                this._trackersCache = { entitiesRef, configKey };
                return [];
            }
            seenSubstances.add(substance);
            const profileId = this._getAttr(entityId, 'profile_id') || '';
            const profileName = this._getAttr(entityId, 'profile_name') || 'Default';
            const entities = this._computeEntities(deviceId);
            trackers.push({ entityId, deviceId, profileId, profileName, substance: substance, entities });
        }
        // ── Single-substance validation ──
        if (seenSubstances.size > 1) {
            this._trackersError = localize(this._lang, 'card.trackers_error_mixed_substance');
            this._resolvedTrackers = [];
            this._trackersCache = { entitiesRef, configKey };
            return [];
        }
        this._trackersError = null;
        this._resolvedTrackers = trackers;
        this._trackersCache = { entitiesRef, configKey };
        // Clamp the active index to bounds + read localStorage persistence.
        this._activeTrackerIndex = this._readActiveTrackerIndex(trackers.length);
        return trackers;
    }
    /** Resolve the single `drink_master: True` body-mass entity living on a
     *  Drink Tracker device, or '' if the device is not a Drink Tracker. Only
     *  DrinkMasterSensor carries `drink_master: True` and there is exactly one
     *  per tracker device, so the match is unambiguous. */
    _masterEntityForDevice(deviceId) {
        if (!this.hass || !deviceId)
            return '';
        for (const [entityId, info] of Object.entries(this.hass.entities)) {
            if (info.device_id === deviceId &&
                this._getAttr(entityId, 'drink_master') === true) {
                return entityId;
            }
        }
        return '';
    }
    /** Auto-discover all Drink Tracker devices (devices hosting a
     *  `drink_master: True` entity). Returns their device IDs, de-duplicated.
     *  The caller (_resolveTrackers) validates single-substance; if multiple
     *  substances are found, the card renders the placeholder. */
    _autoDiscoverMasterDevices() {
        if (!this.hass)
            return [];
        const ids = [];
        const seen = new Set();
        for (const [entityId, info] of Object.entries(this.hass.entities)) {
            if (this._getAttr(entityId, 'drink_master') !== true)
                continue;
            const devId = info.device_id;
            if (devId && !seen.has(devId)) {
                seen.add(devId);
                ids.push(devId);
            }
        }
        return ids;
    }
    /** True when auto-discovery found multiple substances (render the
     *  placeholder). Only relevant in zero-config mode (drink_tracker_devices
     *  empty). A configured array is validated in _resolveTrackers instead. */
    _autoDiscoveryIsMultiSubstance() {
        const deviceIds = this._autoDiscoverMasterDevices();
        if (deviceIds.length === 0)
            return false;
        const substances = new Set();
        for (const deviceId of deviceIds) {
            const entityId = this._masterEntityForDevice(deviceId);
            if (!entityId)
                continue;
            const s = (this._getAttr(entityId, 'substance') || '').toLowerCase();
            if (s)
                substances.add(s);
        }
        return substances.size > 1;
    }
    /** A stable key derived from drink_tracker_devices for localStorage scoping. */
    _trackerConfigKey() {
        const ids = Array.isArray(this.config?.drink_tracker_devices)
            ? this.config.drink_tracker_devices
            : [];
        return ids.slice().sort().join('|');
    }
    /** localStorage persistence: store the last-used _activeTrackerIndex keyed by
     *  a hash of drink_tracker_devices so a shared dashboard remembers each
     *  browser's last view. Clamp to array bounds (handles a removed tracker). */
    _readActiveTrackerIndex(length) {
        if (length === 0)
            return 0;
        const key = `ax-dose-logger:tracker-idx:${this._trackerConfigKey()}`;
        let stored = 0;
        try {
            const raw = window.localStorage.getItem(key);
            if (raw !== null) {
                const n = parseInt(raw, 10);
                if (!isNaN(n))
                    stored = n;
            }
        }
        catch { /* localStorage unavailable */ }
        if (stored < 0 || stored >= length)
            return 0;
        return stored;
    }
    /** Persist the active tracker index to localStorage (called on switch). */
    _persistActiveTrackerIndex() {
        const key = `ax-dose-logger:tracker-idx:${this._trackerConfigKey()}`;
        try {
            window.localStorage.setItem(key, String(this._activeTrackerIndex));
        }
        catch { /* localStorage unavailable */ }
    }
    /** The active tracker, or null when not in multi-tracker mode / no trackers. */
    _activeTracker() {
        if (!this._isMultiTrackerMode())
            return null;
        const trackers = this._resolveTrackers();
        if (trackers.length === 0)
            return null;
        const idx = Math.min(this._activeTrackerIndex, trackers.length - 1);
        return trackers[idx];
    }
    /** Switch the active profile (header switcher). Persists + re-renders. */
    _switchTracker(index) {
        const trackers = this._resolveTrackers();
        if (index < 0 || index >= trackers.length)
            return;
        this._activeTrackerIndex = index;
        this._persistActiveTrackerIndex();
        this._showProfileSwitcher = false;
        // Invalidate downstream caches so panels re-resolve for the new tracker.
        this._resolvedEntities = null;
        this._drinksCache = null;
        this.requestUpdate();
    }
    // ── Multi-Medicine State Machine ──
    // Mirrors the multi-tracker machine for the all-in-one medicine card
    // (medicine_devices populated). No substance constraint — medicines are
    // independent; the only validation is that each selected device is an
    // ax_dose_logger device that is NOT a Drink Tracker and resolves at least
    // one entity. See plans/medicine-multi-select-plan.md.
    /** True when the card is running the multi-medicine state machine. */
    _isMultiMedicineMode() {
        return Array.isArray(this.config?.medicine_devices) &&
            (this.config.medicine_devices.length > 0);
    }
    /** A stable key derived from medicine_devices for localStorage scoping. */
    _medicineConfigKey() {
        const ids = Array.isArray(this.config?.medicine_devices)
            ? this.config.medicine_devices
            : [];
        return ids.slice().sort().join('|');
    }
    /** One-shot lazy migration: legacy single `device_id` → `medicine_devices`.
     *  The single Medicine Picker was removed from the editor (its required:true
     *  blocked saving a multi-picker-only config), so existing configs that
     *  persisted `device_id` are absorbed into `medicine_devices` here on the
     *  first render pass where hass is available (needed to distinguish a real
     *  medicine device from a legacy Drink Tracker device — the latter keeps the
     *  legacy master-card path via auto-discovery). Runs once per element
     *  instance; the migrated config is written back through setConfig() so the
     *  persisted YAML is updated and `device_id` is deleted. Called from
     *  willUpdate(). See plans/medicine-multi-select-plan.md. */
    _migrateLegacyDeviceId() {
        if (this._legacyDeviceIdMigrated)
            return;
        if (!this.hass || !this.config)
            return;
        this._legacyDeviceIdMigrated = true;
        const did = this.config.device_id;
        // Nothing to migrate (fresh config / stub / already migrated).
        if (!did || (Array.isArray(this.config.medicine_devices) && this.config.medicine_devices.length > 0)) {
            return;
        }
        // A legacy device_id pointing at a Drink Tracker device is the legacy
        // master-card path — leave it for the tracker auto-discovery machinery
        // (it is NOT a medicine and must not enter medicine_devices).
        if (this._masterEntityForDevice(did))
            return;
        // Seed medicine_devices with the legacy device and drop device_id from
        // the persisted config. setConfig() re-normalizes + invalidates caches.
        this.setConfig({ ...this.config, medicine_devices: [did], device_id: undefined });
    }
    /** The device the card's single-device code paths should operate on:
     *  the active medicine's deviceId in multi-medicine mode, else the legacy
     *  config.device_id (pre-migration configs / legacy master card). Empty
     *  string when neither is available. */
    _effectiveDeviceId() {
        if (this._isMultiMedicineMode()) {
            return this._activeMedicine()?.deviceId ?? '';
        }
        return this.config?.device_id ?? '';
    }
    /** Resolve the configured medicine devices into ResolvedMedicine[].
     *  Cached keyed by the hass.entities reference + a config-derived key (so a
     *  config change forces a rebuild). For each selected device, validates it
     *  is NOT a Drink Tracker device and resolves its entity bundle. Sets
     *  _medicinesError on failure and returns an empty array so render()
     *  shows the error placeholder. */
    _resolveMedicines() {
        if (!this.hass || !this.config)
            return [];
        const entitiesRef = this.hass.entities;
        const configKey = this._medicineConfigKey();
        // Cache hit.
        if (this._medicinesCache &&
            this._medicinesCache.entitiesRef === entitiesRef &&
            this._medicinesCache.configKey === configKey &&
            this._resolvedMedicines.length > 0) {
            return this._resolvedMedicines;
        }
        const deviceIds = Array.isArray(this.config.medicine_devices)
            ? this.config.medicine_devices.filter((id) => !!id)
            : [];
        // Build medicines, validating each device.
        const medicines = [];
        for (const deviceId of deviceIds) {
            // Reject Drink Tracker devices — they belong in the Drink Tracker
            // picker (the multi-tracker machine handles them).
            if (this._masterEntityForDevice(deviceId)) {
                this._medicinesError = localize(this._lang, 'card.medicines_error_not_medicine');
                this._resolvedMedicines = [];
                this._medicinesCache = { entitiesRef, configKey };
                return [];
            }
            // Reject devices with no resolvable entities (dead/removed device).
            const entities = this._computeEntities(deviceId);
            if (!entities || Object.keys(entities).length === 0) {
                this._medicinesError = localize(this._lang, 'card.medicines_error_not_medicine');
                this._resolvedMedicines = [];
                this._medicinesCache = { entitiesRef, configKey };
                return [];
            }
            const name = this.hass.devices?.[deviceId]?.name
                || entities.medicationName
                || 'Medication';
            medicines.push({ deviceId, name, entities });
        }
        if (medicines.length === 0) {
            this._medicinesError = localize(this._lang, 'card.medicines_error_not_medicine');
            this._resolvedMedicines = [];
            this._medicinesCache = { entitiesRef, configKey };
            return [];
        }
        this._medicinesError = null;
        this._resolvedMedicines = medicines;
        this._medicinesCache = { entitiesRef, configKey };
        // Clamp the active index to bounds + read localStorage persistence.
        this._activeMedicineIndex = this._readActiveMedicineIndex(medicines.length);
        return medicines;
    }
    /** localStorage persistence: store the last-used _activeMedicineIndex keyed
     *  by a hash of medicine_devices so a shared dashboard remembers each
     *  browser's last view. Clamp to array bounds (handles a removed medicine). */
    _readActiveMedicineIndex(length) {
        if (length === 0)
            return 0;
        const key = `ax-dose-logger:medicine-idx:${this._medicineConfigKey()}`;
        let stored = 0;
        try {
            const raw = window.localStorage.getItem(key);
            if (raw !== null) {
                const n = parseInt(raw, 10);
                if (!isNaN(n))
                    stored = n;
            }
        }
        catch { /* localStorage unavailable */ }
        if (stored < 0 || stored >= length)
            return 0;
        return stored;
    }
    /** Persist the active medicine index to localStorage (called on switch). */
    _persistActiveMedicineIndex() {
        const key = `ax-dose-logger:medicine-idx:${this._medicineConfigKey()}`;
        try {
            window.localStorage.setItem(key, String(this._activeMedicineIndex));
        }
        catch { /* localStorage unavailable */ }
    }
    /** The active medicine, or null when not in multi-medicine mode / no
     *  medicines resolved. */
    _activeMedicine() {
        if (!this._isMultiMedicineMode())
            return null;
        const medicines = this._resolveMedicines();
        if (medicines.length === 0)
            return null;
        const idx = Math.min(this._activeMedicineIndex, medicines.length - 1);
        return medicines[idx];
    }
    /** The active medicine's display name (for the header switcher chip). Empty
     *  when not in multi-medicine mode or no medicines resolved. */
    _activeMedicineName() {
        return this._activeMedicine()?.name ?? '';
    }
    /** Switch the active medicine (header switcher). Persists + re-renders. */
    _switchMedicine(index) {
        const medicines = this._resolveMedicines();
        if (index < 0 || index >= medicines.length)
            return;
        this._activeMedicineIndex = index;
        this._persistActiveMedicineIndex();
        this._showMedicineSwitcher = false;
        // Invalidate downstream caches so panels re-resolve for the new medicine.
        this._resolvedEntities = null;
        this._drinksCache = null;
        this.requestUpdate();
    }
    /** Render the medicines error placeholder (Drink Tracker device selected or
     *  a dead device). Shown in place of the card so the admin can fix the
     *  config. */
    _renderMedicinesError() {
        const msg = this._medicinesError || localize(this._lang, 'card.medicines_error_generic');
        return b `
      <ha-card>
        <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
          <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
          <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${localize(this._lang, 'card.medicines_error_title')}</div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">${msg}</div>
        </div>
      </ha-card>
    `;
    }
    /** Render the header medicine switcher popup (shown when N>1). Lists the
     *  configured medicines as buttons; tapping one switches the active
     *  medicine. */
    _renderMedicineSwitcher() {
        const medicines = this._resolveMedicines();
        const close = () => { this._showMedicineSwitcher = false; };
        return b `
      <ha-dialog open width="small" @closed=${close}>
        <div slot="header" class="dialog-header">${localize(this._lang, 'card.medicine_switcher_title')}</div>
        <div class="dialog-body">
          <div class="log-drink-grid">
            ${medicines.map((m, i) => b `
              <button
                class="dialog-btn log-drink-btn ${i === this._activeMedicineIndex ? 'active' : ''}"
                @click=${delayedAction(() => this._switchMedicine(i))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:pill"></ha-icon>
                <span class="log-drink-name">${m.name}</span>
              </button>
            `)}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${close}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
        </div>
      </ha-dialog>
    `;
    }
    /** True when the card is in zero-config auto-discovery mode:
     *  drink_tracker_devices is empty/absent AND no explicit non-tracker
     *  device_id is selected. The card then scans hass.entities for all
     *  drink_master: True entities (collecting their device IDs). A configured
     *  drink_tracker_devices array is NOT auto-discovery (it's explicit
     *  multi-tracker). A configured medicine / granular-drink device_id is also
     *  NOT auto-discovery — it's an explicit single-device card, and running the
     *  global tracker scan here would hijack it (rendering the mixed-substance
     *  error placeholder instead of the medicine card when the install also has
     *  Caffeine + Alcohol trackers). Only an empty device_id (zero-config) OR a
     *  device_id that already points at a Drink Tracker (legacy master card)
     *  fall through to discovery. The discriminator reuses
     *  _masterEntityForDevice() (returns '' for any non-tracker device). Used by
     *  render() to decide whether to run the trackers-validation path before the
     *  device_id fallback. */
    _autoDiscoveryActive() {
        if (this._isMultiTrackerMode())
            return false;
        if (this._isMultiMedicineMode())
            return false;
        const did = this.config?.device_id;
        if (did && !this._masterEntityForDevice(did))
            return false;
        return true;
    }
    /** The active tracker's display name (for the header switcher chip). Empty
     *  when not in multi-tracker mode or no trackers resolved. */
    _activeTrackerName() {
        return this._activeTracker()?.profileName ?? '';
    }
    /** Render the trackers error placeholder (non-master entity or mixed
     *  substance). Shown in place of the card so the admin can fix the config. */
    _renderTrackersError() {
        const msg = this._trackersError || localize(this._lang, 'card.trackers_error_generic');
        return b `
      <ha-card>
        <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
          <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
          <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${localize(this._lang, 'card.trackers_error_title')}</div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">${msg}</div>
        </div>
      </ha-card>
    `;
    }
    /** Render the "please select" placeholder (zero-config multi-substance
     *  household or no master trackers found). */
    _renderTrackersPlaceholder() {
        return b `
      <ha-card>
        <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
          <ha-icon icon="mdi:account-group" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
          <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${localize(this._lang, 'card.trackers_placeholder_title')}</div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">${localize(this._lang, 'card.trackers_placeholder_subtitle')}</div>
        </div>
      </ha-card>
    `;
    }
    /** Render the header profile switcher popup (shown when N>1). Lists the
     *  configured trackers as buttons; tapping one switches the active profile. */
    _renderProfileSwitcher() {
        const trackers = this._resolveTrackers();
        const close = () => { this._showProfileSwitcher = false; };
        return b `
      <ha-dialog open width="small" @closed=${close}>
        <div slot="header" class="dialog-header">${localize(this._lang, 'card.profile_switcher_title')}</div>
        <div class="dialog-body">
          <div class="log-drink-grid">
            ${trackers.map((t, i) => b `
              <button
                class="dialog-btn log-drink-btn ${i === this._activeTrackerIndex ? 'active' : ''}"
                @click=${delayedAction(() => this._switchTracker(i))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:account"></ha-icon>
                <span class="log-drink-name">${t.profileName}</span>
              </button>
            `)}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${close}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
        </div>
      </ha-dialog>
    `;
    }
    // ── M2M Multi-Profile — profile UUID → display-name map ──
    // Builds a { profileId: profileName } map by scanning hass.entities for
    // drink_master: True and reading the profile_id + profile_name state
    // attributes (exposed by DrinkMasterSensor in the backend). The map is
    // cached keyed by the hass.entities reference (HA replaces it on registry
    // updates), mirroring the _drinksCache pattern. Used by:
    //   - The Log Drink popup profile picker (shared drinks) — to show
    //     human-readable profile names on the sub-list buttons.
    //   - The multi-tracker header switcher (active profile display name).
    // Fallbacks:
    //   - profile_name null/missing → "Default" (the legacy singleton).
    //   - A UUID in a drink's allowed_profiles with no matching master sensor
    //     (profile deleted but not yet scrubbed) → not in the map; the popup
    //     falls back to a truncated-UUID label. The backend _validate_profile_id
    //     guard raises HomeAssistantError if a dead UUID is actually submitted.
    _getProfileNameMap() {
        if (!this.hass)
            return {};
        const entitiesRef = this.hass.entities;
        if (this._profilesCache &&
            this._profilesCache.entitiesRef === entitiesRef) {
            return this._profilesCache.map;
        }
        const map = {};
        for (const [entityId] of Object.entries(this.hass.entities)) {
            if (this._getAttr(entityId, 'drink_master') !== true)
                continue;
            const pid = this._getAttr(entityId, 'profile_id');
            if (typeof pid !== 'string' || !pid)
                continue;
            const pname = this._getAttr(entityId, 'profile_name');
            map[pid] = (typeof pname === 'string' && pname) ? pname : 'Default';
        }
        this._profilesCache = { entitiesRef, map };
        return map;
    }
    /** Resolve a display name for a profile UUID, with a truncated-UUID
     *  fallback when the profile is not found in the map (deleted / not yet
     *  loaded). The fallback shows the first 4 chars + "…" so the user sees
     *  *something* rather than a blank; the backend guard prevents a real log
     *  to a dead UUID. */
    _profileDisplayName(profileId) {
        const map = this._getProfileNameMap();
        const name = map[profileId];
        if (name)
            return name;
        return profileId.length > 8 ? `${profileId.slice(0, 4)}…` : profileId;
    }
    _computeEntities(deviceId) {
        const result = { medicationName: 'Medication', metrics: [] };
        if (!this.hass)
            return result;
        // Extract medication name from device registry
        if (this.hass.devices?.[deviceId]?.name) {
            result.medicationName = this.hass.devices[deviceId].name;
        }
        // Iterate all entities to find those belonging to this device. This single
        // pass handles both suffix-based medicine categorization AND master-tracker
        // / granular-drink detection (N5: previously two separate loops over the
        // same hass.entities object — merged since the result is cached and only
        // runs on device-id or registry change, but the double iteration was a
        // code-quality smell).
        let isMaster = false;
        let isGranularDrink = false;
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
                // Days-left inventory-burn sensor. Two suffixes exist (scheduled
                // "_days_left" vs As Needed "_days_left_est"); longest-first so the
                // shorter suffix doesn't shadow the longer. The estimation flag is
                // read from the backend `estimation` state attribute so the Stats
                // row picks the matching label ("Days left" vs "Est. days left").
                else if (entityId.endsWith('_days_left_est')) {
                    result.daysLeft = entityId;
                    result.daysLeftEst = true;
                }
                else if (entityId.endsWith('_days_left')) {
                    result.daysLeft = entityId;
                    result.daysLeftEst = false;
                }
                else if (entityId.endsWith('_strength'))
                    result.strength = entityId;
                else if (entityId.endsWith('_24h_limit_exceeded'))
                    result.limit24hExceeded = entityId;
                // Dose Status enum sensor (backend single source of truth for the
                // button state machine: not_due/due/overdue/limit_reached/limit_24h/ok).
                else if (entityId.endsWith('_dose_status'))
                    result.doseStatus = entityId;
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
                else {
                    // Adherence cover + skip buttons are resolved by the backend
                    // `role` state attribute, NOT entity_id suffix. The friendly
                    // name "Mark Last Adherence Taken" slugifies to
                    // `_mark_last_adherence_taken`, not `_cover_last_missed` (the
                    // translation_key), so suffix-matching failed and the button
                    // never resolved — it was missing from the Tools pane. The
                    // `role` attribute is set explicitly by the backend and is the
                    // same pattern the drink buttons already use.
                    const btnRole = this._getAttr(entityId, 'role');
                    if (btnRole === 'cover')
                        result.adherenceCoverButton = entityId;
                    else if (btnRole === 'skip')
                        result.skipButton = entityId;
                    else if (btnRole === 'averages_reset')
                        result.averagesResetButton = entityId;
                }
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
            // ── Master Tracker (Caffeine/Alcohol) + granular drink detection ──
            // Merged into the same single pass as the suffix categorization above
            // (N5: previously a second Object.entries loop). Master tracker entities
            // use different suffixes than medicine entities, so the suffix block
            // above doesn't populate ResolvedEntities for them. Detect them by state
            // attributes (`drink_master: True` for masters, `device_type: "drink"`
            // for granular drinks) and populate the master fields. Granular drink
            // devices set deviceType='drink' so render() can show the redirect
            // placeholder.
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
                else if (masterRole === 'low_hours_until')
                    result.lowHoursUntil = entityId;
                // Dedicated Master Tracker last-dose TIMESTAMP sensor — its state IS
                // the last-dose timestamp (single source of truth), so the Daily
                // panel's computeTimeSinceLastDose helper works unchanged for masters.
                else if (masterRole === 'last_dose')
                    result.lastDose = entityId;
                // The Master Tracker no longer has a days-left sensor (removed in
                // backend v14 — the aggregate has no single inventory). The per-
                // granular-drink DrinkDaysLeftSensor powers the Inventory panel's
                // per-drink "Est. days left" 2nd line instead. Do NOT map a master
                // days_left role here — the Stats panel's `if (e.daysLeft)` guard
                // then skips the row for master devices.
                //
                // The Master Tracker also has no dedicated "Total Doses" sensor.
                // The body-mass sensor (amountInBody, mapped above) carries a
                // dose_count attribute, but surfacing it as a "Total Doses" Stats
                // box on the aggregate device is misleading — the box is omitted
                // for master devices by NOT mapping totalDoses here. Medicine
                // devices still map totalDoses via the `_total_doses` suffix above.
            }
            else if (dt === 'drink') {
                isGranularDrink = true;
                const substance = (this._getAttr(entityId, 'substance') || '').toLowerCase();
                if (substance === 'caffeine' || substance === 'alcohol')
                    result.substance = substance;
                // Granular drink days-left sensor (classified by role like the master
                // variant). Granular devices redirect to the Master Tracker so the
                // Stats panel never renders for them, but resolving the field keeps
                // the classifier complete and available for any future surface.
                if (this._getAttr(entityId, 'role') === 'days_left') {
                    result.daysLeft = entityId;
                    result.daysLeftEst = true;
                }
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
    // Enumerate configured Daily-panel custom chips (chip_1..4 + icon/label +
    // 3 ui_action overrides).  Each chip now carries the full override suite
    // mirroring the Safe to Take / Pills Left box pattern: entity + label +
    // icon + tap/hold/double_tap actions.  The panel passes the configs back to
    // handleChipAction on click/hold/double-tap.
    _getChipEntities() {
        if (!this.config)
            return [];
        const chips = [];
        for (const key of ['chip_1', 'chip_2', 'chip_3', 'chip_4']) {
            const val = this.config[key];
            if (val) {
                const labelKey = `${key}_label`;
                const iconKey = `${key}_icon`;
                const showIconKey = `${key}_show_icon`;
                const tapKey = `${key}_tap_action`;
                const holdKey = `${key}_hold_action`;
                const dblKey = `${key}_double_tap_action`;
                chips.push({
                    entityId: val,
                    label: this.config[labelKey],
                    icon: this.config[iconKey],
                    showIcon: this.config[showIconKey] === true,
                    tapAction: this.config[tapKey],
                    holdAction: this.config[holdKey],
                    doubleTapAction: this.config[dblKey],
                });
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
        // Delegates to the shared helper so the container + graphs panel use the
        // same timeframe→hours mapping without duplicating the switch.
        return getTimeframeHours(this._activeTimeframe);
    }
    // ── Actions ────────────────────────────────
    _handleTakePill(entities) {
        if (!this.hass || !entities.takeButton)
            return;
        const safeState = this._getState(entities.pillsSafeToTake);
        const safeCount = parseInt(safeState, 10);
        // 24h Strength Limit reached — show override dialog with 24h-specific
        // text. This fires when the next dose would push the 24h strength sum
        // over the daily_limit, or the limit is already exceeded. Checked
        // before the pill-count lockout so the user sees the more specific
        // 24h strength warning even when pills are still available.
        if (entities.limit24hExceeded) {
            const limitState = this._getState(entities.limit24hExceeded);
            if (limitState === 'on') {
                const currentAmount = this._getAttr(entities.limit24hExceeded, 'current_amount');
                const dailyLimit = this._getAttr(entities.limit24hExceeded, 'daily_limit');
                const nextStrength = this._getAttr(entities.limit24hExceeded, 'next_dose_strength');
                const alreadyExceeded = this._getAttr(entities.limit24hExceeded, 'already_exceeded');
                const unit = this._getAttr(entities.limit24hExceeded, 'unit_of_measurement') || 'mg';
                const projected = (typeof currentAmount === 'number' ? currentAmount : 0)
                    + (typeof nextStrength === 'number' ? nextStrength : 0);
                const timeLabel = `${currentAmount} / ${dailyLimit} ${unit}`;
                const bodyKey = alreadyExceeded
                    ? 'dialog.override.body_24h_exceeded'
                    : 'dialog.override.body_24h_would_exceed';
                this._overrideDialog = {
                    timeLabel,
                    bodyKey,
                    entities,
                };
                // Store extra context for the dialog body placeholders.
                this._overrideDialogExtras = {
                    current: String(currentAmount),
                    limit: String(dailyLimit),
                    next: String(nextStrength),
                    projected: String(projected),
                    unit: String(unit),
                };
                return;
            }
        }
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
                // Pill-count window reset (scheduled meds): when the lockout is caused
                // by the 24h sliding window (not the schedule), the next_dose sensor
                // can point at a far-future slot (e.g. tomorrow 13:00) while the
                // actual binding constraint — the rolling window — lifts much sooner
                // (e.g. oldest dose + 24h − buffer, minutes away). Prefer
                // window_expires_at when it is valid, in the future, and EARLIER than
                // the next scheduled slot, so the dialog shows when the limit actually
                // resets. Mirrors the As-Needed branch above; falls back to the
                // scheduled message for older backends without the attribute.
                const windowExpiresAt = this._getAttr(entities.pillsSafeToTake, 'window_expires_at');
                const windowExpiry = windowExpiresAt ? new Date(windowExpiresAt) : null;
                const windowResetsFirst = windowExpiry !== null && !isNaN(windowExpiry.getTime())
                    && windowExpiry > new Date()
                    && (!nextDate || isNaN(nextDate.getTime()) || windowExpiry < nextDate);
                if (windowResetsFirst) {
                    timeLabel = this._formatOverrideTime(windowExpiry);
                    bodyKey = 'dialog.override.body_window';
                }
                else if (nextDate && !isNaN(nextDate.getTime()) && nextDate > new Date()) {
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
        // Trigger the transient ACK (logged) flash on the Take Pill button.
        this._triggerDailyAck();
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
        // Cache hit: if the substance + entity-registry reference + active profile
        // are unchanged since the last scan, return the cached result. DrinkInfo
        // stores only entity IDs (stable), so the cache is valid until the registry
        // reference changes or is explicitly invalidated. The active profile ID is
        // part of the key so a profile switch re-scans with a different filter
        // (Phase 2 multi-tracker inventory filtering).
        const entitiesRef = this.hass.entities;
        const activeProfileId = this._activeTracker()?.profileId ?? '';
        if (this._drinksCache &&
            this._drinksCache.substance === substance &&
            this._drinksCache.entitiesRef === entitiesRef &&
            this._drinksCache.activeProfileId === activeProfileId) {
            return this._drinksCache.drinks;
        }
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
                if (role === 'log') {
                    info.logButtonEntityId = entityId;
                    // M2M: read allowed_profiles from the DrinkLogButton attribute so
                    // the popup can decide single-tap vs. profile-picker without a
                    // second entity lookup on every render. config_entry_id is needed
                    // for the log_drink service call (entry_id field). Both are read
                    // once here and cached in DrinkInfo.
                    const ap = this._getAttr(entityId, 'allowed_profiles');
                    if (Array.isArray(ap))
                        info.allowedProfiles = ap.map(String);
                    if (entityInfo.config_entry_id)
                        info.configEntryId = entityInfo.config_entry_id;
                }
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
                // Per-granular-drink "Est. days left" sensor (DrinkDaysLeftSensor).
                // Powers the Inventory panel's col-1 2nd line.
                else if (role === 'days_left')
                    info.daysLeftEntityId = entityId;
            }
            byDevice[deviceId] = info;
        }
        let result = Object.values(byDevice).sort((a, b) => a.name.localeCompare(b.name));
        // ── Phase 2: inventory filtering by active profile ──
        // In multi-tracker mode, only drinks the active profile is allowed to log
        // render. Switching profile remounts the Drinks panel with a different
        // drink set. Single-device mode (activeProfileId === '') skips the filter.
        if (activeProfileId) {
            result = result.filter(d => (d.allowedProfiles ?? []).includes(activeProfileId));
        }
        // Cache the scan result so subsequent calls (e.g. _relevantStateChanged
        // on every HA state change while inventory pane is active) skip the scan.
        this._drinksCache = { substance, entitiesRef, drinks: result, activeProfileId };
        return result;
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
    /** Log a granular drink via the ax_dose_logger.log_drink service.
     *
     *  M2M routing: the optional targetProfile routes the PK payload to a
     *  specific profile's Master Tracker. When omitted, the backend applies
     *  the single-profile convenience default (single/zero-profile drinks) or
     *  raises for shared drinks (the popup resolves the target before calling
     *  so this path only receives an omitted target for single/zero-profile
     *  drinks). The local inventory always decrements regardless.
     *
     *  Phase 2 active-profile inheritance: when no explicit targetProfile is
     *  passed AND the card is in multi-tracker mode, the active tracker's
     *  profileId is the implicit default — the popup's single-tap path (which
     *  calls _logDrink with no target) routes to the active profile for shared
     *  drinks the active profile is allowed to log. The popup's profile-picker
     *  path passes an explicit targetProfile (the user picked a profile manually
     *  from the sub-list restricted to _resolvedTrackers). N=1 cards never show
     *  a sub-list — one-tap, always the sole profile.
     *
     *  Replaces the prior button.press call: the DrinkLogButton is stateless
     *  and raises HomeAssistantError for multi-profile drinks (cannot carry a
     *  per-press target_profile). The service path is the backend's documented
     *  contract for the card. entry_id is resolved from the log button's
     *  config_entry_id (hass.entities).
     */
    _logDrink(logButtonEntityId, targetProfile) {
        if (!this.hass || !logButtonEntityId)
            return;
        // Resolve the drink's config entry id (required for the service call).
        const entryId = this.hass.entities[logButtonEntityId]?.config_entry_id;
        if (!entryId) {
            console.warn('[ax-dose-logger-card] _logDrink: no config_entry_id for', logButtonEntityId);
            return;
        }
        // Phase 2: apply the active tracker's profile as the implicit default when
        // no explicit target was passed. The popup passes an explicit target from
        // the picker; the single-tap path passes nothing, so the active profile
        // kicks in here for shared drinks the active profile is allowed to log.
        // In single-device mode (no active tracker) the effective target is
        // undefined → backend convenience default / single-profile short-circuit.
        const activeProfileId = this._activeTracker()?.profileId;
        const effectiveTarget = targetProfile ?? activeProfileId;
        this.hass.callService('ax_dose_logger', 'log_drink', {
            entry_id: entryId,
            ...(effectiveTarget ? { target_profile: effectiveTarget } : {}),
        });
        this._showLogDrinkDialog = false;
        this._logDrinkSubstance = null;
        this._logDrinkProfileTarget = null;
        // Trigger the transient ACK flash on the Drinks panel's Log Drink button.
        this._triggerDrinksAck();
    }
    /**
     * Trigger the transient ACK (logged) flash on the Daily Take Pill button.
     * Called after a successful button.press (both the direct press path and the
     * limit-reached override-dialog confirm path). Sets the reactive flag true,
     * clears any in-flight timer, then arms a new setTimeout that flips it back
     * to false after the configured ack_duration_ms (default 3000). Non-blocking
     * — the container keeps rendering normally while the flash plays out.
     */
    _triggerDailyAck() {
        const duration = this.config?.take_button_ack_duration_ms ?? 3000;
        // Freeze the resolved button state for the ACK intro window so the
        // post-press state transition (e.g. idle to lockout) is hidden behind the
        // overlay once it's opaque. Capture the PRE-press state from the live
        // entities first — the trigger fires synchronously right after
        // button.press, before HA has pushed the new state, so the resolved state
        // is still the pre-press value.
        const entities = this._resolveEntities();
        this._dailyFrozenState = this._computeDailyButtonState(entities);
        if (this._dailyFreezeTimer !== undefined) {
            window.clearTimeout(this._dailyFreezeTimer);
        }
        this._dailyFreezeTimer = window.setTimeout(() => {
            if (!this._connected)
                return; // N3: detached guard
            this._dailyFrozenState = null;
            this._dailyFreezeTimer = undefined;
            this.requestUpdate();
        }, ACK_INTRO_MS);
        // Rapid successive clicks: if a flash is already active, increment the
        // running counter (1st press showed "Logged", 2nd shows "Logged 2x" etc.)
        // and reset the fade timer. If this is the first press in the window,
        // initialise the counter to 1 and arm the flag. The counter and flag are
        // cleared together when the timer fires so there is one source of truth.
        if (this._dailyAckActive) {
            this._dailyAckCount += 1;
        }
        else {
            this._dailyAckCount = 1;
            this._dailyAckActive = true;
        }
        if (this._dailyAckTimer !== undefined) {
            window.clearTimeout(this._dailyAckTimer);
        }
        this._dailyAckTimer = window.setTimeout(() => {
            if (!this._connected)
                return; // N3: detached guard
            this._dailyAckActive = false;
            this._dailyAckCount = 0;
            this._dailyAckTimer = undefined;
            this.requestUpdate();
        }, Math.max(500, duration));
    }
    /** Trigger the transient ACK flash on the Drinks Log Drink button. */
    _triggerDrinksAck() {
        const duration = this.config?.drink_button_ack_duration_ms ?? 3000;
        // Freeze the resolved button state for the ACK intro window — mirrors
        // _triggerDailyAck so the post-press state transition (e.g. idle to
        // lockout when the daily drink limit is hit) is hidden behind the overlay
        // once it's opaque.
        const entities = this._resolveEntities();
        this._drinksFrozenState = this._computeDrinksButtonState(entities);
        if (this._drinksFreezeTimer !== undefined) {
            window.clearTimeout(this._drinksFreezeTimer);
        }
        this._drinksFreezeTimer = window.setTimeout(() => {
            if (!this._connected)
                return; // N3: detached guard
            this._drinksFrozenState = null;
            this._drinksFreezeTimer = undefined;
            this.requestUpdate();
        }, ACK_INTRO_MS);
        // Rapid successive clicks: mirrors _triggerDailyAck. Each press while the
        // flash is active increments the counter ("Logged 2x", "Logged 3x" …) and
        // resets the fade timer; the first press initialises to 1 and arms the
        // flag. The timer clears both together on expiry.
        if (this._drinksAckActive) {
            this._drinksAckCount += 1;
        }
        else {
            this._drinksAckCount = 1;
            this._drinksAckActive = true;
        }
        if (this._drinksAckTimer !== undefined) {
            window.clearTimeout(this._drinksAckTimer);
        }
        this._drinksAckTimer = window.setTimeout(() => {
            if (!this._connected)
                return; // N3: detached guard
            this._drinksAckActive = false;
            this._drinksAckCount = 0;
            this._drinksAckTimer = undefined;
            this.requestUpdate();
        }, Math.max(500, duration));
    }
    /**
     * Cancel an in-flight Daily ACK (the "Logged" flash on the Take Pill
     * button). Called when the user navigates away from the Daily pane while
     * the flash is still playing. Pane navigation destroys the daily-panel DOM
     * (render is conditional on _activePane), so the CSS animation is gone —
     * but without this cancel, the surviving _dailyAckActive flag would remount
     * a fresh .ack-flash div on return and replay the animation from t=0. This
     * mirrors the cleanup the fade-timer callback and disconnectedCallback
     * already perform. No requestUpdate() here — _handlePaneChange's own
     * _activePane mutation already triggers the render that drops the panel.
     */
    _cancelDailyAck() {
        if (this._dailyAckTimer !== undefined) {
            window.clearTimeout(this._dailyAckTimer);
            this._dailyAckTimer = undefined;
        }
        if (this._dailyFreezeTimer !== undefined) {
            window.clearTimeout(this._dailyFreezeTimer);
            this._dailyFreezeTimer = undefined;
        }
        this._dailyFrozenState = null;
        this._dailyAckActive = false;
        this._dailyAckCount = 0;
    }
    /**
     * Cancel an in-flight Drinks ACK (the "Logged" flash on the Log Drink
     * button). Mirrors _cancelDailyAck for the Drinks pane.
     */
    _cancelDrinksAck() {
        if (this._drinksAckTimer !== undefined) {
            window.clearTimeout(this._drinksAckTimer);
            this._drinksAckTimer = undefined;
        }
        if (this._drinksFreezeTimer !== undefined) {
            window.clearTimeout(this._drinksFreezeTimer);
            this._drinksFreezeTimer = undefined;
        }
        this._drinksFrozenState = null;
        this._drinksAckActive = false;
        this._drinksAckCount = 0;
    }
    /**
     * Resolve the adherence grace period (on-time buffer) in hours. Powers the
     * Button State Matrix latency boundary (overdue warning at half grace).
     *
     * Resolution order (fixes the bug where the card silently fell back to a
     * hardcoded 1.0h when adherence tracking was off, ignoring the user's
     * configured value):
     *   1. The Overdue sensor's `grace_minutes` attribute — the Overdue sensor
     *      is created for every scheduled medication (independent of
     *      enable_adherence), so it is the reliable single source of truth.
     *      Convert minutes -> hours for the internal ButtonStateInput contract.
     *   2. The adherence sensors' `grace_hours` attribute (legacy path, when
     *      the Overdue sensor somehow lacks grace_minutes — defensive).
     *   3. The backend default 60 min (== 1.0h).
     */
    _resolveGraceHours(entities) {
        // 1. Prefer the Overdue sensor's grace_minutes (always present for
        //    scheduled meds, regardless of whether adherence tracking is on).
        if (entities.overdue) {
            const gm = this._getAttr(entities.overdue, 'grace_minutes');
            if (typeof gm === 'number' && gm > 0)
                return gm / 60;
        }
        // 2. Fall back to adherence sensors' grace_hours (legacy).
        const candidates = [
            entities.adherence7Days,
            entities.adherence14Days,
            entities.adherence30Days,
            entities.adherence365Days,
        ];
        for (const eid of candidates) {
            if (!eid)
                continue;
            const gh = this._getAttr(eid, 'grace_hours');
            if (typeof gh === 'number' && gh > 0)
                return gh;
        }
        // 3. Final fallback (matches the backend default 60 min).
        return 1.0;
    }
    /**
     * Compute the resolved ButtonState for the Daily (Take Pill) button from the
     * current entities + the transient ACK flag. Pure read of hass state; the
     * panel receives the resulting state as a reactive prop.
     */
    _computeDailyButtonState(entities) {
        // While the ACK intro freeze is active, return the captured pre-press
        // state so the underlying color doesn't transition until the overlay is
        // opaque. The freeze is released by the ACK_INTRO_MS timer armed in
        // _triggerDailyAck.
        if (this._dailyFrozenState !== null) {
            return this._dailyFrozenState;
        }
        // ── Primary path: backend Dose Status enum sensor ──
        // Single source of truth: the backend computes the same state machine
        // (limit_reached → limit_24h → not_due/due/overdue → ok) with
        // point-in-time timers, so card and automations can never disagree.
        // Fail-open: when the sensor is missing (older backend) or
        // unavailable/unknown, fall through to the legacy 4-entity derivation.
        if (entities.doseStatus) {
            const statusState = this._getState(entities.doseStatus);
            const mapped = mapDoseStatusToButtonState(statusState);
            if (mapped !== null) {
                return mapped;
            }
        }
        // ── Legacy fallback: derive from 4 entities (pre-dose_status backends) ──
        // Lockout — always reads the REAL pillsSafeToTake sensor (never the
        // display-swapped entity) so the safety gate is decoupled from the box.
        const safeState = this._getState(entities.pillsSafeToTake);
        const safeCount = parseInt(safeState, 10);
        const isLockedOut = !isNaN(safeCount) && safeCount <= 0;
        // 24h Strength Limit — reads the binary sensor (on when the next dose
        // would push the 24h strength sum over the daily_limit, or the limit is
        // already exceeded). Distinct from the pill-count lockout (isLockedOut)
        // which reads pillsSafeToTake. Takes precedence after lockout but before
        // latency/execution in the state machine.
        let is24hLimitReached = false;
        if (entities.limit24hExceeded) {
            const limitState = this._getState(entities.limit24hExceeded);
            is24hLimitReached = limitState === 'on';
        }
        // Scheduled = tracking_type != as_needed. Defensive snake/title-case
        // normalization mirroring _handleTakePill.
        const tt = (this._getAttr(entities.nextDose, 'tracking_type') || '').toLowerCase();
        const isScheduled = tt !== 'as_needed' && tt !== 'as needed' && tt !== '';
        // Overdue seconds (0 when on-time / not yet due / as-needed).
        const overdueState = this._getState(entities.overdue);
        let overdueSeconds = 0;
        if (overdueState && overdueState !== 'unavailable' && overdueState !== 'unknown') {
            const s = parseFloat(overdueState);
            if (!isNaN(s) && s > 0)
                overdueSeconds = s;
        }
        // "Due now" = the next scheduled slot has arrived. Read the next_dose
        // sensor: a valid ISO timestamp <= now means the slot is here (freshly
        // due or overdue); a future timestamp means not yet due. The overdue
        // sensor alone can't distinguish these (it reads 0 in both cases), so
        // next_dose is the authoritative "has the slot arrived" signal.
        // Fail-open: when next_dose is unavailable/unknown/unparseable, treat as
        // due-now so a genuinely-due dose is never hidden behind idle.
        let isDueNow = true;
        const nextDoseState = this._getState(entities.nextDose);
        if (nextDoseState && nextDoseState !== 'unavailable' && nextDoseState !== 'unknown') {
            const next = new Date(nextDoseState);
            if (!isNaN(next.getTime())) {
                isDueNow = next.getTime() <= Date.now();
            }
        }
        const input = {
            isLockedOut,
            is24hLimitReached,
            isScheduled,
            isDueNow,
            overdueSeconds,
            graceHours: this._resolveGraceHours(entities),
            ackActive: this._dailyAckActive,
        };
        return resolveButtonState(input);
    }
    /**
     * Compute the resolved ButtonState for the Drinks (Log Drink) button.
     * Drinks are PRN/as-needed with no schedule → execution/latency never active;
     * only lockout (daily limit reached) + idle + transient ack are possible.
     * Lockout reads the master daily-amount sensor's `remaining` attribute
     * (caffeine/alcohol daily limit); absent sensor/limit → never locks out.
     */
    _computeDrinksButtonState(entities) {
        // While the ACK intro freeze is active, return the captured pre-press
        // state (mirrors _computeDailyButtonState).
        if (this._drinksFrozenState !== null) {
            return this._drinksFrozenState;
        }
        let isLockedOut = false;
        if (entities.amountLast24h) {
            const remaining = this._getAttr(entities.amountLast24h, 'remaining');
            if (typeof remaining === 'number' && remaining <= 0) {
                isLockedOut = true;
            }
            else if (typeof remaining === 'string') {
                const r = parseFloat(remaining);
                if (!isNaN(r) && r <= 0)
                    isLockedOut = true;
            }
        }
        const input = {
            isLockedOut,
            is24hLimitReached: false, // drinks have no 24h strength limit
            isScheduled: false, // drinks have no schedule
            isDueNow: false, // no schedule → unreachable in the resolver
            overdueSeconds: 0,
            graceHours: 1.0,
            ackActive: this._drinksAckActive,
        };
        return resolveButtonState(input);
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
    // Run a Tools panel action respecting the `confirm_tool_actions` config.
    // Default ON (negative-false check preserves existing configs without the
    // field): the shared tools confirmation dialog opens first. When the user
    // explicitly disables the toggle, the action fires immediately with no
    // popup. Centralizes the dialog-vs-direct decision in the container so the
    // Tools panel stays purely presentational.
    _runToolAction(title, descriptor, onConfirm) {
        if (this.config?.confirm_tool_actions !== false) {
            this._openToolsDialog(title, descriptor, onConfirm);
        }
        else {
            onConfirm();
        }
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
        this._deviceInfoTarget = null;
        this._showDeviceInfo = true;
    }
    showDeviceInfoFor(deviceId, name) {
        this._deviceInfoTarget = { deviceId, name };
        this._showDeviceInfo = true;
    }
    showColorExplainerDialog() {
        this._showColorExplainerDialog = true;
    }
    showLogDrinkDialog(substance) {
        this._logDrinkSubstance = substance;
        this._showLogDrinkDialog = true;
        this._fetchDrinkLowPredictions(substance);
    }
    // Fetch the predicted Low-band timestamp for every granular drink of the
    // substance, in parallel, via the backend predict_low REST endpoint. The
    // backend builds a throwaway what-if dose list (current master history +
    // this drink's dose_strength + drinking_duration) and forecasts the
    // post-dose peak + Low-band ETA — the real coordinator state is never
    // mutated, so closing the popup without pressing a drink has no effect.
    // Results are race-guarded by _predictLowToken so a stale substance switch
    // can't clobber the current dialog.
    async _fetchDrinkLowPredictions(substance) {
        if (!this.hass)
            return;
        const drinks = this._getDrinksOfSubstance(substance);
        const token = ++this._predictLowToken;
        // Reset so a freshly-opened dialog shows "—" placeholders until the
        // predictions resolve, rather than the previous substance's values.
        this._drinkLowPredictions = {};
        await Promise.all(drinks.map(async (d) => {
            if (!d.logButtonEntityId)
                return;
            try {
                const data = await this.hass.callApi('GET', `ax_dose_logger/predict_low?entity_id=${encodeURIComponent(d.logButtonEntityId)}`);
                if (token !== this._predictLowToken)
                    return; // stale
                this._drinkLowPredictions = {
                    ...this._drinkLowPredictions,
                    [d.logButtonEntityId]: data?.low_time ?? null,
                };
            }
            catch (e) {
                console.warn('[ax-dose-logger-card] predict_low fetch failed for', d.logButtonEntityId, e);
            }
        }));
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
    handleChipAction(e, kind, cfg, entity) { this._handleChipAction(e, kind, cfg, entity); }
    formatInteger(value) { return this._formatInteger(value); }
    computeNextDose(entities) { return this._computeNextDose(entities); }
    computeOverTime(entities) { return this._computeOverTime(entities); }
    computeTimeSinceLastDose(entities) { return this._computeTimeSinceLastDose(entities); }
    /** Resolve the Daily (Take Pill) button state for the Button State Matrix.
     *  Delegates to the private resolver so the panel stays presentational. */
    computeDailyButtonState(entities) { return this._computeDailyButtonState(entities); }
    /** Resolve the Drinks (Log Drink) button state for the Button State Matrix. */
    computeDrinksButtonState(entities) { return this._computeDrinksButtonState(entities); }
    bucketByDay(dayCount) { return this._bucketByDay(dayCount); }
    daysSinceReveal(entities) { return this._daysSinceReveal(entities); }
    getDrinksOfSubstance(substance) { return this._getDrinksOfSubstance(substance); }
    /** M2M: enumerate all profiles as dropdown options. Returns
     *  [{ value: uuid, label: name }] sorted by name. Used by the visual editor
     *  + the multi-tracker header switcher. Delegates to the cached
     *  _getProfileNameMap. */
    getProfileOptions() {
        const map = this._getProfileNameMap();
        return Object.entries(map)
            .map(([value, label]) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }
    drinkDaysSinceReveal(avg365EntityId) { return this._drinkDaysSinceReveal(avg365EntityId); }
    logDrink(logButtonEntityId, targetProfile) { this._logDrink(logButtonEntityId, targetProfile); }
    undoDrink(undoButtonEntityId) { this._undoDrink(undoButtonEntityId); }
    resetDrink(resetButtonEntityId) { this._resetDrink(resetButtonEntityId); }
    handleTakePill(entities) { this._handleTakePill(entities); }
    handleUndoDose(entities) { this._handleUndoDose(entities); }
    handleRefill(entities) { this._handleRefill(entities); }
    openToolsDialog(title, descriptor, onConfirm) { this._openToolsDialog(title, descriptor, onConfirm); }
    runToolAction(title, descriptor, onConfirm) { this._runToolAction(title, descriptor, onConfirm); }
    openMoreInfo(entityId) { this._openMoreInfo(entityId); }
    handleSafeBoxAction(e, kind, cfg, entity) { this._handleSafeBoxAction(e, kind, cfg, entity); }
    getPillsLeftBoxEntity(entities) { return this._getPillsLeftBoxEntity(entities); }
    handlePillsLeftBoxAction(e, kind, cfg, entity, fallback) { this._handlePillsLeftBoxAction(e, kind, cfg, entity, fallback); }
    // ── Drinks panel public wrappers ──
    getInBodyBoxEntity(entities) { return this._getInBodyBoxEntity(entities); }
    handleInBodyBoxAction(e, kind, cfg, entity) { this._handleInBodyBoxAction(e, kind, cfg, entity); }
    getDisruptionBoxEntity(entities) { return this._getDisruptionBoxEntity(entities); }
    handleDisruptionBoxAction(e, kind, cfg, entity, fallback) { this._handleDisruptionBoxAction(e, kind, cfg, entity, fallback); }
    getDrinkChipEntities() { return this._getDrinkChipEntities(); }
    handleDrinkChipAction(e, kind, cfg, entity) { this._handleDrinkChipAction(e, kind, cfg, entity); }
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
        // If leaving the Daily / Drinks pane while a "Logged" ACK flash is still
        // playing, cancel it now. Pane navigation destroys the panel DOM (render
        // is conditional on _activePane), so the CSS animation is gone; without
        // this cancel, the surviving _dailyAckActive/_drinksAckActive flag would
        // remount a fresh .ack-flash div on return and replay the animation.
        // See plans/ack-navigate-away-replay-fix-plan.md.
        if (this._activePane === 'daily')
            this._cancelDailyAck();
        else if (this._activePane === 'drinks')
            this._cancelDrinksAck();
        this._activePane = paneId;
        // Default the graphs carousel to the Amount in Body line graph when the
        // user navigates to the graphs pane, provided the Amount in Body toggle is
        // on (show_amount_in_body !== false) and the device actually has a usable
        // amount-in-body state (entity exists + state is not 0/unknown/unavailable).
        // This mirrors the exact slide-gating the panel applies in render(), so the
        // default landing slide always points at a slide that will actually render.
        // Resetting on every graphs-pane entry keeps the Amount in Body graph the
        // default landing view even after the user carousels away and back; manual
        // prev/next navigation still works within a session (it is reset only on a
        // pane switch, not on a re-render).
        if (paneId === 'graphs' && this.config && this.hass) {
            const entities = this._resolveEntities();
            const amountState = this._getState(entities.amountInBody);
            const hasAmountInBody = !!entities.amountInBody &&
                amountState !== '0' &&
                amountState !== 'unknown' &&
                amountState !== 'unavailable';
            this._activeGraph = (this.config.show_amount_in_body !== false && hasAmountInBody) ? 1 : 0;
        }
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
    _navigateToDevice(deviceId) {
        const target = deviceId ?? this._effectiveDeviceId();
        if (!target)
            return;
        window.history.pushState(null, '', `/config/devices/device/${target}`);
        window.dispatchEvent(new CustomEvent('location-changed'));
    }
    _renderDeviceInfoDialog(entities) {
        const targetName = this._deviceInfoTarget?.name ?? this._getMedName(entities);
        const targetDeviceId = this._deviceInfoTarget?.deviceId;
        const close = () => { this._showDeviceInfo = false; this._deviceInfoTarget = null; };
        return b `
      <ha-dialog
        open
        width="medium"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">${targetName}</div>
        <div class="dialog-body dialog-body--center">
          <button class="dialog-btn" @click=${delayedAction(() => { this._navigateToDevice(targetDeviceId); close(); })}>
            <ha-ripple></ha-ripple>
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>${localize(this._lang, 'dialog.device_info.button')}</span>
          </button>
          ${this.config?.show_color_indicator_explainer !== false
            ? b `<button class="dialog-btn" aria-label=${localize(this._lang, 'dialog.device_info.color_indicators_aria')} @click=${delayedAction(() => { this.showColorExplainerDialog(); close(); })}>
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:palette-outline"></ha-icon>
                <span>${localize(this._lang, 'dialog.device_info.color_indicators')}</span>
              </button>`
            : A}
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
          <button class="dialog-btn" @click=${delayedAction(() => this._handleRefill(entities))}>
            <ha-ripple></ha-ripple>
            ${localize(this._lang, 'dialog.refill.confirm')}
          </button>
        </div>
      </ha-dialog>
    `;
    }
    // Log Drink popup (Master Tracker Drinks panel). Phase 2 multi-tracker flow:
    //   1. Drink grid — tap a drink to log it. The active profile is the one-tap
    //      default for any drink the active profile is allowed to log. N=1 cards
    //      NEVER show a sub-list (one-tap, always the sole profile). A shared
    //      drink the active profile is NOT allowed to log (but another
    //      configured tracker is) switches to the profile sub-list (step 2).
    //   2. Profile sub-list — "Who is logging this?" — shows the configured
    //      trackers ∩ the drink's allowed_profiles (view scope = logging scope)
    //      as name buttons; tap one to log_drink with that profile's UUID. Back
    //      returns to the drink grid.
    // Logging calls _logDrink() which uses the ax_dose_logger.log_drink service
    // (not button.press — the stateless button raises for shared drinks).
    _renderLogDrinkDialog() {
        const substance = this._logDrinkSubstance;
        if (!substance)
            return A;
        const drinks = this._getDrinksOfSubstance(substance);
        // Phase 2: the active tracker is the one-tap default for any drink the
        // active profile is allowed to log. N=1 cards never show a sub-list
        // (one-tap, always the sole profile). N>1 cards show a profile sub-list
        // for shared drinks, restricted to the card's configured trackers (view
        // scope = logging scope), NOT the drink's full allowed_profiles.
        const trackers = this._resolveTrackers();
        const activeProfileId = this._activeTracker()?.profileId ?? '';
        const singleTracker = trackers.length <= 1;
        const close = () => {
            this._showLogDrinkDialog = false;
            this._logDrinkSubstance = null;
            this._drinkLowPredictions = {};
            this._predictLowToken++; // invalidate any in-flight fetch
            this._logDrinkProfileTarget = null; // reset the profile sub-step
        };
        // Format the predicted Low-band wall-clock time as HH:MM (24-hour, no
        // date, no seconds) — matches the Stats panel's Low - Timestamp format.
        // "Low: —" when the prediction is null (the drink would not lift body-mass
        // above the Low band, so there is no predicted descent — a "safe" signal).
        // While the fetch is in flight (no key yet), show "Low: …" as a loading
        // placeholder so the user knows a prediction is coming.
        const formatLow = (entityId) => {
            if (!entityId)
                return localize(this._lang, 'dialog.log_drink.predicted_low_dash');
            const iso = this._drinkLowPredictions[entityId];
            if (iso === undefined) {
                return `${localize(this._lang, 'dialog.log_drink.predicted_low')}: …`;
            }
            if (iso === null) {
                return localize(this._lang, 'dialog.log_drink.predicted_low_dash');
            }
            const dt = new Date(iso);
            if (isNaN(dt.getTime())) {
                return localize(this._lang, 'dialog.log_drink.predicted_low_dash');
            }
            const hhmm = dt.toLocaleTimeString(this._lang, { hour: '2-digit', minute: '2-digit', hour12: false });
            return `${localize(this._lang, 'dialog.log_drink.predicted_low')}: ${hhmm}`;
        };
        // ── Step 2: profile sub-list for a shared drink ──
        // Rendered when _logDrinkProfileTarget is set (the user tapped a shared
        // drink). Shows the configured trackers (view scope = logging scope) as
        // name buttons + a Back button to return to the drink grid. The sub-list is
        // restricted to _resolvedTrackers, NOT the drink's full allowed_profiles —
        // a profile not on this card cannot be logged from this card. The active
        // profile is NOT specially marked (it's just one option in the list); the
        // user explicitly chose to log for a different profile by reaching step 2.
        const target = this._logDrinkProfileTarget;
        if (target) {
            // Intersect the drink's allowed_profiles with the card's configured
            // tracker profile IDs (logging scope = view scope). Falls back to the
            // drink's allowed_profiles when not in multi-tracker mode (single-device
            // cards still support the legacy picker for shared drinks).
            const allowedSet = new Set(target.allowedProfiles);
            const subListProfiles = singleTracker
                ? target.allowedProfiles
                : trackers
                    .map(t => t.profileId)
                    .filter(pid => allowedSet.has(pid));
            return b `
        <ha-dialog
          open
          width="small"
          @closed=${close}
        >
          <div slot="header" class="dialog-header">${target.drinkName}</div>
          <div class="dialog-body">
            <div class="tools-dialog-descriptor">${localize(this._lang, 'dialog.log_drink.select_profile')}</div>
            <div class="log-drink-grid">
              ${subListProfiles.map((pid) => b `
                <button
                  class="dialog-btn log-drink-btn"
                  @click=${delayedAction(() => this._logDrink(target.logButtonEntityId, pid))}
                >
                  <ha-ripple></ha-ripple>
                  <ha-icon icon="mdi:account"></ha-icon>
                  <span class="log-drink-name">${this._profileDisplayName(pid)}</span>
                </button>
              `)}
            </div>
          </div>
          <div class="custom-action-bar">
            <button class="dialog-btn dialog-btn--muted" @click=${() => { this._logDrinkProfileTarget = null; }}>
              ${localize(this._lang, 'dialog.log_drink.back')}
            </button>
            <button class="dialog-btn dialog-btn--muted" @click=${close}>
              ${localize(this._lang, 'dialog.cancel')}
            </button>
          </div>
        </ha-dialog>
      `;
        }
        // ── Step 1: drink grid ──
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
                ${drinks.map((d) => {
                // Decide single-tap vs. profile-picker (Phase 2):
                //   - N=1 (single tracker or single-device) → NEVER show a
                //     sub-list. One-tap log to the sole/active profile.
                //   - The active profile is in the drink's allowed_profiles
                //     → one-tap log to the active profile (the common case).
                //   - Otherwise (a shared drink the active profile is NOT
                //     allowed to log, but another configured tracker is) →
                //     switch to the profile sub-list (step 2), restricted to
                //     _resolvedTrackers ∩ the drink's allowed_profiles.
                //   - allowedProfiles length ≤ 1 → one-tap (backend
                //     convenience default / inventory only for zero-profile).
                const ap = d.allowedProfiles ?? [];
                const activeCanLog = activeProfileId !== '' && ap.includes(activeProfileId);
                const isShared = !singleTracker && ap.length >= 2 && !activeCanLog;
                return b `
                    <button
                      class="dialog-btn log-drink-btn"
                      ?disabled=${!d.logButtonEntityId}
                      @click=${delayedAction(() => {
                    if (!d.logButtonEntityId)
                        return;
                    if (isShared) {
                        // Show the profile sub-list for this shared drink.
                        this._logDrinkProfileTarget = {
                            drinkName: d.name,
                            logButtonEntityId: d.logButtonEntityId,
                            allowedProfiles: d.allowedProfiles,
                        };
                    }
                    else {
                        // One-tap log: active profile (multi-tracker) or
                        // backend default (single/zero-profile). The active
                        // profile is applied inside _logDrink when no explicit
                        // targetProfile is passed.
                        this._logDrink(d.logButtonEntityId);
                    }
                })}
                    >
                      <ha-ripple ?disabled=${!d.logButtonEntityId}></ha-ripple>
                      <ha-icon icon=${substance === 'caffeine' ? 'mdi:coffee' : 'mdi:glass-wine'}></ha-icon>
                      <span class="log-drink-name">${d.name}</span>
                      <span class="log-drink-low">${formatLow(d.logButtonEntityId)}</span>
                    </button>
                  `;
            })}
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
        const extras = this._overrideDialogExtras;
        // Build the placeholder map: always includes `time` (used by the
        // pill-count lockout dialog). For 24h limit dialogs, also includes
        // current/limit/next/projected/unit so the body text can show the
        // specific numbers (e.g. "600 / 700 mg — next dose 200 mg → 800 mg").
        const placeholders = { time: dlg.timeLabel };
        if (extras) {
            placeholders.current = extras.current;
            placeholders.limit = extras.limit;
            placeholders.next = extras.next;
            placeholders.projected = extras.projected;
            placeholders.unit = extras.unit;
        }
        const closeDialog = () => { this._overrideDialog = null; this._overrideDialogExtras = null; };
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${closeDialog}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'dialog.warning')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${localize(this._lang, dlg.bodyKey, placeholders)}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${closeDialog}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${delayedAction(() => {
            if (this.hass && dlg.entities.takeButton) {
                this.hass.callService('button', 'press', {
                    entity_id: dlg.entities.takeButton,
                });
                // Limit-reached override confirm also counts as a
                // successful dose log → trigger the ACK flash.
                this._triggerDailyAck();
            }
            closeDialog();
        })}>
            <ha-ripple></ha-ripple>
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
    // Resolve the entity to display in the top (Safe to Take / Amount in Body)
    // box. Priority (mirrors _getPillsLeftBoxEntity — built-in mode-swap wins
    // over an arbitrary entity swap so the two overrides are mutually
    // unambiguous):
    //   1. safe_to_take_show_amount_in_body === true → amountInBody sensor
    //      (the toggle is a first-class built-in swap; wins over a configured
    //      safe_to_take_entity). Falls back to pillsSafeToTake when amountInBody
    //      is structurally absent (e.g. a device without a PK model) so the box
    //      is never empty — distinct from a state-quality dynamic default, which
    //      we reject (the panel's displayIsUnknown branch shows N/A when the
    //      sensor exists but reads unknown, which is expected for an opt-in).
    //   2. safe_to_take_entity configured → the user's chosen entity.
    //   3. default → the auto-resolved pills_safe_to_take sensor.
    // The Take Pill button's LIMIT REACHED logic is decoupled and always uses
    // the real pillsSafeToTake sensor (see isLimitReached in daily-panel.ts),
    // so swapping the box display is purely cosmetic.
    _getSafeBoxEntity(entities) {
        if (this.config?.safe_to_take_show_amount_in_body === true) {
            return entities.amountInBody || entities.pillsSafeToTake;
        }
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
    // ── Custom chips (Daily panel) ─────────────────────────
    // Fire the configured tap/hold/double-tap action for a Daily-panel custom
    // chip.  Mirrors _handleSafeBoxAction: custom ActionConfig → handleAction;
    // no tap config → more-info on the chip entity (user-confirmed default, same
    // as the Safe to Take box).  hold/double_tap with no config are no-ops.
    // Separate method (not a refactor of _handleSafeBoxAction) to avoid any
    // regression risk on the working Safe to Take path.
    _handleChipAction(_e, action, config, chipEntity) {
        if (!this.hass)
            return;
        const actionKey = `${action}_action`;
        const actionConfig = config[actionKey];
        if (actionConfig) {
            handleAction(this, this.hass, config, action);
        }
        else if (action === 'tap' && chipEntity) {
            // No custom tap action → default to more-info on the chip entity.
            this._openMoreInfo(chipEntity);
        }
        // hold/double_tap with no config → no-op.
    }
    // Resolve the entity to display in the Pills Left box. Priority:
    //   1. pills_left_show_days_left === true → backend days_left sensor
    //      (the toggle is a first-class built-in swap; wins over a configured
    //      pills_left_entity so the two overrides are mutually unambiguous).
    //   2. pills_left_entity configured (and differs from the default sensor) →
    //      the user's chosen entity (arbitrary HA entity).
    //   3. default → the auto-resolved pills_left number entity.
    // Unlike the Safe to Take box, no safety-critical logic reads the real
    // pills_left entity (the Stats "Pills Left" row was removed in the
    // de-duplication pass; the Refill dialog reads entities.addRefill, a
    // separate entity), so swapping is purely cosmetic.
    _getPillsLeftBoxEntity(entities) {
        if (this.config?.pills_left_show_days_left === true)
            return entities.daysLeft;
        return this.config?.pills_left_entity || entities.pillsLeft;
    }
    // Fire the configured tap/hold/double-tap action for the Pills Left box.
    // When the requested action has a user-configured ActionConfig, delegate to
    // handleAction (standard HA action dispatch). When no tap_action is
    // configured, run the fallback (the Refill dialog for the default/days-left/
    // swapped modes — retained across all display modes because "Refill dialog"
    // can't be expressed in the ui_action dropdown); if no fallback applies, fall
    // back to more-info on the display entity. hold/double_tap with no config are
    // no-ops.
    _handlePillsLeftBoxAction(_e, action, config, displayEntity, fallback) {
        if (!this.hass)
            return;
        const actionKey = `${action}_action`;
        const actionConfig = config[actionKey];
        if (actionConfig) {
            handleAction(this, this.hass, config, action);
        }
        else if (action === 'tap' && fallback) {
            // No custom tap action → card-internal fallback (Refill dialog).
            fallback();
        }
        else if (action === 'tap' && displayEntity) {
            this._openMoreInfo(displayEntity);
        }
        // hold/double_tap with no config and no fallback → no-op.
    }
    // ── Drinks panel In Body box ─────────────────────────
    // Resolve the entity to display in the Drinks panel In Body box. Mirrors
    // _getSafeBoxEntity: the configured in_body_entity wins; otherwise the
    // auto-resolved amountInBody sensor. No safety-critical logic reads the
    // In Body sensor (the Take Pill button's LIMIT REACHED logic is medicine-
    // only), so swapping is purely cosmetic.
    _getInBodyBoxEntity(entities) {
        return this.config?.in_body_entity || entities.amountInBody;
    }
    // Fire the configured tap/hold/double-tap action for the In Body box.
    // Mirrors _handleSafeBoxAction: custom ActionConfig → handleAction; no tap
    // config → more-info on the display entity (the Drinks panel default).
    _handleInBodyBoxAction(_e, action, config, displayEntity) {
        if (!this.hass)
            return;
        const actionKey = `${action}_action`;
        const actionConfig = config[actionKey];
        if (actionConfig) {
            handleAction(this, this.hass, config, action);
        }
        else if (action === 'tap' && displayEntity) {
            this._openMoreInfo(displayEntity);
        }
        // hold/double_tap with no config and no fallback → no-op.
    }
    // ── Drinks panel Disruption box ─────────────────────────
    // Resolve the entity to display in the Drinks panel Disruption box.
    // Priority (mirrors _getPillsLeftBoxEntity — built-in mode swap wins over
    // an arbitrary entity swap so the two overrides are mutually unambiguous):
    //   1. disruption_mode === 'low_timestamp' → estimatedLowTime sensor
    //      (Low - Timestamp, HH:MM display).
    //   2. disruption_mode === 'low_hours_until' → lowHoursUntil sensor
    //      (Low - Hours Until, X h display).
    //   3. disruption_entity configured → the user's chosen entity.
    //   4. default (disruption / unset) → the auto-resolved sleepDisruption sensor.
    _getDisruptionBoxEntity(entities) {
        if (this.config?.disruption_mode === 'low_timestamp')
            return entities.estimatedLowTime;
        if (this.config?.disruption_mode === 'low_hours_until')
            return entities.lowHoursUntil;
        return this.config?.disruption_entity || entities.sleepDisruption;
    }
    // Fire the configured tap/hold/double-tap action for the Disruption box.
    // Mirrors _handlePillsLeftBoxAction: custom ActionConfig → handleAction; no
    // tap config → the card-internal fallback (the Sleep Disruption popup when
    // mode='disruption' + substance exists; otherwise more-info on the display
    // entity, matching the Low-modes' default). hold/double_tap with no config
    // are no-ops.
    _handleDisruptionBoxAction(_e, action, config, displayEntity, fallback) {
        if (!this.hass)
            return;
        const actionKey = `${action}_action`;
        const actionConfig = config[actionKey];
        if (actionConfig) {
            handleAction(this, this.hass, config, action);
        }
        else if (action === 'tap' && fallback) {
            fallback();
        }
        else if (action === 'tap' && displayEntity) {
            this._openMoreInfo(displayEntity);
        }
        // hold/double_tap with no config and no fallback → no-op.
    }
    // ── Drinks panel custom chips ─────────────────────────
    // Fire the configured tap/hold/double-tap action for a Drinks-panel custom
    // chip.  Mirrors _handleChipAction (which mirrors _handleSafeBoxAction):
    // custom ActionConfig → handleAction; no tap config → more-info on the chip
    // entity.  hold/double_tap with no config are no-ops.  Separate method (not
    // a refactor of _handleChipAction) to keep the two panels' action paths
    // independent (mirrors the _handleInBodyBoxAction / _handleDisruptionBoxAction
    // separation from _handleSafeBoxAction / _handlePillsLeftBoxAction).
    _handleDrinkChipAction(_e, action, config, chipEntity) {
        if (!this.hass)
            return;
        const actionKey = `${action}_action`;
        const actionConfig = config[actionKey];
        if (actionConfig) {
            handleAction(this, this.hass, config, action);
        }
        else if (action === 'tap' && chipEntity) {
            // No custom tap action → default to more-info on the chip entity.
            this._openMoreInfo(chipEntity);
        }
        // hold/double_tap with no config → no-op.
    }
    // Enumerate configured Drinks-panel custom chips (drink_chip_1..4 + icon/
    // label + 3 ui_action overrides).  Parallel to _getChipEntities but reads
    // the drink_chip_* config namespace so the Daily and Drinks panels' chip
    // configs stay fully independent.
    _getDrinkChipEntities() {
        if (!this.config)
            return [];
        const chips = [];
        for (const key of ['drink_chip_1', 'drink_chip_2', 'drink_chip_3', 'drink_chip_4']) {
            const val = this.config[key];
            if (val) {
                const labelKey = `${key}_label`;
                const iconKey = `${key}_icon`;
                const showIconKey = `${key}_show_icon`;
                const tapKey = `${key}_tap_action`;
                const holdKey = `${key}_hold_action`;
                const dblKey = `${key}_double_tap_action`;
                chips.push({
                    entityId: val,
                    label: this.config[labelKey],
                    icon: this.config[iconKey],
                    showIcon: this.config[showIconKey] === true,
                    tapAction: this.config[tapKey],
                    holdAction: this.config[holdKey],
                    doubleTapAction: this.config[dblKey],
                });
            }
        }
        return chips;
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
        // _effectiveDeviceId() resolves the active medicine's device in
        // multi-medicine mode (config.device_id is empty there) — without this,
        // the Graphs dose-history stream would silently never fetch.
        const deviceId = this._effectiveDeviceId();
        if (!this.hass || !deviceId)
            return;
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
        // Live summary — show ALL three Sleep Disruption-family values at the
        // top of the dialog so the user can see them at a glance regardless of
        // which disruption_mode the box is in:
        //   1. Sleep Disruption (band: None/Low/Moderate/High)
        //   2. Low - Timestamp (HH:MM, 24-hour)
        //   3. Low - Hours Until (numeric, no unit suffix)
        // Mirrors the Log Drink popup pattern (reads resolved state at render
        // time; the card re-renders on every hass state change via shouldUpdate
        // + _relevantStateChanged, and the backend pushes on every
        // dose/undo/reset + 1-min decay tick, so the values stay fresh with no
        // extra fetch/polling).  Formatting mirrors the Stats panel rows.
        const entities = this._resolveEntities();
        const dash = localize(this._lang, 'dialog.sleep_disruption.not_applicable');
        let disruptionDisplay = dash;
        const rawDisruption = this._getState(entities.sleepDisruption);
        if (rawDisruption && rawDisruption !== 'unknown' && rawDisruption !== 'unavailable') {
            disruptionDisplay = rawDisruption.charAt(0).toUpperCase() + rawDisruption.slice(1);
        }
        let lowTimestampDisplay = dash;
        const rawLowTs = this._getState(entities.estimatedLowTime);
        if (rawLowTs && rawLowTs !== 'unknown' && rawLowTs !== 'unavailable' && rawLowTs !== 'None') {
            const dt = new Date(rawLowTs);
            if (!isNaN(dt.getTime())) {
                lowTimestampDisplay = dt.toLocaleTimeString(this._lang, { hour: '2-digit', minute: '2-digit', hour12: false });
            }
        }
        let lowHoursDisplay = dash;
        const rawLowHours = this._getState(entities.lowHoursUntil);
        if (rawLowHours && rawLowHours !== 'unknown' && rawLowHours !== 'unavailable' && rawLowHours !== 'None') {
            const num = parseFloat(rawLowHours);
            if (!isNaN(num)) {
                lowHoursDisplay = String(num);
            }
        }
        return b `
      <ha-dialog
        open
        width="medium"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">
          <ha-icon icon="mdi:sleep"></ha-icon>
          ${localize(this._lang, 'dialog.sleep_disruption.title')}
        </div>
        <div class="dialog-body">
          <div class="disruption-summary">
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${localize(this._lang, 'dialog.sleep_disruption.disruption_label')}</span>
              <span class="disruption-summary-value">${disruptionDisplay}</span>
            </div>
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${localize(this._lang, 'dialog.sleep_disruption.low_timestamp_label')}</span>
              <span class="disruption-summary-value">${lowTimestampDisplay}</span>
            </div>
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${localize(this._lang, 'dialog.sleep_disruption.low_hours_until_label')}</span>
              <span class="disruption-summary-value">${lowHoursDisplay}</span>
            </div>
          </div>
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
    // Medical Color Indicators explainer popup. ha-dialog + ha-markdown, mirroring
    // the Sleep Disruption popup pattern. Reached via a button in the device-info
    // dialog (when show_color_indicator_explainer is not false). Content is the
    // indicator-color table + the Color Scheme interference note — the same facts
    // documented in the README "⚠️ Color Scheme and Indicator Conflicts"
    // subsection, surfaced in-card for discoverability.
    _renderColorExplainerDialog() {
        const close = () => { this._showColorExplainerDialog = false; };
        return b `
     <ha-dialog
       open
       width="medium"
       @closed=${close}
     >
       <div slot="header" class="dialog-header">
         <ha-icon icon="mdi:palette-outline"></ha-icon>
         ${localize(this._lang, 'dialog.color_indicators.title')}
       </div>
       <div class="dialog-body">
         <ha-markdown .content=${localize(this._lang, 'dialog.color_indicators.explainer')}></ha-markdown>
       </div>
       <div class="custom-action-bar">
         <button class="dialog-btn" @click=${close}>
           <ha-icon icon="mdi:close"></ha-icon>
           <span>${localize(this._lang, 'dialog.color_indicators.close')}</span>
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
          <button class="dialog-btn" @click=${delayedAction(onConfirm)}>
            <ha-ripple></ha-ripple>
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
                  @click=${delayedAction(() => {
            if (this.hass) {
                this.hass.callService('ax_dose_logger', 'set_metric', {
                    entity_id: dlg.entityId,
                    value: dlg.newValue,
                    override: true,
                });
            }
            this._trackingOverrideDialog = null;
        })}>
            <ha-ripple></ha-ripple>
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
    // ── Pre-Render Auto-Fallback ───────────────
    /**
     * Lit calls willUpdate() BEFORE render(), so reactive property mutations
     * here are safe and reflected in the same render pass. This is the correct
     * place for the auto-fallback logic that was previously mutating
     * this._activePane inside render() — Lit's docs explicitly say "Do not
     * update reactive properties in render()."
     *
     * Auto-fallback rules:
     *  - tracking pane with no metrics → daily (metrics removed in options flow)
     *  - master-tracker pane on a medicine device → daily (device switched)
     *  - medicine pane on a master tracker → drinks (device switched)
     * Granular drink devices render a placeholder (handled in render() before
     * this logic matters) so they're skipped here.
     */
    willUpdate(changedProps) {
        if (!this.config || !this.hass)
            return;
        // One-shot legacy device_id → medicine_devices migration (needs hass to
        // distinguish a medicine device from a legacy Drink Tracker device).
        // Runs before _resolveEntities() so the very first render already uses
        // the migrated config.
        this._migrateLegacyDeviceId();
        if (!(changedProps.has('_activePane') || changedProps.has('config') || changedProps.has('hass')))
            return;
        const entities = this._resolveEntities();
        if (entities.deviceType === 'drink')
            return; // granular drink → placeholder, no fallback
        if (this._activePane === 'tracking' && entities.metrics.length === 0) {
            this._activePane = 'daily';
        }
        const isMaster = entities.deviceType === 'drink_master';
        const masterPanes = ['drinks', 'inventory'];
        const medicinePanes = ['daily', 'tracking'];
        if (isMaster && medicinePanes.includes(this._activePane))
            this._activePane = 'drinks';
        if (!isMaster && masterPanes.includes(this._activePane))
            this._activePane = 'daily';
    }
    // ── Main Render ────────────────────────────
    render() {
        if (!this.config || !this.hass) {
            return b `<ha-card><div class="card-content">${localize('en', 'card.loading')}</div></ha-card>`;
        }
        // ── Multi-medicine state machine ──
        // When medicine_devices is populated, the card runs the multi-medicine
        // state machine and ignores device_id. Validation failures (Drink Tracker
        // device selected, dead device) render an error placeholder. A
        // multi-medicine card may legitimately have an empty device_id, so this
        // check runs BEFORE the device_id empty-check below.
        // See plans/medicine-multi-select-plan.md.
        if (this._isMultiMedicineMode()) {
            const medicines = this._resolveMedicines();
            if (this._medicinesError) {
                return this._renderMedicinesError();
            }
            // Medicines resolved → fall through to the main render (entities
            // resolved by _resolveEntities() return the active medicine's bundle).
            // The header medicine switcher is rendered when N>1 (below).
            if (medicines.length === 0 && !this._medicinesError) {
                return this._renderMedicinesError();
            }
        }
        // ── Multi-tracker state machine (Phase 3) ──
        // When drink_tracker_devices is populated (or auto-discovery is active),
        // the card runs the state machine and ignores device_id. Validation
        // failures (non-master entity, mixed substance) render an error placeholder.
        // Zero-config multi-substance discovery renders a "please select" placeholder.
        // A multi-tracker card may legitimately have an empty device_id, so these
        // checks run BEFORE the device_id empty-check below.
        if (this._isMultiTrackerMode() || this._autoDiscoveryActive()) {
            const trackers = this._resolveTrackers();
            // Validation error (non-master entity or mixed substance).
            if (this._trackersError) {
                return this._renderTrackersError();
            }
            // Zero-config auto-discovery found multiple substances → placeholder.
            if (trackers.length === 0 && this._autoDiscoveryIsMultiSubstance()) {
                return this._renderTrackersPlaceholder();
            }
            // No master trackers found at all (zero-config, empty household).
            if (trackers.length === 0 && !this._effectiveDeviceId()) {
                return this._renderTrackersPlaceholder();
            }
            // Trackers resolved → fall through to the main render (entities resolved
            // by _resolveEntities() return the active tracker's bundle). The header
            // profile switcher is rendered when N>1 (added to the main render below).
        }
        // Graceful fallback when the card is first added and no device is selected
        // (single-device mode). Multi-tracker / multi-medicine modes bypassed
        // this above.
        if (!this._effectiveDeviceId() && !this._isMultiTrackerMode() && !this._isMultiMedicineMode()) {
            return b `
        <ha-card>
          <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
            <ha-icon icon="mdi:cog" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
            <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${localize(this._lang, 'card.placeholder_title')}</div>
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
        <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text === true ? '0px' : '-2px'}; --pill-font-weight-boost: ${this.config?.bold_text === true ? '1.5' : '1'};">
          <div class="card-content">
            <div class="caffeine-placeholder">
              <ha-icon icon=${entities.substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee'}></ha-icon>
              <span>${substanceLabel}</span>
            </div>
          </div>
        </ha-card>
      `;
        }
        // Auto-fallback now handled in willUpdate() (mutating @state in render()
        // violates Lit's contract). The device-type / metrics guards there ensure
        // this._activePane always points at a valid pane for the current device
        // before render() runs.
        // Unified card title — shown at the top of .card-content on every pane
        // for both card types, so the title is consistent across all panels:
        //   - Drink Master (N>=1): [ Substance ]  -  [ ProfileName (chevron N>1) ]
        //     The substance button opens the device-info dialog; the profile button
        //     opens the profile-switcher popup when N>1, or the device-info dialog
        //     when N=1 (keeps the row visually consistent so single-user cards still
        //     show "Caffeine - Adam" rather than a bare substance label). The '-' is
        //     a non-interactive divider.
        //   - Medicine (default): a single centered button showing
        //     "MedName - Strength" (e.g. "Ritalin - 10 mg") that opens device-info.
        //     This supersedes the old per-Daily-pane .med-name div — the title now
        //     appears on Graphs, Stats, Tools, and Tracking too, matching the Drink
        //     Master card's consistent title across all panes.
        let cardTitle = A;
        if (entities.deviceType === 'drink_master') {
            const substanceLabel = entities.substance === 'alcohol'
                ? localize(this._lang, 'drinks.alcohol')
                : localize(this._lang, 'drinks.caffeine');
            const trackers = this._resolveTrackers();
            const profileName = this._activeTrackerName() || localize(this._lang, 'drinks.default_profile');
            const multi = trackers.length > 1;
            cardTitle = b `
        <div class="card-title-row">
          <button class="card-title-btn"
            role="button" tabindex="0"
            aria-label=${substanceLabel}
            @click=${delayedAction(() => this.showDeviceInfo())}
            @keydown=${(ev) => this.onKeyActivate(ev, () => this.showDeviceInfo())}
          ><ha-ripple></ha-ripple>${substanceLabel}</button>
          <span class="card-title-divider" aria-hidden="true">-</span>
          <button class="card-title-btn${multi ? ' is-selector' : ''}"
            role="button" tabindex="0"
            aria-label=${profileName}
            @click=${delayedAction(() => multi
                ? (this._showProfileSwitcher = true)
                : this.showDeviceInfo())}
            @keydown=${(ev) => this.onKeyActivate(ev, () => multi
                ? (this._showProfileSwitcher = true)
                : this.showDeviceInfo())}
          ><ha-ripple></ha-ripple><span class="card-title-name">${profileName}</span>${multi
                ? b `<ha-icon icon="mdi:chevron-down" class="card-title-chevron"></ha-icon>`
                : A}</button>
        </div>
      `;
        }
        else {
            // Medicine card — title button (MedName - Strength). In multi-medicine
            // mode with N>1 the title becomes a switcher chip (chevron + tap opens
            // the medicine switcher popup), mirroring the drinks profile switcher.
            // N=1 (or single-device mode) keeps the plain title (device info on
            // tap). See plans/medicine-multi-select-plan.md.
            const multiMed = this._isMultiMedicineMode() && this._resolveMedicines().length > 1;
            const medName = multiMed ? this._activeMedicineName() : this._getMedName(entities);
            cardTitle = b `
        <div class="card-title-row">
          <button class="card-title-btn${multiMed ? ' is-selector' : ''}"
            role="button" tabindex="0"
            aria-label=${medName}
            @click=${delayedAction(() => multiMed
                ? (this._showMedicineSwitcher = true)
                : this.showDeviceInfo())}
            @keydown=${(ev) => this.onKeyActivate(ev, () => multiMed
                ? (this._showMedicineSwitcher = true)
                : this.showDeviceInfo())}
          ><ha-ripple></ha-ripple><span class="card-title-name">${medName}</span>${multiMed
                ? b `<ha-icon icon="mdi:chevron-down" class="card-title-chevron"></ha-icon>`
                : A}</button>
        </div>
      `;
        }
        return b `
      <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text === true ? '0px' : '-2px'}; --pill-font-weight-boost: ${this.config?.bold_text === true ? '1.5' : '1'};">
        <div class="card-content">
          ${cardTitle}
          ${this._activePane === 'daily' ? b `<ax-dose-daily-panel .controller=${this} .entities=${entities} .hass=${this.hass} .tick=${this._tick} .buttonState=${this._computeDailyButtonState(entities)} .ackActive=${this._dailyAckActive} .ackCount=${this._dailyAckCount}></ax-dose-daily-panel>` : A}
          ${this._activePane === 'graphs' ? b `<ax-dose-graphs-panel .controller=${this} .entities=${entities} .hass=${this.hass} .amountHistory=${this._amountHistory} .doseHistory=${this._doseHistory} .activeGraph=${this._activeGraph} .activeTimeframe=${this._activeTimeframe} .activeBarTimeframe=${this._activeBarTimeframe} .activeEffectivenessTimeframe=${this._activeEffectivenessTimeframe} .activeEffectivenessView=${this._activeEffectivenessView} .effectivenessHistory=${this._effectivenessHistory} .effectivenessVisible=${this._effectivenessVisible}></ax-dose-graphs-panel>` : A}
          ${this._activePane === 'stats' ? b `<ax-dose-stats-panel .controller=${this} .entities=${entities} .hass=${this.hass} .tick=${this._tick}></ax-dose-stats-panel>` : A}
          ${this._activePane === 'drinks' ? b `<ax-dose-drinks-panel .controller=${this} .entities=${entities} .hass=${this.hass} .tick=${this._tick} .buttonState=${this._computeDrinksButtonState(entities)} .ackActive=${this._drinksAckActive} .ackCount=${this._drinksAckCount}></ax-dose-drinks-panel>` : A}
          ${this._activePane === 'inventory' ? b `<ax-dose-inventory-panel .controller=${this} .entities=${entities} .hass=${this.hass} .tick=${this._tick}></ax-dose-inventory-panel>` : A}
          ${this._activePane === 'tools' ? b `<ax-dose-tools-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-tools-panel>` : A}
          ${this._activePane === 'tracking' ? b `<ax-dose-tracking-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-tracking-panel>` : A}
        </div>
        ${this.config?.hide_nav_bar !== true ? this._renderPaneSelector(entities) : A}
        ${this._showProfileSwitcher ? this._renderProfileSwitcher() : A}
        ${this._showMedicineSwitcher ? this._renderMedicineSwitcher() : A}
        ${this._showDeviceInfo ? this._renderDeviceInfoDialog(entities) : A}
        ${this._showRefillDialog ? this._renderRefillDialog(entities) : A}
        ${this._showLogDrinkDialog ? this._renderLogDrinkDialog() : A}
        ${this._showSleepDisruptionDialog ? this._renderSleepDisruptionDialog() : A}
        ${this._showColorExplainerDialog ? this._renderColorExplainerDialog() : A}
        ${this._toolsDialog ? this._renderToolsDialog() : A}
        ${this._overrideDialog ? this._renderOverrideDialog() : A}
        ${this._trackingOverrideDialog ? this._renderTrackingOverrideDialog() : A}
      </ha-card>
    `;
    }
    // ── Lifecycle ──────────────────────────────
    connectedCallback() {
        super.connectedCallback();
        this._connected = true; // N3: guard timer callbacks from detached mutation
        // Reset to defaults on every connection. With ll-rebuild removed (#16),
        // the element is no longer destroyed/recreated on pane switch, so @state
        // survives naturally. The only time connectedCallback fires is on a
        // genuine view entry (navigate to the dashboard) or initial load — both
        // should start on the daily pane. Lit auto-renders on the @state
        // mutations below, so no manual requestUpdate() is needed (#17).
        // Apply configured default pane, validated against the 7 valid pane IDs.
        // Invalid/unset falls back to 'daily'. The render-time auto-fallback
        // (see render()) handles device-type mismatches (e.g. 'drinks' on a
        // medicine device bounces to 'daily'), so no extra validation here.
        const validPanes = ['daily', 'graphs', 'stats', 'drinks', 'inventory', 'tools', 'tracking'];
        const configuredView = this.config?.default_view;
        this._activePane = (configuredView && validPanes.includes(configuredView))
            ? configuredView
            : 'daily';
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
        this._deviceInfoTarget = null;
        this._showRefillDialog = false;
        this._refillAmount = '';
        this._refillTarget = null;
        this._showLogDrinkDialog = false;
        this._logDrinkSubstance = null;
        this._showSleepDisruptionDialog = false;
        this._sleepDisruptionSubstance = null;
        this._showColorExplainerDialog = false;
        this._toolsDialog = null;
        this._overrideDialog = null;
        this._overrideDialogExtras = null;
        // Clear pending tracking flags so stale entries from a prior session
        // (set_value calls that never got confirmed by HA before disconnect)
        // don't suppress the override dialog on the next tracking change.
        this._pendingTracking.clear();
        // Start a 30s tick so time-relative panes (daily/stats) refresh their
        // "Xh XXm" countdowns. Previously the whole card re-rendered on every
        // system-wide state change; with shouldUpdate gating, this timer keeps
        // the countdowns live without that cost.
        this._startTickTimer();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._connected = false; // N3: guard timer callbacks from detached mutation
        this._stopTickTimer();
        // Invalidate any in-flight fetch so it can't write state to a detached
        // element. Bumping the token makes every pending _fetchAmountHistory /
        // _fetchDoseHistory result discard itself after its `await` resolves.
        this._amountFetchToken++;
        this._doseFetchToken++;
        this._effectivenessFetchToken++;
        // Cancel any pending debounced graphs re-fetch so it doesn't fire after
        // the card is detached (the token bumps above would discard its result
        // anyway, but cancelling the timer avoids a needless detached fetch).
        if (this._graphsRefetchTimer !== null) {
            window.clearTimeout(this._graphsRefetchTimer);
            this._graphsRefetchTimer = null;
        }
        // Cancel any pending ACK intro state-freeze timers so they can't flip the
        // frozen state (and request a re-render) on a detached element.
        if (this._dailyFreezeTimer !== undefined) {
            window.clearTimeout(this._dailyFreezeTimer);
            this._dailyFreezeTimer = undefined;
        }
        if (this._drinksFreezeTimer !== undefined) {
            window.clearTimeout(this._drinksFreezeTimer);
            this._drinksFreezeTimer = undefined;
        }
        // Cancel any pending ACK fade timers so they can't flip the ACK flag (and
        // request a re-render) on a detached element. Hardening that falls out of
        // the rapid-click counter work — the ACK timers were previously left to
        // fire harmlessly on a detached element; now they are cancelled for
        // cleanliness alongside the freeze timers.
        if (this._dailyAckTimer !== undefined) {
            window.clearTimeout(this._dailyAckTimer);
            this._dailyAckTimer = undefined;
        }
        if (this._drinksAckTimer !== undefined) {
            window.clearTimeout(this._drinksAckTimer);
            this._drinksAckTimer = undefined;
        }
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
            '_deviceInfoTarget',
            '_showRefillDialog',
            '_refillAmount',
            '_refillTarget',
            '_showLogDrinkDialog',
            '_logDrinkSubstance',
            // Predict-Low popup: the fetch resolves asynchronously after the dialog
            // is open (showLogDrinkDialog already triggered the initial render). The
            // resolved predictions live in _drinkLowPredictions; without these in the
            // whitelist, shouldUpdate returns false on the async mutation and the
            // popup stays on "Low: …" until the next unrelated re-render (~20s).
            // (_predictLowToken is NOT here — it's a plain race-guard field, not
            // @state(), so it has no rendering impact and shouldn't trigger shouldUpdate.)
            '_drinkLowPredictions',
            '_showSleepDisruptionDialog',
            '_sleepDisruptionSubstance',
            '_showColorExplainerDialog',
            '_toolsDialog',
            '_overrideDialog',
            '_trackingOverrideDialog',
            // Profile switcher + multi-tracker state machine. Without these three
            // keys in the whitelist, shouldUpdate returns false on the @state
            // mutation (no hass change, no other whitelisted prop) and the dialog
            // open/close + profile selection is deferred until the next whitelisted
            // event (the 30s _tick timer), matching the reported ~40s delay.
            // _showProfileSwitcher gates the popup open/close; _activeTrackerIndex
            // gates the profile switch re-render; _logDrinkProfileTarget gates the
            // Log Drink popup profile sub-step.
            '_showProfileSwitcher',
            '_activeTrackerIndex',
            '_logDrinkProfileTarget',
            // Medicine switcher + multi-medicine state machine. Same failure mode as
            // the profile switcher above: without these keys, shouldUpdate returns
            // false on the @state mutation (no hass change, no other whitelisted
            // prop) and the MedName ▾ popup open/close + medicine switch is deferred
            // until the next whitelisted event (the 30s _tick timer), matching the
            // reported ~40s delay. _showMedicineSwitcher gates the popup open/close;
            // _activeMedicineIndex gates the medicine switch re-render;
            // _medicinesError gates the error placeholder render.
            '_showMedicineSwitcher',
            '_activeMedicineIndex',
            '_medicinesError',
            // ACK flash state — the fade-timer expiry sets _dailyAckActive = false
            // and _dailyAckCount = 0, then calls requestUpdate(). Without these in
            // the whitelist, shouldUpdate returns false (no hass change, no other
            // whitelisted prop), the .ack-flash div is never removed from the DOM,
            // and a rapid re-press with the same ackCount (1) reuses the stale
            // keyed() instance — the CSS animation does not restart and the flash
            // is invisible. Same for the drinks panel and the frozen-state cleanup.
            '_dailyAckActive',
            '_dailyAckCount',
            '_drinksAckActive',
            '_drinksAckCount',
            '_dailyFrozenState',
            '_drinksFrozenState',
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
        // Include configured Drinks-panel custom chips (parallel to the Daily
        // chips above; they may belong to other devices and only render on the
        // drinks pane, but keeping them always watched mirrors the Daily pattern).
        for (const chip of this._getDrinkChipEntities()) {
            if (chip.entityId)
                watchedIds.push(chip.entityId);
        }
        // The Inventory pane renders granular-drink entities (stock, add_stock,
        // avg sensors) that belong to different devices than the Master Tracker.
        // Those entities are NOT in the master's ResolvedEntities, so without
        // including them here a refill (which changes number.<drink>_inventory)
        // would not trigger a re-render until the 30s tick timer fires. Only
        // include them when the inventory pane is actually active to avoid
        // needless re-renders on other panes where these entities aren't shown.
        if (this._activePane === 'inventory' && entities.substance) {
            for (const d of this._getDrinksOfSubstance(entities.substance)) {
                if (d.stockEntityId)
                    watchedIds.push(d.stockEntityId);
                if (d.addStockEntityId)
                    watchedIds.push(d.addStockEntityId);
                if (d.avg7EntityId)
                    watchedIds.push(d.avg7EntityId);
                if (d.avg365EntityId)
                    watchedIds.push(d.avg365EntityId);
                if (d.daysLeftEntityId)
                    watchedIds.push(d.daysLeftEntityId);
            }
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
                // navigate away and back. Debounced so rapid successive state changes
                // (e.g. take-pill + immediate state propagation) coalesce into one fetch
                // instead of 3 fetches per change — 2 of which hit the recorder DB via
                // the history/period endpoint. The per-fetch race-guard tokens discard
                // stale results from superseded fetches. The dose-history fetch
                // (ax_dose_logger/history/ custom endpoint) is in-memory, but it's
                // bundled with the DB-backed fetches for simplicity.
                // Note: this branch does NOT fire on the _tick timer (shouldUpdate
                // excludes _tick for the graphs pane), so there is no periodic polling.
                if (this._graphsRefetchTimer !== null) {
                    window.clearTimeout(this._graphsRefetchTimer);
                }
                this._graphsRefetchTimer = window.setTimeout(() => {
                    this._graphsRefetchTimer = null;
                    if (!this._connected)
                        return; // N3: detached guard
                    // Re-resolve entities inside the timeout in case the device changed
                    // during the debounce window (unlikely but defense-in-depth).
                    const e = this._resolveEntities();
                    this._fetchDoseHistory(e);
                    this._fetchAmountHistory(e);
                    if (e.metrics.length) {
                        this._fetchEffectivenessHistory(e);
                    }
                }, AxDoseLoggerCard.GRAPHS_REFETCH_DEBOUNCE_MS);
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
        // Install the grid-alignment CSS observer here (only when the user opens
        // the visual editor), not in connectedCallback (which fired on every
        // dashboard load for every card instance and never disconnected the
        // observer → memory leak + needless document-wide DOM scanning). The
        // observer auto-cleans when the editor dialog closes.
        installEditorGridAlignment();
        return buildEditorForm();
    }
    static getStubConfig() {
        return {
            medicine_devices: [],
            show_amount_in_body: true,
        };
    }
}
AxDoseLoggerCard.GRAPHS_REFETCH_DEBOUNCE_MS = 500;
// ── Styles ─────────────────────────────────
AxDoseLoggerCard.styles = i$5 `
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
  `;
__decorate([
    n$1({ attribute: false })
], AxDoseLoggerCard.prototype, "hass", void 0);
__decorate([
    n$1({ attribute: false })
], AxDoseLoggerCard.prototype, "config", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_activePane", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_activeGraph", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_amountHistory", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_doseHistory", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_showDeviceInfo", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_showRefillDialog", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_refillAmount", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_refillTarget", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_deviceInfoTarget", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_showLogDrinkDialog", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_logDrinkSubstance", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_drinkLowPredictions", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_logDrinkProfileTarget", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_showSleepDisruptionDialog", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_sleepDisruptionSubstance", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_showColorExplainerDialog", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_dailyAckActive", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_drinksAckActive", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_dailyAckCount", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_drinksAckCount", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_dailyFrozenState", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_drinksFrozenState", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_activeTimeframe", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_activeBarTimeframe", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_activeEffectivenessTimeframe", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_activeEffectivenessView", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_effectivenessHistory", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_effectivenessVisible", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_toolsDialog", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_overrideDialog", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_trackingOverrideDialog", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_tick", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_activeTrackerIndex", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_trackersError", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_showProfileSwitcher", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_activeMedicineIndex", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_medicinesError", void 0);
__decorate([
    r$2()
], AxDoseLoggerCard.prototype, "_showMedicineSwitcher", void 0);
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
