"use client";
import Header from "@/components/Header";
import About from "@/components/About";
import { Contact, Experience, Projects, Skills, useReveal } from "@/components/Sections";
import CrowdFooter from "@/components/CrowdFooter";

export default function Page() {
  useReveal();
  return (
    <>
      <Header />
      <main id="main">
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <CrowdFooter />
    </>
  );
}
