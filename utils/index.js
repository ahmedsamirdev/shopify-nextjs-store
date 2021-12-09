export async function storefront(query, variables = {}) {

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_ACCESS_TOKEN
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