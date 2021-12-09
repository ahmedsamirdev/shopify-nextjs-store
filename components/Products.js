import Link from "next/link";
import { formatPrice } from "../utils";

function Products({ products }) {
  return (
    <>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.edges.map((item) => {
              const product = item.node;
              const image = product.images.edges[0].node;
              return (
                <Link key={product.handle} href={`/products/${product.handle}`}>
                  <a className="group">
                    <div className="w-full 	 aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden ">
                      <img
                        src={image.transformedSrc}
                        alt={image.altText}
                        className="w-full h-full object-center object-cover group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {formatPrice(product.priceRange.minVariantPrice.amount)}
                    </p>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;

