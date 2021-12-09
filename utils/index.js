export async function storefront(query, variables = {}) {
const dev = process.env.NEXT_PUBLIC_API_URL
const pass = process.env.NEXT_PUBLIC_ACCESS_TOKEN
  const response = await fetch(
    dev, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": pass
    },
    body: JSON.stringify({ query, variables })
  }
  )
  return response.json()
}

export function formatPrice(number) {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(number)
}