import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { addPack } from "@/lib/firestore/pack";
import { PackInput } from "@/lib/types/pack";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Button from "./Button";
import { storage } from "@/lib/firebase";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

interface PackUploadFormProps {
  onClose: () => void;
  onBack: () => void;
}

function PackUploadForm({ onClose, onBack }: PackUploadFormProps) {
  const [form, setForm] = useState<PackInput>({
    name: "",
    type: null,
    description: "",
    price: 0,
    discount_price: 0,
    genre: "",
    file_count: 0,
    download_url: "",
    preview_url: "",
    image_url: "",
    tags: [],
    hidden: false,
    is_featured: false,
    is_discounted: false,
    sales: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTagInput(e.target.value);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (tags.length < 3 && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validExtensions = [".zip"];

      // Check if the file extension is valid
      const isValidExtension = validExtensions.some((ext) =>
        selectedFile.name.toLowerCase().endsWith(ext)
      );

      if (!isValidExtension) {
        alert("Please select a valid pack ZIP file (.zip)");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;

    if (type === "checkbox" && "checked" in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Handling submit...");
    e.preventDefault();
    if (!file || !preview || !image) {
      alert("Please upload a file, preview, and image");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const fileRef = ref(storage, `midifiles/${file.name}`);
      await uploadBytes(fileRef, file);
      const file_url = await getDownloadURL(fileRef);

      let preview_url = "";
      if (preview) {
        const previewRef = ref(storage, `previews/${preview.name}`);
        await uploadBytes(previewRef, preview);
        preview_url = await getDownloadURL(previewRef);
      }

      let image_url = "";
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        image_url = await getDownloadURL(imageRef);
      }

      await addPack({
        ...form,
        download_url: file_url,
        preview_url,
        image_url,
        tags,
      });
      alert(form.type + " Pack uploaded successfully");
      onClose();
    } catch (error) {
      console.error("Error uploading midi file:", error);
      alert("Failed to upload midi file");
    } finally {
      setIsLoading(false); // Stop loading regardless of success/failure
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative">
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-2">
          <button onClick={onBack}>
            <ArrowLeftIcon className="w-6 h-6 hover:cursor-pointer" />
          </button>
          <h1 className="text-2xl font-bold">Upload Pack</h1>
          <button className="absolute right-8" onClick={onClose}>
            <XMarkIcon className="w-6 h-6 hover:cursor-pointer" />
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pack ZIP File
            </label>
            <input
              id="file-upload"
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".zip"
              required
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label
              htmlFor="preview-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preview File
            </label>
            <input
              id="preview-upload"
              type="file"
              name="preview"
              accept=".mp3,.wav,.ogg,.m4a"
              required
              onChange={handlePreviewChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label htmlFor="image-upload">Image (1:1 ratio)</label>
            <input
              id="image-upload"
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              required
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <select
              name="type"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Pack Type
              </option>
              <option value="midi">Midi Pack</option>
              <option value="sample">Sample Pack</option>
            </select>
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              required
              placeholder="Price"
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="discount_price"
              required
              placeholder="Discount Price"
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (supports markdown)"
            rows={5}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preview of description:
            </label>
            <div className="prose prose-sm max-w-none bg-gray-100 rounded-md p-3">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside">{children}</ol>
                  ),
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                }}
              >
                {form.description}
              </ReactMarkdown>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="file_count"
              placeholder="File Count"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Tags */}
          <div>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder={
                tags.length >= 3 ? "Max 3 tags" : "Tags (press Enter or comma)"
              }
              disabled={tags.length >= 3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    onClick={() => handleRemoveTag(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Checkboxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="hidden" onChange={handleChange} />
              Hidden
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                onChange={handleChange}
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="is_discounted"
                onChange={handleChange}
              />
              Discounted
            </label>
          </div>
          <div className="pt-4">
            <Button
              text={isLoading ? "Uploading..." : "Upload"}
              style="primary"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default PackUploadForm;
