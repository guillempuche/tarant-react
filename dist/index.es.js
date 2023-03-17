function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import require$$0 from 'react';
function shallowCopyOfActorState(actor) {
  var copy = _objectSpread({}, actor);
  delete copy.self;
  delete copy.materializers;
  delete copy.scheduled;
  delete copy.topicSubscriptions;
  delete copy.busy;
  delete copy.partitions;
  delete copy.system;
  delete copy.supervisor;
  delete copy.__reactState;
  delete copy.__reactSnapshot;
  delete copy.__reactSubs;
  // Make the actor state immutable.
  return Object.freeze(copy);
}
var ReactMaterializer = /*#__PURE__*/function () {
  function ReactMaterializer() {
    _classCallCheck(this, ReactMaterializer);
  }
  _createClass(ReactMaterializer, [{
    key: "onInitialize",
    value: function onInitialize(actor) {
      actor.__reactState = shallowCopyOfActorState(actor);
      actor.__reactSnapshot = function () {
        return actor.__reactState;
      };
      actor.__reactSubs = new Map();
    }
  }, {
    key: "onBeforeMessage",
    value: function onBeforeMessage(actor, message) {}
  }, {
    key: "onAfterMessage",
    value: function onAfterMessage(actor, message) {
      actor.self.ref.__reactState = shallowCopyOfActorState(actor);
      actor.self.ref.__reactSubs.forEach(function (cb) {
        return cb();
      });
    }
  }, {
    key: "onError",
    value: function onError(actor, message, error) {
      console.error(error);
    }
  }]);
  return ReactMaterializer;
}();
var shimExports = {};
var shim = {
  get exports() {
    return shimExports;
  },
  set exports(v) {
    shimExports = v;
  }
};
var useSyncExternalStoreShim_production_min = {};

/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredUseSyncExternalStoreShim_production_min;
function requireUseSyncExternalStoreShim_production_min() {
  if (hasRequiredUseSyncExternalStoreShim_production_min) return useSyncExternalStoreShim_production_min;
  hasRequiredUseSyncExternalStoreShim_production_min = 1;
  var e = require$$0;
  function h(a, b) {
    return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
  }
  var k = "function" === typeof Object.is ? Object.is : h,
    l = e.useState,
    m = e.useEffect,
    n = e.useLayoutEffect,
    p = e.useDebugValue;
  function q(a, b) {
    var d = b(),
      f = l({
        inst: {
          value: d,
          getSnapshot: b
        }
      }),
      c = f[0].inst,
      g = f[1];
    n(function () {
      c.value = d;
      c.getSnapshot = b;
      r(c) && g({
        inst: c
      });
    }, [a, d, b]);
    m(function () {
      r(c) && g({
        inst: c
      });
      return a(function () {
        r(c) && g({
          inst: c
        });
      });
    }, [a]);
    p(d);
    return d;
  }
  function r(a) {
    var b = a.getSnapshot;
    a = a.value;
    try {
      var d = b();
      return !k(a, d);
    } catch (f) {
      return !0;
    }
  }
  function t(a, b) {
    return b();
  }
  var u = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t : q;
  useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e.useSyncExternalStore ? e.useSyncExternalStore : u;
  return useSyncExternalStoreShim_production_min;
}
var useSyncExternalStoreShim_development = {};

/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredUseSyncExternalStoreShim_development;
function requireUseSyncExternalStoreShim_development() {
  if (hasRequiredUseSyncExternalStoreShim_development) return useSyncExternalStoreShim_development;
  hasRequiredUseSyncExternalStoreShim_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function () {
      /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === 'function') {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      }
      var React = require$$0;
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning('error', format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        // When changing this logic, you might want to also
        // update consoleWithStackDev.www.js as well.
        {
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame.getStackAddendum();
          if (stack !== '') {
            format += '%s';
            args = args.concat([stack]);
          } // eslint-disable-next-line react-internal/safe-string-coercion

          var argsWithFormat = args.map(function (item) {
            return String(item);
          }); // Careful: RN currently depends on this prefix

          argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
          // breaks IE9: https://github.com/facebook/react/issues/13610
          // eslint-disable-next-line react-internal/no-production-logging

          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }

      /**
       * inlined Object.is polyfill to avoid requiring consumers ship their own
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
       */
      function is(x, y) {
        return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
        ;
      }

      var objectIs = typeof Object.is === 'function' ? Object.is : is;

      // dispatch for CommonJS interop named imports.

      var useState = React.useState,
        useEffect = React.useEffect,
        useLayoutEffect = React.useLayoutEffect,
        useDebugValue = React.useDebugValue;
      var didWarnOld18Alpha = false;
      var didWarnUncachedGetSnapshot = false; // Disclaimer: This shim breaks many of the rules of React, and only works
      // because of a very particular set of implementation details and assumptions
      // -- change any one of them and it will break. The most important assumption
      // is that updates are always synchronous, because concurrent rendering is
      // only available in versions of React that also have a built-in
      // useSyncExternalStore API. And we only use this shim when the built-in API
      // does not exist.
      //
      // Do not assume that the clever hacks used by this hook also work in general.
      // The point of this shim is to replace the need for hacks by other libraries.

      function useSyncExternalStore(subscribe, getSnapshot,
      // Note: The shim does not use getServerSnapshot, because pre-18 versions of
      // React do not expose a way to check if we're hydrating. So users of the shim
      // will need to track that themselves and return the correct value
      // from `getSnapshot`.
      getServerSnapshot) {
        {
          if (!didWarnOld18Alpha) {
            if (React.startTransition !== undefined) {
              didWarnOld18Alpha = true;
              error('You are using an outdated, pre-release alpha of React 18 that ' + 'does not support useSyncExternalStore. The ' + 'use-sync-external-store shim will not work correctly. Upgrade ' + 'to a newer pre-release.');
            }
          }
        } // Read the current snapshot from the store on every render. Again, this
        // breaks the rules of React, and only works here because of specific
        // implementation details, most importantly that updates are
        // always synchronous.

        var value = getSnapshot();
        {
          if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            if (!objectIs(value, cachedValue)) {
              error('The result of getSnapshot should be cached to avoid an infinite loop');
              didWarnUncachedGetSnapshot = true;
            }
          }
        } // Because updates are synchronous, we don't queue them. Instead we force a
        // re-render whenever the subscribed state changes by updating an some
        // arbitrary useState hook. Then, during render, we call getSnapshot to read
        // the current value.
        //
        // Because we don't actually use the state returned by the useState hook, we
        // can save a bit of memory by storing other stuff in that slot.
        //
        // To implement the early bailout, we need to track some things on a mutable
        // object. Usually, we would put that in a useRef hook, but we can stash it in
        // our useState hook instead.
        //
        // To force a re-render, we call forceUpdate({inst}). That works because the
        // new object always fails an equality check.

        var _useState = useState({
            inst: {
              value: value,
              getSnapshot: getSnapshot
            }
          }),
          inst = _useState[0].inst,
          forceUpdate = _useState[1]; // Track the latest getSnapshot function with a ref. This needs to be updated
        // in the layout phase so we can access it during the tearing check that
        // happens on subscribe.

        useLayoutEffect(function () {
          inst.value = value;
          inst.getSnapshot = getSnapshot; // Whenever getSnapshot or subscribe changes, we need to check in the
          // commit phase if there was an interleaved mutation. In concurrent mode
          // this can happen all the time, but even in synchronous mode, an earlier
          // effect may have mutated the store.

          if (checkIfSnapshotChanged(inst)) {
            // Force a re-render.
            forceUpdate({
              inst: inst
            });
          }
        }, [subscribe, value, getSnapshot]);
        useEffect(function () {
          // Check for changes right before subscribing. Subsequent changes will be
          // detected in the subscription handler.
          if (checkIfSnapshotChanged(inst)) {
            // Force a re-render.
            forceUpdate({
              inst: inst
            });
          }
          var handleStoreChange = function handleStoreChange() {
            // TODO: Because there is no cross-renderer API for batching updates, it's
            // up to the consumer of this library to wrap their subscription event
            // with unstable_batchedUpdates. Should we try to detect when this isn't
            // the case and print a warning in development?
            // The store changed. Check if the snapshot changed since the last time we
            // read from the store.
            if (checkIfSnapshotChanged(inst)) {
              // Force a re-render.
              forceUpdate({
                inst: inst
              });
            }
          }; // Subscribe to the store and return a clean-up function.

          return subscribe(handleStoreChange);
        }, [subscribe]);
        useDebugValue(value);
        return value;
      }
      function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        var prevValue = inst.value;
        try {
          var nextValue = latestGetSnapshot();
          return !objectIs(prevValue, nextValue);
        } catch (error) {
          return true;
        }
      }
      function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
        // Note: The shim does not use getServerSnapshot, because pre-18 versions of
        // React do not expose a way to check if we're hydrating. So users of the shim
        // will need to track that themselves and return the correct value
        // from `getSnapshot`.
        return getSnapshot();
      }
      var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');
      var isServerEnvironment = !canUseDOM;
      var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
      var useSyncExternalStore$2 = React.useSyncExternalStore !== undefined ? React.useSyncExternalStore : shim;
      useSyncExternalStoreShim_development.useSyncExternalStore = useSyncExternalStore$2;
      /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === 'function') {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
      }
    })();
  }
  return useSyncExternalStoreShim_development;
}
(function (module) {
  if (process.env.NODE_ENV === 'production') {
    module.exports = requireUseSyncExternalStoreShim_production_min();
  } else {
    module.exports = requireUseSyncExternalStoreShim_development();
  }
})(shim);

// This doesn't work in ESM, because use-sync-external-store only exposes CJS.
var useActorState = function useActorState(actor) {
  function subscribe(callback) {
    var subId = +new Date();
    actor.ref.__reactSubs.set(subId, callback);
    return function () {
      actor.ref.__reactSubs["delete"](subId);
    };
  }
  function getSnapshot() {
    return actor.ref.__reactState;
  }
  return shimExports.useSyncExternalStore(subscribe, getSnapshot);
};
export { ReactMaterializer, useActorState };
//# sourceMappingURL=index.es.js.map
