/* Sharon's Cookbook Design System components — built by tools/build.mjs from: components/brand/Logo.jsx, components/content/RecipeCard.jsx, components/controls/Button.jsx, components/controls/IconButton.jsx, components/controls/SegmentedControl.jsx, components/feedback/AlertPill.jsx, components/feedback/Chip.jsx, components/feedback/EmptyState.jsx, components/feedback/Toast.jsx, components/forms/Checkbox.jsx, components/forms/Field.jsx, components/forms/Input.jsx, components/forms/Select.jsx, components/forms/Textarea.jsx, components/surfaces/Card.jsx, components/surfaces/Dialog.jsx */
var __ds_build = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <stdin>
  var stdin_exports = {};
  __export(stdin_exports, {
    AlertPill: () => AlertPill,
    Button: () => Button,
    Card: () => Card,
    Checkbox: () => Checkbox,
    Chip: () => Chip,
    Dialog: () => Dialog,
    EmptyState: () => EmptyState,
    Field: () => Field,
    IconButton: () => IconButton,
    Input: () => Input,
    Logo: () => Logo,
    RecipeCard: () => RecipeCard,
    SegmentedControl: () => SegmentedControl,
    Select: () => Select,
    Textarea: () => Textarea,
    Toast: () => Toast
  });

  // ../components/brand/Logo.jsx
  function Logo({ variant = "full", size = 28, className = "", ...rest }) {
    const cls = ["brand", className].filter(Boolean).join(" ");
    const mark = /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "brand-mark",
        viewBox: "0 0 24 24",
        width: size,
        height: size,
        "aria-hidden": "true",
        style: { width: size, height: size }
      },
      /* @__PURE__ */ React.createElement("path", { d: "M12 21c-4.5 0-8-3-8-8 0-6 5-10 8-11 3 1 8 5 8 11 0 5-3.5 8-8 8Z", fill: "var(--primary)" }),
      /* @__PURE__ */ React.createElement("path", { d: "M12 4v15", stroke: "var(--cream)", strokeWidth: "1.4", strokeLinecap: "round" }),
      /* @__PURE__ */ React.createElement("path", { d: "M12 9c1.6-.4 3-1.6 3.6-3.2M12 13c-1.8-.4-3.4-1.8-4-3.6", stroke: "var(--cream)", strokeWidth: "1.4", strokeLinecap: "round", fill: "none" })
    );
    if (variant === "mark") {
      return /* @__PURE__ */ React.createElement("span", { className: cls, "aria-label": "Sharon's Cookbook", ...rest }, mark);
    }
    return /* @__PURE__ */ React.createElement("span", { className: cls, ...rest }, mark, /* @__PURE__ */ React.createElement("span", { className: "brand-name" }, "Sharon's Cookbook"));
  }

  // ../components/content/RecipeCard.jsx
  function RecipeCard({ recipe, href = "#", className = "", ...rest }) {
    const r = recipe || {};
    const cls = ["recipe-card", className].filter(Boolean).join(" ");
    const firstLetter = (r.title || "?").trim().charAt(0).toUpperCase() || "?";
    return /* @__PURE__ */ React.createElement("a", { className: cls, href, ...rest }, r.photo ? /* @__PURE__ */ React.createElement("img", { className: "recipe-card-img", src: r.photo, alt: "", loading: "lazy" }) : /* @__PURE__ */ React.createElement("div", { className: "recipe-card-img recipe-card-placeholder", "aria-hidden": "true" }, firstLetter), /* @__PURE__ */ React.createElement("div", { className: "recipe-card-body" }, /* @__PURE__ */ React.createElement("h3", { className: "recipe-card-title" }, r.title, r.favourite ? /* @__PURE__ */ React.createElement("span", { className: "fav-star", "aria-label": "favourite" }, " \u2605") : null), r.subtitle ? /* @__PURE__ */ React.createElement("p", { className: "recipe-card-sub" }, r.subtitle) : null, /* @__PURE__ */ React.createElement("p", { className: "recipe-card-meta" }, r.category ? /* @__PURE__ */ React.createElement("span", null, r.category) : null, r.totalMinutes ? /* @__PURE__ */ React.createElement("span", null, "\xB7 ", r.totalMinutes, " min") : null, r.difficulty ? /* @__PURE__ */ React.createElement("span", null, "\xB7 ", r.difficulty) : null)));
  }

  // ../components/controls/Button.jsx
  function Button({
    variant = "primary",
    size = "md",
    href,
    icon,
    disabled = false,
    className = "",
    children,
    ...rest
  }) {
    const variantClass = {
      primary: "btn-primary",
      ghost: "btn-ghost",
      danger: "btn-danger",
      "danger-ghost": "btn-danger-ghost"
    }[variant] || "btn-primary";
    const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
    const cls = ["btn", variantClass, sizeClass, className].filter(Boolean).join(" ");
    const inner = /* @__PURE__ */ React.createElement(React.Fragment, null, icon ? /* @__PURE__ */ React.createElement("span", { className: "btn-icon", "aria-hidden": "true" }, icon) : null, children);
    if (href && !disabled) {
      return /* @__PURE__ */ React.createElement("a", { className: cls, href, ...rest }, inner);
    }
    return /* @__PURE__ */ React.createElement("button", { className: cls, disabled, ...rest }, inner);
  }

  // ../components/controls/IconButton.jsx
  function IconButton({ label, className = "", children, ...rest }) {
    const cls = ["icon-btn", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("button", { className: cls, "aria-label": label, title: rest.title || label, ...rest }, children);
  }

  // ../components/controls/SegmentedControl.jsx
  function SegmentedControl({ options = [], value, onChange, className = "", ...rest }) {
    const cls = ["seg", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("div", { className: cls, role: "tablist", ...rest }, options.map((opt) => {
      const active = opt.value === value;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: opt.value,
          type: "button",
          role: "tab",
          "aria-selected": active,
          className: active ? "seg-btn active" : "seg-btn",
          onClick: () => onChange && onChange(opt.value)
        },
        opt.label,
        opt.hint ? /* @__PURE__ */ React.createElement("small", null, " ", opt.hint) : null
      );
    }));
  }

  // ../components/feedback/AlertPill.jsx
  function AlertPill({ tone = "info", className = "", children, ...rest }) {
    const toneClass = { danger: "alert-danger", warn: "alert-warn", info: "alert-info" }[tone] || "alert-info";
    const cls = ["alert-pill", toneClass, className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("span", { className: cls, ...rest }, children);
  }

  // ../components/feedback/Chip.jsx
  function Chip({ variant = "default", size, className = "", children, ...rest }) {
    const variantClass = {
      default: "",
      tag: "chip-tag",
      danger: "chip-danger",
      warn: "chip-warn",
      info: "chip-info"
    }[variant] || "";
    const cls = ["chip", variantClass, size === "sm" ? "chip-sm" : "", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("span", { className: cls, ...rest }, children);
  }

  // ../components/feedback/EmptyState.jsx
  function EmptyState({ className = "", action, children, ...rest }) {
    const cls = ["empty-state", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("div", { className: cls, ...rest }, /* @__PURE__ */ React.createElement("p", null, children), action);
  }

  // ../components/feedback/Toast.jsx
  function Toast({ tone = "success", className = "", children, ...rest }) {
    const toneClass = { success: "toast-success", warn: "toast-warn", error: "toast-error" }[tone] || "toast-success";
    const cls = ["toast", toneClass, className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("div", { className: cls, role: "status", ...rest }, children);
  }

  // ../components/forms/Checkbox.jsx
  function Checkbox({ label, size, className = "", ...rest }) {
    const cls = ["check-label", size === "sm" ? "sm" : "", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("label", { className: cls }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", ...rest }), label);
  }

  // ../components/forms/Field.jsx
  function Field({ label, hint, htmlFor, className = "", children }) {
    const cls = ["field", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("label", { className: cls, htmlFor }, label, children, hint ? /* @__PURE__ */ React.createElement("small", { className: "hint" }, hint) : null);
  }

  // ../components/forms/Input.jsx
  function Input({ size = "md", type = "text", className = "", ...rest }) {
    const cls = ["input", size === "sm" ? "input-sm" : "", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("input", { type, className: cls, ...rest });
  }

  // ../components/forms/Select.jsx
  function Select({ options, value, onChange, className = "", children, ...rest }) {
    const cls = ["input", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("select", { className: cls, value, onChange, ...rest }, children, (options || []).map((o) => {
      const val = typeof o === "object" ? o.value : o;
      const label = typeof o === "object" ? o.label : o;
      return /* @__PURE__ */ React.createElement("option", { key: val, value: val }, label);
    }));
  }

  // ../components/forms/Textarea.jsx
  function Textarea({ rows = 3, className = "", ...rest }) {
    const cls = ["input", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("textarea", { rows, className: cls, ...rest });
  }

  // ../components/surfaces/Card.jsx
  function Card({ accent, flush = false, title, className = "", children, ...rest }) {
    const accentClass = {
      top: "card-accent-top",
      left: "card-accent-left",
      warn: "card-accent-warn",
      info: "card-accent-info"
    }[accent] || "";
    const cls = ["card", accentClass, flush ? "card-flush" : "", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("section", { className: cls, ...rest }, title ? /* @__PURE__ */ React.createElement("h2", null, title) : null, children);
  }

  // ../components/surfaces/Dialog.jsx
  function Dialog({ title, actions, open, wide = false, onClose, className = "", children, ...rest }) {
    const cls = ["app-dialog", wide ? "dialog-wide" : "", className].filter(Boolean).join(" ");
    const body = /* @__PURE__ */ React.createElement("div", { className: "dialog-body" }, title ? /* @__PURE__ */ React.createElement("h2", { className: "dialog-title" }, title) : null, /* @__PURE__ */ React.createElement("div", { className: "dialog-message" }, children), actions ? /* @__PURE__ */ React.createElement("div", { className: "dialog-actions" }, actions) : null);
    if (open) {
      return /* @__PURE__ */ React.createElement("dialog", { className: cls, open: true, onClose, ...rest }, body);
    }
    return /* @__PURE__ */ React.createElement("div", { className: cls, role: "dialog", "aria-modal": "false", style: { position: "static", margin: 0 }, ...rest }, body);
  }
  return __toCommonJS(stdin_exports);
})();

window.SharonSCookbookDesignSystem_c765c0 = Object.assign(window.SharonSCookbookDesignSystem_c765c0 || {}, __ds_build);
