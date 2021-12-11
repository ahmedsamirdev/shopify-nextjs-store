import Link from "next/link";
import Head from "next/head";
import { storefront, formatPrice } from "../../utils/index";
import { format } from "date-fns";
import { useState } from "react";

function handle({ product, products }) {
  const [isLoading, setIsLoading] = useState(false);

  const image = product.images.edges[0].node;
  const variantId = product.variants.edges[0].node.id;

  const relatedProducts = products.edges
    .filter((item) => item.node.handle !== product.handle)
    .slice(0, 4);

  async function checkout() {
    setIsLoading(true);
    const { data } = await storefront(checkoutMutation, { variantId });
    const { webUrl } = data.checkoutCreate.checkout;
    window.location.href = webUrl;
  }

  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <main className="max-w-7xl font-sans mx-auto pt-14 px-4 sm:pt-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-16">
          <div className="lg:col-span-4">
            <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={image.transformedSrc}
                alt={image.altText}
                className="object-center object-cover"
              />
            </div>
          </div>
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:col-span-3">
            <div className="flex flex-col-reverse">
              <div>
                <h1 className=" text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  {product.title}
                </h1>
                <h2 id="information-heading" className="sr-only">
                  Product information
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {product.tags[0]} · Updated{" "}
                  <time dateTime={product.updatedAt}>
                    {format(new Date(product.updatedAt), "dd MMM yyyy")}
                  </time>
                </p>
              </div>
            </div>
            <p className="text-gray-500 mt-6">{product.description}</p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={checkout}
                className="w-full bg-gray-900 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
              >
                <span className="flex-row flex items-center justify-center">
                  {isLoading && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Pay {formatPrice(product.priceRange.minVariantPrice.amount)}
                </span>
              </button>
              <button
                type="button"
                className="w-full bg-white border rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
              >
                Preview
              </button>
            </div>
            <div className="pt-10 sm:border-t sm:mt-10">
              <h3 className="text-sm font-medium text-gray-900">Demo only</h3>
              <p className="mt-4 text-sm text-gray-500">
                For personal and development use only. You cannot order or
                pay in this site version.
              </p>
            </div>
          </div>
        </div>
        {/* Related products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto py-16 sm:py-24 lg:py-32 lg:max-w-none">
            <div className="flex items-center justify-between space-x-4">
              <h2 className="text-lg font-medium text-gray-900">
                Customers also viewed
              </h2>
              <a
                className="whitespace-nowrap text-sm font-medium text-gray-900 hover:text-gray-700"
                href="/"
              >
                View all<span aria-hidden="true"> →</span>
              </a>
            </div>
            <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-x-6">
              {relatedProducts.map((item) => {
                const product = item.node;
                const image = product.images.edges[0].node;
                return (
                  <div key={product.handle} className="group relative">
                    <div
                      className="relative w-full h-20 lg:aspect-w-4 lg:aspect-h-3  
                    aspect-w-4 aspect-h-3 sm:h-40 bg-white 
                    rounded-lg overflow-hidden group-hover:opacity-75 "
                    >
                      <img
                        src={image.transformedSrc}
                        alt={image.altText}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="mt-4  flex items-center justify-between text-base font-medium text-gray-900 space-x-8">
                      <h3>
                        <Link href={`/products/${product.handle}`}>
                          <a href="/products/tiers">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            ></span>
                            {product.title}
                          </a>
                        </Link>
                      </h3>
                      <p>
                        {formatPrice(product.priceRange.minVariantPrice.amount)}
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
  const { data } = await storefront(gql`
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
  const { data } = await storefront(singleProductQuery, {
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
      tags
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
