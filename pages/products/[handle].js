import Link from "next/link";
import { storeFront, formatPrice } from "../../utils/index";
import { format } from "date-fns";
import { useState } from "react";

function handle({ product ,products}) {
  const [isLoading, setIsLoading] = useState(false);

  const image = product.images.edges[0].node;
  const variantId = product.variants.edge[0].node.id;

  const relatedProducts = products.edges
    .filter((item) => item.node.handle !== product.handle)
    .slice(0, 4);

  async function checkout() {
    setIsLoading(true);
    const { data } = await storeFront(checkoutMutation, { variantId });
    const { webUrl } = data.checkoutCreate.checkout;
    window.location.href = webUrl;
  }

  return (
    <>
      <main class="max-w-7xl mx-auto pt-14 px-4 sm:pt-24 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-16">
          <div class="lg:col-span-4">
            <div class="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={image.transformedSrc}
                alt={image.altText}
                class="object-center object-cover"
              />
            </div>
          </div>
          <div class="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:col-span-3">
            <div class="flex flex-col-reverse">
              <div>
                <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {product.title}
                </h1>
                <h2 id="information-heading" class="sr-only">
                  Product information
                </h2>
                <p class="text-sm text-gray-500 mt-2">
                  {product.tags[0]} · Updated
                  <time datetime={product.updatedAt}>
                    {format(new Date(product.updatedAt), "dd MMM yyyy")}
                  </time>
                </p>
              </div>
            </div>
            <p class="text-gray-500 mt-6">{product.description}</p>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={checkout}
                class="w-full bg-gray-900 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
              >
                <span>
                  {isLoading && (
                    <svg
                      class="animate-spin h-5 w-5 mr-3 ..."
                      viewBox="0 0 24 24"
                    ></svg>
                  )}
                  Pay {formatPrice(product.priceRange.minVariantPrice.amount)}
                </span>
              </button>
              <button
                type="button"
                class="w-full bg-white border rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
        <div class="max-w-2xl mx-auto mt-24 lg:mt-32 lg:max-w-none">
          <div class="flex items-center justify-between space-x-4">
            <h2 class="text-lg font-medium text-gray-900">
              Customers also viewed
            </h2>
            {/* Related products */}
            <div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900 space-x-8">
              {relatedProducts.map((item) => {
                const product = item.node;
                const image = product.images.edges[0].node;
                return (
                  <div
                    key={product.handle}
                    class="mt-4  flex items-center justify-between text-base font-medium text-gray-900 space-x-8"
                  >
                    <div class="relative group">
                      <div class="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.transformedSrc}
                          alt={image.altText}
                          class="object-center object-cover group-hover:opacity-75"
                        />
                      </div>
                      <div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900 space-x-8">
                        <h3>
                          <Link href={`/products/${product.handle}`}>
                            <a>
                              <span
                                aria-hidden="true"
                                class="absolute inset-0"
                              ></span>
                              {product.title}
                            </a>
                          </Link>
                        </h3>
                        <p>
                          {formatPrice(
                            product.priceRange.minVariantPrice.amount
                          )}
                        </p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">
                        {product.tags[0]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default handle;

export async function getStaticPaths() {
  // at 22 min
  const { data } = await storeFront(gql`
    {
      products(first: 6) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `);
  return {
    paths: data.products.edges.map((product) => ({
      params: { handle: product.node.handle },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { data } = await storeFront(singleProductQuery, {
    handle: params.handle,
  });
  return {
    props: {
      product: data.productByHandle,
      products: data.products,
    },
  };
}

const gql = String.raw;
const singleProductQuery = gql`
  query SingleProduct($handle: String!) {
    productByHandle(handle: $handle) {
      title
      handle
      description
      updatedAt
      priceRange {
        minVariantPrice {
          amount
        }
      }
      images(first: 1) {
        edges {
          node {
            transformedSrc
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
    products(first: 6) {
      edges {
        node {
          title
          handle
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 1) {
            edges {
              node {
                transformedSrc
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const checkoutMutation = gql`
  mutation CheckoutCreate($variantId: ID!) {
    checkoutCreate(
      input: { lineItems: { variantId: $variantId, quantity: 1 } }
    ) {
      checkout {
        webUrl
      }
    }
  }
`;
