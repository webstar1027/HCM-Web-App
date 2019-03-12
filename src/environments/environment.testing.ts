export const environment = {
  production: true,
  name: "testing",
  apiUrl: "https://api.myhcit.com/",
  appUrl: "https://app.myhcit.com/",
  openIdConnectSettings: {
    authority: "https://identity.myhcit.com/",
    clientId: "hcmwebappclient",
    redirect_uri: "https://app.myhcit.com/signin-oidc/",
    scope: "openid profile email claims",
    response_type: "id_token"
  }
};
