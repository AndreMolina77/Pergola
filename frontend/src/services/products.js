const API_URL = "http://localhost:4000/api/products"; // ajusta si usas otro puerto

export async function getAllProducts() {
  const res = await fetch(API_URL, {
    credentials: "include",
  });
  return await res.json();
}

export async function createProduct(product) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(product),
  });
  return await res.json();
}