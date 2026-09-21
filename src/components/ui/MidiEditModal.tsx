import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { Midi } from "@/lib/types/midi";
import { uploadAsset } from "@/lib/uploadAsset";

interface MidiEditModalProps {
  midi: Midi;
  onClose: () => void;
  onSaved: (updated: Midi) => void;
}

const inputClass =
  "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const fileInputClass =
  "block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md bg-gray-50";
const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function MidiEditModal({ midi, onClose, onSaved }: MidiEditModalProps) {
  const { user: currentUser } = useAuth();
  const [form, setForm] = useState({
    name: midi.name ?? "",
    price: midi.price ?? 0,
    discount_price: midi.discount_price ?? 0,
    root: midi.root ?? "C",
    scale: midi.scale ?? "Major",
    bpm: midi.bpm ?? 120,
    genre: midi.genre ?? "",
    vst: midi.vst ?? "",
    preset: midi.preset ?? "",
    hidden: midi.hidden ?? false,
    is_featured: midi.is_featured ?? false,
    is_discounted: midi.is_discounted ?? false,
  });
  const [tags, setTags] = useState<string[]>(midi.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [midiFile, setMidiFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        alert("You must be logged in to edit MIDI files");
        return;
      }

      const urls: { file_url?: string; preview_url?: string } = {};
      try {
        if (midiFile) urls.file_url = await uploadAsset("midi-file", midiFile, token);
        if (previewFile) urls.preview_url = await uploadAsset("midi-preview", previewFile, token);
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
          type: "midis",
          productId: midi.id,
          productData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to save: ${errorData.error || "Unknown error"}`);
        return;
      }

      onSaved({ ...midi, ...productData });
      onClose();
    } catch (error) {
      console.error("Error saving MIDI file:", error);
      alert("Failed to save MIDI file");
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
          <h1 className="text-2xl font-bold">Edit MIDI file</h1>
          <button type="button" onClick={onClose}>
            <XMarkIcon className="w-6 h-6 hover:cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="edit-midi">
              Replace MIDI file (optional)
            </label>
            <input
              id="edit-midi"
              type="file"
              accept=".mid,.midi,audio/midi"
              onChange={(e) => setMidiFile(e.target.files?.[0] ?? null)}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
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
              <label className={labelClass} htmlFor="edit-vst">
                VST
              </label>
              <input
                id="edit-vst"
                type="text"
                name="vst"
                value={form.vst}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-preset">
                Preset
              </label>
              <input
                id="edit-preset"
                type="text"
                name="preset"
                value={form.preset}
                onChange={handleChange}
                className={inputClass}
              />
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
                  ? midiFile || previewFile
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

export default MidiEditModal;
