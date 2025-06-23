import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-gray-400 p-4">
      <div className="flex flex-col items-center justify-center gap-2 text-sm md:text-md">
        <Link className="hover:text-white" href="/about">
          About us
        </Link>
        <Link className="hover:text-white" href="/terms">
          Terms and conditions
        </Link>
        <Link className="hover:text-white" href="/refunds">
          Refunds
        </Link>
        <p className="text-gray-500">
          © 2025 Soundschool. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
