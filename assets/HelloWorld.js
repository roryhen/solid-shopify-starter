const W = (e, s) => e === s, D = {
  equals: W
};
let G = j;
const w = 1, S = 2, U = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var h = null;
let T = null, M = null, f = null, u = null, g = null, E = 0;
function V(e, s) {
  const t = f, n = h, l = e.length === 0, i = s === void 0 ? n : s, r = l ? U : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, o = l ? e : () => e(() => x(() => m(r)));
  h = r, f = null;
  try {
    return b(o, !0);
  } finally {
    f = t, h = n;
  }
}
function Q(e, s) {
  s = s ? Object.assign({}, D, s) : D;
  const t = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: s.equals || void 0
  }, n = (l) => (typeof l == "function" && (l = l(t.value)), H(t, l));
  return [X.bind(t), n];
}
function $(e, s, t) {
  const n = K(e, s, !1, w);
  B(n);
}
function x(e) {
  if (f === null)
    return e();
  const s = f;
  f = null;
  try {
    return e();
  } finally {
    f = s;
  }
}
function X() {
  if (this.sources && this.state)
    if (this.state === w)
      B(this);
    else {
      const e = u;
      u = null, b(() => A(this), !1), u = e;
    }
  if (f) {
    const e = this.observers ? this.observers.length : 0;
    f.sources ? (f.sources.push(this), f.sourceSlots.push(e)) : (f.sources = [this], f.sourceSlots = [e]), this.observers ? (this.observers.push(f), this.observerSlots.push(f.sources.length - 1)) : (this.observers = [f], this.observerSlots = [f.sources.length - 1]);
  }
  return this.value;
}
function H(e, s, t) {
  let n = e.value;
  return (!e.comparator || !e.comparator(n, s)) && (e.value = s, e.observers && e.observers.length && b(() => {
    for (let l = 0; l < e.observers.length; l += 1) {
      const i = e.observers[l], r = T && T.running;
      r && T.disposed.has(i), (r ? !i.tState : !i.state) && (i.pure ? u.push(i) : g.push(i), i.observers && q(i)), r || (i.state = w);
    }
    if (u.length > 1e6)
      throw u = [], new Error();
  }, !1)), s;
}
function B(e) {
  if (!e.fn)
    return;
  m(e);
  const s = E;
  J(e, e.value, s);
}
function J(e, s, t) {
  let n;
  const l = h, i = f;
  f = h = e;
  try {
    n = e.fn(s);
  } catch (r) {
    return e.pure && (e.state = w, e.owned && e.owned.forEach(m), e.owned = null), e.updatedAt = t + 1, F(r);
  } finally {
    f = i, h = l;
  }
  (!e.updatedAt || e.updatedAt <= t) && (e.updatedAt != null && "observers" in e ? H(e, n) : e.value = n, e.updatedAt = t);
}
function K(e, s, t, n = w, l) {
  const i = {
    fn: e,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: s,
    owner: h,
    context: h ? h.context : null,
    pure: t
  };
  return h === null || h !== U && (h.owned ? h.owned.push(i) : h.owned = [i]), i;
}
function O(e) {
  if (e.state === 0)
    return;
  if (e.state === S)
    return A(e);
  if (e.suspense && x(e.suspense.inFallback))
    return e.suspense.effects.push(e);
  const s = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < E); )
    e.state && s.push(e);
  for (let t = s.length - 1; t >= 0; t--)
    if (e = s[t], e.state === w)
      B(e);
    else if (e.state === S) {
      const n = u;
      u = null, b(() => A(e, s[0]), !1), u = n;
    }
}
function b(e, s) {
  if (u)
    return e();
  let t = !1;
  s || (u = []), g ? t = !0 : g = [], E++;
  try {
    const n = e();
    return Y(t), n;
  } catch (n) {
    t || (g = null), u = null, F(n);
  }
}
function Y(e) {
  if (u && (j(u), u = null), e)
    return;
  const s = g;
  g = null, s.length && b(() => G(s), !1);
}
function j(e) {
  for (let s = 0; s < e.length; s++)
    O(e[s]);
}
function A(e, s) {
  e.state = 0;
  for (let t = 0; t < e.sources.length; t += 1) {
    const n = e.sources[t];
    if (n.sources) {
      const l = n.state;
      l === w ? n !== s && (!n.updatedAt || n.updatedAt < E) && O(n) : l === S && A(n, s);
    }
  }
}
function q(e) {
  for (let s = 0; s < e.observers.length; s += 1) {
    const t = e.observers[s];
    t.state || (t.state = S, t.pure ? u.push(t) : g.push(t), t.observers && q(t));
  }
}
function m(e) {
  let s;
  if (e.sources)
    for (; e.sources.length; ) {
      const t = e.sources.pop(), n = e.sourceSlots.pop(), l = t.observers;
      if (l && l.length) {
        const i = l.pop(), r = t.observerSlots.pop();
        n < l.length && (i.sourceSlots[r] = n, l[n] = i, t.observerSlots[n] = r);
      }
    }
  if (e.owned) {
    for (s = e.owned.length - 1; s >= 0; s--)
      m(e.owned[s]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (s = e.cleanups.length - 1; s >= 0; s--)
      e.cleanups[s]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Z(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function F(e, s = h) {
  throw Z(e);
}
function k(e, s) {
  return x(() => e(s || {}));
}
function z(e, s, t) {
  let n = t.length, l = s.length, i = n, r = 0, o = 0, c = s[l - 1].nextSibling, p = null;
  for (; r < l || o < i; ) {
    if (s[r] === t[o]) {
      r++, o++;
      continue;
    }
    for (; s[l - 1] === t[i - 1]; )
      l--, i--;
    if (l === r) {
      const a = i < n ? o ? t[o - 1].nextSibling : t[i - o] : c;
      for (; o < i; )
        e.insertBefore(t[o++], a);
    } else if (i === o)
      for (; r < l; )
        (!p || !p.has(s[r])) && s[r].remove(), r++;
    else if (s[r] === t[i - 1] && t[o] === s[l - 1]) {
      const a = s[--l].nextSibling;
      e.insertBefore(t[o++], s[r++].nextSibling), e.insertBefore(t[--i], a), s[l] = t[i];
    } else {
      if (!p) {
        p = /* @__PURE__ */ new Map();
        let d = o;
        for (; d < i; )
          p.set(t[d], d++);
      }
      const a = p.get(s[r]);
      if (a != null)
        if (o < a && a < i) {
          let d = r, v = 1, _;
          for (; ++d < l && d < i && !((_ = p.get(s[d])) == null || _ !== a + v); )
            v++;
          if (v > a - o) {
            const R = s[r];
            for (; o < a; )
              e.insertBefore(t[o++], R);
          } else
            e.replaceChild(t[o++], s[r++]);
        } else
          r++;
      else
        s[r++].remove();
    }
  }
}
const L = "_$DX_DELEGATE";
function ee(e, s, t, n = {}) {
  let l;
  return V((i) => {
    l = i, s === document ? e() : I(s, e(), s.firstChild ? null : void 0, t);
  }, n.owner), () => {
    l(), s.textContent = "";
  };
}
function te(e, s, t) {
  let n;
  const l = () => {
    const r = document.createElement("template");
    return r.innerHTML = e, t ? r.content.firstChild.firstChild : r.content.firstChild;
  }, i = s ? () => x(() => document.importNode(n || (n = l()), !0)) : () => (n || (n = l())).cloneNode(!0);
  return i.cloneNode = i, i;
}
function se(e, s = window.document) {
  const t = s[L] || (s[L] = /* @__PURE__ */ new Set());
  for (let n = 0, l = e.length; n < l; n++) {
    const i = e[n];
    t.has(i) || (t.add(i), s.addEventListener(i, ne));
  }
}
function I(e, s, t, n) {
  if (t !== void 0 && !n && (n = []), typeof s != "function")
    return C(e, s, n, t);
  $((l) => C(e, s(), l, t), n);
}
function ne(e) {
  const s = `$$${e.type}`;
  let t = e.composedPath && e.composedPath()[0] || e.target;
  for (e.target !== t && Object.defineProperty(e, "target", {
    configurable: !0,
    value: t
  }), Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }); t; ) {
    const n = t[s];
    if (n && !t.disabled) {
      const l = t[`${s}Data`];
      if (l !== void 0 ? n.call(t, l, e) : n.call(t, e), e.cancelBubble)
        return;
    }
    t = t._$host || t.parentNode || t.host;
  }
}
function C(e, s, t, n, l) {
  for (; typeof t == "function"; )
    t = t();
  if (s === t)
    return t;
  const i = typeof s, r = n !== void 0;
  if (e = r && t[0] && t[0].parentNode || e, i === "string" || i === "number")
    if (i === "number" && (s = s.toString()), r) {
      let o = t[0];
      o && o.nodeType === 3 ? o.data !== s && (o.data = s) : o = document.createTextNode(s), t = y(e, t, n, o);
    } else
      t !== "" && typeof t == "string" ? t = e.firstChild.data = s : t = e.textContent = s;
  else if (s == null || i === "boolean")
    t = y(e, t, n);
  else {
    if (i === "function")
      return $(() => {
        let o = s();
        for (; typeof o == "function"; )
          o = o();
        t = C(e, o, t, n);
      }), () => t;
    if (Array.isArray(s)) {
      const o = [], c = t && Array.isArray(t);
      if (N(o, s, t, l))
        return $(() => t = C(e, o, t, n, !0)), () => t;
      if (o.length === 0) {
        if (t = y(e, t, n), r)
          return t;
      } else
        c ? t.length === 0 ? P(e, o, n) : z(e, t, o) : (t && y(e), P(e, o));
      t = o;
    } else if (s.nodeType) {
      if (Array.isArray(t)) {
        if (r)
          return t = y(e, t, n, s);
        y(e, t, null, s);
      } else
        t == null || t === "" || !e.firstChild ? e.appendChild(s) : e.replaceChild(s, e.firstChild);
      t = s;
    }
  }
  return t;
}
function N(e, s, t, n) {
  let l = !1;
  for (let i = 0, r = s.length; i < r; i++) {
    let o = s[i], c = t && t[i], p;
    if (!(o == null || o === !0 || o === !1))
      if ((p = typeof o) == "object" && o.nodeType)
        e.push(o);
      else if (Array.isArray(o))
        l = N(e, o, c) || l;
      else if (p === "function")
        if (n) {
          for (; typeof o == "function"; )
            o = o();
          l = N(e, Array.isArray(o) ? o : [o], Array.isArray(c) ? c : [c]) || l;
        } else
          e.push(o), l = !0;
      else {
        const a = String(o);
        c && c.nodeType === 3 && c.data === a ? e.push(c) : e.push(document.createTextNode(a));
      }
  }
  return l;
}
function P(e, s, t = null) {
  for (let n = 0, l = s.length; n < l; n++)
    e.insertBefore(s[n], t);
}
function y(e, s, t, n) {
  if (t === void 0)
    return e.textContent = "";
  const l = n || document.createTextNode("");
  if (s.length) {
    let i = !1;
    for (let r = s.length - 1; r >= 0; r--) {
      const o = s[r];
      if (l !== o) {
        const c = o.parentNode === e;
        !i && !r ? c ? e.replaceChild(l, o) : e.insertBefore(l, t) : c && o.remove();
      } else
        i = !0;
    }
  } else
    e.insertBefore(l, t);
  return [l];
}
const le = /* @__PURE__ */ te("<div><h1>Hello, There!</h1><button>Count: ");
function ie() {
  const [e, s] = Q(0);
  return (() => {
    const t = le(), n = t.firstChild, l = n.nextSibling;
    return l.firstChild, l.$$click = () => s((i) => i + 1), I(l, e, null), t;
  })();
}
ee(() => k(ie, {}), document.getElementById("HelloWorld"));
se(["click"]);
export {
  ie as default
};
