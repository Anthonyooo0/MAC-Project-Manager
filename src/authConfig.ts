import { Configuration, LogLevel } from "@azure/msal-browser";

// Azure AD App Registration Configuration
// Using the same tenant as MAC Products apps
export const msalConfig: Configuration = {
  auth: {
    clientId: "25e35ae1-9af0-4326-a24b-d4b74f48de48",
    authority: "https://login.microsoftonline.com/422e0e56-e8fe-4fc5-8554-b9b89f3cadac",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: [],
};

export const ALLOWED_DOMAIN = "macproducts.net";
