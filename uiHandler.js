// uiHandler.js
import { getAuthorizationURL, getRedirectUrl, getGenres } from "./apiHandler.js";
import { createPlaylist } from './businessLogic.js';

async function redirectToSpotifyAuthorize() {
  let authUrl = await getAuthorizationURL();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

async function loginWithSpotifyClick() {
  await redirectToSpotifyAuthorize();
}

async function logoutClick() {
  localStorage.clear();
  window.location.href = getRedirectUrl();
}

//should get automaticly handled witin API if token expired
async function refreshTokenClick() {
  const token = await refreshToken();
  currentToken.save(token);
  renderTemplate("oauth", "oauth-template", currentToken);
}

function renderTemplate(targetId, templateId, data = null) {
  const template = document.getElementById(templateId);
  const clone = template.content.cloneNode(true);

  const elements = clone.querySelectorAll("*");
  elements.forEach((ele) => {
    const bindingAttrs = [...ele.attributes].filter((a) =>
      a.name.startsWith("data-bind")
    );

    bindingAttrs.forEach((attr) => {
      const target = attr.name
        .replace(/data-bind-/, "")
        .replace(/data-bind/, "");
      const targetType = target.startsWith("onclick") ? "HANDLER" : "PROPERTY";
      const targetProp = target === "" ? "innerHTML" : target;

      const prefix = targetType === "PROPERTY" ? "data." : "";
      const expression = prefix + attr.value.replace(/;\n\r\n/g, "");

      // Maybe use a framework with more validation here ;)
      try {
        ele[targetProp] =
          targetType === "PROPERTY"
            ? eval(expression)
            : () => {
                eval(expression);
              };
        ele.removeAttribute(attr.name);
      } catch (ex) {
        console.error(`Error binding ${expression} to ${targetProp}`, ex);
      }
    });
  });

  const target = document.getElementById(targetId);
  target.innerHTML = "";
  target.appendChild(clone);
}

function getSelectedGenre() {
  var selectedIndex = document.getElementById("genre-list").selectedIndex;
  var options = document.getElementById("genre-list").options;
  var selectedOption = options[selectedIndex].text;

  return selectedOption;
}

export {
  redirectToSpotifyAuthorize,
  loginWithSpotifyClick,
  logoutClick,
  refreshTokenClick,
  renderTemplate,
  getSelectedGenre
};
