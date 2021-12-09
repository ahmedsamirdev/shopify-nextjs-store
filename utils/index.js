
export async function storefront(query, variables = {}) {

  const response = await fetch(
    "https://new-electronics-booth.myshopify.com/api/2021-07/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Origin": "*",
      "X-Shopify-Storefront-Access-Token": "9a0d1f67f389cb25faed1a32edc136cf"
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