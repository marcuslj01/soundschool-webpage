import React, { useState } from "react";
import Button from "./Button";
import MidiUploadForm from "./MidiUploadForm";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PackUploadForm from "./PackUploadForm";

interface UploadModalProps {
  onClose: () => void;
}

function UploadModal({ onClose }: UploadModalProps) {
  const [type, setType] = useState<"midi" | "pack" | null>(null);

  return (
    <dialog
      open
      className="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      {type === "midi" && (
        <MidiUploadForm onClose={onClose} onBack={() => setType(null)} />
      )}
      {type === "pack" && (
        <PackUploadForm onClose={onClose} onBack={() => setType(null)} />
      )}
      {type === null && (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 relative">
          <div className="text-2xl font-bold flex flex-row gap-2">
            <p>What do you want to upload?</p>
            <button className="absolute top-4 right-4" onClick={onClose}>
              <XMarkIcon className="w-6 h-6 hover:cursor-pointer" />
            </button>
          </div>
          <div className="flex flex-row gap-4 items-center justify-center mt-4">
            <Button
              text="Midi"
              style="primary"
              onClick={() => setType("midi")}
            />
            <Button
              text="Pack"
              style="primary"
              onClick={() => setType("pack")}
            />
          </div>
        </div>
      )}
    </dialog>
  );
}

export default UploadModal;
