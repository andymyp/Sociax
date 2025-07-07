export const signInOauth = async (url: string) => {
  const width = 500;
  const height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  const popup = window.open(
    url,
    "oauth2-signin",
    `width=${width},height=${height},top=${top},left=${left}`
  );

  if (!popup) {
    return Promise.reject(new Error("Popup blocked"));
  }

  return new Promise<{ access_token: string }>((resolve, reject) => {
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener("message", listener);
        reject(new Error("OAuth sign in failed"));
      }
    }, 1000);

    const listener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.source !== "oauth2-signin") return;

      clearInterval(timer);
      popup.close();
      window.removeEventListener("message", listener);

      const data = event.data.data;
      if (!data?.access_token) {
        reject(new Error("Missing access token in response"));
      } else {
        resolve(data);
      }
    };

    window.addEventListener("message", listener);
  });
};
