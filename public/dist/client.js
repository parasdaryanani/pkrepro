(!globalThis.EventTarget||!globalThis.Event)&&console.error(`
  PartySocket requires a global 'EventTarget' class to be available!
  You can use the 'event-target-shim' package to polyfill this. See https://www.npmjs.com/package/event-target-shim. 
  First, run:
  \`\`\`
  npm install event-target-shim
  \`\`\`
  Then, add this in your code:
  \`\`\`
  import {Event, EventTarget} from 'event-target-shim';
  if(!globalThis.Event) {
    globalThis.Event = Event;
  }
  if(!globalThis.EventTarget) {
    globalThis.EventTarget = EventTarget;
  }
  \`\`\`
  Please file an issue at https://github.com/partykit/partykit if you're still having trouble.
`);var E=class extends Event{message;error;constructor(n,e){super("error",e),this.message=n.message,this.error=n}},T=class extends Event{code;reason;wasClean=!0;constructor(n=1e3,e="",t){super("close",t),this.code=n,this.reason=e}},u={Event,ErrorEvent:E,CloseEvent:T};function b(n,e){if(!n)throw new Error(e)}function a(n){return new n.constructor(n.type,n)}var r={maxReconnectionDelay:1e4,minReconnectionDelay:1e3+Math.random()*4e3,minUptime:5e3,reconnectionDelayGrowFactor:1.3,connectionTimeout:4e3,maxRetries:1/0,maxEnqueuedMessages:1/0,startClosed:!1,debug:!1},_=class o extends EventTarget{_ws;_retryCount=-1;_uptimeTimeout;_connectTimeout;_shouldReconnect=!0;_connectLock=!1;_binaryType="blob";_closeCalled=!1;_messageQueue=[];_url;_protocols;_options;constructor(e,t,s={}){super(),this._url=e,this._protocols=t,this._options=s,this._options.startClosed&&(this._shouldReconnect=!1),this._connect()}static get CONNECTING(){return 0}static get OPEN(){return 1}static get CLOSING(){return 2}static get CLOSED(){return 3}get CONNECTING(){return o.CONNECTING}get OPEN(){return o.OPEN}get CLOSING(){return o.CLOSING}get CLOSED(){return o.CLOSED}get binaryType(){return this._ws?this._ws.binaryType:this._binaryType}set binaryType(e){this._binaryType=e,this._ws&&(this._ws.binaryType=e)}get retryCount(){return Math.max(this._retryCount,0)}get bufferedAmount(){return this._messageQueue.reduce((t,s)=>(typeof s=="string"?t+=s.length:s instanceof Blob?t+=s.size:t+=s.byteLength,t),0)+(this._ws?this._ws.bufferedAmount:0)}get extensions(){return this._ws?this._ws.extensions:""}get protocol(){return this._ws?this._ws.protocol:""}get readyState(){return this._ws?this._ws.readyState:this._options.startClosed?o.CLOSED:o.CONNECTING}get url(){return this._ws?this._ws.url:""}get shouldReconnect(){return this._shouldReconnect}onclose=null;onerror=null;onmessage=null;onopen=null;close(e=1e3,t){if(this._closeCalled=!0,this._shouldReconnect=!1,this._clearTimeouts(),!this._ws){this._debug("close enqueued: no ws instance");return}if(this._ws.readyState===this.CLOSED){this._debug("close: already closed");return}this._ws.close(e,t)}reconnect(e,t){this._shouldReconnect=!0,this._closeCalled=!1,this._retryCount=-1,!this._ws||this._ws.readyState===this.CLOSED?this._connect():(this._disconnect(e,t),this._connect())}send(e){if(this._ws&&this._ws.readyState===this.OPEN)this._debug("send",e),this._ws.send(e);else{let{maxEnqueuedMessages:t=r.maxEnqueuedMessages}=this._options;this._messageQueue.length<t&&(this._debug("enqueue",e),this._messageQueue.push(e))}}_debug(...e){this._options.debug&&console.log.apply(console,["RWS>",...e])}_getNextDelay(){let{reconnectionDelayGrowFactor:e=r.reconnectionDelayGrowFactor,minReconnectionDelay:t=r.minReconnectionDelay,maxReconnectionDelay:s=r.maxReconnectionDelay}=this._options,i=0;return this._retryCount>0&&(i=t*Math.pow(e,this._retryCount-1),i>s&&(i=s)),this._debug("next delay",i),i}_wait(){return new Promise(e=>{setTimeout(e,this._getNextDelay())})}_getNextProtocols(e){if(!e)return Promise.resolve(null);if(typeof e=="string"||Array.isArray(e))return Promise.resolve(e);if(typeof e=="function"){let t=e();if(!t)return Promise.resolve(null);if(typeof t=="string"||Array.isArray(t))return Promise.resolve(t);if(t.then)return t}throw Error("Invalid protocols")}_getNextUrl(e){if(typeof e=="string")return Promise.resolve(e);if(typeof e=="function"){let t=e();if(typeof t=="string")return Promise.resolve(t);if(t.then)return t}throw Error("Invalid URL")}_connect(){if(this._connectLock||!this._shouldReconnect)return;this._connectLock=!0;let{maxRetries:e=r.maxRetries,connectionTimeout:t=r.connectionTimeout}=this._options;if(this._retryCount>=e){this._debug("max retries reached",this._retryCount,">=",e);return}this._retryCount++,this._debug("connect",this._retryCount),this._removeListeners(),this._wait().then(()=>Promise.all([this._getNextUrl(this._url),this._getNextProtocols(this._protocols||null)])).then(([s,i])=>{if(this._closeCalled){this._connectLock=!1;return}this._debug("connect",{url:s,protocols:i}),this._ws=i?new WebSocket(s,i):new WebSocket(s),this._ws.binaryType=this._binaryType,this._connectLock=!1,this._addListeners(),this._connectTimeout=setTimeout(()=>this._handleTimeout(),t)}).catch(s=>{this._connectLock=!1,this._handleError(new u.ErrorEvent(Error(s.message),this))})}_handleTimeout(){this._debug("timeout event"),this._handleError(new u.ErrorEvent(Error("TIMEOUT"),this))}_disconnect(e=1e3,t){if(this._clearTimeouts(),!!this._ws){this._removeListeners();try{this._ws.close(e,t),this._handleClose(new u.CloseEvent(e,t,this))}catch{}}}_acceptOpen(){this._debug("accept open"),this._retryCount=0}_handleOpen=e=>{this._debug("open event");let{minUptime:t=r.minUptime}=this._options;clearTimeout(this._connectTimeout),this._uptimeTimeout=setTimeout(()=>this._acceptOpen(),t),b(this._ws,"WebSocket is not defined"),this._ws.binaryType=this._binaryType,this._messageQueue.forEach(s=>this._ws?.send(s)),this._messageQueue=[],this.onopen&&this.onopen(e),this.dispatchEvent(a(e))};_handleMessage=e=>{this._debug("message event"),this.onmessage&&this.onmessage(e),this.dispatchEvent(a(e))};_handleError=e=>{this._debug("error event",e.message),this._disconnect(void 0,e.message==="TIMEOUT"?"timeout":void 0),this.onerror&&this.onerror(e),this._debug("exec error listeners"),this.dispatchEvent(a(e)),this._connect()};_handleClose=e=>{this._debug("close event"),this._clearTimeouts(),this._shouldReconnect&&this._connect(),this.onclose&&this.onclose(e),this.dispatchEvent(a(e))};_removeListeners(){this._ws&&(this._debug("removeListeners"),this._ws.removeEventListener("open",this._handleOpen),this._ws.removeEventListener("close",this._handleClose),this._ws.removeEventListener("message",this._handleMessage),this._ws.removeEventListener("error",this._handleError))}_addListeners(){this._ws&&(this._debug("addListeners"),this._ws.addEventListener("open",this._handleOpen),this._ws.addEventListener("close",this._handleClose),this._ws.addEventListener("message",this._handleMessage),this._ws.addEventListener("error",this._handleError))}_clearTimeouts(){clearTimeout(this._connectTimeout),clearTimeout(this._uptimeTimeout)}};function x(){if(typeof crypto<"u"&&crypto.randomUUID)return crypto.randomUUID();let n=new Date().getTime(),e=typeof performance<"u"&&performance.now&&performance.now()*1e3||0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){let s=Math.random()*16;return n>0?(s=(n+s)%16|0,n=Math.floor(n/16)):(s=(e+s)%16|0,e=Math.floor(e/16)),(t==="x"?s:s&3|8).toString(16)})}var d=class extends _{constructor(n){let{host:e,room:t,party:s,protocol:i,query:p,protocols:y,...w}=n,h=n.id||x(),c=e.replace(/^(http|https|ws|wss):\/\//,""),l=`${i||(c.startsWith("localhost:")||c.startsWith("127.0.0.1:")?"ws":"wss")}://${c}/${s?`parties/${s}`:"party"}/${t}`;p?l+=`?${new URLSearchParams({...p,_pk:h}).toString()}`:l+=`?_pk=${h}`,super(l,y,w),this.partySocketOptions=n,this._pk=h}_pk;get id(){return this._pk}};var f=document.getElementById("app");function m(n){f.appendChild(document.createTextNode(n)),f.appendChild(document.createElement("br"))}var g=new d({host:"pkrepro.parasdaryanani.partykit.dev",room:"queue",id:"web-client"});g.addEventListener("message",n=>{m(`${n.data}`)});g.addEventListener("open",()=>{m("Connected!"),m("Sending a ping every 2 seconds..."),setInterval(()=>{g.send(JSON.stringify({type:"ping",message:"ping from web client"}))},2e3)});
/*! Bundled license information:

partysocket/dist/chunk-54YSQCE5.mjs:
  (*!
   * Reconnecting WebSocket
   * by Pedro Ladaria <pedro.ladaria@gmail.com>
   * https://github.com/pladaria/reconnecting-websocket
   * License MIT
   *)
*/
//# sourceMappingURL=client.js.map
