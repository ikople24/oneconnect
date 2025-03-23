class ApiClient {
  baseUrl = "";
  headers = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async request(url, options) {
    try {
      const response = await fetch(this.baseUrl + url, options);
      if (!response.ok) {
        throw new Error(`Error : ${response.statusText}`);
      }
      const data = await response.json();
      console.debug("REQUEST ->", url, "RESULT ->", data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  get(url) {
    return this.request(url, {
      method: "GET",
      headers: this.headers,
      credentials: "include",
    });
  }

  post(url, body) {
    return this.request(url, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify(body),
    });
  }
  postBuffer(url, body) {
    return this.request(url, {
      method: "POST",
      // headers: this.headers,
      credentials: "include",
      body: body,
    });
  }
  patchBuffer(url, body) {
    console.log(url,body);
    return this.request(url, {
      method: "PATCH",
      credentials: "include",
      body: body,
    });
  }
  patch(url, body) {
    return this.request(url, {
      method: "PATCH",
      credentials: "include",
      headers: this.headers,
      body: JSON.stringify(body),
    });
  }
  put(url, body) {
    return this.request(url, {
      method: "PUT",
      credentials: "include",
      headers: this.headers,
      body: JSON.stringify(body),
    });
  }
  delete(url) {
    return this.request(url, {
      method: "DELETE",
      credentials: "include",
      headers: this.headers,
    });
  }
}

export default ApiClient;
