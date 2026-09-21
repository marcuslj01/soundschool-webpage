import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { FLP } from "@/lib/types/FLP";

interface FLPEditModalProps {
  flp: FLP;
  onClose: () => void;
  onSaved: (updated: FLP) => void;
}

const inputClass =
  "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function FLPEditModal({ flp, onClose, onSaved }: FLPEditModalProps) {
  const { user: currentUser } = useAuth();
  const [form, setForm] = useState({
    name: flp.name ?? "",
    description: flp.description ?? "",
    price: flp.price ?? 0,
    discount_price: flp.discount_price ?? 0,
    bpm: flp.bpm ?? 120,
    root: flp.root ?? "C",
    scale: flp.scale ?? "Major",
    genre: flp.genre ?? "",
    video_url: flp.video_url ?? "",
    hidden: flp.hidden ?? false,
    is_featured: flp.is_featured ?? false,
    is_discounted: flp.is_discounted ?? false,
  });
  const [tags, setTags] = useState<string[]>(flp.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (!selected.name.toLowerCase().endsWith(".zip")) {
      alert("Please select a valid FLP ZIP file (.zip)");
      e.target.value = "";
      return;
    }
    setFile(selected);
  };

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
        alert("You must be logged in to edit files");
        return;
      }

      let file_url: string | undefined;
      if (file) {
        const urlResponse = await fetch("/api/admin/flp/upload-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileName: file.name, fileSize: file.size }),
        });
        if (!urlResponse.ok) {
          const errorData = await urlResponse.json().catch(() => ({}));
          alert(`Upload failed: ${errorData.error || "Unknown error"}`);
          return;
        }
        const { uploadUrl, contentType, file_url: newUrl } =
          await urlResponse.json();

        const uploadResult = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: file,
        });
        if (!uploadResult.ok) {
          alert("Upload failed: could not upload file to storage");
          return;
        }
        file_url = newUrl;
      }

      const productData = {
        ...form,
        name: form.name.trim(),
        tags,
        ...(file_url ? { file_url } : {}),
      };
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "flps",
          productId: flp.id,
          productData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to save: ${errorData.error || "Unknown error"}`);
        return;
      }

      const videoId = form.video_url.match(
        /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
      )?.[1];
      onSaved({
        ...flp,
        ...productData,
        image_url: videoId
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          : flp.image_url,
      });
      onClose();
    } catch (error) {
      console.error("Error saving FLP:", error);
      alert("Failed to save FLP");
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
          <h1 className="text-2xl font-bold">Edit FLP</h1>
          <button type="button" onClick={onClose}>
            <XMarkIcon className="w-6 h-6 hover:cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="edit-file">
              Replace FLP ZIP (optional, leave empty to keep current file)
            </label>
            <input
              id="edit-file"
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

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
            <label className={labelClass} htmlFor="edit-video">
              YouTube Video URL (thumbnail is updated from this)
            </label>
            <input
              id="edit-video"
              type="url"
              name="video_url"
              value={form.video_url}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className={labelClass} htmlFor="edit-bpm">
                BPM
              </label>
              <input
                id="edit-bpm"
                type="number"
                name="bpm"
                min={1}
                value={form.bpm}
                onChange={handleChange}
                required
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
              <label className={labelClass} htmlFor="edit-root">
                Root
              </label>
              <select
                id="edit-root"
                name="root"
                value={form.root}
                onChange={handleChange}
                className={inputClass}
              >
                {ROOTS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-scale">
                Scale
              </label>
              <select
                id="edit-scale"
                name="scale"
                value={form.scale}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
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
              text={isSaving ? (file ? "Uploading..." : "Saving...") : "Save changes"}
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

export default FLPEditModal;
