const BASE = import.meta.env.VITE_API_BASE;

async function request(path, { method = "GET", token, body } = {}) {
  let url = `${BASE}${path}`;

  if (token) {
    const join = url.includes("?") ? "&" : "?";
    url += `${join}token=${encodeURIComponent(token)}`;
  }

  if (body && method === "GET") {
    Object.entries(body).forEach(([k, v]) => {
      url += `&${encodeURIComponent(k)}=${encodeURIComponent(v ?? "")}`;
    });
  }

  const res = await fetch(url); 
  const data = await res.json();

  if (data?.success === false) {
    throw new Error(data?.message || "request_failed");
  }
  return data;
}



// PRODUCTS (public)
export const apiGetProducts = () =>
  request(`?resource=products`);

// ORDER (public by id)
export const apiGetOrderPublic = (orderId) =>
  request(`?orderId=${encodeURIComponent(orderId)}`);

// ORDERS (admin)
export const apiGetAllOrders = (token) =>
  request(`?all=true`, { token });

export const apiCreateOrder = (token, payload) =>
  request(`?action=createOrder`, { token, body: payload });

export const apiUpdateOrder = (token, payload , orderId) =>
  request(`?action=updateOrder&orderId=${encodeURIComponent(orderId)}`, { token, body: payload });

export const apiDeleteOrder = (token, orderId) =>
  request(`?action=deleteOrder&orderId=${encodeURIComponent(orderId)}`, { token });

export const apiCheckAuth = (token) =>
  request(`?resource=auth&action=check`, { token });
