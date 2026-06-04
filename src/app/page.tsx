import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Sessions from "@/components/sections/Sessions";
import Blog from "@/components/sections/Blog";
import SkillsAndContact from "@/components/sections/SkillsAndContact";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Experience />
      <Projects />
      <Sessions />
      <Blog />
      <SkillsAndContact />
    </div>
  );
}
