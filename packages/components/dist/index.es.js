import { defineComponent as c, ref as a, onMounted as i, watch as v, openBlock as _, createElementBlock as d, createElementVNode as t, toDisplayString as p } from "vue";
function r(o, n) {
  return o + n;
}
const m = { class: "wrapper" }, f = { class: "content" }, b = { class: "num" }, y = ["value"], h = { class: "num" }, k = ["value"], x = { class: "num" }, N = /* @__PURE__ */ c({
  __name: "Test",
  setup(o) {
    const n = a(1), s = a(2), u = a(0);
    return i(() => {
      u.value = r(n.value, s.value);
    }), v(
      () => [n.value, s.value],
      ([l, e]) => {
        u.value = r(l, e);
      }
    ), (l, e) => (_(), d("div", m, [
      t("div", f, [
        e[2] || (e[2] = t("div", { class: "title" }, "测试组件", -1)),
        t("div", b, [
          e[0] || (e[0] = t("span", null, "Number 1", -1)),
          t("input", {
            type: "number",
            value: n.value
          }, null, 8, y)
        ]),
        t("div", h, [
          e[1] || (e[1] = t("span", null, "Number 2", -1)),
          t("input", {
            type: "number",
            value: s.value
          }, null, 8, k)
        ]),
        t("div", x, [
          t("span", null, "result:" + p(u.value), 1)
        ])
      ])
    ]));
  }
}), g = (o, n) => {
  const s = o.__vccOpts || o;
  for (const [u, l] of n)
    s[u] = l;
  return s;
}, B = /* @__PURE__ */ g(N, [["__scopeId", "data-v-eadd76e6"]]);
export {
  B as Test
};
//# sourceMappingURL=index.es.js.map
