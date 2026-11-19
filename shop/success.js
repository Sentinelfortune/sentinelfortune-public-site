/* =====================================================
SENTINEL FORTUNE LLC — success.js
Post-checkout confirmation page. Shows the private download as soon as
the signed Stripe webhook has recorded the payment, without waiting
for the delivery email. The Worker grants it only to the browser that
started the checkout (claim stored by product.js), never on the
session id in this URL alone. Delivery by email is unchanged.
===================================================== */
"use strict";

var POLL_MS = 3000;
var MAX_POLLS = 40; // about 2 minutes, then the page explains what to do

function esc(s) {
  var d = document.createElement("div");
  d.textContent = String(s || "");
  return d.innerHTML;
}

function readClaim(sessionId) {
  try {
    var raw = localStorage.getItem("sfl_order_access:" + sessionId);
    return raw ? JSON.parse(raw).claim : null;
  } catch (e) { return null; }
}

function show(panel, html) { panel.innerHTML = html; }

function fallbackText() {
  return 'Your download link is also sent by email. If it does not arrive, use the ' +
    '<a href="licenses.html#download-recovery-title" style="color:var(--gold3)">download recovery page</a> ' +
    'with your purchase email and license number.';
}

async function requestAccess(panel, sessionId, claim, attempt) {
  var base = (window.SHOP_API_BASE || "").replace(/\/$/, "");
  if (!/^https:\/\//.test(base)) return;
  try {
    var res = await fetch(base + "/shop/order/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId, claim: claim }),
    });
    var data = await res.json();
    if (res.status === 202 && data.status === "PENDING") {
      if (attempt >= MAX_POLLS) {
        show(panel, '<p class="page-sub">Your payment is still being confirmed. Reload this page in a few minutes. ' + fallbackText() + "</p>");
        return;
      }
      show(panel, '<p class="page-sub">Confirming your payment… your download will appear here.</p>');
      setTimeout(function () { requestAccess(panel, sessionId, claim, attempt + 1); }, POLL_MS);
      return;
    }
    if (res.ok && data.status === "READY") {
      show(panel,
        '<p class="page-sub"><strong>' + esc(data.productTitle) + "</strong> is ready.</p>" +
        '<a class="btn" data-testid="success-download" href="' + esc(data.downloadUrl) + '" rel="nofollow noreferrer">Download now</a>' +
        '<p class="page-sub" style="margin-top:14px">Order <code>' + esc(data.orderNumber) + "</code> · License <code>" + esc(data.licenseNumber) +
        "</code>. Keep your license number: with your purchase email it lets you request a new link at any time. " +
        "This link works for 1 hour (up to " + esc(data.maxDownloads) + " downloads).</p>");
      return;
    }
    show(panel, '<p class="page-sub">' + esc(data.error || "Download access is not available on this page.") +
      (data.licenseNumber ? " License <code>" + esc(data.licenseNumber) + "</code>." : "") + " " + fallbackText() + "</p>");
  } catch (e) {
    show(panel, '<p class="page-sub">' + fallbackText() + "</p>");
  }
}

function init() {
  var params = new URLSearchParams(window.location.search);
  var sessionId = params.get("session_id");
  var refEl = document.getElementById("sessionRef");
  var panel = document.getElementById("deliveryPanel");

  if (sessionId && refEl) {
    refEl.innerHTML = 'Reference: <code>' + esc(sessionId) + "</code>";
  } else if (refEl) {
    refEl.textContent = "";
  }

  if (!sessionId || !panel) return;
  var claim = readClaim(sessionId);
  if (!claim) {
    show(panel, '<p class="page-sub">' + fallbackText() + "</p>");
    return;
  }
  requestAccess(panel, sessionId, claim, 0);
}

document.addEventListener("DOMContentLoaded", init);
