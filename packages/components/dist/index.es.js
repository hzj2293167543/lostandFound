import { defineComponent as d, ref as a, onMounted as m, watch as c, openBlock as _, createElementBlock as f, createElementVNode as t, withDirectives as i, vModelText as p, toDisplayString as b } from "vue";
function v(o, n) {
  return o + n;
}
const x = { class: "wrapper" }, y = { class: "content" }, k = { class: "num" }, w = { class: "num" }, N = { class: "num" }, T = /* @__PURE__ */ d({
  __name: "Test",
  setup(o) {
    const n = a(1), s = a(2), l = a(0);
    return m(() => {
      l.value = v(n.value, s.value);
    }), c(
      () => [n.value, s.value],
      ([u, e]) => {
        l.value = v(u, e);
      }
    ), (u, e) => (_(), f("div", x, [
      t("div", y, [
        e[4] || (e[4] = t("div", { class: "title" }, "测试组件", -1)),
        t("div", k, [
          e[2] || (e[2] = t("span", null, "Number 1", -1)),
          i(t("input", {
            type: "number",
            "onUpdate:modelValue": e[0] || (e[0] = (r) => n.value = r)
          }, null, 512), [
            [p, n.value]
          ])
        ]),
        t("div", w, [
          e[3] || (e[3] = t("span", null, "Number 2", -1)),
          i(t("input", {
            type: "number",
            "onUpdate:modelValue": e[1] || (e[1] = (r) => s.value = r)
          }, null, 512), [
            [p, s.value]
          ])
        ]),
        t("div", N, [
          t("span", null, "result:" + b(l.value), 1)
        ])
      ])
    ]));
  }
}), V = (o, n) => {
  const s = o.__vccOpts || o;
  for (const [l, u] of n)
    s[l] = u;
  return s;
}, B = /* @__PURE__ */ V(T, [["__scopeId", "data-v-9fe542be"]]);
export {
  B as Test
};
//# sourceMappingURL=index.es.js.map
