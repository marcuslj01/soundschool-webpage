"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import UploadModal from "@/components/ui/UploadModal";

export default function Products() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>
      <div className="text-white flex items-center justify-center">
        <Button
          text="Add Product +"
          style="primary"
          onClick={() => setIsOpen(true)}
        />
        {isOpen && <UploadModal onClose={() => setIsOpen(false)} />}
      </div>
    </>
  );
}

/*
TODO: Implementer sikker admin API for products
- Opprett /api/admin/products route med Firebase Admin validering
- Flytt database-operasjoner til API routes
- Send Firebase token i API-kall for admin-validering
- Implementer CRUD operasjoner (Create, Read, Update, Delete)
- Legg til loading states og error handling
*/
