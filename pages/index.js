import Head from "next/head";
import Hero from "../components/Hero";
import Products from "../components/Products";
import { storefront } from "../utils/index";

export default function Home({ products }) {
  return (
    <div className=" font-sans">
      <Hero />
      <Head>
        <title>Shopify - Nextjs Store</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Products products={products} />
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center"></main>
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await storefront(productsQuery);
  return {
    props: {
      products: data.products,
    },
  };
}

const gql = String.raw;
const productsQuery = gql`
  query Products {
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
