import Hero from "@/components/sections/Hero";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 w-full items-center">
      <Hero
        title="Welcome to"
        subtitle="Soundschool"
        description="Check out our biggest pack yet!"
        productImage="/images/Midipack.png"
        backgroundImage="/images/Hero.png"
        primaryButtonText="Read more"
        secondaryButtonText="Other products"
      />

      <div className="w-[95%] md:w-1/3 flex flex-col items-center h-screen gap-4">
        <h1 className="text-white text-2xl sm:text-4xl flex justify-center font-bold">
          Check out our midifiles!
        </h1>
        <div className="w-60 h-1 bg-primary rounded mb-4" />
        <Card
          title="Chord Progression #192"
          date="25.06.25"
          scale="C Major"
          bpm={120}
        />
        <Card
          title="Chord Progression #192"
          date="25.06.25"
          scale="C Major"
          bpm={120}
        />
        <Card
          title="Chord Progression #192"
          date="25.06.25"
          scale="C Major"
          bpm={120}
        />
        <Card
          title="Chord Progression #192"
          date="25.06.25"
          scale="C Major"
          bpm={120}
        />
      </div>
    </main>
  );
}
