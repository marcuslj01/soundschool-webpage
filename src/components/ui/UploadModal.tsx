import React, { useState } from "react";
import Button from "./Button";
import { addMidi } from "@/lib/firestore/midifiles";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { XMarkIcon } from "@heroicons/react/24/outline";

const storage = getStorage();

interface UploadModalProps {
  onClose: () => void;
}

function UploadModal({ onClose }: UploadModalProps) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    root: "",
    scale: "",
    bpm: "",
    genre: "",
    vst: "",
    preset: "",
    discount_price: "",
    tags: "",
    hidden: false,
    is_featured: false,
    is_discounted: false,
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        "audio/midi",
        "audio/x-midi",
        "application/x-midi",
        "application/x-midi-file",
      ];
      const validExtensions = [".mid", ".midi"];

      // Sjekk mimetype
      const isValidType = validTypes.includes(selectedFile.type);

      // Sjekk filendelse (for sikkerhets skyld)
      const isValidExtension = validExtensions.some((ext) =>
        selectedFile.name.toLowerCase().endsWith(ext)
      );

      if (!isValidType && !isValidExtension) {
        alert("Please select a valid MIDI file (.mid or .midi)");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file");
      return;
    }

    if (!preview) {
      alert("Please upload a preview");
      return;
    }

    if (!form.root || !form.scale) {
      alert("You must choose both root and scale");
      return;
    }

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

      await addMidi({
        name: form.name,
        price: Number(form.price),
        root: form.root,
        scale: form.scale,
        bpm: Number(form.bpm),
        genre: form.genre,
        vst: form.vst,
        preset: form.preset,
        discount_price: form.discount_price
          ? Number(form.discount_price)
          : undefined,
        file_url,
        preview_url,
        tags,
        hidden: form.hidden,
        is_featured: form.is_featured,
        is_discounted: form.is_discounted,
      });

      alert("Midi file uploaded successfully");
      onClose();
    } catch (error) {
      console.error("Error uploading midi file:", error);
      alert("Failed to upload midi file");
    }
  };

  return (
    <dialog
      open
      className="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Upload Midifile</h1>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 hover:cursor-pointer" />
          </button>
        </div>

        {/* Midifile form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Midi File
            </label>
            <input
              id="file-upload"
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".mid,.midi,audio/midi"
              required
              className="block w-full text-sm text-gray-700
             file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100
             cursor-pointer border border-gray-300 rounded-md bg-gray-50"
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
              className="block w-full text-sm text-gray-700
             file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100
             cursor-pointer border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="root"
              required
              value={form.root}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Choose root
              </option>
              {[
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
              ].map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </select>
            <select
              name="scale"
              required
              value={form.scale}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Choose scale
              </option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
            </select>
          </div>

          <input
            type="number"
            name="bpm"
            required
            placeholder="BPM"
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre"
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="vst"
              required
              placeholder="VST"
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="preset"
              required
              placeholder="Preset"
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="number"
            name="discount_price"
            placeholder="Discount Price"
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
            <Button text="Upload" style="primary" type="submit" />
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default UploadModal;
