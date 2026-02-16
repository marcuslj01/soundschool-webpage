import { Midi } from "@/lib/types/midi";
import PlayButton from "./PlayButton";
import Badge from "./Badge";

interface MidiInfoModalProps {
  midi: Midi;
  onClose: () => void;
}

export default function MidiInfoModal({ midi, onClose }: MidiInfoModalProps) {
  return (
    <div className="relative bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white hover:cursor-pointer transition-colors z-10"
        aria-label="Close modal"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="p-6">
        {/* Midi details */}
        <div className="max-w-none">
          <div className="flex flex-col">
            <div className="mt-4">
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
                {midi.name}
              </h1>
              <div className="mb-4">
                <div className="flex flex-row gap-2 flex-wrap">
                  {midi.tags?.map((tag) => (
                    <div className="mt-2" key={tag}>
                      <Badge text={tag} style="blue" key={tag} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <PlayButton
                  previewUrl={midi.preview_url}
                  name={midi.name}
                  type="midi"
                />
              </div>

              <h2 id="information-heading" className="sr-only">
                midi information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300 font-bold">BPM</p>
                  <p className="text-gray-300">{midi.bpm}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-300 font-bold">Created</p>
                  <p className="text-gray-300">
                    {midi.created_at.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-300 font-bold">Key</p>
                  <p className="text-gray-300">
                    {midi.root} {midi.scale}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-300 font-bold">Genre</p>
                  <p className="text-gray-300">{midi.genre}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-300 font-bold">VST</p>
                  <p className="text-gray-300">{midi.vst}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-300 font-bold">Preset</p>
                  <p className="text-gray-300">{midi.preset}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
