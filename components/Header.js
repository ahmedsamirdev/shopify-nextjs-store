import { useRouter } from "next/router";
import { ShieldCheckIcon } from "@heroicons/react/outline";

function Header() {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <>
      <div className="relative bg-white">
        <div className="md:px-20 px-6">
          <div className="flex justify-between mx-auto max-w-7xl items-center border-b-2 border-gray-100 py-3 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a onClick={handleClick} href="#">
                <ShieldCheckIcon 
                  className="h-8 w-auto text-indigo-600 sm:h-10"
                  />
              </a>
            </div>
            <a className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md  text-base font-medium text-indigo-600 bg-white cursor-pointer hover:opacity-70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
