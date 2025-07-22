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

/*
TODO: Implementer sikker admin API for products
- Opprett /api/admin/products route med Firebase Admin validering
- Flytt database-operasjoner til API routes
- Send Firebase token i API-kall for admin-validering
- Implementer CRUD operasjoner (Create, Read, Update, Delete)
- Legg til loading states og error handling
*/
