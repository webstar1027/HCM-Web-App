export const environment = {
  production: false,
  name: "local",
  apiUrl: "https://localhost:56051/",
  appUrl: "https://localhost:50319/",
  openIdConnectSettings: {
    authority: "https://localhost:51010/",
    clientId: "hcmwebappclient",
    redirect_uri: "https://localhost:50319/signin-oidc/",
    scope: "openid profile email claims",
    response_type: "id_token"
  }
};
