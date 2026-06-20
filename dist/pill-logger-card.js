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
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

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
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

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

// Lightweight localization helper for the Pill Logger card.
// Currently English-only; adding a new language is just adding
// another key to the `translations` object.
const translations = {
    en: {
        // ── Card-level ──
        'card.loading': 'Loading...',
        'card.placeholder_title': 'Pill Logger Card',
        'card.placeholder_subtitle': 'Please select a device in the visual editor to begin.',
        // ── Pane tabs ──
        'pane.daily': 'Daily',
        'pane.graphs': 'Graphs',
        'pane.stats': 'Stats',
        'pane.tools': 'Tools',
        // ── Daily pane ──
        'daily.take_pill': 'Take Pill',
        'daily.limit_reached': 'LIMIT REACHED',
        'daily.last': 'Last',
        'daily.next': 'Next',
        'daily.over': 'over',
        'daily.safe_to_take': 'Safe to take',
        'daily.pills_left': 'Pills left',
        'daily.na': 'N/A',
        // ── Graphs pane ──
        'graphs.bar_title': '{days}-day taken tracker',
        'graphs.line_title': 'Amount in Body',
        'graphs.empty_bar': 'No dose data yet',
        'graphs.loading_history': 'Loading history...',
        'graphs.timeframe_12h': '12H',
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
        // ── Dialogs ──
        'dialog.warning': 'Warning',
        'dialog.cancel': 'Cancel',
        'dialog.confirm': 'Confirm',
        'dialog.refill.title': 'Refill Medication',
        'dialog.refill.placeholder': 'Enter number of pills',
        'dialog.refill.confirm': 'Refill',
        'dialog.override.body': 'Pill limit does not reset until: {expiry}. Override?',
        'dialog.override.confirm': 'Override',
        'dialog.device_info.button': 'To Device info',
        'dialog.device_info.aria': 'View device info',
        'dialog.refill.aria': 'Refill medication',
        // ── Config form labels ──
        'config.device_id': 'Device',
        'config.big_text': 'Big Text',
        'config.color_scheme': 'Color Scheme',
        'config.name': 'Name Override',
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
        'config.show_amount_in_body': 'Amount in Body Graph',
        'config.show_day_avg_boxes': 'Day Avg Boxes',
        'config.show_adherence_boxes': 'Adherence Boxes (If available)',
        'config.stats_3_columns': '3-Column Stats',
        'config.hide_nav_bar': 'Hide Navigation Bar',
        // ── Config form helpers ──
        'config.helper.device_id': 'Select your Pill Logger medication device.',
        'config.helper.big_text': 'When off, all text is 2px smaller. Daily pane shrinks further for compact view.',
        'config.helper.color_scheme': 'Sets the accent color for buttons, icons, and highlights across the card.',
        'config.helper.name': 'Custom name for this medication. Leave empty to use the device name.',
        'config.helper.chip_label': "Custom display name for this chip. Leave empty to use the entity's friendly name.",
        'config.helper.chip': 'Entity from the selected device to display as a chip on the Daily pane.',
        'config.helper.show_amount_in_body': 'Show the Amount in Body line graph as a second slide in the Graphs pane.',
        'config.helper.show_day_avg_boxes': 'Show the 7/14/30-day and yearly average boxes beneath the bar graph.',
        'config.helper.show_adherence_boxes': 'Show the 7/14/30/365-day adherence percentage boxes beneath the bar graph. Only applies when the device has adherence sensors.',
        'config.helper.stats_3_columns': 'Display statistics in 3 columns instead of 2.',
        'config.helper.hide_nav_bar': 'Hide the bottom Daily/Graphs/Stats/Tools navigation bar. Use for dashboards that only need the Daily pane.',
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
        'setconfig.error.device_required': 'A device is required for the Pill Logger card.',
        // ── aria-labels ──
        'aria.take_pill_safe': 'Take pill',
        'aria.take_pill_limit': 'Limit reached, override available',
        'aria.timeframe_12h': '12 hours',
        'aria.timeframe_48h': '48 hours',
        'aria.timeframe_7d': '7 days',
        'aria.timeframe_14d': '14 days',
        'aria.timeframe_30d': '30 days',
        'aria.timeframe_60d': '60 days',
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
// PillLoggerCard — Main Card Class
// ──────────────────────────────────────────────
class PillLoggerCard extends i {
    constructor() {
        super(...arguments);
        this._activePane = 'daily';
        this._activeGraph = 0;
        this._amountHistory = [];
        this._doseHistory = [];
        this._showDeviceInfo = false;
        this._showRefillDialog = false;
        this._refillAmount = '';
        this._activeTimeframe = '48h';
        this._activeBarTimeframe = '14d';
        this._toolsDialog = null;
        // Pill-limit override warning dialog (#6): replaces the synchronous native
        // confirm() box. When non-null, _renderOverrideDialog() shows an ha-dialog
        // asking the user to confirm taking a pill past the safe limit.
        this._overrideDialog = null;
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
            return { medicationName: 'Medication' };
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
        const result = { medicationName: 'Medication' };
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
                else if (entityId.endsWith('_avg_daily_doses_7_days'))
                    result.avg7Days = entityId;
                else if (entityId.endsWith('_avg_daily_doses_14_days'))
                    result.avg14Days = entityId;
                else if (entityId.endsWith('_avg_daily_doses_30_days'))
                    result.avg30Days = entityId;
                else if (entityId.endsWith('_avg_daily_doses_yearly'))
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
            }
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
        if (!entityId || !this.hass)
            return 'unavailable';
        const state = this.hass.states[entityId];
        return state ? state.state : 'unavailable';
    }
    _getAttr(entityId, attr) {
        if (!entityId || !attr || !this.hass)
            return undefined;
        const state = this.hass.states[entityId];
        return state?.attributes?.[attr];
    }
    _getStrengthUnit(entities) {
        const unit = this._getAttr(entities.strength, 'strength_unit');
        return (typeof unit === 'string' && unit) ? unit : 'mg';
    }
    _formatInteger(value) {
        const num = parseFloat(value);
        if (isNaN(num))
            return value;
        return Math.round(num).toString();
    }
    // ── Color Scheme ───────────────────────────
    _getColorOverrides() {
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
        const scheme = this.config?.color_scheme || 'default';
        const colors = schemes[scheme];
        if (!colors || !colors.primary)
            return '';
        return `--primary-color: ${colors.primary}; --rgb-primary-color: ${colors.rgb};`;
    }
    // ── Dose History ───────────────────────────
    _toLocalDateKey(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    _getBarTimeframeDays() {
        switch (this._activeBarTimeframe) {
            case '30d': return 30;
            case '60d': return 60;
            default: return 14;
        }
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
            const diffMs = next.getTime() - now.getTime();
            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            if (hours > 0)
                return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
        catch (e) {
            console.warn('[pill-logger-card] _computeNextDose failed:', e);
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
        const state = this._getState(entities.nextDose);
        if (state === 'unavailable' || state === 'unknown' || !state)
            return null;
        try {
            const next = new Date(state);
            const now = new Date();
            if (isNaN(next.getTime()))
                return null;
            if (next > now)
                return null; // not overdue yet
            const diffMs = now.getTime() - next.getTime();
            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            if (hours > 0)
                return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
        catch (e) {
            console.warn('[pill-logger-card] _computeOverTime failed:', e);
            return null;
        }
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
                console.warn('[pill-logger-card] _computeWindowExpiry failed:', e);
                // fall through to next_dose fallback
            }
        }
        return this._computeNextDose(entities);
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
            const diffMs = now.getTime() - last.getTime();
            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            if (hours > 0)
                return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
        catch (e) {
            console.warn('[pill-logger-card] _computeTimeSinceLastDose failed:', e);
            return 'Never';
        }
    }
    // ── Computed Values: Timeframe ─────────────
    _getTimeframeHours() {
        switch (this._activeTimeframe) {
            case '12h': return 12;
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
            this._overrideDialog = {
                windowExpiry: this._computeWindowExpiry(entities),
                entities,
            };
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
        if (!this.hass || !entities.addRefill)
            return;
        const value = parseFloat(this._refillAmount);
        if (isNaN(value) || value <= 0)
            return;
        this.hass.callService('number', 'set_value', {
            entity_id: entities.addRefill,
            value: value,
        });
        this._showRefillDialog = false;
        this._refillAmount = '';
    }
    // ── Tools Actions ──────────────────────────
    _openToolsDialog(title, descriptor, onConfirm) {
        this._toolsDialog = { title, descriptor, onConfirm };
    }
    _closeToolsDialog() {
        this._toolsDialog = null;
    }
    _handleAdherenceReset(entities) {
        if (!this.hass || !entities.adherenceResetButton)
            return;
        this._openToolsDialog(localize(this._lang, 'tools.reset_adherence'), localize(this._lang, 'tools.desc.reset_adherence'), () => {
            this.hass.callService('button', 'press', { entity_id: entities.adherenceResetButton });
        });
    }
    _handleAdherenceCover(entities) {
        if (!this.hass || !entities.adherenceCoverButton)
            return;
        this._openToolsDialog(localize(this._lang, 'tools.mark_adherence_taken'), localize(this._lang, 'tools.desc.mark_adherence_taken'), () => {
            this.hass.callService('button', 'press', { entity_id: entities.adherenceCoverButton });
        });
    }
    _handleResetHistory(entities) {
        if (!this.hass || !entities.resetButton)
            return;
        this._openToolsDialog(localize(this._lang, 'tools.reset_history'), localize(this._lang, 'tools.desc.reset_history'), () => {
            this.hass.callService('button', 'press', { entity_id: entities.resetButton });
        });
    }
    _handleUndoDoseConfirm(entities) {
        if (!this.hass || !entities.undoButton)
            return;
        this._openToolsDialog(localize(this._lang, 'tools.undo_dose'), localize(this._lang, 'tools.desc.undo_dose'), () => {
            this.hass.callService('button', 'press', { entity_id: entities.undoButton });
        });
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
    // Keyboard activation helper for clickable <div> elements that use
    // role="button". Fires the handler on Enter or Space (standard button
    // behavior) so they're accessible to keyboard and screen-reader users.
    _onKeyActivate(e, handler) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handler();
        }
    }
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
        return b `
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._showRefillDialog = false; this._refillAmount = ''; }}
      >
        <div slot="header" class="dialog-header">${localize(this._lang, 'dialog.refill.title')}</div>
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
          <button class="dialog-btn dialog-btn--muted"
                  @click=${() => { this._showRefillDialog = false; this._refillAmount = ''; }}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${() => this._handleRefill(entities)}>
            ${localize(this._lang, 'dialog.refill.confirm')}
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
            ${localize(this._lang, 'dialog.override.body', { expiry: dlg.windowExpiry })}
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
    _renderPane1(entities) {
        const safeState = this._getState(entities.pillsSafeToTake);
        const safeCount = parseInt(safeState, 10);
        const isLimitReached = !isNaN(safeCount) && safeCount <= 0;
        const isUnknown = safeState === 'unknown' || safeState === 'unavailable';
        const timeSince = this._computeTimeSinceLastDose(entities);
        const nextDose = this._computeNextDose(entities);
        const overTime = this._computeOverTime(entities);
        const pillsLeft = this._getState(entities.pillsLeft);
        const chipEntities = this._getChipEntities();
        return b `
      <div class="pane pane-daily">
        <div class="med-name"
             role="button" tabindex="0"
             aria-label=${localize(this._lang, 'dialog.device_info.aria')}
             @click=${() => this._showDeviceInfo = true}
             @keydown=${(e) => this._onKeyActivate(e, () => this._showDeviceInfo = true)}
        >${this._getMedName(entities)}</div>

        <div class="daily-main">
          <button
            class="take-pill-btn ${isLimitReached ? 'danger' : 'safe'}"
            aria-label=${isLimitReached
            ? localize(this._lang, 'aria.take_pill_limit')
            : localize(this._lang, 'aria.take_pill_safe')}
            @click=${() => this._handleTakePill(entities)}
          >
            <ha-icon icon="${isLimitReached ? 'mdi:alert' : 'mdi:pill'}"></ha-icon>
            <span class="take-label">${isLimitReached ? localize(this._lang, 'daily.limit_reached') : localize(this._lang, 'daily.take_pill')}</span>
            <span class="take-sub">${isLimitReached
            ? b `${localize(this._lang, 'daily.last')}: ${timeSince} \u2022 ${localize(this._lang, 'daily.next')}: ${nextDose}`
            : (overTime
                ? b `${localize(this._lang, 'daily.over')}: ${overTime}`
                : b `${localize(this._lang, 'daily.last')}: ${timeSince}`)}</span>
          </button>

          <div class="stats-column">
            <div class="stat-pill">
              <ha-icon icon="mdi:shield-check"></ha-icon>
              <span class="stat-label">${localize(this._lang, 'daily.safe_to_take')}</span>
              <span class="stat-value">${isUnknown ? localize(this._lang, 'daily.na') : this._formatInteger(safeState)}</span>
            </div>
            <div class="stat-pill ${entities.addRefill ? 'clickable' : ''}"
                 role="button"
                 tabindex="0"
                 aria-label=${localize(this._lang, 'dialog.refill.aria')}
                 @click=${entities.addRefill ? () => { this._showRefillDialog = true; this._refillAmount = ''; } : null}
                 @keydown=${entities.addRefill ? (e) => this._onKeyActivate(e, () => { this._showRefillDialog = true; this._refillAmount = ''; }) : null}>
              <ha-icon icon="mdi:pill"></ha-icon>
              <span class="stat-label">${localize(this._lang, 'daily.pills_left')}</span>
              <span class="stat-value">${pillsLeft === 'unavailable' ? '-' : this._formatInteger(pillsLeft)}</span>
            </div>
          </div>
        </div>

        ${chipEntities.length > 0
            ? b `
              <div class="chips-row">
                ${chipEntities.map((chip) => {
                const chipState = this._getState(chip.entityId);
                const chipName = chip.label
                    || this.hass?.states[chip.entityId]?.attributes?.friendly_name
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
    // ── Pane 2: Graphs ─────────────────────────
    _renderPane2(entities) {
        const dailyBuckets = this._bucketByDay(this._getBarTimeframeDays());
        const hasAmountInBody = entities.amountInBody &&
            this._getState(entities.amountInBody) !== '0' &&
            this._getState(entities.amountInBody) !== 'unknown' &&
            this._getState(entities.amountInBody) !== 'unavailable';
        // Determine available slides
        const slides = ['bar'];
        if (hasAmountInBody && (this.config?.show_amount_in_body !== false)) {
            slides.push('line');
        }
        // Clamp active graph index
        const activeIdx = Math.min(this._activeGraph, slides.length - 1);
        const activeSlide = slides[activeIdx];
        return b `
      <div class="pane pane-graphs">
        ${slides.length > 1 ? b `
          <div class="carousel-nav">
            <button
              class="nav-btn"
              aria-label=${localize(this._lang, 'graphs.aria_prev')}
              @click=${() => this._activeGraph = (activeIdx - 1 + slides.length) % slides.length}
              ?disabled=${slides.length <= 1}
            >
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <span class="nav-title">
              ${activeSlide === 'bar' ? localize(this._lang, 'graphs.bar_title', { days: this._getBarTimeframeDays() }) : localize(this._lang, 'graphs.line_title')}
            </span>
            <button
              class="nav-btn"
              aria-label=${localize(this._lang, 'graphs.aria_next')}
              @click=${() => this._activeGraph = (activeIdx + 1) % slides.length}
              ?disabled=${slides.length <= 1}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        ` : b `
          <div class="carousel-nav">
            <span class="nav-title">${localize(this._lang, 'graphs.bar_title', { days: this._getBarTimeframeDays() })}</span>
          </div>
        `}

        <div class="graph-container">
          ${activeSlide === 'bar'
            ? this._renderBarGraph(dailyBuckets)
            : this._renderLineGraph(entities)}
        </div>

        ${activeSlide === 'bar' ? this._renderAveragesGrid(entities) : A}
      </div>
    `;
    }
    _renderBarGraph(buckets) {
        const maxCount = Math.max(...buckets.map(b => b.count), 1);
        const hasData = buckets.some(b => b.count > 0);
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
        const padTop = 16;
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
          ${[0, 0.25, 0.5, 0.75, 1].map(fraction => {
            const y = padTop + chartH * (1 - fraction);
            return w `
              <line x1="${padLeft}" y1="${y}" x2="${w$1 - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(10px + var(--pill-text-offset, 0px))"
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
            console.warn('[pill-logger-card] amount history fetch failed:', e);
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
            const data = await this.hass.callApi('GET', `pill_logger/history/${deviceId}`);
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
            console.warn('[pill-logger-card] dose history fetch failed:', e);
        }
    }
    _renderTimeframeChips() {
        const timeframes = [
            { id: '12h', labelKey: 'graphs.timeframe_12h', ariaKey: 'aria.timeframe_12h' },
            { id: '48h', labelKey: 'graphs.timeframe_48h', ariaKey: 'aria.timeframe_48h' },
            { id: '7d', labelKey: 'graphs.timeframe_7d', ariaKey: 'aria.timeframe_7d' },
            { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
            { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
        ];
        return timeframes.map(tf => b `
      <button
        class="timeframe-chip ${this._activeTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => this._handleTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
    }
    _renderBarTimeframeChips() {
        const timeframes = [
            { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
            { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
            { id: '60d', labelKey: 'graphs.timeframe_60d', ariaKey: 'aria.timeframe_60d' },
        ];
        return timeframes.map(tf => b `
      <button
        class="timeframe-chip ${this._activeBarTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => this._handleBarTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
    }
    _handleBarTimeframeChange(timeframe) {
        if (timeframe === this._activeBarTimeframe)
            return;
        this._activeBarTimeframe = timeframe;
    }
    _renderLineGraph(entities) {
        const amountInBody = this._getState(entities.amountInBody);
        const history = this._amountHistory;
        const w$1 = 320;
        const h = 180;
        const padLeft = 36;
        const padRight = 8;
        const padTop = 16;
        const padBottom = 28;
        const chartW = w$1 - padLeft - padRight;
        const chartH = h - padTop - padBottom;
        if (history.length === 0) {
            return b `
        <div class="line-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderTimeframeChips()}
          </div>
          <svg viewBox="0 0 ${w$1} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
            <text x="${w$1 / 2}" y="${h / 2}" text-anchor="middle"
                  style="font-size: calc(13px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${localize(this._lang, 'graphs.loading_history')}</text>
          </svg>
        </div>
      `;
        }
        const now = new Date();
        const timeframeHours = this._getTimeframeHours();
        const startTime = new Date(now.getTime() - timeframeHours * 60 * 60 * 1000);
        // Find max value for Y-axis scaling
        const values = history.map(p => p.value);
        const maxAmount = Math.max(...values, 1);
        // Build polyline points from actual history
        const polylinePoints = history.map(p => {
            const t = new Date(p.timestamp);
            const fraction = Math.max(0, Math.min(1, (t.getTime() - startTime.getTime()) / (timeframeHours * 60 * 60 * 1000)));
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
        // Dynamic time labels based on timeframe
        const timeLabels = [];
        const totalHours = this._getTimeframeHours();
        if (totalHours <= 12) {
            // 12H: labels every 3 hours, format "-Xh"
            for (let h = 0; h <= totalHours; h += 3) {
                const fraction = h / totalHours;
                timeLabels.push({ label: `-${totalHours - h}h`, x: padLeft + fraction * chartW });
            }
        }
        else if (totalHours <= 48) {
            // 48H: labels every 6 hours, format "-Xh"
            for (let h = 0; h <= totalHours; h += 6) {
                const fraction = h / totalHours;
                timeLabels.push({ label: `-${totalHours - h}h`, x: padLeft + fraction * chartW });
            }
        }
        else {
            // 7D/14D/30D: labels in days
            const totalDays = totalHours / 24;
            let step;
            if (totalDays <= 7)
                step = 1; // 7D: every 1 day
            else if (totalDays <= 14)
                step = 2; // 14D: every 2 days
            else
                step = 5; // 30D: every 5 days
            for (let d = 0; d <= totalDays; d += step) {
                const fraction = d / totalDays;
                timeLabels.push({ label: `-${Math.round(totalDays - d)}d`, x: padLeft + fraction * chartW });
            }
        }
        return b `
      <div class="line-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${w$1} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
          <!-- Y-axis grid lines and labels -->
          ${[0, 0.25, 0.5, 0.75, 1].map(fraction => {
            const y = padTop + chartH * (1 - fraction);
            return w `
              <line x1="${padLeft}" y1="${y}" x2="${w$1 - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(10px + var(--pill-text-offset, 0px))"
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
            <text x="${padLeft}" y="${currentLabelY}" style="font-size: calc(11px + var(--pill-text-offset, 0px))" fill="var(--primary-color)">
              Current: ${amountInBody} ${this._getStrengthUnit(entities)}
            </text>
          ` : A}

          <!-- X-axis baseline -->
          <line x1="${padLeft}" y1="${h - padBottom}" x2="${w$1 - padRight}" y2="${h - padBottom}"
                stroke="var(--divider-color)" stroke-width="1"/>

          <!-- X-axis time labels -->
          ${timeLabels.map(tl => w `
            <line x1="${tl.x}" y1="${h - padBottom}" x2="${tl.x}" y2="${h - padBottom + 4}"
                  stroke="var(--divider-color)" stroke-width="1"/>
            <text x="${tl.x}" y="${h - 6}" text-anchor="middle"
                  style="font-size: calc(9px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${tl.label}</text>
          `)}
        </svg>
      </div>
    `;
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
    _renderAveragesGrid(entities) {
        const items = [];
        const { hasDaysSensor, daysSince } = this._daysSinceReveal(entities);
        if (this.config?.show_day_avg_boxes !== false) {
            if (entities.avg7Days && (!hasDaysSensor || daysSince >= 7))
                items.push({ label: localize(this._lang, 'averages.avg_7_day'), value: this._getState(entities.avg7Days) });
            if (entities.avg14Days && (!hasDaysSensor || daysSince >= 14))
                items.push({ label: localize(this._lang, 'averages.avg_14_day'), value: this._getState(entities.avg14Days) });
            if (entities.avg30Days && (!hasDaysSensor || daysSince >= 30))
                items.push({ label: localize(this._lang, 'averages.avg_30_day'), value: this._getState(entities.avg30Days) });
            // Year slot doubles as the running elapsed-days average until 365 days pass.
            // The avgYearly sensor already computes min(days_since_start, 365), so its
            // value IS the running average from the first dose until the year mark.
            if (entities.avgYearly && (!hasDaysSensor || daysSince > 0)) {
                const label = (hasDaysSensor && daysSince < 365) ? localize(this._lang, 'averages.avg_running', { days: daysSince }) : localize(this._lang, 'averages.avg_year');
                items.push({ label, value: this._getState(entities.avgYearly) });
            }
        }
        if (this.config?.show_adherence_boxes !== false) {
            if (entities.adherence7Days && (!hasDaysSensor || daysSince >= 7))
                items.push({ label: localize(this._lang, 'averages.adh_7_day'), value: this._getState(entities.adherence7Days) + '%' });
            if (entities.adherence14Days && (!hasDaysSensor || daysSince >= 14))
                items.push({ label: localize(this._lang, 'averages.adh_14_day'), value: this._getState(entities.adherence14Days) + '%' });
            if (entities.adherence30Days && (!hasDaysSensor || daysSince >= 30))
                items.push({ label: localize(this._lang, 'averages.adh_30_day'), value: this._getState(entities.adherence30Days) + '%' });
            // 365d slot doubles as the running elapsed-days adherence until 365 days pass.
            if (entities.adherence365Days && (!hasDaysSensor || daysSince > 0)) {
                const label = (hasDaysSensor && daysSince < 365) ? localize(this._lang, 'averages.adh_running', { days: daysSince }) : localize(this._lang, 'averages.adh_365_day');
                items.push({ label, value: this._getState(entities.adherence365Days) + '%' });
            }
        }
        if (items.length === 0)
            return A;
        return b `
      <div class="averages-grid">
        ${items.map(item => b `
          <div class="avg-cell">
            <span class="avg-label">${item.label}</span>
            <span class="avg-value">${item.value === 'unavailable' ? '-' : item.value}</span>
          </div>
        `)}
      </div>
    `;
    }
    // ── Pane 3: Stats ──────────────────────────
    _renderPane3(entities) {
        const rows = [];
        if (entities.totalDoses)
            rows.push({ label: localize(this._lang, 'stats.total_doses'), value: this._getState(entities.totalDoses), icon: 'mdi:counter' });
        if (entities.daysSinceFirstDose)
            rows.push({ label: localize(this._lang, 'stats.days_since_first_dose'), value: this._getState(entities.daysSinceFirstDose), icon: 'mdi:calendar-start' });
        if (entities.lastDose)
            rows.push({ label: localize(this._lang, 'stats.last_dose'), value: this._computeTimeSinceLastDose(entities), icon: 'mdi:clock-outline' });
        const strengthUnit = this._getStrengthUnit(entities);
        if (entities.strength)
            rows.push({ label: localize(this._lang, 'stats.strength'), value: this._formatInteger(this._getState(entities.strength)) + ' ' + strengthUnit, icon: 'mdi:scale' });
        if (entities.amountInBody)
            rows.push({ label: localize(this._lang, 'stats.amount_in_body'), value: this._getState(entities.amountInBody) + ' ' + strengthUnit, icon: 'mdi:chart-bell-curve' });
        if (entities.steadyState) {
            const ss = this._getState(entities.steadyState);
            const display = (ss === '0.0' || ss === '0') ? localize(this._lang, 'stats.steady_state_reached') : localize(this._lang, 'stats.steady_state_days', { days: ss });
            rows.push({ label: localize(this._lang, 'stats.steady_state'), value: display, icon: 'mdi:chart-timeline-variant' });
        }
        // Avg / Adherence rows mirror the Graph panel's progressive reveal driven
        // by days-since-first-dose. When the sensor is absent, all rows show.
        const { hasDaysSensor: hasDays, daysSince: days } = this._daysSinceReveal(entities);
        if (entities.avg7Days && (!hasDays || days >= 7))
            rows.push({ label: localize(this._lang, 'stats.avg_7_day'), value: this._getState(entities.avg7Days), icon: 'mdi:chart-line' });
        if (entities.avg14Days && (!hasDays || days >= 14))
            rows.push({ label: localize(this._lang, 'stats.avg_14_day'), value: this._getState(entities.avg14Days), icon: 'mdi:chart-line' });
        if (entities.avg30Days && (!hasDays || days >= 30))
            rows.push({ label: localize(this._lang, 'stats.avg_30_day'), value: this._getState(entities.avg30Days), icon: 'mdi:chart-line' });
        // Year slot doubles as the running elapsed-days average until 365 days pass.
        if (entities.avgYearly && (!hasDays || days > 0)) {
            const label = (hasDays && days < 365) ? localize(this._lang, 'stats.avg_running', { days }) : localize(this._lang, 'stats.avg_yearly');
            rows.push({ label, value: this._getState(entities.avgYearly), icon: 'mdi:chart-line' });
        }
        if (entities.adherence7Days && (!hasDays || days >= 7))
            rows.push({ label: localize(this._lang, 'stats.adherence_7_day'), value: this._getState(entities.adherence7Days) + '%', icon: 'mdi:check-decagram' });
        if (entities.adherence14Days && (!hasDays || days >= 14))
            rows.push({ label: localize(this._lang, 'stats.adherence_14_day'), value: this._getState(entities.adherence14Days) + '%', icon: 'mdi:check-decagram' });
        if (entities.adherence30Days && (!hasDays || days >= 30))
            rows.push({ label: localize(this._lang, 'stats.adherence_30_day'), value: this._getState(entities.adherence30Days) + '%', icon: 'mdi:check-decagram' });
        // 365d slot doubles as the running elapsed-days adherence until 365 days pass.
        if (entities.adherence365Days && (!hasDays || days > 0)) {
            const label = (hasDays && days < 365) ? localize(this._lang, 'stats.adherence_running', { days }) : localize(this._lang, 'stats.adherence_365_day');
            rows.push({ label, value: this._getState(entities.adherence365Days) + '%', icon: 'mdi:check-decagram' });
        }
        return b `
      <div class="pane pane-stats">
        <div class="stats-grid ${this.config?.stats_3_columns ? 'three-col' : ''}">
          ${rows.map(row => b `
            <div class="stat-cell">
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
    // ── Pane 4: Tools ──────────────────────────
    _renderPane4(entities) {
        const hasAdhTools = !!(entities.adherenceResetButton || entities.adherenceCoverButton);
        const hasGenTools = !!(entities.resetButton || entities.undoButton);
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
            ${entities.adherenceResetButton ? b `
              <button
                class="tool-btn danger"
                @click=${() => this._handleAdherenceReset(entities)}
              >
                <ha-icon icon="mdi:percent-circle-outline"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_adherence')}</span>
              </button>
            ` : A}
            ${entities.adherenceCoverButton ? b `
              <button
                class="tool-btn"
                @click=${() => this._handleAdherenceCover(entities)}
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
            ${entities.resetButton ? b `
              <button
                class="tool-btn danger"
                @click=${() => this._handleResetHistory(entities)}
              >
                <ha-icon icon="mdi:history"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_history')}</span>
              </button>
            ` : A}
            ${entities.undoButton ? b `
              <button
                class="tool-btn danger"
                @click=${() => this._handleUndoDoseConfirm(entities)}
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
    // ── Pane Selector ──────────────────────────
    _renderPaneSelector() {
        const panes = [
            { id: 'daily', labelKey: 'pane.daily', icon: 'mdi:pill' },
            { id: 'graphs', labelKey: 'pane.graphs', icon: 'mdi:chart-bar' },
            { id: 'stats', labelKey: 'pane.stats', icon: 'mdi:clipboard-list' },
            { id: 'tools', labelKey: 'pane.tools', icon: 'mdi:wrench' },
        ];
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
            <div style="font-size: 13px; color: var(--secondary-text-color);">${localize(this._lang, 'card.placeholder_subtitle')}</div>
          </div>
        </ha-card>
      `;
        }
        const entities = this._resolveEntities();
        return b `
      <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text !== false ? '0px' : '-2px'};">
        <div class="card-content">
          ${this._activePane === 'daily' ? this._renderPane1(entities) : A}
          ${this._activePane === 'graphs' ? this._renderPane2(entities) : A}
          ${this._activePane === 'stats' ? this._renderPane3(entities) : A}
          ${this._activePane === 'tools' ? this._renderPane4(entities) : A}
        </div>
        ${this.config?.hide_nav_bar !== true ? this._renderPaneSelector() : A}
        ${this._showDeviceInfo ? this._renderDeviceInfoDialog(entities) : A}
        ${this._showRefillDialog ? this._renderRefillDialog(entities) : A}
        ${this._toolsDialog ? this._renderToolsDialog() : A}
        ${this._overrideDialog ? this._renderOverrideDialog() : A}
      </ha-card>
    `;
    }
    // ── Lifecycle ──────────────────────────────
    connectedCallback() {
        super.connectedCallback();
        // Reset to defaults on every connection. With ll-rebuild removed (#16),
        // the element is no longer destroyed/recreated on pane switch, so @state
        // survives naturally. The only time connectedCallback fires is on a
        // genuine view entry (navigate to the dashboard) or initial load — both
        // should start on the daily pane. Lit auto-renders on the @state
        // mutations below, so no manual requestUpdate() is needed (#17).
        this._activePane = 'daily';
        this._activeGraph = 0;
        this._activeTimeframe = '48h';
        this._activeBarTimeframe = '14d';
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
            '_showDeviceInfo',
            '_showRefillDialog',
            '_refillAmount',
            '_toolsDialog',
            '_overrideDialog',
        ]) {
            if (changedProps.has(key))
                return true;
        }
        // The 30s tick refreshes time-relative panes (daily/stats). The graphs and
        // tools panes don't depend on wall-clock time, so skip the tick there to
        // avoid needless SVG re-renders.
        if (changedProps.has('_tick') && (this._activePane === 'daily' || this._activePane === 'stats')) {
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
            }
            else if (changedProperties.has('_activeTimeframe')) {
                this._amountHistory = [];
                this._fetchAmountHistory(entities);
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
        return {
            schema: [
                {
                    name: 'device_id',
                    required: true,
                    selector: {
                        device: {
                            filter: { integration: 'pill_logger' },
                        },
                    },
                },
                {
                    name: 'big_text',
                    selector: { boolean: {} },
                },
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
                {
                    type: 'expandable',
                    name: 'chips',
                    title: 'Custom Chips',
                    flatten: true,
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
                {
                    type: 'expandable',
                    name: 'graph_options',
                    title: 'Graph',
                    flatten: true,
                    schema: [
                        {
                            name: 'show_amount_in_body',
                            selector: { boolean: {} },
                        },
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
                {
                    name: 'stats_3_columns',
                    selector: { boolean: {} },
                },
                {
                    name: 'hide_nav_bar',
                    selector: { boolean: {} },
                },
            ],
            computeLabel: (schema, _data, hass) => {
                const lang = hass?.language || 'en';
                return localize(lang, 'config.' + schema.name);
            },
            computeHelper: (schema, _data, hass) => {
                const lang = hass?.language || 'en';
                const name = schema.name;
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
    static getStubConfig() {
        return {
            device_id: '',
            show_amount_in_body: true,
        };
    }
}
// ── Styles ─────────────────────────────────
PillLoggerCard.styles = i$3 `
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
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-family: inherit;
      cursor: pointer;
      transition: color 0.2s, background 0.2s, box-shadow 0.2s;
      border-bottom: 2px solid transparent;
    }

    .pane-btn.tools {
      flex: 0 0 auto;
      min-width: 44px;
      padding: 10px;
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

    /* ── Pane 1: Daily ─────────────────────── */

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
      font-size: calc(14px + var(--pill-text-offset, 0px));
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
      font-size: calc(10px + var(--pill-text-offset, 0px));
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

    /* ── Pane 2: Graphs ─────────────────────── */

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
      width: 32px;
      height: 32px;
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
      font-size: calc(15px + var(--pill-text-offset, 0px));
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
      padding: 2px 6px;
      font-size: 10px;
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
      font-size: calc(11px + var(--pill-text-offset, 0px));
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
      font-size: calc(11px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .avg-value {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
    }

    /* ── Pane 3: Stats ──────────────────────── */

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
      font-size: calc(12px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .stat-cell-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
    }

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
      font-size: 1.25rem;
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
      --mdc-icon-size: 24px;
    }

    .dialog-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dialog-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
    }

    .dialog-btn ha-icon {
      --mdc-icon-size: 20px;
    }

    /* ── Refill Dialog ──────────────────────── */

    .refill-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--divider-color, rgba(0,0,0,0.1));
      border-radius: var(--ha-card-border-radius, 12px);
      font-size: 16px;
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

    /* ── Tools Panel ─────────────────────────── */

    .tools-panel {
      padding: 8px 4px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tools-empty {
      text-align: center;
      color: var(--secondary-text-color, #666);
      font-size: calc(13px + var(--pill-text-offset, 0px));
      padding: 24px 8px;
    }

    .tools-section-header {
      font-size: calc(14px + var(--pill-text-offset, 0px));
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
      padding: 14px 8px;
      border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color, var(--primary-background-color, #fff));
      color: var(--primary-text-color, #222);
      font-size: calc(13px + var(--pill-text-offset, 0px));
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.1s;
    }

    .tool-btn ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-color, #03a9f4);
    }

    .tool-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-color: var(--primary-color, #03a9f4);
    }

    .tool-btn:active {
      transform: scale(0.98);
    }

    .tool-btn.danger:hover {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.06);
      border-color: var(--error-color, #db4437);
    }

    .tools-dialog-descriptor {
      font-size: calc(14px + var(--pill-text-offset, 0px));
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
], PillLoggerCard.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], PillLoggerCard.prototype, "config", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_activePane", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_activeGraph", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_amountHistory", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_doseHistory", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_showDeviceInfo", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_showRefillDialog", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_refillAmount", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_activeTimeframe", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_activeBarTimeframe", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_toolsDialog", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_overrideDialog", void 0);
__decorate([
    r()
], PillLoggerCard.prototype, "_tick", void 0);
// ──────────────────────────────────────────────
// Registrations
// ──────────────────────────────────────────────
customElements.define('pill-logger-card', PillLoggerCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'pill-logger-card',
    name: 'Pill Logger',
    preview: true,
    description: 'A custom card for the Pill Logger integration — track medications, view dose graphs, and monitor statistics.',
    documentationURL: 'https://github.com/adix992/Home-Assistant-Pill-Logger',
});

export { PillLoggerCard };
