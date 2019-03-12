export class UrlUtilities {
  public static encodeObject(obj: any): string {
    let str = "";
    if (obj == null) {
      return str;
    }
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      if (typeof str !== "undefined" && str && str !== "") {
        str += "&";
      }
      str += key + "=" + obj[key];
    }
    return str;
  }
}
