$(function () {
  const $toast = $('<div id="goods-page-toast" class="goods_page_toast" role="status" aria-live="polite"></div>');

  $("body").append($toast);

  let toastTimer = 0;

  function showToast(msg) {
    $toast.text(msg).addClass("is_visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      $toast.removeClass("is_visible");
    }, 2000);
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  $.ajax({
    url: "data/goods.json",
    type: "get",
    dataType: "json",
    cache: false,
    success: function (json) {
      let results = "";

      $.each(json, function (index, item) {
        results +=
          `<div class="goods" data-code="${escapeAttr(item.code)}">` +
          `<img src="${escapeAttr(item.imgurl)}" alt="${escapeHtml(item.title)}" loading="lazy" width="200" height="200" />` +
          `<p>${escapeHtml(item.price)}</p>` +
          `<h3>${escapeHtml(item.title)}</h3>` +
          `<button type="button" class="add_cart_btn">加入购物车</button>` +
          `</div>`;
      });

      $(".content").html(results);
    },
  });

  $(".content").on("click", ".add_cart_btn", function () {
    const code = $(this).closest(".goods").attr("data-code");

    if (!code) {
      return;
    }

    CartStorage.addToCart(code);
    showToast("已加入购物车");
  });
});
