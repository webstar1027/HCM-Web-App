
export const environment = {
  production: false,
  name: "local",
  apiUrl: "https://api.myhcit.com/",
  appUrl: "https://localhost:50319/",
  openIdConnectSettings: {
    authority: "https://identity.myhcit.com/",
    clientId: "hcmwebappclient",
    redirect_uri: "https://identity.myhcit.com/signin-oidc/",
    scope: "openid profile email",
    response_type: "id_token"
  }
};
