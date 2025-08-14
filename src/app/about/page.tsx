"use client";

const features = [
  {
    title: "High-Quality Resources",
    description:
      "All our files are created by professional producers and tested for quality.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Easy Access",
    description:
      "Download and use our resources immediately in your own project.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Continuous Updates",
    description:
      "We add new resources regularly to keep you updated with the latest trends.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-20">
      {/* Hero section */}
      <div className="flex flex-col gap-4 w-full items-center text-white py-16 px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-2xl font-bold text-white sm:text-4xl mb-4">
            We are <span className="text-primary">SoundSchool</span>
          </h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            Your digital home for professional music production resources. We
            offer high-quality MIDI files, FLP files, and packs that help
            producers and artists create amazing music.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <a
              href="/midis"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
            >
              Explore MIDI Files
            </a>
            <a
              href="/flps"
              className="border-2 border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black hover:cursor-pointer transition-all duration-300"
            >
              View FLP Files
            </a>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="flex flex-col gap-4 w-full items-center text-white py-16 px-4">
        <div className="text-center max-w-4xl">
          <h2 className="text-2xl font-bold text-white sm:text-4xl mb-4">
            Helping producers create amazing music
          </h2>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            SoundSchool is dedicated to giving producers and artists the best
            resources to realize their musical visions.
          </p>
        </div>
      </div>

      {/* Mission section */}
      <div className="flex flex-col gap-12 w-full items-center text-white py-16 px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white sm:text-3xl mb-6">
              Our Mission
            </h2>
            <p className="text-gray-300 mb-8">
              We believe that all producers deserve access to professional
              resources that can help them develop their art. SoundSchool is
              built on the principle of making music production accessible to
              everyone.
            </p>
            <div className="space-y-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white sm:text-3xl mb-6">
              Why Choose SoundSchool?
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20 text-green-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-300">
                  Professional quality resources
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20 text-green-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-300">Instant download access</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20 text-green-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-300">
                  Regular new content updates
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="flex flex-col gap-4 w-full items-center text-white py-16 px-4">
        <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl mb-4">
            Ready to take your music production to the next level?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore our library of professional MIDI files, FLP files, and packs
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/midis"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
            >
              Explore MIDI Files
            </a>
            <a
              href="/flps"
              className="border-2 border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black hover:cursor-pointer transition-all duration-300"
            >
              View FLP Files
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
