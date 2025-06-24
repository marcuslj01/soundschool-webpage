"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import UploadModal from "@/components/ui/UploadModal";

function Products() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen text-white flex items-center justify-center">
      <Button
        text="Add Product +"
        style="primary"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && <UploadModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}

export default Products;
