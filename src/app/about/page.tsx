"use client";

const timeline = [
  {
    name: "Founded SoundSchool",
    description:
      "We started SoundSchool with a vision to make professional music production resources accessible to all producers and artists.",
    date: "2023",
    dateTime: "2023",
  },
  {
    name: "Launched MIDI Files",
    description:
      "We began offering high-quality MIDI files for producers looking to enhance their music production workflow.",
    date: "2024",
    dateTime: "2024",
  },
  {
    name: "Expanded to FLP & Pack Files",
    description:
      "We expanded our offering to include FLP files and complete packs for an even more comprehensive experience.",
    date: "2024",
    dateTime: "2024",
  },
  {
    name: "Global Accessibility",
    description:
      "SoundSchool is now available to producers worldwide, with a continuously growing library of resources.",
    date: "2025",
    dateTime: "2025",
  },
];

// const stats = [
//   {
//     name: "Active Users",
//     value: "9,000+",
//     description: "Producers using our resources regularly.",
//   },
//   {
//     name: "MIDI Files",
//     value: "200+",
//     description: "Professional MIDI files available for download.",
//   },
//   {
//     name: "FLP Files",
//     value: "1,000+",
//     description: "Complete production files for FL Studio.",
//   },
//   {
//     name: "Production Packs",
//     value: "500+",
//     description: "Comprehensive packs with samples and resources.",
//   },
// ];

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
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen pb-8">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate overflow-hidden pt-14">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-600 to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                We are{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  SoundSchool
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Your digital home for professional music production resources.
                We offer high-quality MIDI files, FLP files, and packs that help
                producers and artists create amazing music.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/midis"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
                >
                  Explore MIDI Files
                </a>
                <a
                  href="/flps"
                  className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors duration-200"
                >
                  View FLP Files <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-600 to-indigo-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        {/* Timeline section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Journey
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              From humble beginnings to a global platform for music producers.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {timeline.map((item, index) => (
              <div key={item.name} className="relative">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 ring-8 ring-gray-900">
                  <span className="text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="ml-16">
                  <time
                    dateTime={item.dateTime}
                    className="text-sm font-semibold text-indigo-400"
                  >
                    {item.date}
                  </time>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-white">
                    {item.name}
                  </p>
                  <p className="mt-2 text-base text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Helping producers create amazing music
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              SoundSchool is dedicated to giving producers and artists the best
              resources to realize their musical visions.
            </p>
          </div>
          {/* <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <p className="text-4xl font-bold tracking-tight text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-lg font-semibold tracking-tight text-white mb-2">
                    {stat.name}
                  </p>
                  <p className="text-base text-gray-300">{stat.description}</p>
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Mission section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8">
            <div className="lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-700/50">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                    Our Mission
                  </h2>
                  <p className="text-lg leading-8 text-gray-300 mb-8">
                    We believe that all producers deserve access to professional
                    resources that can help them develop their art. SoundSchool
                    is built on the principle of making music production
                    accessible to everyone.
                  </p>
                  <div className="space-y-6">
                    {features.map((feature) => (
                      <div
                        key={feature.title}
                        className="flex items-start gap-4"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {feature.title}
                          </h3>
                          <p className="mt-1 text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-700/50 h-full flex flex-col justify-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
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
                      <span className="text-gray-300">
                        Instant download access
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
                      <span className="text-gray-300">
                        Regular new content updates
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
                      <span className="text-gray-300">
                        Community-driven platform
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600/20 to-purple-600/20 px-6 py-24 text-center sm:rounded-3xl sm:px-16">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to take your music production to the next level?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Explore our library of professional MIDI files, FLP files, and
                packs today.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/midis"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
                >
                  Explore MIDI Files
                </a>
                <a
                  href="/flps"
                  className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors duration-200"
                >
                  View FLP Files <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
