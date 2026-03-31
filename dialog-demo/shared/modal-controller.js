/**
 * 通用弹窗控制器：挂载到 body、打开/关闭、遮罩与 Esc、可配置动画时长
 * 约定：.dlg-overlay 为根；内部 [data-modal-panel] 为面板（无则取第一个子元素）
 */
(function (global) {
  "use strict";

  function ensureBody(el) {
    if (el && el.parentNode !== document.body) {
      document.body.appendChild(el);
    }
  }

  function ModalController(overlay, options) {
    this.overlay =
      typeof overlay === "string"
        ? document.querySelector(overlay)
        : overlay;

    if (!this.overlay) {
      throw new Error("ModalController: overlay not found");
    }

    this.options = Object.assign(
      {
        closeOnBackdrop: true,
        closeOnEscape: true,
        duration: 320,
        openDisplay: "flex"
      },
      options || {}
    );

    this.panel = this.overlay.querySelector("[data-modal-panel]");
    if (!this.panel) {
      this.panel = this.overlay.firstElementChild;
    }

    this._onKeydown = this._onKeydown.bind(this);
    this._onBackdropClick = this._onBackdropClick.bind(this);
    this._isOpen = false;

    ensureBody(this.overlay);

    if (this.options.closeOnBackdrop) {
      this.overlay.addEventListener("click", this._onBackdropClick);
    }
  }

  ModalController.prototype._onBackdropClick = function (event) {
    if (event.target === this.overlay) {
      this.close();
    }
  };

  ModalController.prototype._onKeydown = function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
    }
  };

  ModalController.prototype.open = function () {
    if (this._isOpen) {
      return;
    }
    this._isOpen = true;
    this.overlay.style.display = this.options.openDisplay;
    this.overlay.removeAttribute("hidden");

    requestAnimationFrame(() => {
      this.overlay.classList.add("is-open");
      if (this.panel) {
        this.panel.classList.add("is-open");
      }
    });

    if (this.options.closeOnEscape) {
      document.addEventListener("keydown", this._onKeydown);
    }
  };

  ModalController.prototype.close = function () {
    if (!this._isOpen) {
      return;
    }
    this._isOpen = false;
    this.overlay.classList.remove("is-open");
    if (this.panel) {
      this.panel.classList.remove("is-open");
    }

    document.removeEventListener("keydown", this._onKeydown);

    const ms = this.options.duration;
    window.setTimeout(() => {
      if (!this.overlay.classList.contains("is-open")) {
        this.overlay.style.display = "none";
        this.overlay.setAttribute("hidden", "");
      }
    }, ms);
  };

  ModalController.prototype.toggle = function () {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  ModalController.prototype.destroy = function () {
    document.removeEventListener("keydown", this._onKeydown);
    this.overlay.removeEventListener("click", this._onBackdropClick);
  };

  global.ModalController = ModalController;
})(typeof window !== "undefined" ? window : this);
