export const backend_url = "https://api.theeliteqa.com/api/";
// export const backend_url = "https://6fcb-117-195-39-75.ngrok-free.app/api/";
export const getCookie = (name) => {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const deleteAllCookie = () => {
  let cookies = document.cookie.split("; ");
  for (let c = 0; c < cookies.length; c++) {
    let d = window.location.hostname.split(".");
    while (d.length > 0) {
      let cookieBase =
        encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
        "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
        d.join(".") +
        " ;path=";
      let p = window.location.pathname.split("/");
      document.cookie = cookieBase + "/";
      while (p.length > 0) {
        document.cookie = cookieBase + p.join("/");
        p.pop();
      }
      d.shift();
    }
  }
};

export const setCookie = (name, value) => {
  if (process.env.NODE_ENV === "development") {
    document.cookie = `${name}=${value}`;
  } else {
    document.cookie = `${name}=${value}; domain=.theeliteqa.com`;
  }
};
