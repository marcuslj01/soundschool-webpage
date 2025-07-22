"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import UploadModal from "@/components/ui/UploadModal";
import AdminGuard from "@/components/security/AdminGuard";

function Products() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="h-screen text-white flex items-center justify-center">
        <Button
          text="Add Product +"
          style="primary"
          onClick={() => setIsOpen(true)}
        />
        {isOpen && <UploadModal onClose={() => setIsOpen(false)} />}
      </div>
    </AdminGuard>
  );
}

export default Products;
