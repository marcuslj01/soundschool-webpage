import React, { useState } from "react";
import { addMidi } from "@/lib/firestore/midifiles";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";
const storage = getStorage(app);

interface UploadModalProps {
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

function UploadModal({ onClose, onSubmit }: UploadModalProps) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    key: "",
    scale: "",
    bpm: "",
    genre: "",
    vst: "",
    preset: "",
    tags: "",
    hidden: false,
    discount_price: "",
    is_featured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);
  const [fileDragActive, setFileDragActive] = useState(false);
  const [previewDragActive, setPreviewDragActive] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploadType, setUploadType] = useState<"single" | "pack" | null>(null);
  const [packFiles, setPackFiles] = useState<File[]>([]);

  const musicalKeys = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const scaleTypes = ["Major", "Minor"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "tags") {
      setTagInput(value);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handlePreviewDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPreviewDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPreview(e.dataTransfer.files[0]);
    }
  };

  const handleFileDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragActive(true);
  };

  const handleFileDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragActive(false);
  };

  const handlePreviewDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPreviewDragActive(true);
  };

  const handlePreviewDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPreviewDragActive(false);
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

  const handleRemoveTag = (removeIdx: number) => {
    setTags(tags.filter((_, idx) => idx !== removeIdx));
  };

  const handlePackFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPackFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadType === "single") {
      if (!file) {
        alert("Please select a MIDI file.");
        return;
      }
      try {
        // 1. Upload MIDI file
        const fileRef = ref(storage, `midifiles/${file.name}`);
        await uploadBytes(fileRef, file);
        const file_url = await getDownloadURL(fileRef);

        // 2. Upload preview if present
        let preview_url = "";
        if (preview) {
          const previewRef = ref(storage, `previews/${preview.name}`);
          await uploadBytes(previewRef, preview);
          preview_url = await getDownloadURL(previewRef);
        }

        // 3. Call addMidi with all fields
        await addMidi({
          name: form.name,
          price: Number(form.price),
          key: form.key,
          bpm: Number(form.bpm),
          genre: form.genre,
          scale: form.scale,
          vst: form.vst,
          preset: form.preset,
          file_url,
          preview_url,
          tags,
          hidden: form.hidden,
          discount_price: form.discount_price
            ? Number(form.discount_price)
            : undefined,
          is_featured: form.is_featured,
        });
        alert("MIDI product uploaded!");
        onClose();
      } catch (err) {
        alert("Upload failed: " + (err as Error).message);
      }
    }
    // TODO: Handle pack upload
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative text-black">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        <h1 className="text-2xl font-bold mb-4">Add MIDI Product</h1>
        {uploadType === null && (
          <div className="flex flex-col items-center space-y-4">
            <p className="mb-2 text-lg font-medium">
              What do you want to upload?
            </p>
            <button
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 hover:cursor-pointer"
              onClick={() => setUploadType("single")}
            >
              Single MIDI file
            </button>
            <button
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 hover:cursor-pointer"
              onClick={() => setUploadType("pack")}
            >
              MIDI pack
            </button>
          </div>
        )}
        {uploadType === "single" && (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Name"
              className="input"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              className="input"
              value={form.price}
              onChange={handleChange}
              required
            />
            <div className="flex space-x-2">
              <select
                name="key"
                className="input flex-1"
                value={form.key}
                onChange={handleChange}
                required
              >
                <option value="">Select Key</option>
                {musicalKeys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <select
                name="scale"
                className="input flex-1"
                value={form.scale}
                onChange={handleChange}
                required
              >
                <option value="">Select Scale</option>
                {scaleTypes.map((scale) => (
                  <option key={scale} value={scale}>
                    {scale}
                  </option>
                ))}
              </select>
            </div>
            <input
              name="bpm"
              type="number"
              placeholder="BPM"
              className="input"
              value={form.bpm}
              onChange={handleChange}
              required
            />
            <input
              name="genre"
              placeholder="Genre"
              className="input"
              value={form.genre}
              onChange={handleChange}
              required
            />
            <input
              name="vst"
              placeholder="VST"
              className="input"
              value={form.vst}
              onChange={handleChange}
              required
            />
            <input
              name="preset"
              placeholder="Preset"
              className="input"
              value={form.preset}
              onChange={handleChange}
              required
            />
            <input
              name="tags"
              placeholder={
                tags.length >= 3 ? "Max 3 tags" : "Tags (press Enter or comma)"
              }
              className="input"
              value={tagInput}
              onChange={handleChange}
              onKeyDown={handleTagKeyDown}
              disabled={tags.length >= 3}
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, idx) => (
                <span key={tag} className="tag-badge">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveTag(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <label>
                <input
                  type="checkbox"
                  name="hidden"
                  checked={form.hidden}
                  onChange={handleChange}
                />{" "}
                Hidden
              </label>
              <label>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                />{" "}
                Featured
              </label>
            </div>
            <input
              name="discount_price"
              type="number"
              placeholder="Discount Price (optional)"
              className="input"
              value={form.discount_price}
              onChange={handleChange}
            />
            <div>
              <label className="block mb-1 font-medium">MIDI File:</label>
              <div
                className={`dropzone ${
                  fileDragActive ? "dropzone-active" : ""
                }`}
                onDragOver={handleFileDragOver}
                onDragLeave={handleFileDragLeave}
                onDrop={handleFileDrop}
                onClick={() =>
                  document.getElementById("midi-file-input")?.click()
                }
                tabIndex={0}
                role="button"
                style={{ cursor: "pointer" }}
              >
                {file ? (
                  <span>{file.name}</span>
                ) : (
                  <span>
                    Drag & drop your MIDI file here, or{" "}
                    <span className="underline">click to choose</span>
                  </span>
                )}
                <input
                  id="midi-file-input"
                  type="file"
                  accept=".mid,.midi"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Preview File (optional):
              </label>
              <div
                className={`dropzone ${
                  previewDragActive ? "dropzone-active" : ""
                }`}
                onDragOver={handlePreviewDragOver}
                onDragLeave={handlePreviewDragLeave}
                onDrop={handlePreviewDrop}
                onClick={() =>
                  document.getElementById("preview-file-input")?.click()
                }
                tabIndex={0}
                role="button"
                style={{ cursor: "pointer" }}
              >
                {preview ? (
                  <span>{preview.name}</span>
                ) : (
                  <span>
                    Drag & drop your preview file here, or{" "}
                    <span className="underline">click to choose</span>
                  </span>
                )}
                <input
                  id="preview-file-input"
                  type="file"
                  accept="audio/*"
                  onChange={handlePreviewChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 mt-2 hover:cursor-pointer"
            >
              Upload
            </button>
          </form>
        )}
        {uploadType === "pack" && (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-medium">MIDI Pack Files:</label>
              <input
                type="file"
                accept=".mid,.midi"
                multiple
                onChange={handlePackFilesChange}
                required
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {packFiles.map((f) => (
                  <span key={f.name} className="tag-badge">
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
            {/* TODO: Add more fields for pack metadata */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 mt-2"
            >
              Upload Pack
            </button>
          </form>
        )}
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
        }
        .dropzone {
          width: 100%;
          min-height: 48px;
          border: 2px dashed #d1d5db;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: #f9fafb;
          color: #6b7280;
          transition: border-color 0.2s, background 0.2s;
        }
        .dropzone-active {
          border-color: #2563eb;
          background: #e0e7ff;
        }
        .tag-badge {
          display: inline-flex;
          align-items: center;
          background: #e0e7ff;
          color: #1e293b;
          border-radius: 9999px;
          padding: 0.25rem 0.75rem 0.25rem 0.75rem;
          font-size: 0.875rem;
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
          gap: 0.5rem;
        }
        .tag-remove {
          background: none;
          border: none;
          color: #64748b;
          font-size: 1rem;
          margin-left: 0.5rem;
          cursor: pointer;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}

export default UploadModal;
