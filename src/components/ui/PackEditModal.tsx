import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { Pack } from "@/lib/types/pack";
import { uploadAsset } from "@/lib/uploadAsset";

interface PackEditModalProps {
  pack: Pack;
  onClose: () => void;
  onSaved: (updated: Pack) => void;
}

const inputClass =
  "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const fileInputClass =
  "block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md bg-gray-50";

function PackEditModal({ pack, onClose, onSaved }: PackEditModalProps) {
  const { user: currentUser } = useAuth();
  const [form, setForm] = useState({
    name: pack.name ?? "",
    type: pack.type ?? "midi",
    description: pack.description ?? "",
    price: pack.price ?? 0,
    discount_price: pack.discount_price ?? 0,
    genre: pack.genre ?? "",
    file_count: pack.file_count ?? 0,
    hidden: pack.hidden ?? false,
    is_featured: pack.is_featured ?? false,
    is_discounted: pack.is_discounted ?? false,
  });
  const [tags, setTags] = useState<string[]>(pack.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      newValue = Number(value);
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (tags.length < 3 && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const token = await currentUser?.getIdToken();
      if (!token) {
        alert("You must be logged in to edit packs");
        return;
      }

      const urls: {
        download_url?: string;
        preview_url?: string;
        image_url?: string;
      } = {};
      try {
        if (zipFile) urls.download_url = await uploadAsset("pack-zip", zipFile, token);
        if (previewFile) urls.preview_url = await uploadAsset("pack-preview", previewFile, token);
        if (imageFile) urls.image_url = await uploadAsset("pack-image", imageFile, token);
      } catch (uploadError) {
        alert(
          `Upload failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`
        );
        return;
      }

      const productData = { ...form, name: form.name.trim(), tags, ...urls };
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "packs",
          productId: pack.id,
          productData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to save: ${errorData.error || "Unknown error"}`);
        return;
      }

      onSaved({ ...pack, ...productData, type: form.type as Pack["type"] });
      onClose();
    } catch (error) {
      console.error("Error saving pack:", error);
      alert("Failed to save pack");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <dialog
      open
      className="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Pack</h1>
          <button type="button" onClick={onClose}>
            <XMarkIcon className="w-6 h-6 hover:cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="edit-zip">
              Replace pack ZIP (optional)
            </label>
            <input
              id="edit-zip"
              type="file"
              accept=".zip"
              onChange={(e) => setZipFile(e.target.files?.[0] ?? null)}
              className={fileInputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="edit-preview">
              Replace preview audio (optional)
            </label>
            <input
              id="edit-preview"
              type="file"
              accept=".mp3,.wav"
              onChange={(e) => setPreviewFile(e.target.files?.[0] ?? null)}
              className={fileInputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="edit-image">
              Replace image, 1:1 (optional)
            </label>
            <input
              id="edit-image"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className={fileInputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="edit-name">
                Name
              </label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-type">
                Pack type
              </label>
              <select
                id="edit-type"
                name="type"
                value={form.type ?? "midi"}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="midi">Midi Pack</option>
                <option value="sample">Sample Pack</option>
                <option value="preset">Preset Pack</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-price">
                Price
              </label>
              <input
                id="edit-price"
                type="number"
                name="price"
                min={0}
                value={form.price}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-discount">
                Discount price
              </label>
              <input
                id="edit-discount"
                type="number"
                name="discount_price"
                min={0}
                value={form.discount_price}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-genre">
                Genre
              </label>
              <input
                id="edit-genre"
                type="text"
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-count">
                File count
              </label>
              <input
                id="edit-count"
                type="number"
                name="file_count"
                min={0}
                value={form.file_count}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="edit-description">
              Description (supports markdown)
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className={inputClass}
            />
            <div className="prose prose-sm max-w-none bg-gray-100 rounded-md p-3 mt-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.description}
              </ReactMarkdown>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="edit-tags">
              Tags
            </label>
            <input
              id="edit-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={
                tags.length >= 3 ? "Max 3 tags" : "Press Enter or comma to add"
              }
              disabled={tags.length >= 3}
              className={inputClass}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-sm hover:text-red-600 hover:cursor-pointer"
                    onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="hidden"
                checked={form.hidden}
                onChange={handleChange}
              />
              Hidden
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="is_discounted"
                checked={form.is_discounted}
                onChange={handleChange}
              />
              Discounted
            </label>
          </div>

          <div className="pt-2">
            <Button
              text={
                isSaving
                  ? zipFile || previewFile || imageFile
                    ? "Uploading..."
                    : "Saving..."
                  : "Save changes"
              }
              style="primary"
              type="submit"
              disabled={isSaving}
            />
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default PackEditModal;
