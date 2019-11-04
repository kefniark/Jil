(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.jil = {}));
}(this, (function (exports) { 'use strict';

  function parseQuery (query) {
    var isId = false;
    var isClass = false;
    var tag = '';
    var id = '';
    var className = '';
    for (var i = 0; i < query.length; i++) {
      var char = query[i];
      if (char === '.') {
        isClass = true;
        isId = false;
        if (className.length > 0) {
          className += ' ';
        }
      } else if (char === '#') {
        isId = true;
        isClass = false;
      } else if (isId) {
        id += char;
      } else if (isClass) {
        className += char;
      } else {
        tag += char;
      }
    }

    return {
      tag: tag || 'div',
      id: id,
      className: className
    };
  }

  function createElement (query, ns) {
    var ref = parseQuery(query);
    var tag = ref.tag;
    var id = ref.id;
    var className = ref.className;
    var element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);

    if (id) {
      element.id = id;
    }

    if (className) {
      if (ns) {
        element.setAttribute('class', className);
      } else {
        element.className = className;
      }
    }

    return element;
  }

  function unmount (parent, child) {
    var parentEl = getEl(parent);
    var childEl = getEl(child);

    if (child === childEl && childEl.__redom_view) {
      // try to look up the view if not provided
      child = childEl.__redom_view;
    }

    if (childEl.parentNode) {
      doUnmount(child, childEl, parentEl);

      parentEl.removeChild(childEl);
    }

    return child;
  }

  function doUnmount (child, childEl, parentEl) {
    var hooks = childEl.__redom_lifecycle;

    if (hooksAreEmpty(hooks)) {
      childEl.__redom_lifecycle = {};
      return;
    }

    var traverse = parentEl;

    if (childEl.__redom_mounted) {
      trigger(childEl, 'onunmount');
    }

    while (traverse) {
      var parentHooks = traverse.__redom_lifecycle || {};

      for (var hook in hooks) {
        if (parentHooks[hook]) {
          parentHooks[hook] -= hooks[hook];
        }
      }

      if (hooksAreEmpty(parentHooks)) {
        traverse.__redom_lifecycle = null;
      }

      traverse = traverse.parentNode;
    }
  }

  function hooksAreEmpty (hooks) {
    if (hooks == null) {
      return true;
    }
    for (var key in hooks) {
      if (hooks[key]) {
        return false;
      }
    }
    return true;
  }

  /* global Node, ShadowRoot */

  var hookNames = ['onmount', 'onremount', 'onunmount'];
  var shadowRootAvailable = typeof window !== 'undefined' && 'ShadowRoot' in window;

  function mount (parent, child, before, replace) {
    var parentEl = getEl(parent);
    var childEl = getEl(child);

    if (child === childEl && childEl.__redom_view) {
      // try to look up the view if not provided
      child = childEl.__redom_view;
    }

    if (child !== childEl) {
      childEl.__redom_view = child;
    }

    var wasMounted = childEl.__redom_mounted;
    var oldParent = childEl.parentNode;

    if (wasMounted && (oldParent !== parentEl)) {
      doUnmount(child, childEl, oldParent);
    }

    if (before != null) {
      if (replace) {
        parentEl.replaceChild(childEl, getEl(before));
      } else {
        parentEl.insertBefore(childEl, getEl(before));
      }
    } else {
      parentEl.appendChild(childEl);
    }

    doMount(child, childEl, parentEl, oldParent);

    return child;
  }

  function trigger (el, eventName) {
    if (eventName === 'onmount' || eventName === 'onremount') {
      el.__redom_mounted = true;
    } else if (eventName === 'onunmount') {
      el.__redom_mounted = false;
    }

    var hooks = el.__redom_lifecycle;

    if (!hooks) {
      return;
    }

    var view = el.__redom_view;
    var hookCount = 0;

    view && view[eventName] && view[eventName]();

    for (var hook in hooks) {
      if (hook) {
        hookCount++;
      }
    }

    if (hookCount) {
      var traverse = el.firstChild;

      while (traverse) {
        var next = traverse.nextSibling;

        trigger(traverse, eventName);

        traverse = next;
      }
    }
  }

  function doMount (child, childEl, parentEl, oldParent) {
    var hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});
    var remount = (parentEl === oldParent);
    var hooksFound = false;

    for (var i = 0, list = hookNames; i < list.length; i += 1) {
      var hookName = list[i];

      if (!remount) { // if already mounted, skip this phase
        if (child !== childEl) { // only Views can have lifecycle events
          if (hookName in child) {
            hooks[hookName] = (hooks[hookName] || 0) + 1;
          }
        }
      }
      if (hooks[hookName]) {
        hooksFound = true;
      }
    }

    if (!hooksFound) {
      childEl.__redom_lifecycle = {};
      return;
    }

    var traverse = parentEl;
    var triggered = false;

    if (remount || (traverse && traverse.__redom_mounted)) {
      trigger(childEl, remount ? 'onremount' : 'onmount');
      triggered = true;
    }

    while (traverse) {
      var parent = traverse.parentNode;
      var parentHooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

      for (var hook in hooks) {
        parentHooks[hook] = (parentHooks[hook] || 0) + hooks[hook];
      }

      if (triggered) {
        break;
      } else {
        if (traverse.nodeType === Node.DOCUMENT_NODE ||
          (shadowRootAvailable && (traverse instanceof ShadowRoot)) ||
          (parent && parent.__redom_mounted)
        ) {
          trigger(traverse, remount ? 'onremount' : 'onmount');
          triggered = true;
        }
        traverse = parent;
      }
    }
  }

  function setStyle (view, arg1, arg2) {
    var el = getEl(view);

    if (typeof arg1 === 'object') {
      for (var key in arg1) {
        setStyleValue(el, key, arg1[key]);
      }
    } else {
      setStyleValue(el, arg1, arg2);
    }
  }

  function setStyleValue (el, key, value) {
    if (value == null) {
      el.style[key] = '';
    } else {
      el.style[key] = value;
    }
  }

  /* global SVGElement */

  var xlinkns = 'http://www.w3.org/1999/xlink';

  function setAttr (view, arg1, arg2) {
    setAttrInternal(view, arg1, arg2);
  }

  function setAttrInternal (view, arg1, arg2, initial) {
    var el = getEl(view);

    var isObj = typeof arg1 === 'object';

    if (isObj) {
      for (var key in arg1) {
        setAttrInternal(el, key, arg1[key], initial);
      }
    } else {
      var isSVG = el instanceof SVGElement;
      var isFunc = typeof arg2 === 'function';

      if (arg1 === 'style' && typeof arg2 === 'object') {
        setStyle(el, arg2);
      } else if (isSVG && isFunc) {
        el[arg1] = arg2;
      } else if (arg1 === 'dataset') {
        setData(el, arg2);
      } else if (!isSVG && (arg1 in el || isFunc) && (arg1 !== 'list')) {
        el[arg1] = arg2;
      } else {
        if (isSVG && (arg1 === 'xlink')) {
          setXlink(el, arg2);
          return;
        }
        if (initial && arg1 === 'class') {
          arg2 = el.className + ' ' + arg2;
        }
        if (arg2 == null) {
          el.removeAttribute(arg1);
        } else {
          el.setAttribute(arg1, arg2);
        }
      }
    }
  }

  function setXlink (el, arg1, arg2) {
    if (typeof arg1 === 'object') {
      for (var key in arg1) {
        setXlink(el, key, arg1[key]);
      }
    } else {
      if (arg2 != null) {
        el.setAttributeNS(xlinkns, arg1, arg2);
      } else {
        el.removeAttributeNS(xlinkns, arg1, arg2);
      }
    }
  }

  function setData (el, arg1, arg2) {
    if (typeof arg1 === 'object') {
      for (var key in arg1) {
        setData(el, key, arg1[key]);
      }
    } else {
      if (arg2 != null) {
        el.dataset[arg1] = arg2;
      } else {
        delete el.dataset[arg1];
      }
    }
  }

  function text (str) {
    return document.createTextNode((str != null) ? str : '');
  }

  function parseArgumentsInternal (element, args, initial) {
    for (var i = 0, list = args; i < list.length; i += 1) {
      var arg = list[i];

      if (arg !== 0 && !arg) {
        continue;
      }

      var type = typeof arg;

      if (type === 'function') {
        arg(element);
      } else if (type === 'string' || type === 'number') {
        element.appendChild(text(arg));
      } else if (isNode(getEl(arg))) {
        mount(element, arg);
      } else if (arg.length) {
        parseArgumentsInternal(element, arg, initial);
      } else if (type === 'object') {
        setAttrInternal(element, arg, null, initial);
      }
    }
  }

  function ensureEl (parent) {
    return typeof parent === 'string' ? html(parent) : getEl(parent);
  }

  function getEl (parent) {
    return (parent.nodeType && parent) || (!parent.el && parent) || getEl(parent.el);
  }

  function isNode (arg) {
    return arg && arg.nodeType;
  }

  var htmlCache = {};

  function html (query) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var element;

    var type = typeof query;

    if (type === 'string') {
      element = memoizeHTML(query).cloneNode(false);
    } else if (isNode(query)) {
      element = query.cloneNode(false);
    } else if (type === 'function') {
      var Query = query;
      element = new (Function.prototype.bind.apply( Query, [ null ].concat( args) ));
    } else {
      throw new Error('At least one argument required');
    }

    parseArgumentsInternal(getEl(element), args, true);

    return element;
  }

  var el = html;

  html.extend = function extendHtml (query) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var clone = memoizeHTML(query);

    return html.bind.apply(html, [ this, clone ].concat( args ));
  };

  function memoizeHTML (query) {
    return htmlCache[query] || (htmlCache[query] = createElement(query));
  }

  function setChildren (parent) {
    var children = [], len = arguments.length - 1;
    while ( len-- > 0 ) children[ len ] = arguments[ len + 1 ];

    var parentEl = getEl(parent);
    var current = traverse(parent, children, parentEl.firstChild);

    while (current) {
      var next = current.nextSibling;

      unmount(parent, current);

      current = next;
    }
  }

  function traverse (parent, children, _current) {
    var current = _current;

    var childEls = new Array(children.length);

    for (var i = 0; i < children.length; i++) {
      childEls[i] = children[i] && getEl(children[i]);
    }

    for (var i$1 = 0; i$1 < children.length; i$1++) {
      var child = children[i$1];

      if (!child) {
        continue;
      }

      var childEl = childEls[i$1];

      if (childEl === current) {
        current = current.nextSibling;
        continue;
      }

      if (isNode(childEl)) {
        var next = current && current.nextSibling;
        var exists = child.__redom_index != null;
        var replace = exists && next === childEls[i$1 + 1];

        mount(parent, child, current, replace);

        if (replace) {
          current = next;
        }

        continue;
      }

      if (child.length != null) {
        current = traverse(parent, child, current);
      }
    }

    return current;
  }

  var ListPool = function ListPool (View, key, initData) {
    this.View = View;
    this.initData = initData;
    this.oldLookup = {};
    this.lookup = {};
    this.oldViews = [];
    this.views = [];

    if (key != null) {
      this.key = typeof key === 'function' ? key : propKey(key);
    }
  };
  ListPool.prototype.update = function update (data, context) {
    var ref = this;
      var View = ref.View;
      var key = ref.key;
      var initData = ref.initData;
    var keySet = key != null;

    var oldLookup = this.lookup;
    var newLookup = {};

    var newViews = new Array(data.length);
    var oldViews = this.views;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var view = (void 0);

      if (keySet) {
        var id = key(item);

        view = oldLookup[id] || new View(initData, item, i, data);
        newLookup[id] = view;
        view.__redom_id = id;
      } else {
        view = oldViews[i] || new View(initData, item, i, data);
      }
      view.update && view.update(item, i, data, context);

      var el = getEl(view.el);

      el.__redom_view = view;
      newViews[i] = view;
    }

    this.oldViews = oldViews;
    this.views = newViews;

    this.oldLookup = oldLookup;
    this.lookup = newLookup;
  };

  function propKey (key) {
    return function (item) {
      return item[key];
    };
  }

  var List = function List (parent, View, key, initData) {
    this.__redom_list = true;
    this.View = View;
    this.initData = initData;
    this.views = [];
    this.pool = new ListPool(View, key, initData);
    this.el = ensureEl(parent);
    this.keySet = key != null;
  };
  List.prototype.update = function update (data, context) {
      if ( data === void 0 ) data = [];

    var ref = this;
      var keySet = ref.keySet;
    var oldViews = this.views;

    this.pool.update(data, context);

    var ref$1 = this.pool;
      var views = ref$1.views;
      var lookup = ref$1.lookup;

    if (keySet) {
      for (var i = 0; i < oldViews.length; i++) {
        var oldView = oldViews[i];
        var id = oldView.__redom_id;

        if (lookup[id] == null) {
          oldView.__redom_index = null;
          unmount(this, oldView);
        }
      }
    }

    for (var i$1 = 0; i$1 < views.length; i$1++) {
      var view = views[i$1];

      view.__redom_index = i$1;
    }

    setChildren(this, views);

    if (keySet) {
      this.lookup = lookup;
    }
    this.views = views;
  };

  List.extend = function extendList (parent, View, key, initData) {
    return List.bind(List, parent, View, key, initData);
  };

  /**
   * Provide polyfill around Date.now()
   */
  const now = typeof Date.now === "function" ? Date.now : new Date().getTime;
  const start = now();
  /**
   * Provide polyfill around performance.now()
   */
  /* istanbul ignore next */
  const perf = () => {
      if (globalThis && globalThis.performance) {
          return globalThis.performance.now();
      }
      else if (globalThis.process) {
          return process.hrtime()[1];
      }
      return now() - start;
  };

  /// Inspired by https://basarat.gitbooks.io/typescript/docs/tips/typed-event.html
  class Event {
      constructor() {
          this.listeners = [];
          this.listenersOncer = [];
      }
      on(listener) {
          this.listeners.push(listener);
          return { dispose: () => this.off(listener) };
      }
      once(listener) {
          this.listenersOncer.push(listener);
      }
      off(listener) {
          const callbackIndex = this.listeners.indexOf(listener);
          if (callbackIndex > -1)
              this.listeners.splice(callbackIndex, 1);
      }
      emit(event) {
          /** Update any general listeners */
          this.listeners.forEach(listener => listener(event));
          /** Clear the `once` queue */
          if (this.listenersOncer.length > 0) {
              const toCall = this.listenersOncer;
              this.listenersOncer = [];
              toCall.forEach(listener => listener(event));
          }
      }
  }

  const url = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  /**
   * Create a `uid` [a-zA-z0-9]
   *
   * @param {Number} len
   * @return {String} uid
   */
  function uid(len = 8) {
      let id = "";
      while (len--) {
          id += url[(Math.random() * 62) | 0];
      }
      return id;
  }

  var LogLevel;
  (function (LogLevel) {
      LogLevel[LogLevel["INFO"] = 0] = "INFO";
      LogLevel[LogLevel["WARN"] = 1] = "WARN";
      LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
      LogLevel[LogLevel["OFF"] = 3] = "OFF";
  })(LogLevel || (LogLevel = {}));

  /**
   * Method used to create a proxy around some data an get event
   *
   * Inspired by `on-change` but simpler (https://github.com/sindresorhus/on-change/)
   *
   * @export
   * @param {*} objToWatch
   * @param {(prop: string, value?: any, previous?: any) => void} onChangeFunction
   * @returns {Proxy}
   */
  function onChange(objToWatch, onChangeFunction) {
      const map = new WeakMap();
      const getRootPath = (val) => {
          const path = map.get(val) || "";
          return path ? `${path}.` : "";
      };
      const handler = {
          get(target, property, receiver) {
              const path = getRootPath(target) + property;
              const value = Reflect.get(target, property, receiver);
              if (typeof value === "object" && value !== null) {
                  map.set(value, path);
                  return new Proxy(value, handler);
              }
              /* istanbul ignore next */
              return value;
          },
          set(target, property, value) {
              const path = getRootPath(target) + property;
              const prev = target[property];
              if (value === prev)
                  return true;
              const res = Reflect.set(target, property, value);
              onChangeFunction(path, value, prev);
              return res;
          },
          deleteProperty(target, property) {
              const path = getRootPath(target) + property;
              const prev = target[property];
              if (map.has(target))
                  map.delete(target);
              const res = Reflect.deleteProperty(target, property);
              onChangeFunction(path, undefined, prev);
              return res;
          }
      };
      map.set(objToWatch, "");
      return new Proxy(objToWatch, handler);
  }
  if (!Math.hypot) {
      Math.hypot = function () {
          var y = 0, i = arguments.length;
          while (i--)
              y += arguments[i] * arguments[i];
          return Math.sqrt(y);
      };
  }

  class Entity {
      constructor(store, data) {
          this.dataDefault = {
              id: uid(),
              name: "entity",
              parentId: "",
              childIds: [],
              componentIds: {},
              enable: true
          };
          this.store = store;
          this.data = Object.assign({}, this.dataDefault, data);
      }
      get enable() {
          return this.data.enable;
      }
      set enable(value) {
          this.watchedData.enable = value;
      }
      get id() {
          return this.data.id;
      }
      get name() {
          return this.data.name;
      }
      set name(value) {
          this.watchedData.name = value;
      }
      get gameobject() {
          return this.store.getEntity(this.data.id);
      }
      get transform() {
          return this.store.getEntity(this.data.componentIds["Transform"]);
      }
      get parent() {
          return this.store.getEntity(this.data.parentId);
      }
      get components() {
          return Object.values(this.data.componentIds).map(x => this.store.getEntity(x));
      }
      get childs() {
          return this.data.childIds.map(x => this.store.getEntity(x));
      }
      get watchedData() {
          return this.store.getData(this.data.id);
      }
      created() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent)
              return;
          if (parent.childIds.indexOf(this.data.id) !== -1)
              return;
          if (!this.store.created.has(this.id))
              return;
          parent.childIds.push(this.data.id);
      }
      deleted() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent || !parent.childIds)
              return;
          parent.childIds = parent.childIds.filter((x) => x !== this.id);
          for (const componentId of Object.values(this.data.componentIds)) {
              this.store.delete(componentId);
          }
          for (const childId of this.data.childIds) {
              this.store.delete(childId);
          }
      }
  }
  // export function walkEntity(entity: Entity, cb: (entity: Entity | Component, depth: number) => void, depth: number = 0) {
  // 	if (!entity) return
  // 	cb(entity, depth)
  // 	for (const comp of entity.components) {
  // 		cb(comp, depth + 1)
  // 	}
  // 	for (const child of entity.childs) {
  // 		walkEntity(child, cb, depth + 1)
  // 	}
  // }

  class Component {
      constructor(store, data) {
          this.dataDefault = {
              id: uid(),
              parentId: "",
              type: "",
              enable: true
          };
          this.store = store;
          this.data = Object.assign({}, this.dataDefault, data);
      }
      get id() {
          return this.data.id;
      }
      get name() {
          return this.data.type;
      }
      get gameobject() {
          return this.store.getEntity(this.data.parentId);
      }
      get transform() {
          return this.gameobject.transform;
      }
      get watchedData() {
          return this.store.getData(this.data.id);
      }
      created() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent)
              return;
          if (this.data.type in parent.componentIds)
              return;
          if (!this.store.created.has(this.id))
              return;
          parent.componentIds[this.data.type] = this.data.id;
      }
      deleted() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent || !parent.componentIds)
              return;
          delete parent.componentIds[this.data.type];
      }
      mounted() { }
      unmounted() { }
      enabled() { }
      disabled() { }
  }
  class TransformComponent extends Component {
      constructor(store, data) {
          if (!data.type)
              data.type = "Transform";
          super(store, data);
          if (!this.data.position)
              this.data.position = { x: 0, y: 0, z: 0 };
          if (!this.data.rotation)
              this.data.rotation = { x: 0, y: 0, z: 0 };
          if (!this.data.scale)
              this.data.scale = { x: 1, y: 1, z: 1 };
      }
      get position() {
          return this.watchedData.position;
      }
      get rotation() {
          return this.watchedData.rotation;
      }
      get scale() {
          return this.watchedData.scale;
      }
  }

  function pathWalk(obj, path) {
      let root = obj;
      let index;
      let prop = path;
      while (path) {
          index = path.indexOf(".");
          if (index === -1) {
              return { root, property: path };
          }
          prop = path.slice(0, index);
          if (!root[prop])
              break;
          root = root[prop];
          path = path.slice(index + 1);
      }
      return { root, property: "" };
  }
  function clone(obj) {
      return JSON.parse(JSON.stringify(obj));
  }

  class DataStore {
      constructor() {
          this.hook = [];
          this.mutations = {};
          // transaction
          this.transactionMeta = undefined;
          this.transactionHistory = [];
          // undo / redo
          this.lastUndoIndex = -1;
          this.undoBuffer = [];
          this.syncQueue = [];
          this.id = uid();
          this.evtCreate = new Event();
          this.evtApply = new Event();
          this.history = [];
          this.historyIds = new Set();
          this.undoMap = new Map();
          this.mutations.add = (obj, mut, forward = true) => {
              const { root, property } = pathWalk(obj, mut.path);
              if (forward) {
                  if (!root[property])
                      root[property] = JSON.parse(JSON.stringify(mut.data.value));
              }
              else {
                  if (root[property])
                      delete root[property];
              }
              this.addHistory(mut);
          };
          this.mutations.set = (obj, mut, forward = true) => {
              const { root, property } = pathWalk(obj, mut.path);
              if (forward) {
                  root[property] = JSON.parse(JSON.stringify(mut.data.value));
              }
              else {
                  root[property] = JSON.parse(JSON.stringify(mut.data.old));
              }
              this.addHistory(mut);
          };
          this.mutations.delete = (obj, mut, forward = true) => {
              const { root, property } = pathWalk(obj, mut.path);
              if (forward) {
                  if (root && root[property]) {
                      this.keepUndoObject(mut.id, root[property]);
                      delete root[property];
                  }
              }
              else {
                  if (this.undoMap.has(mut.id)) {
                      root[property] = this.undoMap.get(mut.id);
                      this.undoMap.delete(mut.id);
                  }
              }
              this.addHistory(mut);
          };
          this.mutations.transaction = (obj, mut, forward = true) => {
              if (!this.transactionMeta)
                  this.transactionMeta = mut.data.meta;
              for (const subMut of mut.data.history) {
                  if (forward) {
                      if (this.historyIds.has(subMut.id))
                          continue;
                      this.applyMutation(obj, subMut);
                      this.historyIds.add(subMut.id);
                  }
                  else {
                      if (!this.historyIds.has(subMut.id))
                          continue;
                      this.revertMutation(obj, subMut);
                      this.historyIds.delete(subMut.id);
                  }
              }
              this.transactionMeta = undefined;
              this.transactionHistory = [];
              this.history.push(mut);
              this.historyIds.add(mut.id);
          };
          this.mutations.undo = (obj, mut) => {
              const index = this.history.findIndex(x => x.id === mut.data.id);
              const target = this.history[index];
              this.lastUndoIndex = index;
              this.revertMutation(obj, target);
              this.undoBuffer.push(target.id);
              this.addHistory(mut);
              this.historyIds.add(mut.id);
          };
          this.mutations.redo = (obj, mut) => {
              const index = this.history.findIndex(x => x.id === mut.data.id);
              const target = this.history[index];
              this.lastUndoIndex = index + 1;
              this.applyMutation(obj, target);
              const index2 = this.undoBuffer.indexOf(target.id);
              if (index2 != -1)
                  this.undoBuffer.splice(index2, 1);
              this.historyIds.add(mut.id);
              this.addHistory(mut);
          };
      }
      addHookBefore(name, path, promise) {
          this.hook.push({
              type: "before",
              name,
              path,
              promise
          });
      }
      addHookAfter(name, path, promise) {
          this.hook.push({
              type: "after",
              name,
              path,
              promise
          });
      }
      get nextUndoId() {
          if (this.history.length === 0)
              return -1;
          if (this.lastUndoIndex !== -1) {
              for (let i = this.lastUndoIndex - 1; i >= 0; i--) {
                  return this.history[i].id;
              }
          }
          return this.history[this.history.length - 1].id;
      }
      get nextRedoId() {
          if (this.undoBuffer.length === 0)
              return -1;
          return this.undoBuffer[this.undoBuffer.length - 1];
      }
      keepUndoObject(id, val) {
          this.undoMap.set(id, val);
      }
      addHistory(mut, force = false) {
          if (!force && this.transactionMeta) {
              this.transactionHistory.push(mut);
          }
          else {
              this.history.push(mut);
          }
      }
      transactionStart(meta = {}) {
          this.transactionMeta = meta;
      }
      transactionEnd(path, meta = {}) {
          this.createMutation("transaction", path, {
              meta: Object.assign(this.transactionMeta, meta),
              history: this.transactionHistory
          });
      }
      createMutation(name, path, data) {
          const mut = { id: uid(), time: perf(), name, path, data };
          this.evtCreate.emit(mut);
          return mut;
      }
      registerMutation(name, cb) {
          this.mutations[name] = cb;
      }
      revertMutation(obj, mut) {
          if (!this.mutations[mut.name])
              throw new Error(`Unknown mutation ${mut.name}`);
          this.mutations[mut.name](obj, mut, false);
          this.historyIds.delete(mut.id);
          this.evtApply.emit(mut);
      }
      applyMutation(obj, mut) {
          if (!this.mutations[mut.name])
              throw new Error(`Unknown mutation ${mut.name}`);
          if (this.historyIds.has(mut.id))
              return;
          this.mutations[mut.name](obj, mut);
          this.historyIds.add(mut.id);
          this.evtApply.emit(mut);
      }
      async hookBefore(obj, mut) {
          for (const hook of this.hook) {
              if (hook.type !== "before")
                  continue;
              if (hook.name !== mut.name)
                  continue;
              if (hook.path !== mut.path)
                  continue;
              await hook.promise(obj, mut);
          }
      }
      async hookAfter(obj, mut) {
          for (const hook of this.hook) {
              if (hook.type !== "after")
                  continue;
              if (hook.name !== mut.name)
                  continue;
              if (hook.path !== mut.path)
                  continue;
              await hook.promise(obj, mut);
          }
      }
      sync(obj, history) {
          for (const mut of history) {
              this.applyMutation(obj, mut);
          }
      }
      async syncAsyncExecute(obj, history) {
          for (const mut of history) {
              if (this.historyIds.has(mut.id))
                  continue;
              await this.hookBefore(obj, mut);
              this.applyMutation(obj, mut);
              await this.hookAfter(obj, mut);
          }
      }
      async syncAsync(obj, history) {
          this.syncQueue.push(() => this.syncAsyncExecute(obj, history));
          if (!this.syncCurrent) {
              let elem = this.syncQueue.shift();
              while (!!elem) {
                  this.syncCurrent = elem;
                  await elem();
                  elem = this.syncQueue.shift();
                  this.syncCurrent = undefined;
              }
          }
      }
      getHistory() {
          return this.history;
      }
  }

  class BaseStore {
      constructor(data = {}) {
          this._originalData = data;
          this._store = new DataStore();
          this._store.evtCreate.on((mut) => {
              this._store.applyMutation(this._originalData, mut);
          });
          this._data = onChange(this._originalData, (path, value, previousValue) => {
              if (previousValue === undefined) {
                  this._store.createMutation("add", path, { value, type: typeof value });
              }
              else if (value === undefined) {
                  const mut = this._store.createMutation("delete", path, {});
                  this._store.keepUndoObject(mut.id, previousValue);
              }
              else {
                  this._store.createMutation("set", path, { value, old: previousValue });
              }
          });
      }
      get id() {
          return this._store.id;
      }
      get history() {
          return clone(this._store.getHistory());
      }
      get data() {
          return this._data;
      }
      get proxy() {
          return clone(this.data);
      }
      get serialize() {
          return this._originalData;
      }
      addHookBefore(name, path, promise) {
          this._store.addHookBefore(name, path, promise);
      }
      addHookAfter(name, path, promise) {
          this._store.addHookAfter(name, path, promise);
      }
      transactionStart(meta) {
          this._store.transactionStart(meta);
      }
      transactionEnd(path = "", meta) {
          this._store.transactionEnd(path, meta);
      }
      observe(cb) {
          this._store.evtApply.on(cb);
      }
      sync(history) {
          this._store.sync(this._originalData, history);
      }
      async syncAsync(history) {
          await this._store.syncAsync(this._originalData, history);
      }
      undo() {
          const mutId = this._store.nextUndoId;
          if (mutId !== -1)
              this._store.createMutation("undo", "", { id: mutId });
      }
      redo() {
          const mutId = this._store.nextRedoId;
          if (mutId !== -1)
              this._store.createMutation("redo", "", { id: mutId });
      }
  }

  class EntityStore extends BaseStore {
      constructor(data = {}) {
          super(data);
          this.factory = new Map();
          this.instances = new WeakMap();
          this.created = new Set();
          this._store.registerMutation("create", (obj, mut, _forward) => {
              let instance = undefined;
              // only instantiate object on real not proxy
              const init = this.factory.get(mut.data.classname);
              if (!init)
                  throw new Error("Cant find factory method for " + mut.data.classname);
              instance = init(this, mut.data);
              obj[mut.path] = instance.data;
              this.instances.set(instance.data, instance);
              this._store.addHistory(mut);
              this._store.historyIds.add(mut.id);
              if (instance && instance.created)
                  instance.created();
          });
      }
      register(name, factory) {
          this.factory.set(name, factory);
      }
      create(classname, data = {}) {
          if (!this.factory.has(classname))
              throw new Error("unknown class " + classname);
          const id = data.id ? data.id : uid(6);
          data.id = id;
          this.created.add(id);
          this._store.createMutation("create", id, { classname, ...data });
      }
      delete(id) {
          if (!this.data[id])
              return;
          const entity = this.getEntity(id);
          if (entity && entity.deleted)
              entity.deleted();
          delete this.data[id];
      }
      getData(id, event = true) {
          return event ? this.data[id] : this._originalData[id];
      }
      getEntity(id) {
          const originalData = this.getData(id, false);
          return this.instances.get(originalData);
      }
  }

  class KeyStore extends BaseStore {
      createSection(name) {
          if (!name)
              throw new Error("wrong parameter");
          if (this.data[name])
              throw new Error("section already exist " + name);
          this.data[name] = {};
      }
      has(section, key) {
          if (!section || !key)
              throw new Error("wrong parameter");
          if (!this.data || !this.data[section])
              return false;
          return key in this.data[section];
      }
      get(section, key, def = "") {
          if (!section || !key)
              throw new Error("wrong parameter");
          if (!this.has(section, key))
              return def;
          return this.data[section][key];
      }
      set(section, key, value = "") {
          if (!section || !key)
              throw new Error("wrong parameter");
          if (!this.data || !this.data[section])
              throw new Error("section dont exist " + section);
          this.data[section][key] = value;
      }
      delete(section, key) {
          if (!section || !key)
              throw new Error("wrong parameter");
          if (!this.data || !this.data[section])
              throw new Error("section dont exist " + section);
          delete this.data[section][key];
      }
      deleteSection(name) {
          if (!name)
              throw new Error("wrong parameter");
          delete this.data[name];
      }
      stringify() {
          return JSON.stringify(this.data, null, 2);
      }
  }

  class TableStore extends BaseStore {
      constructor(entries = {}) {
          const data = clone(entries);
          for (const sheetId in entries) {
              data[sheetId] = {
                  id: "id",
                  rows: [],
                  values: {}
              };
              for (const row of entries[sheetId]) {
                  const id = data[sheetId].id;
                  const uuid = row[id] ? row[id] : uid(4);
                  row[id] = uuid;
                  data[sheetId].rows.push(uuid);
                  data[sheetId].values[uuid] = row;
              }
          }
          super(data);
      }
      getValues() {
          const data = clone(this.serialize);
          for (const sheetId in data) {
              data[sheetId] = Object.values(data[sheetId].values);
          }
          return data;
      }
      getSheet(name) {
          if (!this.data || !this.data[name])
              throw new Error("sheet doesnt exist " + name);
          return this.data[name];
      }
      createSheet(name, id = "id") {
          if (!name)
              throw new Error("wrong parameter");
          if (this.data[name])
              throw new Error("sheet already exist " + name);
          this.data[name] = {
              id,
              rows: [],
              values: {}
          };
      }
      getRows(sheet) {
          const data = this.getSheet(sheet);
          return Object.values(data.values);
      }
      getRowById(sheet, id) {
          if (!sheet || !id)
              throw new Error("wrong parameter");
          const data = this.getSheet(sheet);
          return data.values[id];
      }
      addRow(sheet, value) {
          if (!sheet || !value)
              throw new Error("wrong parameter");
          const data = this.getSheet(sheet);
          const id = value[data.id] ? value[data.id] : uid(4);
          value[data.id] = id;
          data.rows.push(id);
          data.values[id] = value;
      }
      setRow(sheet, rowId, value) {
          if (!sheet || !rowId || !value)
              throw new Error("wrong parameter");
          const data = this.getSheet(sheet);
          if (!(data.id in value))
              value[data.id] = rowId;
          data.values[rowId] = value;
      }
      deleteRow(sheet, rowId) {
          if (!sheet || !rowId)
              throw new Error("wrong parameter");
          const data = this.getSheet(sheet);
          data.rows = data.rows.filter(e => e !== rowId);
          delete data.values[rowId];
      }
      getCell(sheet, rowId, col) {
          if (!sheet || !rowId || !col)
              throw new Error("wrong parameter");
          const data = this.getSheet(sheet);
          return data.values[rowId][col];
      }
      setCell(sheet, rowId, col, value = "") {
          if (!sheet || !rowId || !col)
              throw new Error("wrong parameter");
          const data = this.getSheet(sheet);
          data.values[rowId][col] = value;
      }
      deleteSheet(name) {
          if (!name)
              throw new Error("wrong parameter");
          delete this.data[name];
      }
      stringify() {
          return JSON.stringify(this.getValues(), null, 2);
      }
  }

  class EntityFile {
      constructor(store, data) {
          this.store = store;
          const defaults = {
              id: uid(),
              parentId: "",
              icon: "file",
              label: "file",
              meta: {}
          };
          this.data = Object.assign({}, defaults, data);
      }
      get id() {
          return this.data.id;
      }
      get label() {
          return this.data.label;
      }
      set label(val) {
          this.watchedData.label = val;
      }
      get icon() {
          return this.data.icon;
      }
      set icon(val) {
          this.watchedData.icon = val;
      }
      get isFolder() {
          return false;
      }
      get watchedData() {
          return this.store.getData(this.data.id);
      }
      setParent(parentId) {
          const parent = this.store.getData(parentId);
          if (!parent)
              return;
          if (parent.childIds.indexOf(this.data.id) !== -1)
              return;
          if (this.data.parentId !== parentId) {
              const prevParent = this.store.getData(this.data.parentId);
              if (prevParent) {
                  prevParent.childIds = prevParent.childIds.filter((x) => x !== this.id);
              }
              this.data.parentId = parentId;
          }
          parent.childIds.push(this.data.id);
      }
      created() {
          if (!this.store.created.has(this.id))
              return;
          this.setParent(this.data.parentId);
      }
      deleted() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent || !parent.childIds)
              return;
          parent.childIds = parent.childIds.filter((x) => x !== this.id);
      }
      toNestedJSON() {
          const data = clone(this.data);
          delete data.parentId;
          data.icon = this.icon;
          data.selected = this.id === this.store.getData("meta").selected;
          return data;
      }
  }

  class EntityFolder extends EntityFile {
      constructor(store, data) {
          const defaults = {
              id: uid(),
              parentId: "",
              label: "folder",
              icon: "folder",
              meta: {},
              childIds: []
          };
          data = Object.assign({}, defaults, data);
          super(store, data);
      }
      get icon() {
          return this.data.icon + (!this.data.meta.collapse ? "-open" : "");
      }
      set icon(val) {
          this.data.icon = val;
      }
      get isFolder() {
          return true;
      }
      toNestedJSON() {
          const data = clone(this.data);
          delete data.parentId;
          delete data.childIds;
          data.icon = this.icon;
          data.selected = this.id === this.store.getData("meta").selected;
          data.children = this.data.childIds.map(x => this.store.getEntity(x).toNestedJSON());
          data.children.sort((a, b) => a.label.localeCompare(b.label));
          return data;
      }
  }

  class Kaaya {
      /**
       * Create a Base Store (basic store without helpers or predefined structure)
       *
       * @param {*} [data={}]
       * @returns {BaseStore}
       */
      static createRawStore(data) {
          return new BaseStore(data);
      }
      //#region Key Store
      /**
       * Create a Keystore
       *
       * @param {*} [data={}]
       * @returns {KeyStore}
       */
      static createKeyStore(data = {}) {
          return new KeyStore(data);
      }
      /**
       * Create a Keystore from a configuration file (.json)
       *
       * @param {string} data
       * @memberof Kaaya
       */
      static createKeyStoreFromJSON(data) {
          return Kaaya.createKeyStore(JSON.parse(data));
      }
      //#endregion KeyStore
      //#region Table Store
      static createTableStore(data) {
          return new TableStore(data);
      }
      static createTableStoreFromJSON(data) {
          return Kaaya.createTableStore(JSON.parse(data));
      }
      //#endregion Table Store
      static createEntityStore(data) {
          return new EntityStore(data);
      }
      static createEntityComponentStore(data) {
          const store = Kaaya.createEntityStore(data);
          store.register("Entity", (store1, data1) => new Entity(store1, data1));
          store.register("Transform", (store2, data2) => new TransformComponent(store2, data2));
          return store;
      }
      static createFileFolderStore(data = {}) {
          if (!data.meta)
              data.meta = { selected: "" };
          const store = Kaaya.createEntityStore(data);
          store.register("File", (store1, data1) => new EntityFile(store1, data1));
          store.register("Folder", (store2, data2) => new EntityFolder(store2, data2));
          return store;
      }
  }

  /**
   * Provide polyfill around Date.now()
   */
  const now$1 = typeof Date.now === "function" ? Date.now : new Date().getTime;
  const start$1 = now$1();

  /// Inspired by https://basarat.gitbooks.io/typescript/docs/tips/typed-event.html
  class Event$1 {
      constructor() {
          this.listeners = [];
          this.listenersOncer = [];
      }
      on(listener) {
          this.listeners.push(listener);
          return { dispose: () => this.off(listener) };
      }
      once(listener) {
          this.listenersOncer.push(listener);
      }
      off(listener) {
          const callbackIndex = this.listeners.indexOf(listener);
          if (callbackIndex > -1)
              this.listeners.splice(callbackIndex, 1);
      }
      emit(event) {
          /** Update any general listeners */
          this.listeners.forEach(listener => listener(event));
          /** Clear the `once` queue */
          if (this.listenersOncer.length > 0) {
              const toCall = this.listenersOncer;
              this.listenersOncer = [];
              toCall.forEach(listener => listener(event));
          }
      }
  }

  const url$1 = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  /**
   * Create a `uid` [a-zA-z0-9]
   *
   * @param {Number} len
   * @return {String} uid
   */
  function uid$1(len = 8) {
      let id = "";
      while (len--) {
          id += url$1[(Math.random() * 62) | 0];
      }
      return id;
  }

  var LogLevel$1;
  (function (LogLevel) {
      LogLevel[LogLevel["INFO"] = 0] = "INFO";
      LogLevel[LogLevel["WARN"] = 1] = "WARN";
      LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
      LogLevel[LogLevel["OFF"] = 3] = "OFF";
  })(LogLevel$1 || (LogLevel$1 = {}));

  /* istanbul ignore file */
  /**
   * Common utilities
   */
  // Configuration Constants
  const EPSILON = 0.000001;
  let ARRAY_TYPE = Array;
  const RANDOM = Math.random;
  const degree = Math.PI / 180;
  /**
   * Convert Degree To Radian
   *
   * @param {Number} a Angle in Degrees
   */
  function toRadian(a) {
      return a * degree;
  }
  function toDegree(a) {
      return a / degree;
  }
  /**
   * Number Equal, approximately (+-epsilon)
   *
   * @export
   * @param {number} a
   * @param {number} b
   */
  function numberEqual(a, b) {
      return Math.abs(a - b) < EPSILON;
  }
  /**
   * Round to a certain amount of decimals
   *
   * @export
   * @param {number} value
   * @param {number} [decimals=2]
   */
  function roundTo(value, decimals = 2) {
      return +value.toFixed(decimals);
  }
  /**
   * Tests whether or not the arguments have approximately the same value, within an absolute
   * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
   * than or equal to 1.0, and a relative tolerance is used for larger values)
   *
   * @param {Number} a The first number to test.
   * @param {Number} b The second number to test.
   * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
   */
  function equals(a, b) {
      return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
  }
  function forEach(mat, cb) {
      for (var i = 0; i < mat.length; i++) {
          mat[i] = cb(i, mat[i]);
      }
  }
  if (!Math.hypot) {
      Math.hypot = function () {
          var y = 0, i = arguments.length;
          while (i--)
              y += arguments[i] * arguments[i];
          return Math.sqrt(y);
      };
  }

  var common = /*#__PURE__*/Object.freeze({
  	__proto__: null,
  	EPSILON: EPSILON,
  	ARRAY_TYPE: ARRAY_TYPE,
  	RANDOM: RANDOM,
  	toRadian: toRadian,
  	toDegree: toDegree,
  	numberEqual: numberEqual,
  	roundTo: roundTo,
  	equals: equals,
  	forEach: forEach
  });

  class StringExt {
      static isNullOrEmpty(val) {
          if (val === undefined || val === null || val.trim() === "") {
              return true;
          }
          return false;
      }
      static capitalize(val) {
          if (val.length == 1) {
              return val.toUpperCase();
          }
          else if (val.length > 0) {
              return val.substring(0, 1).toUpperCase() + val.substring(1);
          }
          return val;
      }
      static capitalizeWords(val) {
          let regexp = /\s/;
          let words = val.split(regexp);
          if (words.length == 1) {
              return StringExt.capitalize(words[0]);
          }
          let result = "";
          for (let i = 0; i < words.length; i++) {
              if (StringExt.capitalize(words[i]) !== null) {
                  result += StringExt.capitalize(words[i]) + " ";
              }
          }
          return result.trim();
      }
      static contains(val, search) {
          return val.indexOf(search) !== -1;
      }
      static slugify(val, lower = true) {
          if (lower)
              val = val.toLowerCase();
          return val.normalize().replace(/[^a-z0-9]/gi, "-");
      }
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var fatina = createCommonjsModule(function (module, exports) {
  // [Fatina]  Build: 3.0.1 - Friday, October 4th, 2019, 12:49:50 AM  
   (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(typeof self !== 'undefined' ? self : commonjsGlobal, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
  /******/ })
  /************************************************************************/
  /******/ ({

  /***/ "./src/easing/easing.ts":
  /*!******************************!*\
    !*** ./src/easing/easing.ts ***!
    \******************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  /**
   * List of easing method
   *
   * Mostly based on http://easings.net/
   */
  // tslint:disable:no-parameter-reassignment
  /**
   * @ignore
   * @private
   * @const
   * @readonly
   */
  const PI = Math.PI;
  /**
   * @ignore
   * @private
   * @const
   * @readonly
   */
  const PI_OVER_TWO = Math.PI / 2;
  /**
   * @ignore
   * @private
   * @const
   * @readonly
   */
  const BACK = 1.70158;
  /**
   * @ignore
   * @private
   * @const
   * @readonly
   */
  const e = {};
  // Linear
  e.linear = (t) => {
      return t;
  };
  // Quad
  e.inQuad = (t) => {
      return t * t;
  };
  e.outQuad = (t) => {
      return 2 * t - t * t;
  };
  e.inOutQuad = (t) => {
      if (t < 0.5) {
          return 2 * t * t;
      }
      else {
          return 2 * (2 * t - t * t) - 1;
      }
  };
  // Cubic
  e.inCubic = (t) => {
      return t * t * t;
  };
  e.outCubic = (t) => {
      return 3 * t - 3 * t * t + t * t * t;
  };
  e.inOutCubic = (t) => {
      if (t < 0.5) {
          return 4 * t * t * t;
      }
      else {
          return 4 * (3 * t - 3 * t * t + t * t * t) - 3;
      }
  };
  // Quart
  e.inQuart = (t) => {
      return t * t * t * t;
  };
  e.outQuart = (t) => {
      const t2 = t * t;
      return 4 * t - 6 * t2 + 4 * t2 * t - t2 * t2;
  };
  e.inOutQuart = (t) => {
      if (t < 0.5) {
          return 8 * t * t * t * t;
      }
      else {
          const t2 = t * t;
          return 8 * (4 * t - 6 * t2 + 4 * t2 * t - t2 * t2) - 7;
      }
  };
  // Sine
  e.inSine = (t) => {
      if (t === 1) {
          return 1;
      }
      return 1 - Math.cos(PI_OVER_TWO * t);
  };
  e.outSine = (t) => {
      return Math.sin(PI_OVER_TWO * t);
  };
  e.inOutSine = (t) => {
      if (t < 0.5) {
          return (1 - Math.cos(PI * t)) / 2;
      }
      else {
          return (1 + Math.sin(PI * (t - 0.5))) / 2;
      }
  };
  // Circular
  e.inCirc = (t) => {
      return 1 - Math.sqrt(1 - Math.pow(t, 2));
  };
  e.outCirc = (t) => {
      return Math.sqrt(1 - Math.pow(1 - t, 2));
  };
  e.inOutCirc = (t) => {
      if (t < 0.5) {
          return (1 - Math.sqrt(1 - 4 * t * t)) / 2;
      }
      else {
          return (1 + Math.sqrt(-3 + 8 * t - 4 * t * t)) / 2;
      }
  };
  // Quint
  e.inQuint = (t) => {
      return t * t * t * t * t;
  };
  e.outQuint = (t) => {
      return --t * t * t * t * t + 1;
  };
  e.InOutQuint = (t) => {
      t *= 2;
      if (t < 1) {
          return 0.5 * t * t * t * t * t;
      }
      return 0.5 * ((t -= 2) * t * t * t * t + 2);
  };
  // Exponential
  e.inExponential = (t) => {
      if (t === 1) {
          return 1;
      }
      return t === 0 ? 0 : Math.pow(1024, t - 1);
  };
  e.outExponential = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };
  e.inOutExponential = (t) => {
      if (t === 0) {
          return 0;
      }
      if (t === 1) {
          return 1;
      }
      t *= 2;
      if (t < 1) {
          return 0.5 * Math.pow(1024, t - 1);
      }
      return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
  };
  // Elastic
  e.inElastic = (t) => {
      if (t === 0) {
          return 0;
      }
      return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
  };
  e.outElastic = (t) => {
      if (t === 1) {
          return 1;
      }
      return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  };
  e.inOutElastic = (t) => {
      if (t === 0) {
          return 0;
      }
      if (t === 1) {
          return 1;
      }
      t *= 2;
      if (t < 1) {
          return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
      }
      return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
  };
  // Back
  e.inBack = (t) => {
      const s = BACK;
      return t === 1 ? 1 : t * t * ((s + 1) * t - s);
  };
  e.outBack = (t) => {
      const s = BACK;
      return t === 0 ? 0 : --t * t * ((s + 1) * t + s) + 1;
  };
  e.inOutBack = (t) => {
      const s = BACK * 1.525;
      t *= 2;
      if (t < 1) {
          return 0.5 * (t * t * ((s + 1) * t - s));
      }
      return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
  };
  // Bounce
  e.outBounce = (t) => {
      if (t < (1 / 2.75)) {
          return 7.5625 * t * t;
      }
      else if (t < (2 / 2.75)) {
          return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
      }
      else if (t < (2.5 / 2.75)) {
          return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
      }
      else {
          return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
      }
  };
  e.inBounce = (t) => {
      return 1 - e.outBounce(1 - t);
  };
  e.inOutBounce = (t) => {
      if (t < 0.5) {
          return e.inBounce(t * 2) * 0.5;
      }
      return e.outBounce(t * 2 - 1) * 0.5 + 0.5;
  };
  exports.easeNames = e;


  /***/ }),

  /***/ "./src/easing/easingType.ts":
  /*!**********************************!*\
    !*** ./src/easing/easingType.ts ***!
    \**********************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  /**
   * List of all easing methods
   *
   * @export
   * @enum {number}
   */
  var EasingType;
  (function (EasingType) {
      EasingType["Linear"] = "linear";
      EasingType["InQuad"] = "inQuad";
      EasingType["OutQuad"] = "outQuad";
      EasingType["InOutQuad"] = "inOutQuad";
      EasingType["InCubic"] = "inCubic";
      EasingType["OutCubic"] = "outCubic";
      EasingType["InOutCubic"] = "inOutCubic";
      EasingType["InQuart"] = "inQuart";
      EasingType["OutQuart"] = "outQuart";
      EasingType["InOutQuart"] = "inOutQuart";
      EasingType["InSine"] = "inSine";
      EasingType["OutSine"] = "outSine";
      EasingType["InOutSine"] = "inOutSine";
      EasingType["InCirc"] = "inCirc";
      EasingType["OutCirc"] = "outCirc";
      EasingType["InOutCirc"] = "inOutCirc";
      EasingType["InQuint"] = "inQuint";
      EasingType["OutQuint"] = "outQuint";
      EasingType["InOutQuint"] = "inOutQuint";
      EasingType["InExponential"] = "inExponential";
      EasingType["OutExponential"] = "outExponential";
      EasingType["InOutExponential"] = "inOutExponential";
      EasingType["InElastic"] = "inElastic";
      EasingType["OutElastic"] = "outElastic";
      EasingType["InOutElastic"] = "inOutElastic";
      EasingType["InBack"] = "inBack";
      EasingType["OutBack"] = "outBack";
      EasingType["InOutBack"] = "inOutBack";
      EasingType["InBounce"] = "inBounce";
      EasingType["OutBounce"] = "outBounce";
      EasingType["InOutBounce"] = "inOutBounce";
  })(EasingType = exports.EasingType || (exports.EasingType = {}));


  /***/ }),

  /***/ "./src/fatina.ts":
  /*!***********************!*\
    !*** ./src/fatina.ts ***!
    \***********************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  const preset_1 = __webpack_require__(/*! ./preset */ "./src/preset.ts");
  const ticker_1 = __webpack_require__(/*! ./ticker */ "./src/ticker.ts");
  const delay_1 = __webpack_require__(/*! ./tweens/delay */ "./src/tweens/delay.ts");
  const sequence_1 = __webpack_require__(/*! ./tweens/sequence */ "./src/tweens/sequence.ts");
  const tween_1 = __webpack_require__(/*! ./tweens/tween */ "./src/tweens/tween.ts");
  /**
   * This part manage the auto-update loop if necessary (browser only)
   */
  /**
   * @ignore
   * @private
   */
  let lastFrame;
  /**
   * @ignore
   * @private
   * @const
   */
  let raf;
  /**
   * @ignore
   * @private
   * @const
   */
  let cancelFrame;
  if (typeof (window) !== 'undefined') {
      raf = window.requestAnimationFrame || window.mozRequestAnimationFrame
          || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      cancelFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  }
  /**
   * Main class exposed as fatina library
   *
   * @export
   * @class Fatina
   */
  class Fatina {
      constructor() {
          // plugins
          /**
           * @export
           */
          this.plugin = {};
          /**
           * @private
           */
          this.loadedPlugins = [];
          /**
           * @private
           */
          this.eventCreated = [];
          /**
           * Settings
           * @private
           */
          this.settings = {
              logLevel: 0 /* None */,
              safe: true,
              smooth: false,
              maxFrameDt: 50,
              maxFrameNumber: 40,
              maxDt: 500 // 500ms of animation
          };
          // properties
          /**
           * @readonly
           */
          this.version = '3.0.1';
          this.time = 0;
          /**
           * @private
           */
          this.dt = 0;
          /**
           * @private
           */
          this.lastTime = 0;
          /**
           * @private
           */
          this.initialized = false;
          /**
           * Pulse Animation
           *
           * @export
           * @param {any} obj
           * @param {any} settings
           * @returns {ISequence}
           */
          this.pulse = (obj, settings) => preset_1.pulsePreset(this, obj, settings);
          /**
           * Strobe Animation
           *
           * @export
           * @param {any} obj
           * @param {any} settings
           * @returns {ITween}
           */
          this.scale = (obj, settings) => preset_1.scalePreset(this, obj, settings);
          /**
           * Wobble Animation
           *
           * @export
           * @param {any} obj
           * @param {any} settings
           * @returns {ITween}
           */
          this.wobble = (obj, settings) => preset_1.wobblePreset(this, obj, settings);
          /**
           * Sonar Animation
           *
           * @export
           * @param {any} obj
           * @param {any} settings
           * @returns {ITween}
           */
          this.sonar = (obj, settings) => preset_1.sonarPreset(this, obj, settings);
          /**
           * Sonar Animation
           *
           * @export
           * @param {any} obj
           * @param {any} settings
           * @returns {ISequence}
           */
          this.shake = (obj, settings) => preset_1.shakePreset(this, obj, settings);
      }
      get elapsed() {
          return this.manager.elapsed;
      }
      get mainTicker() {
          if (!this.initialized) {
              this.init();
          }
          return this.manager;
      }
      /**
       * Method used when Fatina is used for the first time.
       * Can take few ms. (pool initialization & object creation)
       *
       * @export
       * @param {boolean} [disableAutoTick]
       * @returns {boolean}
       */
      init(disableAutoTick) {
          if (this.initialized) {
              return false;
          }
          if (!this.manager) {
              this.manager = new ticker_1.Ticker();
              this.manager.start();
          }
          // browser init requestAnimationFrame, after onLoad() event
          if (typeof (window) !== 'undefined' && !disableAutoTick) {
              console.log(' %c Fatina - Tweening library for games (' + this.version + ') https://github.com/kefniark/Fatina ', 'background: #222; color: #9fbff4; padding: 5px');
              this.lastTime = -1;
              if (document.readyState !== 'loading') {
                  lastFrame = raf(this.updateLoop.bind(this));
              }
              else {
                  document.addEventListener('DOMContentLoaded', () => {
                      lastFrame = raf(this.updateLoop.bind(this));
                  });
              }
          }
          this.initialized = true;
          return true;
      }
      /**
       * Used to change the timescale of the whole game
       *
       * @export
       * @param {number} scale
       */
      setTimescale(scale) {
          this.init();
          this.manager.setTimescale(scale);
      }
      /**
       * This method pause the update loop (update are not called anymore)
       *
       * @export
       */
      pause() {
          this.init();
          this.manager.pause();
      }
      /**
       * This method resume the update loop (works only if the game was paused before)
       *
       * @export
       */
      resume() {
          this.init();
          this.manager.resume();
      }
      /**
       * This method kill the main ticker, the pool of tween and stop any requestAnimationFrame
       *
       * @export
       */
      destroy() {
          if (this.manager) {
              this.manager.kill();
          }
          if (lastFrame) {
              cancelFrame(lastFrame);
          }
          this.initialized = false;
      }
      /**
       * Method used to tick all the child (tween or sequence)
       * This takes cares of recycling the old tween/sequence
       *
       * @export
       * @param {number} timestamp
       * @returns {*}
       */
      update(timestamp) {
          if (!this.initialized || !this.manager) {
              return;
          }
          this.manager.tick(timestamp);
          this.time += timestamp;
      }
      /**
       * Helper to create a tween (use the tween pool)
       *
       * @export
       * @param {*} obj
       * @returns {ITween}
       */
      tween(obj) {
          const t = new tween_1.Tween(obj);
          this.addContext(t);
          return t;
      }
      /**
       * Helper to create a Sequence (use the sequence pool)
       *
       * @export
       * @param {(Tween[] | Sequence[])} [list]
       * @returns {ISequence}
       */
      sequence(list) {
          const s = new sequence_1.Sequence(list);
          this.addContext(s);
          return s;
      }
      /**
       * Helper to create a Delay
       *
       * @export
       * @param {number} duration
       * @returns {IPlayable}
       */
      delay(duration) {
          const d = new delay_1.Delay(duration);
          this.addContext(d);
          return d;
      }
      /**
       * Helper used to replace usage of normal js setTimeout() by a tween
       * https://www.w3schools.com/jsref/met_win_settimeout.asp
       *
       * @export
       * @param {() => void} fn
       * @param {number} duration
       * @returns {IPlayable}
       */
      setTimeout(fn, duration) {
          const timeout = new delay_1.Delay(duration).onComplete(fn);
          this.addContext(timeout);
          return timeout.start();
      }
      /**
       * Helper used to replace usage of normal js setInterval() by a tween
       * https://www.w3schools.com/jsref/met_win_setinterval.asp
       *
       * @export
       * @param {() => void} fn
       * @param {number} duration
       * @returns {IPlayable}
       */
      setInterval(fn, duration) {
          const interval = new delay_1.Delay(duration).onRestart(fn).setLoop(-1);
          this.addContext(interval);
          return interval.start();
      }
      /**
       * Private method to set common data to every object (the parent ticker, safe mode, verbose mode)
       *
       * @private
       * @param {(IPlayable | ITween | ISequence)} obj
       */
      addContext(obj) {
          if (!this.initialized) {
              this.init();
          }
          obj.setParent(this.manager);
          if (this.settings.logLevel !== 0 /* None */ || !this.settings.safe) {
              obj.setSettings(this.settings);
          }
          this.emitCreated(obj);
      }
      /**
       * Create or Get a ticker with a defined name
       * This ticker is a child of the main ticker
       *
       * @export
       * @param {string} name
       * @returns {ITicker}
       */
      ticker() {
          if (!this.initialized) {
              this.init();
          }
          const tick = new ticker_1.Ticker();
          const handler = tick.tick.bind(tick);
          tick.setParent(this.manager, handler);
          this.manager.addTick(handler);
          tick.start();
          this.emitCreated(tick);
          return tick;
      }
      /**
       * @private
       */
      updateLoop(timestamp) {
          this.dt = this.lastTime < 0 ? 16 : this.dt + timestamp - this.lastTime;
          if (this.dt > this.settings.maxDt) {
              console.warn(`dt too high ${Math.round(this.dt)}ms. , Capped to ${this.settings.maxDt}ms.`);
              this.dt = this.settings.maxDt;
          }
          if (!this.settings.smooth) {
              // use directly the delta time
              this.update(this.dt);
              this.dt = 0;
          }
          else {
              // split high dt in multiple smaller .update()
              let frame = 0;
              while (this.dt > 0 && frame < this.settings.maxFrameNumber) {
                  const currentDt = Math.min(this.dt, this.settings.maxFrameDt);
                  this.update(currentDt);
                  this.dt -= currentDt;
                  frame++;
              }
          }
          this.lastTime = timestamp;
          lastFrame = raf(this.updateLoop.bind(this));
      }
      /**
       * Initialize a plugin by passing fatina object to it
       *
       * @export
       * @param {IPlugin} newPlugin
       */
      loadPlugin(newPlugin) {
          newPlugin.init(this);
          this.loadedPlugins.push(newPlugin);
          this.info(2 /* Debug */, 'Plugin Loaded', newPlugin.name);
      }
      /**
       * @private
       */
      info(level, message, data) {
          if (level > this.settings.logLevel) {
              return;
          }
          if (data) {
              console.log(message, data);
          }
          else {
              console.log(message);
          }
      }
      /**
       * @private
       */
      emit(func, control) {
          if (!this.settings.safe) {
              return func(control);
          }
          try {
              func(control);
          }
          catch (e) {
              console.warn(e);
          }
      }
      /**
       * @private
       */
      emitCreated(control) {
          for (const event of this.eventCreated) {
              this.emit(event, control);
          }
      }
      /**
       * Add a listener method on tween/sequence creation
       * (Used by plugin as a factory hook)
       *
       * @export
       * @param {(control: IControl) => void} cb
       */
      addListenerCreated(cb) {
          this.eventCreated.push(cb);
      }
      /**
       * Remove a listener method on tween/sequence creation
       * (Used by plugin as a factory hook)
       *
       * @export
       * @param {(control: IControl) => void} cb
       */
      removeListenerCreated(cb) {
          const index = this.eventCreated.indexOf(cb);
          if (index !== -1) {
              this.eventCreated.splice(index, 1);
          }
      }
      /**
       * This method is used to change the log level
       *
       * @export
       * @param {Log} level
       */
      setLog(level) {
          this.settings.logLevel = level;
      }
      /**
       * This method is used to enable / disable the callback try/catch
       *
       * @export
       * @param {boolean} isSafe
       */
      setSafe(isSafe) {
          this.settings.safe = isSafe;
      }
  }
  exports.Fatina = Fatina;


  /***/ }),

  /***/ "./src/index.ts":
  /*!**********************!*\
    !*** ./src/index.ts ***!
    \**********************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  const fatina_1 = __webpack_require__(/*! ./fatina */ "./src/fatina.ts");
  /**
   * @export
   * @ignore
   */
  exports.default = new fatina_1.Fatina();
  /**
   * @export
   */
  var easingType_1 = __webpack_require__(/*! ./easing/easingType */ "./src/easing/easingType.ts");
  exports.EasingType = easingType_1.EasingType;


  /***/ }),

  /***/ "./src/preset.ts":
  /*!***********************!*\
    !*** ./src/preset.ts ***!
    \***********************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  const easing_1 = __webpack_require__(/*! ./easing/easing */ "./src/easing/easing.ts");
  /**
   * Get Root object
   *
   * @ignore
   * @private
   * @param {*} obj
   * @param {string} property
   * @returns
   */
  function getRoot(obj, property) {
      const path = property.split('.');
      let ret = obj;
      for (let i = 0; i < path.length - 1; i++) {
          ret = ret[path[i]];
      }
      return ret;
  }
  /**
   * Get Object Property
   *
   * @ignore
   * @private
   * @param {string} property
   * @returns
   */
  function getProp(property) {
      const path = property.split('.');
      return path[path.length - 1];
  }
  /**
   * Get Object Property object
   *
   * @ignore
   * @private
   * @param {string} property
   * @param {*} value
   * @returns
   */
  function getData(property, value) {
      const data = {};
      data[getProp(property)] = value;
      return data;
  }
  /**
   * Sonar Preset
   *
   * @ignore
   * @export
   * @param {Fatina} fatina
   * @param {*} obj
   * @param {ISonarPresetParams} [settings]
   * @returns
   */
  function sonarPreset(fatina, obj, settings) {
      const defaults = {
          alpha: 'alpha',
          scaleX: 'scale.x',
          scaleY: 'scale.y',
          amplitude: 4,
          duration: 2000
      };
      const pa = Object.assign(Object.assign({}, defaults), (settings || {}));
      const rs = getRoot(obj, pa.scaleX);
      const ra = getRoot(obj, pa.alpha);
      const sx = getProp(pa.scaleX);
      const sy = getProp(pa.scaleY);
      const alpha = getProp(pa.alpha);
      const src = { x: rs[sx], y: rs[sy] };
      const p = easing_1.easeNames["outCubic" /* OutCubic */];
      return fatina.tween({})
          .to({}, pa.duration)
          .onUpdate((_dt, progress) => {
          ra[alpha] = 1 - easing_1.easeNames["inSine" /* InSine */](progress);
          rs[sx] = src.x + pa.amplitude * p(progress);
          rs[sy] = src.y + pa.amplitude * p(progress);
      })
          .onKilled(() => {
          ra[alpha] = 1;
          rs[sx] = src.x;
          rs[sy] = src.y;
      });
  }
  exports.sonarPreset = sonarPreset;
  /**
   * Pulse Preset
   *
   * @ignore
   * @export
   * @param {Fatina} fatina
   * @param {*} obj
   * @param {IPulsePresetParams} [settings]
   * @returns
   */
  function pulsePreset(fatina, obj, settings) {
      const defaults = {
          alpha: 'alpha',
          duration: 2000
      };
      const pa = Object.assign(Object.assign({}, defaults), (settings || {}));
      const rootAlpha = getRoot(obj, pa.alpha);
      return fatina.tween(rootAlpha)
          .to(getData(pa.alpha, 0), pa.duration / 2)
          .setEasing("inOutQuad" /* InOutQuad */)
          .toSequence()
          .append(fatina.tween(rootAlpha)
          .to(getData(pa.alpha, 1), pa.duration / 2)
          .setEasing("inOutQuad" /* InOutQuad */))
          .onKilled(() => rootAlpha[getProp(pa.alpha)] = 1);
  }
  exports.pulsePreset = pulsePreset;
  /**
   * Scale Preset
   *
   * @ignore
   * @export
   * @param {Fatina} fatina
   * @param {*} obj
   * @param {IScalePresetParams} [settings]
   * @returns
   */
  function scalePreset(fatina, obj, settings) {
      const defaults = {
          scaleX: 'scale.x',
          scaleY: 'scale.y',
          amplitude: 0.5,
          duration: 2000,
          bounce: 5,
          friction: 2,
          sinX: 0
      };
      const pa = Object.assign(Object.assign({}, defaults), (settings || {}));
      const root = getRoot(obj, pa.scaleX);
      const x = getProp(pa.scaleX);
      const y = getProp(pa.scaleY);
      const src = { x: root[x], y: root[y] };
      return fatina.tween({}).to({}, pa.duration)
          .setEasing("inOutCubic" /* InOutCubic */)
          .onUpdate((_dt, progress) => {
          const friction = Math.pow(1 - progress, pa.friction);
          const p = (progress * pa.bounce) % pa.duration;
          root[x] = src.x + Math.sin(pa.sinX + p * Math.PI * 2) * pa.amplitude * friction;
          root[y] = src.y + Math.sin(p * Math.PI * 2) * pa.amplitude * friction;
      })
          .onKilled(() => {
          root[x] = src.x;
          root[y] = src.y;
      });
  }
  exports.scalePreset = scalePreset;
  /**
   * Wobble Preset
   *
   * @ignore
   * @export
   * @param {Fatina} fatina
   * @param {*} obj
   * @param {IScalePresetParams} [settings]
   * @returns
   */
  function wobblePreset(fatina, obj, settings) {
      const defaults = { sinX: Math.PI };
      return scalePreset(fatina, obj, Object.assign(Object.assign({}, defaults), (settings || {})));
  }
  exports.wobblePreset = wobblePreset;
  /**
   * Shake Preset
   *
   * @ignore
   * @export
   * @param {Fatina} fatina
   * @param {*} obj
   * @param {IShakePresetParams} [settings]
   * @returns
   */
  function shakePreset(fatina, obj, settings) {
      const defaults = {
          posX: 'position.x',
          posY: 'position.y',
          amplitude: 1.5,
          duration: 2000,
          bounce: 10,
          friction: 2
      };
      const pa = Object.assign(Object.assign({}, defaults), (settings || {}));
      const root = getRoot(obj, pa.posX);
      const x = getProp(pa.posX);
      const y = getProp(pa.posY);
      const src = { x: root[x], y: root[y] };
      const rnd = { x: 0.5 + Math.random(), y: 0.5 + Math.random() };
      return fatina.tween({})
          .to({}, pa.duration)
          .onUpdate((_dt, progress) => {
          const friction = Math.pow(1 - progress, pa.friction);
          const p = (progress * pa.bounce) % pa.duration;
          root[x] = src.x + Math.sin(Math.PI + (p + rnd.x) * Math.PI * 2) * pa.amplitude * friction;
          root[y] = src.y + Math.sin((p + rnd.y) * Math.PI * 2) * pa.amplitude * friction;
      })
          .onKilled(() => {
          root[x] = src.x;
          root[y] = src.y;
      });
  }
  exports.shakePreset = shakePreset;


  /***/ }),

  /***/ "./src/ticker.ts":
  /*!***********************!*\
    !*** ./src/ticker.ts ***!
    \***********************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  /**
   * Main Fatina Ticker
   * Parent of all the normal tween and sequence
   *
   * @export
   * @class Ticker
   * @extends {EventList}
   * @implements {ITicker}
   */
  class Ticker {
      constructor() {
          this.state = 0 /* Idle */;
          /**
           * @private
           */
          this.timescale = 1;
          this.elapsed = 0;
          this.duration = 0;
          /**
           * @private
           */
          this.ticks = new Set();
          /**
           * @private
           */
          this.newTicks = new Set();
          /**
           * @private
           */
          this.dt = 0;
      }
      setParent(parent, tick) {
          this.tickCb = tick;
          this.parent = parent;
      }
      /**
       * Method used to change the timescale
       *
       * @param {number} scale
       */
      setTimescale(scale) {
          this.timescale = scale;
      }
      /**
       * Method used by the child to be updated
       *
       * @param {(dt: number) => void} cb
       */
      addTick(cb) {
          this.newTicks.add(cb);
      }
      /**
       * Method used by the child to not receive update anymore
       *
       * @param {(dt: number) => void} cb
       */
      removeTick(cb) {
          if (!this.ticks.delete(cb)) {
              this.newTicks.delete(cb);
          }
      }
      /**
       * Method used to tick all the child (tick listeners)
       *
       * @param {number} dt
       * @returns
       */
      tick(dt) {
          if (this.state !== 1 /* Run */) {
              return;
          }
          this.dt = dt * this.timescale;
          if (this.newTicks.size > 0) {
              this.newTicks.forEach((tick) => this.ticks.add(tick));
              this.newTicks.clear();
          }
          this.ticks.forEach((tick) => tick(this.dt));
          this.elapsed += this.dt;
      }
      start() {
          if (this.state === 0 /* Idle */) {
              this.state = 1 /* Run */;
          }
      }
      pause() {
          if (this.state === 1 /* Run */) {
              this.state = 2 /* Pause */;
          }
      }
      resume() {
          if (this.state === 2 /* Pause */) {
              this.state = 1 /* Run */;
          }
      }
      kill() {
          if (this.state >= 3) {
              return;
          }
          if (this.parent && this.tickCb) {
              this.parent.removeTick(this.tickCb);
          }
          this.state = 4 /* Killed */;
      }
      skip() { }
      reset() {
          this.state = 0 /* Idle */;
      }
      get isIdle() {
          return this.state === 0 /* Idle */;
      }
      get isRunning() {
          return this.state === 1 /* Run */;
      }
      get isFinished() {
          return this.state >= 3;
      }
      get isPaused() {
          return this.state === 2 /* Pause */;
      }
  }
  exports.Ticker = Ticker;


  /***/ }),

  /***/ "./src/tweens/baseTween.ts":
  /*!*********************************!*\
    !*** ./src/tweens/baseTween.ts ***!
    \*********************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  /**
   * Shared behaviors between different types of tweens and sequence
   * Used mostly to manage:
   *  - events
   *  - state
   *  - loop and restart
   *
   * @export
   * @abstract
   * @class BaseTween
   */
  class BaseTween {
      constructor() {
          // events
          /**
           * @protected
           */
          this.events = {};
          // public properties
          /**
           * Time elapsed
           * @type {number}
           * @export
           */
          this.elapsed = 0;
          /**
           * Total duration of the tween
           * @type {number}
           * @export
           */
          this.duration = 0;
          /**
           * Timescale of the tween
           * @type {number}
           * @export
           */
          this.timescale = 1;
          /**
           * Current state of the tween
           * @type {State}
           * @export
           */
          this.state = 0 /* Idle */;
          /**
           * @private
           */
          this.first = true;
      }
      /**
       * Is this tween idle (based on state)
       * @readonly
       * @type {boolean}
       * @export
       */
      get isIdle() {
          return this.state === 0 /* Idle */;
      }
      /**
       * Is this tween runs (based on state)
       * @readonly
       * @type {boolean}
       * @export
       */
      get isRunning() {
          return this.state === 1 /* Run */;
      }
      /**
       * Is this tween over (based on state)
       * @readonly
       * @type {boolean}
       * @export
       */
      get isFinished() {
          return this.state >= 3;
      }
      /**
       * Is this tween paused (based on state)
       * @readonly
       * @type {boolean}
       * @export
       */
      get isPaused() {
          return this.state === 2 /* Pause */;
      }
      /**
       * Start the tween
       * @export
       */
      start() {
          if (this.state !== 0 /* Idle */) {
              return this;
          }
          if (this.first) {
              this.validate();
          }
          else {
              this.check();
          }
          this.state = 1 /* Run */;
          this.parent.addTick(this.tickCb);
          if (this.first) {
              this.emitEvent(this.events.start);
              this.first = false;
          }
          return this;
      }
      /**
       * @readonly
       */
      reset(skipParent) {
          this.state = 0 /* Idle */;
          if (!skipParent) {
              this.removeParent();
          }
          if (this.loop) {
              this.loop.value = this.loop.original;
          }
          this.loopInit();
          this.emitEvent(this.events.restart);
      }
      /**
       * To immediately Reset a tween without stopping/restarting it
       * This is faster than calling manually Reset() & Start() & Tick()
       *
       * @param {number} dtRemains
       */
      resetAndStart(dtRemains) {
          this.loopInit();
          this.emitEvent(this.events.restart);
          this.state = 1 /* Run */;
          if (dtRemains > 0) {
              this.tickCb(dtRemains);
          }
      }
      /**
       * Method used to define the ticker of this tween
       * When Fatina.Tween is used, the main ticker is automatically defined as parent
       *
       * @param {ITicker} ticker
       * @returns {T}
       */
      setParent(ticker) {
          this.removeParent();
          this.parent = ticker;
          return this;
      }
      /**
       * Method used to change the timescale of the tween
       *
       * @param {number} scale
       * @returns {T}
       */
      setTimescale(scale) {
          this.timescale = scale;
          return this;
      }
      /**
       * Method used to pause a tween or a sequence (only work if the tween runs)
       *
       * @returns {void}
       */
      pause() {
          if (this.state !== 1 /* Run */) {
              this.info(1 /* Info */, 'Cannot pause this tween ', this.state);
              return;
          }
          this.state = 2 /* Pause */;
          this.removeParent();
      }
      /**
       * Method used to resume a tween or a sequence (only work if the tween is paused)
       * @export
       */
      resume() {
          if (this.state !== 2 /* Pause */) {
              this.info(1 /* Info */, 'Cannot resume this tween ', this.state);
              return;
          }
          this.state = 1 /* Run */;
          this.parent.addTick(this.tickCb);
      }
      /**
       * Method used to Skip this tween or sequence and directly finish it
       *
       * @export
       * @param {boolean} [finalValue]
       * @returns {void}
       */
      skip(finalValue) {
          if (this.state >= 3) {
              this.info(1 /* Info */, 'Cannot skip this tween ', this.state);
              return;
          }
          if (this.state === 0 /* Idle */) {
              this.emitEvent(this.events.start);
          }
          if (finalValue) {
              const duration = this.yo ? (this.yo.value * this.duration) : 0;
              this.tickCb(this.duration - this.elapsed + duration);
              return;
          }
          this.elapsed = this.duration;
          this.complete();
      }
      /**
       * Method used to Stop/Kill a tween or a sequence
       * @export
       */
      kill() {
          if (this.state === 4 /* Killed */) {
              this.info(1 /* Info */, 'Cannot kill this tween ', this.state);
              return;
          }
          this.state = 4 /* Killed */;
          this.removeParent();
          this.emitEvent(this.events.kill);
      }
      /**
       * Method used to define how many time the tween has to loop
       * Extra: if -1 the tween will loop forever
       *
       * @param {number} loop
       * @returns {ITween}
       */
      setLoop(loop) {
          if (!this.loop) {
              this.loop = { original: 1, value: 1 };
          }
          this.loop.original = Math.round(loop);
          this.loop.value = this.loop.original;
          return this;
      }
      setSettings(settings) {
          if (this.settings) {
              Object.assign(this.settings, settings);
          }
          else {
              this.settings = settings;
          }
          return this;
      }
      /**
       * @protected
       */
      complete() {
          if (this.state >= 3) {
              this.info(1 /* Info */, 'Cannot complete this tween ', this.state);
              return;
          }
          this.state = 3 /* Finished */;
          this.removeParent();
          this.emitEvent(this.events.complete);
      }
      /**
       * @protected
       */
      removeParent() {
          if (this.parent) {
              this.parent.removeTick(this.tickCb);
          }
      }
      /**
       * @protected
       */
      check() { }
      /**
       * @protected
       */
      validate() { }
      /**
       * @protected
       */
      loopInit() {
          this.elapsed = 0;
      }
      /**
       * @protected
       */
      info(level, message, data) {
          if (!this.settings || level > this.settings.logLevel) {
              return;
          }
          console.log(message, data);
      }
      /**
       * @private
       */
      emit(func, args) {
          if (this.settings && !this.settings.safe) {
              return func.apply(this, args);
          }
          try {
              func.apply(this, args);
          }
          catch (e) {
              console.warn(e);
          }
      }
      /**
       * @protected
       */
      emitEvent(listeners, args) {
          if (!listeners) {
              return;
          }
          if (listeners instanceof Array) {
              for (const listener of listeners) {
                  this.emit(listener, args);
              }
          }
          else {
              this.emit(listeners, args);
          }
      }
      /**
       *  Callback called when the tween started
       *
       * @param {() => void} cb
       * @returns {T}
       */
      onStart(cb) {
          return this.onEvent('start', cb);
      }
      /**
       * Callback called when the tween restart (loop)
       *
       * @param {() => void} cb
       * @returns {T}
       */
      onRestart(cb) {
          return this.onEvent('restart', cb);
      }
      /**
       * Callback called when the tween is updated
       *
       * @param {(dt: number, progress: number) => void} cb
       * @returns {T}
       */
      onUpdate(cb) {
          return this.onEvent('update', cb);
      }
      /**
       * Callback called when the tween is manually killed
       *
       * @param {() => void} cb
       * @returns {T}
       */
      onKilled(cb) {
          return this.onEvent('kill', cb);
      }
      /**
       * Callback called when the tween is finished
       *
       * @param {() => void} cb
       * @returns {T}
       */
      onComplete(cb) {
          return this.onEvent('complete', cb);
      }
      /**
       * @protected
       */
      onEvent(name, cb) {
          if (!this.events[name]) {
              this.events[name] = cb;
          }
          else if (this.events[name] instanceof Array) {
              this.events[name].push(cb);
          }
          else {
              this.events[name] = [this.events[name], cb];
          }
          return this;
      }
  }
  exports.BaseTween = BaseTween;


  /***/ }),

  /***/ "./src/tweens/callback.ts":
  /*!********************************!*\
    !*** ./src/tweens/callback.ts ***!
    \********************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  const baseTween_1 = __webpack_require__(/*! ./baseTween */ "./src/tweens/baseTween.ts");
  /**
   * Fake tween used to append or join callback in a sequence
   *
   * @export
   * @class Callback
   * @extends {BaseTween}
   * @implements {IPlayable}
   */
  class Callback extends baseTween_1.BaseTween {
      /**
       * Creates an instance of Callback.
       *
       * @param {() => void} cb
       */
      constructor(cb) {
          super();
          this.callback = cb;
          this.tickCb = this.tick.bind(this);
      }
      /**
       * @private
       * @param {number} dt
       */
      tick(dt) {
          this.elapsed += dt;
          this.duration = 0;
          this.callback();
          this.emitEvent(this.events.update, [dt, 1]);
          this.complete();
      }
  }
  exports.Callback = Callback;


  /***/ }),

  /***/ "./src/tweens/delay.ts":
  /*!*****************************!*\
    !*** ./src/tweens/delay.ts ***!
    \*****************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  const baseTween_1 = __webpack_require__(/*! ./baseTween */ "./src/tweens/baseTween.ts");
  /**
   * Fake tween used to delay other tweens in a sequence
   *
   * @export
   * @class Delay
   * @extends {BaseTween}
   * @implements {IPlayable}
   */
  class Delay extends baseTween_1.BaseTween {
      /**
       * Creates an instance of Delay.
       *
       * @param {number} duration
       */
      constructor(duration) {
          super();
          /**
           * @private
           */
          this.remains = 0;
          this.duration = duration;
          this.tickCb = this.tick.bind(this);
      }
      /**
       * @private
       * @param {number} dt
       * @returns
       * @memberof Delay
       */
      tick(dt) {
          this.remains = dt * this.timescale;
          while (this.remains > 0) {
              this.elapsed += this.remains;
              const progress = Math.max(Math.min(this.elapsed / this.duration, 1), 0);
              if (this.events.update) {
                  this.emitEvent(this.events.update, [this.remains, progress]);
              }
              if (this.elapsed < this.duration) {
                  return;
              }
              this.remains = this.elapsed - this.duration;
              if (this.loop) {
                  this.loop.value--;
                  if (this.loop.value !== 0) {
                      this.resetAndStart(0);
                      continue;
                  }
              }
              this.complete();
              return;
          }
      }
  }
  exports.Delay = Delay;


  /***/ }),

  /***/ "./src/tweens/sequence.ts":
  /*!********************************!*\
    !*** ./src/tweens/sequence.ts ***!
    \********************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  const baseTween_1 = __webpack_require__(/*! ./baseTween */ "./src/tweens/baseTween.ts");
  const callback_1 = __webpack_require__(/*! ./callback */ "./src/tweens/callback.ts");
  const delay_1 = __webpack_require__(/*! ./delay */ "./src/tweens/delay.ts");
  /**
   * Sequence: used to animate other tweens or sequence
   * Can play them sequentially or in parallel
   *
   * @export
   * @class Sequence
   * @extends {BaseTween}
   * @implements {ISequence}
   * @implements {ITicker}
   * @implements {IPlayable}
   */
  class Sequence extends baseTween_1.BaseTween {
      /**
       * Creates an instance of Sequence.
       *
       * @param {(ITween[] | ISequence[] | IPlayable[])} [tweens]
       */
      constructor(tweens) {
          super();
          /**
           * @private
           */
          this.evtTick = new Set();
          /**
           * @private
           */
          this.tweens = [];
          /**
           * @private
           */
          this.index = 0;
          /**
           * @private
           */
          this.remains = 0;
          this.tickCb = this.tick.bind(this);
          if (tweens) {
              this.tweens = new Array(tweens.length);
              for (let i = 0; i < tweens.length; i++) {
                  tweens[i].setParent(this);
                  this.tweens[i] = [tweens[i]];
              }
          }
      }
      /**
       * Number of tween in this sequence
       *
       * @readonly
       * @type {number}
       */
      get count() {
          return this.tweens.length;
      }
      /**
       * @protected
       */
      loopInit() {
          this.index = 0;
          for (const tweenArray of this.tweens) {
              for (const tween of tweenArray) {
                  tween.reset();
              }
          }
      }
      /**
       * Add a child to tick
       *
       * @param {(dt: number) => void} cb
       */
      addTick(cb) {
          this.evtTick.add(cb);
      }
      /**
       * Remove a child to tick
       *
       * @param {(dt: number) => void} cb
       * @memberof Sequence
       */
      removeTick(cb) {
          this.evtTick.delete(cb);
      }
      /**
       * @private
       */
      tick(dt) {
          if (this.state >= 3) {
              return;
          }
          this.remains = dt * this.timescale;
          this.elapsed += this.remains;
          this.localTick(this.remains);
      }
      /**
       * @private
       * @param {number} dt
       * @param {boolean} [remains]
       * @returns
       */
      localTick(dt, remains) {
          // If no current tween, take the first one and start it
          if (!this.cur) {
              this.nextTween();
          }
          if (this.cur) {
              // Tick every listener
              this.evtTick.forEach(function (tick) { tick(dt); });
              // Dont emit update event for remains dt
              if (remains !== true && this.events.update) {
                  this.emitEvent(this.events.update, [dt, 0]);
              }
          }
          this.remains = dt;
          // Current tween over
          if (this.cur) {
              for (const current of this.cur) {
                  if (current.state !== 3 /* Finished */) {
                      return;
                  }
              }
              this.remains = this.cur[0].elapsed - this.cur[0].duration;
              if (this.events.stepEnd) {
                  this.emitEvent(this.events.stepEnd, this.cur[0]);
              }
              this.cur = undefined;
              this.index++;
              if (this.remains > 0.01) {
                  this.localTick(this.remains, true);
                  return;
              }
          }
          // Complete
          if (!this.cur && this.tweens.length === this.index) {
              if (this.loop) {
                  this.loop.value--;
                  if (this.loop.value !== 0) {
                      this.resetAndStart(this.remains);
                      return;
                  }
              }
              this.complete();
          }
      }
      /**
       * @private
       */
      nextTween() {
          this.cur = this.tweens[this.index];
          if (!this.cur) {
              return;
          }
          for (const tween of this.cur) {
              tween.start();
          }
          if (this.events.stepStart) {
              this.emitEvent(this.events.stepStart, this.cur[0]);
          }
      }
      /**
       *
       *
       * @param {(ITween | ISequence)} tween
       * @returns {ISequence}
       * @memberof Sequence
       */
      append(tween) {
          tween.setParent(this);
          this.tweens[this.tweens.length] = [tween];
          return this;
      }
      /**
       *
       *
       * @param {() => void} cb
       * @returns {ISequence}
       * @memberof Sequence
       */
      appendCallback(cb) {
          const playable = new callback_1.Callback(cb);
          playable.setParent(this);
          this.tweens[this.tweens.length] = [playable];
          return this;
      }
      /**
       *
       *
       * @param {number} duration
       * @returns {ISequence}
       * @memberof Sequence
       */
      appendInterval(duration) {
          const playable = new delay_1.Delay(duration);
          playable.setParent(this);
          this.tweens[this.tweens.length] = [playable];
          return this;
      }
      /**
       *
       *
       * @param {(ITween | ISequence)} tween
       * @returns {ISequence}
       * @memberof Sequence
       */
      prepend(tween) {
          tween.setParent(this);
          this.tweens.unshift([tween]);
          return this;
      }
      /**
       *
       *
       * @param {() => void} cb
       * @returns {ISequence}
       * @memberof Sequence
       */
      prependCallback(cb) {
          const playable = new callback_1.Callback(cb);
          playable.setParent(this);
          this.tweens.unshift([playable]);
          return this;
      }
      /**
       *
       *
       * @param {number} duration
       * @returns {ISequence}
       * @memberof Sequence
       */
      prependInterval(duration) {
          const playable = new delay_1.Delay(duration);
          playable.setParent(this);
          this.tweens.unshift([playable]);
          return this;
      }
      /**
       * @inheritdoc
       *
       * @param {boolean} [finalValue]
       * @returns {void}
       */
      skip(finalValue) {
          if (this.state >= 3) {
              this.info(1 /* Info */, 'Cannot skip this tween ', this.state);
              return;
          }
          for (const tweenArray of this.tweens) {
              for (const tween of tweenArray) {
                  if (tween.elapsed === 0) {
                      this.emitEvent(this.events.stepStart, tween);
                  }
                  tween.skip(finalValue);
                  this.emitEvent(this.events.stepEnd, tween);
              }
          }
          super.skip();
      }
      /**
       * @inheritdoc
       */
      kill() {
          if (this.state === 4 /* Killed */) {
              this.info(1 /* Info */, 'Cannot kill this tween ', this.state);
              return;
          }
          for (const tweenArray of this.tweens) {
              for (const tween of tweenArray) {
                  tween.kill();
              }
          }
          super.kill();
      }
      /**
       * @param {(ITween | ISequence)} tween
       * @returns {ISequence}
       */
      join(tween) {
          if (this.tweens.length === 0) {
              return this.append(tween);
          }
          tween.setParent(this);
          this.tweens[this.tweens.length - 1].push(tween);
          return this;
      }
      /**
       *
       *
       * @param {((index: ITween | IPlayable) => void)} cb
       * @returns {ISequence}
       */
      onStepStart(cb) {
          return this.onEvent('stepStart', cb);
      }
      /**
       *
       *
       * @param {((index: ITween | IPlayable) => void)} cb
       * @returns {ISequence}
       */
      onStepEnd(cb) {
          return this.onEvent('stepEnd', cb);
      }
  }
  exports.Sequence = Sequence;


  /***/ }),

  /***/ "./src/tweens/tween.ts":
  /*!*****************************!*\
    !*** ./src/tweens/tween.ts ***!
    \*****************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {

  Object.defineProperty(exports, "__esModule", { value: true });
  const easing_1 = __webpack_require__(/*! ../easing/easing */ "./src/easing/easing.ts");
  const baseTween_1 = __webpack_require__(/*! ./baseTween */ "./src/tweens/baseTween.ts");
  const sequence_1 = __webpack_require__(/*! ./sequence */ "./src/tweens/sequence.ts");
  /**
   * Tween: Used to animate values of an object
   *
   * @export
   * @class Tween
   * @extends {BaseTween}
   * @implements {ITween}
   */
  class Tween extends baseTween_1.BaseTween {
      /**
       * Creates an instance of Tween.
       *
       * @param {*} object
       */
      constructor(object) {
          super();
          /**
           * @private
           */
          this.prop = [];
          // options
          /**
           * @private
           */
          this.steps = 0;
          /**
           * @private
           */
          this.relative = false;
          // cache
          /**
           * @private
           */
          this.p = 0;
          /**
           * @private
           */
          this.v = 0;
          /**
           * @private
           */
          this.remains = 0;
          this.obj = object;
          this.tickCb = this.tick.bind(this);
      }
      /**
       * Used to define the object and the properties modified by this tween
       *
       * @param {*} object
       */
      init(object) {
          this.obj = object;
          this.prop.length = 0;
      }
      /**
       * Method used on start to check the values of this tween
       *
       * @protected
       */
      validate() {
          // Check the object
          if (!this.obj) {
              throw new Error('undefined object');
          }
          // Check this tween will be updated
          if (!this.parent) {
              throw new Error('no ticker');
          }
          // Easing
          if (!this.ease) {
              this.ease = easing_1.easeNames["linear" /* Linear */];
          }
          this.check();
      }
      /**
       * Method used to calculate currentFrom/currentTo based on the config
       *
       * @protected
       */
      check() {
          if (!this.cf) {
              this.cf = {};
          }
          if (!this.ct) {
              this.ct = {};
          }
          for (const prop of this.prop) {
              // From
              if (!this.f) {
                  this.cf[prop] = this.obj[prop];
              }
              else {
                  this.cf[prop] = this.f[prop];
                  this.obj[prop] = this.f[prop];
              }
              // Relative
              if (this.relative) {
                  this.ct[prop] = this.obj[prop] + this.t[prop];
              }
              else {
                  this.ct[prop] = this.t[prop];
              }
          }
      }
      /**
       * @private
       */
      tick(dt) {
          if (this.state >= 3) {
              return;
          }
          this.remains = dt * this.timescale;
          while (this.remains > 0) {
              this.elapsed += this.remains;
              this.p = Math.max(Math.min(this.elapsed / this.duration, 1), 0);
              this.v = this.ease(this.p);
              // Yoyo easing (need to be reversed)
              if (this.yo && (this.yo.original - this.yo.value) % 2 === 1) {
                  this.v = 1 - this.ease(1 - this.p);
              }
              // Steps behaviour
              if (this.steps !== 0) {
                  this.v = Math.round(this.v * this.steps) / this.steps;
              }
              // Update if the object still exist
              for (const prop of this.prop) {
                  this.obj[prop] = this.cf[prop] + (this.ct[prop] - this.cf[prop]) * this.v;
              }
              if (this.events.update) {
                  this.emitEvent(this.events.update, [this.remains, this.p]);
              }
              if (this.elapsed < this.duration) {
                  return;
              }
              this.remains = this.elapsed - this.duration;
              // Yoyo effect ( A -> B -> A )
              if (this.yo && this.yo.value !== 0) {
                  this.reverse();
                  this.resetAndStart(0);
                  this.yo.value--;
                  continue;
              }
              // Loop management
              if (this.loop) {
                  this.loop.value--;
                  if (this.loop.value !== 0) {
                      this.check();
                      this.resetAndStart(0);
                      continue;
                  }
              }
              this.complete();
              return;
          }
      }
      /**
       * Method used to set the values at the beginning of the tween
       *
       * @param {*} from
       * @returns {ITween}
       */
      from(from) {
          this.f = from;
          this.updateProp();
          return this;
      }
      /**
       * Method used to set the values at the end of the tween
       *
       * @param {*} to
       * @param {number} duration
       * @returns {ITween}
       */
      to(to, duration) {
          this.t = to;
          this.duration = duration;
          this.updateProp();
          return this;
      }
      /**
       * Compute the properties
       *
       * @private
       */
      updateProp() {
          if (!this.obj) {
              return;
          }
          for (const index in this.t) {
              if (this.t.hasOwnProperty(index)) {
                  this.prop.push(index);
              }
          }
          this.prop.filter((el, i, a) => i === a.indexOf(el));
      }
      /**
       * Method used to define if the tween as to work in relative or not
       *
       * @param {boolean} relative
       * @returns {ITween}
       */
      setRelative(relative) {
          this.relative = relative;
          return this;
      }
      /**
       * To apply a modifier on a current tween
       *
       * @param {*} diff
       * @param {boolean} updateTo
       */
      modify(diff, updateTo) {
          for (const prop of this.prop) {
              if (!diff.hasOwnProperty(prop)) {
                  continue;
              }
              this.obj[prop] += diff[prop];
              if (updateTo) {
                  this.ct[prop] += diff[prop];
              }
              else {
                  this.cf[prop] += diff[prop];
              }
          }
      }
      /**
       * Overwrite the Reset (just for yoyo)
       *
       * @param {boolean} [skipParent]
       */
      reset(skipParent) {
          if (this.yo) {
              if ((this.yo.original - this.yo.value) % 2 === 1) {
                  let previous = this.cf;
                  this.cf = this.ct;
                  this.ct = previous;
                  previous = this.f;
                  this.f = this.t;
                  this.t = previous;
                  const elapsed = (1 - (this.elapsed / this.duration)) * this.duration;
                  this.elapsed = Math.round(elapsed * 1000) / 1000;
              }
              this.yo.value = this.yo.original;
          }
          super.reset(skipParent);
      }
      /**
       * Method used to reverse the tween
       */
      reverse() {
          let previous = this.cf;
          this.cf = this.ct;
          this.ct = previous;
          previous = this.f;
          this.f = this.t;
          this.t = previous;
          const elapsed = (1 - (this.elapsed / this.duration)) * this.duration;
          this.elapsed = Math.round(elapsed * 1000) / 1000;
          if (this.state === 3 /* Finished */) {
              this.reset(true);
              this.start();
          }
      }
      /**
       * Method used to reverse the tween N times at the end
       *
       * @param {number} time
       * @returns {ITween}
       */
      yoyo(time) {
          if (!this.yo) {
              this.yo = { original: 0, value: 0 };
          }
          this.yo.original = time;
          this.yo.value = time;
          return this;
      }
      /**
       * Method used to Quantify the tween value to a certain amount of steps
       *
       * @param {number} steps
       * @returns {ITween}
       */
      setSteps(steps) {
          this.steps = steps;
          return this;
      }
      /**
       * Method used to create a sequence with this tween as first value.
       * Usually used with .AppendInterval(1250) or .PrependInterval(160) to add a delay
       *
       * @returns {ISequence}
       */
      toSequence() {
          if (!this.parent) {
              throw new Error('parent ticker not defined');
          }
          return new sequence_1.Sequence().setParent(this.parent).append(this);
      }
      /**
       * Method used to set the type of easing for this tween
       *
       * @param {(EasingType | string)} type
       * @returns {ITween}
       */
      setEasing(type) {
          if (!(type in easing_1.easeNames)) {
              throw new Error(`unknown easing method ${type}`);
          }
          this.ease = easing_1.easeNames[type];
          return this;
      }
      /**
       * Method used when the tween is reset (loop)
       *
       * @protected
       */
      loopInit() {
          this.elapsed = 0;
      }
  }
  exports.Tween = Tween;


  /***/ })

  /******/ });
  });

  });

  var Fatina = unwrapExports(fatina);

  class GameObject {
      constructor(store, data) {
          this.dataDefault = {
              id: uid$1(),
              name: "gameobject",
              parentId: "",
              childIds: [],
              componentIds: {},
              enable: true,
              classnames: [],
              opacity: 1
          };
          this.store = store;
          this.data = Object.assign({}, this.dataDefault, data);
          this.onRender = new Event$1();
      }
      get enable() {
          return this.data.enable;
      }
      set enable(value) {
          this.watchedData.enable = value;
          this.scheduleRender();
      }
      get id() {
          return this.data.id;
      }
      get name() {
          return this.data.name;
      }
      set name(value) {
          this.watchedData.name = value;
      }
      get gameobject() {
          return this.store.getEntity(this.data.id);
      }
      get transform() {
          return this.store.getEntity(this.data.componentIds["Transform"]);
      }
      get parent() {
          return this.store.getEntity(this.data.parentId);
      }
      get components() {
          return Object.values(this.data.componentIds).map(x => this.store.getEntity(x));
      }
      get childs() {
          return this.data.childIds.map(x => this.store.getEntity(x));
      }
      get watchedData() {
          return this.store.getData(this.data.id);
      }
      tween() {
          return Fatina.tween(this.data).onUpdate(() => this.updateStyle());
      }
      shake() {
          return Fatina.shake(this.transform, {
              amplitude: 0.3,
              duration: 500
          })
              .onUpdate(() => this.updateStyle())
              .start();
      }
      scale() {
          return Fatina.scale(this.transform, {
              amplitude: 0.3,
              duration: 500
          })
              .onUpdate(() => this.updateStyle())
              .start();
      }
      wobble() {
          return Fatina.wobble(this.transform, {
              amplitude: 0.3,
              duration: 500
          })
              .onUpdate(() => this.updateStyle())
              .start();
      }
      getComponent(id) {
          return this.components.find(x => x.name.toLowerCase() === id.toLowerCase());
      }
      created() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent)
              return;
          if (parent.childIds.indexOf(this.data.id) !== -1)
              return;
          if (!this.store.created.has(this.id))
              return;
          parent.childIds.push(this.data.id);
          const pa = this.store.getEntity(this.data.parentId);
          if (pa)
              pa.scheduleRender();
      }
      deleted() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent || !parent.childIds)
              return;
          parent.childIds = parent.childIds.filter((x) => x !== this.id);
          for (const componentId of Object.values(this.data.componentIds)) {
              this.store.delete(componentId);
          }
          for (const childId of this.data.childIds) {
              this.store.delete(childId);
          }
      }
      createPanel(params = {}) {
          const id = uid$1();
          const panelId = uid$1();
          this.store.create("gameobject", { id, parentId: this.gameobject.id });
          this.store.create("transform", { parentId: id });
          this.store.create("panel", Object.assign({ id: panelId, parentId: id }, params));
          return this.store.getEntity(panelId);
      }
      createImage(params = {}) {
          const id = uid$1();
          const imageId = uid$1();
          this.store.create("gameobject", { id, parentId: this.gameobject.id });
          this.store.create("transform", { parentId: id });
          this.store.create("image", Object.assign({ id: imageId, parentId: id }, params));
          return this.store.getEntity(imageId);
      }
      createImageComponent(params = {}) {
          const imageId = uid$1();
          this.store.create("image", Object.assign({ id: imageId, parentId: this.gameobject.id }, params));
          return this.store.getEntity(imageId);
      }
      createButton() {
          const id = uid$1();
          const buttonId = uid$1();
          this.store.create("gameobject", { id, parentId: this.gameobject.id });
          this.store.create("transform", { parentId: id });
          this.store.create("button", { id: buttonId, parentId: id });
          return this.store.getEntity(buttonId);
      }
      createGridLayout(params = {}) {
          const id = uid$1();
          this.store.create("gridlayout", Object.assign({ id, parentId: this.gameobject.id }, params));
          return this.store.getEntity(id);
      }
      getStyles() {
          const styles = {};
          if (this.data.opacity !== 1)
              styles.opacity = this.data.opacity.toString();
          const transform = this.transform.toCss();
          return Object.assign(styles, transform);
      }
      scheduleRender() {
          Fatina.setTimeout(() => this.render(), 1);
      }
      renderChild() {
          const comp = this.gameobject.components.map(child => child.render()).filter(x => !!x);
          const childs = this.gameobject.childs.map(child => child.render()).filter(x => !!x);
          return [...comp, ...childs];
      }
      updateChilds() {
          setChildren(this._element, this.renderChild());
      }
      updateStyle() {
          var classes = ["gameobject", ...this.data.classnames];
          if (!this.data.enable)
              classes.push("disabled");
          setAttr(this._element, "class", classes.join(" "));
          setStyle(this._element, this.getStyles());
      }
      render() {
          var classes = ["gameobject", ...this.data.classnames];
          if (!this.data.enable)
              classes.push("disabled");
          if (!this._element) {
              this._element = el("div", {
                  id: this.data.id,
                  key: this.data.id
              }, this.renderChild());
              this.updateStyle();
              return this._element;
          }
          this.updateChilds();
          this.updateStyle();
          this.onRender.emit();
          return this._element;
      }
  }

  class Component$1 {
      constructor(store, data) {
          this.dataDefault = {
              id: uid$1(),
              parentId: "",
              type: "",
              enable: true
          };
          this.store = store;
          this.data = Object.assign({}, this.dataDefault, data);
      }
      get id() {
          return this.data.id;
      }
      get name() {
          return this.data.type;
      }
      get gameobject() {
          return this.store.getEntity(this.data.parentId);
      }
      get transform() {
          return this.gameobject.transform;
      }
      get watchedData() {
          return this.store.getData(this.data.id);
      }
      created() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent)
              return;
          if (this.data.type in parent.componentIds)
              return;
          if (!this.store.created.has(this.id))
              return;
          parent.componentIds[this.data.type] = this.data.id;
          const pa = this.store.getEntity(this.data.parentId);
          if (pa)
              pa.scheduleRender();
      }
      deleted() {
          const parent = this.store.getData(this.data.parentId);
          if (!parent || !parent.componentIds)
              return;
          delete parent.componentIds[this.data.type];
      }
      tween() {
          return Fatina.tween(this.data).onUpdate(() => this.updateStyle());
      }
      mounted() { }
      unmounted() { }
      enabled() { }
      disabled() { }
      updateStyle() { }
      render() {
          return undefined;
      }
  }

  class Vector2 {
      constructor(parent, getter) {
          this.parent = parent;
          this.getter = getter;
      }
      get x() {
          return this.getter()[0];
      }
      set x(val) {
          this.getter()[0] = val;
      }
      get y() {
          return this.getter()[1];
      }
      set y(val) {
          this.getter()[1] = val;
      }
      set(x = 0, y = 0) {
          this.x = x;
          this.y = y;
      }
      setPx(x = 0, y = 0) {
          this.set(x / 1280, y / 720);
      }
      add(x = 0, y = 0) {
          this.x += x;
          this.y += y;
      }
      addPx(x = 0, y = 0) {
          this.add(x / 1280, y / 720);
      }
      scale(x = 0, y = 0) {
          this.x *= x;
          this.y *= y;
      }
      tween() {
          return Fatina.tween(this).onUpdate(() => this.parent.gameobject.updateStyle());
      }
  }

  class Vector3 {
      constructor(parent, getter) {
          this.parent = parent;
          this.getter = getter;
      }
      get x() {
          return this.getter()[0];
      }
      set x(val) {
          this.getter()[0] = val;
      }
      get y() {
          return this.getter()[1];
      }
      set y(val) {
          this.getter()[1] = val;
      }
      get z() {
          return this.getter()[2];
      }
      set z(val) {
          this.getter()[2] = val;
      }
      set(x = 0, y = 0, z = 0) {
          this.x = x;
          this.y = y;
          this.z = z;
      }
      add(x = 0, y = 0, z = 0) {
          this.x += x;
          this.y += y;
          this.z += z;
      }
      scale(x = 0, y = 0, z = 0) {
          this.x *= x;
          this.y *= y;
          this.z *= z;
      }
      tween() {
          return Fatina.tween(this).onUpdate(() => this.parent.gameobject.updateStyle());
      }
  }

  class TransformComponent$1 extends Component$1 {
      constructor(store, data) {
          if (!data.type)
              data.type = "Transform";
          super(store, data);
          const transformDataDefault = {
              position: [0, 0],
              rotation: [0, 0, 0],
              scale: [1, 1],
              anchor: [0.5, 0.5],
              pivot: [0.5, 0.5],
              size: [1, 1]
          };
          this.data = Object.assign({}, transformDataDefault, data);
      }
      get position() {
          return this._position;
      }
      get rotation() {
          return this._rotation;
      }
      get scale() {
          return this._scale;
      }
      get anchor() {
          return this._anchor;
      }
      get size() {
          return this._size;
      }
      get pivot() {
          return this._pivot;
      }
      created() {
          super.created();
          const transData = this.data;
          this._position = new Vector2(this, () => transData.position);
          this._rotation = new Vector3(this, () => transData.rotation);
          this._scale = new Vector2(this, () => transData.scale);
          this._pivot = new Vector2(this, () => transData.pivot);
          this._anchor = new Vector2(this, () => transData.anchor);
          this._size = new Vector2(this, () => transData.size);
      }
      toCss() {
          const x = (this.anchor.x / this.size.x - this.pivot.x + this.position.x / this.size.x) * 100;
          const y = (this.anchor.y / this.size.y - this.pivot.y + this.position.y / this.size.y) * 100;
          const style = {};
          if (this.size.x !== 1)
              style.width = `${this.size.x * 100}%`;
          if (this.size.y !== 1)
              style.height = `${this.size.y * 100}%`;
          let transform = "";
          if (this.anchor.x != 0.5 && this.anchor.y != 0.5) {
              style.transformOrigin = `${this.anchor.x * 100}% ${this.anchor.y * 100}%`;
          }
          if (x !== 0 || y !== 0) {
              transform += `translate(${x}%, ${y}%) `;
          }
          if (this.rotation.z !== 0) {
              transform += `rotate(${this.rotation.z}deg)`;
          }
          if (this.scale.x !== 1 || this.scale.y !== 1) {
              transform += `scale(${this.scale.x}, ${this.scale.y}) `;
          }
          if (transform)
              style.transform = transform;
          return style;
      }
  }

  class ButtonComponent extends Component$1 {
      constructor(store, data) {
          if (!data.type)
              data.type = "Button";
          super(store, data);
          const sceneDataDefault = {
              text: "Button",
              disabled: false
          };
          this.data = Object.assign({}, sceneDataDefault, data);
      }
      getClass() {
          const data = this.data;
          if (data.disabled)
              ;
      }
      render() {
          if (!this._element) {
              this._element = el("button", {
                  id: this.data.id,
                  key: this.data.id,
                  class: "Button"
              }, this.data.text);
              return this._element;
          }
          const btn = this._element;
          btn.textContent = this.data.text;
          return this._element;
      }
  }

  class ImageComponent extends Component$1 {
      constructor(store, data) {
          if (!data.type)
              data.type = "Image";
          super(store, data);
          const sceneDataDefault = {
              src: "https://pixijs.io/examples/examples/assets/bunny.png",
              opacity: 1
          };
          this.data = Object.assign({}, sceneDataDefault, data);
          const root = window;
          root.image = (root.image || 0) + 1;
      }
      updateStyle() {
          const data = this.data;
          setAttr(this._element, "src", data.src);
          setStyle(this._element, { opacity: data.opacity });
      }
      render() {
          if (!this._element) {
              this._element = el("img", {
                  id: this.data.id,
                  key: this.data.id,
                  class: "image"
              });
              this.updateStyle();
              return this._element;
          }
          return this._element;
      }
  }

  class PanelComponent extends Component$1 {
      constructor(store, data) {
          if (!data.type)
              data.type = "Panel";
          super(store, data);
          const sceneDataDefault = {};
          this.data = Object.assign({}, sceneDataDefault, data);
      }
      render() {
          if (!this._element) {
              this._element = el("span", {
                  id: this.id,
                  key: this.id,
                  class: "panel"
              });
          }
          return this._element;
      }
  }

  class SceneComponent extends Component$1 {
      constructor(store, data) {
          if (!data.type)
              data.type = "Scene";
          super(store, data);
          const sceneDataDefault = {};
          this.data = Object.assign({}, sceneDataDefault, data);
          window.addEventListener("resize", () => this.refreshStyle());
      }
      created() {
          super.created();
          this.gameobject.onRender.on(() => this.refreshStyle());
      }
      refreshStyle() {
          const ratio = Math.min(this.store.data.settings.container.height / this.store.data.settings.resolution.height, this.store.data.settings.container.width / this.store.data.settings.resolution.width);
          var classes = ["scene"];
          if (!this.gameobject.enable)
              classes.push("disabled");
          setAttr(this._element, "class", classes.join(" "));
          var css = Object.assign(this.transform.toCss(), {
              width: `${this.store.data.settings.resolution.width}px`,
              height: `${this.store.data.settings.resolution.height}px`,
              transformOrigin: `top left`,
              transform: `scale(${ratio})`
          });
          setStyle(this._element, css);
      }
      render() {
          if (!this._element) {
              this._element = el("div", {
                  id: this.data.id,
                  key: this.data.id
              }, this.gameobject.childs.map(child => child.render()));
              this.refreshStyle();
              return this._element;
          }
          setChildren(this._element, this.gameobject.childs.map(child => child.render()));
          this.refreshStyle();
          return this._element;
      }
  }

  class GridLayoutComponent extends Component$1 {
      constructor(store, data) {
          if (!data.type)
              data.type = "GridLayout";
          super(store, data);
          const sceneDataDefault = {
              row: 0,
              col: 0,
              cellWidth: 0,
              cellHeight: 0
          };
          this.data = Object.assign({}, sceneDataDefault, data);
      }
      get row() {
          return this.data.row;
      }
      set row(val) {
          this.watchedData.row = val;
      }
      get col() {
          return this.data.col;
      }
      set col(val) {
          this.watchedData.col = val;
      }
      created() {
          super.created();
          this.gameobject.onRender.on(() => this.render());
      }
      render() {
          var row = 0;
          var col = 0;
          for (var child of this.gameobject.childs) {
              const transform = child.transform;
              if (this.data.cellWidth > 0) {
                  transform.size.x = this.data.cellWidth;
              }
              else {
                  transform.size.x = this.data.col > 0 ? 1 / this.data.col : 1;
              }
              if (this.data.cellHeight > 0) {
                  transform.size.y = this.data.cellHeight;
              }
              else {
                  transform.size.y = this.data.row > 0 ? 1 / this.data.row : 1;
              }
              transform.position.x = row * transform.size.x - 0.5 + transform.size.x / 2;
              transform.position.y = col * transform.size.y - 0.5 + transform.size.y / 2;
              if (this.data.row > 0) {
                  row++;
                  if (row >= this.data.row) {
                      row = 0;
                      col++;
                  }
              }
              else if (this.data.col > 0) {
                  col++;
                  if (col >= this.data.col) {
                      col = 0;
                      row++;
                  }
              }
          }
          if (!this._element) {
              this._element = el("span", {
                  id: this.id,
                  key: this.id,
                  class: "grid"
              });
          }
          return this._element;
      }
  }

  class Window {
      constructor(html) {
          this.html = html;
          this.sceneIds = [];
          this._store = Kaaya.createEntityStore();
          this._store.data.settings = {
              scene: {
                  active: ""
              },
              resolution: {
                  width: 1280,
                  height: 720
              },
              container: {
                  width: 0,
                  height: 0
              },
              styles: {
                  position: "absolute",
                  width: "100vw",
                  height: "100vh",
                  top: "0px",
                  left: "0px"
              }
          };
          // this._store.observe(mut => console.log(mut))
          console.log("youhou ! ");
          // core
          this._store.register("gameobject", (store, data) => new GameObject(store, data));
          this._store.register("transform", (store, data) => new TransformComponent$1(store, data));
          // components
          this._store.register("scene", (store, data) => new SceneComponent(store, data));
          this._store.register("image", (store, data) => new ImageComponent(store, data));
          this._store.register("panel", (store, data) => new PanelComponent(store, data));
          this._store.register("button", (store, data) => new ButtonComponent(store, data));
          // layouts
          this._store.register("gridlayout", (store, data) => new GridLayoutComponent(store, data));
          this._element = this.render();
          mount(html, this._element);
          window.addEventListener("resize", () => this.refreshSize());
          this.refreshSize();
      }
      get settings() {
          return this._store.data.settings;
      }
      refreshSize() {
          const ratio = this.html.clientWidth / this.html.clientHeight;
          this.settings.container.width = this.html.clientWidth;
          this.settings.container.height = this.html.clientHeight;
          const expected = this.settings.resolution.width / this.settings.resolution.height;
          if (common.numberEqual(ratio, expected))
              return;
          if (ratio > expected) {
              this.settings.styles.height = `100vh`;
              this.settings.styles.width = `${100 * expected}vh`;
              this.settings.styles.top = `0px`;
              this.settings.styles.left = `${(this.html.clientWidth - this.html.clientHeight * expected) / 2}px`;
          }
          else {
              this.settings.styles.width = `100vw`;
              this.settings.styles.height = `${100 / expected}vw`;
              this.settings.styles.top = `${(this.html.clientHeight - this.html.clientWidth / expected) / 2}px`;
              this.settings.styles.left = `0px`;
          }
          this.render();
      }
      createScene(id) {
          this.sceneIds.push(id);
          const sceneId = uid$1();
          this._store.create("gameobject", { id, enable: false });
          this._store.create("transform", { parentId: id });
          this._store.create("scene", { id: sceneId, parentId: id });
          this.scheduleRender();
          if (StringExt.isNullOrEmpty(this.settings.scene.active)) {
              this.switchScene(id);
          }
          return this._store.getEntity(sceneId);
      }
      switchScene(id) {
          if (StringExt.isNullOrEmpty(id))
              throw new Error(`Wrong parameters`);
          if (this.settings.scene.active === id)
              throw new Error(`Wrong parameters`);
          if (!StringExt.isNullOrEmpty(this.settings.scene.active)) {
              const prev = this._store.getEntity(this.settings.scene.active);
              prev.enable = false;
          }
          this.settings.scene.active = id;
          const go = this._store.getEntity(id);
          go.enable = true;
      }
      deleteScene(id) {
          this._store.delete(id);
          this.scheduleRender();
      }
      getStyle() {
          return {
              position: this.settings.styles.position,
              width: this.settings.styles.width,
              height: this.settings.styles.height,
              top: this.settings.styles.top,
              left: this.settings.styles.left
          };
      }
      scheduleRender() {
          Fatina.setTimeout(() => this.render(), 50);
      }
      renderChild() {
          return this.sceneIds.map(id => {
              var scene = this._store.getEntity(id).components.find(x => x.name === "Scene");
              return scene.render();
          });
      }
      updateChildren() {
          setChildren(this._element, this.renderChild());
      }
      updateStyle() {
          setStyle(this._element, this.getStyle());
      }
      render() {
          if (!this._element) {
              this._element = el("div", {
                  id: "window",
                  class: "window"
              }, this.renderChild());
              this.updateStyle();
              return this._element;
          }
          this.updateChildren();
          this.updateStyle();
          return this._element;
      }
  }

  // Prefab
  function initialize(app) {
      return new Window(app);
  }

  exports.initialize = initialize;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
