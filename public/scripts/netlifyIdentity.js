import netlifyIdentity from "netlify-identity-widget";

netlifyIdentity.init();

// 🔥 gestion login
netlifyIdentity.on("login", () => {
  document.location.href = "/admin/";
});

// 🔥 gestion tokens (INVITE / RECOVERY)
const url = new URL(window.location.href);
const params = url.searchParams;

if (
  params.has("invite_token") ||
  params.has("recovery_token")
) {
  netlifyIdentity.open();
}