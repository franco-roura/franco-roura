import { renderToString } from "react-dom/server";
import { createElement } from "react";
import fs from "fs";
import path from "path";
import { Hero } from "../src/components/Hero";

const cleanHtml = (html: string): string => {
  // Remove the avatar div node
  return html.replace(/<div class="mb-8 flex justify-center">.*?<\/div>/gs, "");
};

const createThemeVariant = (html: string, isDark: boolean): string => {
  const contrastColor = isDark ? "text-white" : "text-black";
  return html
    .replace(/text-slate-300/g, contrastColor)
    .replace(/text-slate-400/g, contrastColor)
    .replace(/font-orbitron/g, "font-orbitron " + contrastColor);
};

const extractTailwindClasses = (html: string): string[] => {
  const classRegex = /class="([^"]*)"/g;
  const classes: string[] = [];
  let match;

  while ((match = classRegex.exec(html)) !== null) {
    const classList = match[1].split(" ").filter(Boolean);
    classes.push(...classList);
  }

  return [...new Set(classes)];
};

const generateTailwindCSS = (classes: string[]): string => {
  // This is a simplified approach - in a real implementation, you'd want to use
  // the actual Tailwind CSS generation process
  const commonClasses = [
    "min-h-screen",
    "flex",
    "items-center",
    "justify-center",
    "relative",
    "px-6",
    "overflow-hidden",
    "absolute",
    "inset-0",
    "pointer-events-none",
    "text-emerald-400",
    "animate-spin-float-1",
    "text-teal-400",
    "animate-spin-float-2",
    "animate-spin-float-3",
    "animate-spin-float-4",
    "animate-spin-float-5",
    "text-center",
    "max-w-4xl",
    "mx-auto",
    "relative",
    "z-10",
    "mb-8",
    "flex",
    "justify-center",
    "w-64",
    "h-64",
    "border-4",
    "border-emerald-400",
    "text-lg",
    "font-mono",
    "text-4xl",
    "md:text-6xl",
    "lg:text-7xl",
    "font-bold",
    "leading-tight",
    "font-orbitron",
    "text-slate-300",
    "text-black",
    "text-white",
    "w-24",
    "h-1",
    "bg-gradient-to-r",
    "from-emerald-400",
    "to-teal-400",
    "rounded-full",
    "text-xl",
    "text-slate-400",
    "max-w-2xl",
    "leading-relaxed",
    "mb-12",
    "gap-6",
    "mb-16",
    "p-3",
    "rounded-full",
    "bg-slate-800",
    "border",
    "border-slate-700",
    "hover:border-emerald-400",
    "hover:bg-slate-800",
    "transition-all",
    "duration-300",
    "group",
    "w-6",
    "h-6",
    "text-slate-400",
    "group-hover:text-emerald-400",
    "transition-colors",
    "animate-bounce",
  ];

  // Filter classes to only include the ones we have CSS for
  classes.filter((cls) => commonClasses.includes(cls));

  // Generate basic CSS for the used classes
  const css = `
    @font-face {
      font-family: 'Orbitron';
      src: url('https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2') format('woff2');
      font-weight: 400 900;
      font-style: normal;
      font-display: swap;
    }

    
    .min-h-screen { min-height: 100vh; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .relative { position: relative; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .overflow-hidden { overflow: hidden; }
    .absolute { position: absolute; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .pointer-events-none { pointer-events: none; }
    .text-emerald-400 { color: #4ade80; }
    .text-teal-400 { color: #2dd4bf; }
    .text-center { text-align: center; }
    .max-w-4xl { max-width: 56rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .z-10 { z-index: 10; }
    .mb-8 { margin-bottom: 2rem; }
    .justify-center { justify-content: center; }
    .w-64 { width: 16rem; }
    .h-64 { height: 16rem; }
    .border-4 { border-width: 4px; }
    .border-emerald-400 { border-color: #4ade80; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .md\\:text-6xl { font-size: 3.75rem; line-height: 1; }
    .lg\\:text-7xl { font-size: 4.5rem; line-height: 1; }
    .font-bold { font-weight: 700; }
    .leading-tight { line-height: 1.25; }
    .font-orbitron { font-family: 'Orbitron', monospace; }
    .text-slate-300 { color: #cbd5e1; }
    .text-black { color: #000000; }
    .text-white { color: #ffffff; }
    .w-24 { width: 6rem; }
    .h-1 { height: 0.25rem; }
    .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
    .from-emerald-400 { --tw-gradient-from: #4ade80; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(74, 222, 128, 0)); }
    .to-teal-400 { --tw-gradient-to: #2dd4bf; }
    .rounded-full { border-radius: 9999px; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-slate-400 { color: #94a3b8; }
    .max-w-2xl { max-width: 42rem; }
    .leading-relaxed { line-height: 1.625; }
    .mb-12 { margin-bottom: 3rem; }
    .gap-6 { gap: 1.5rem; }
    .mb-16 { margin-bottom: 4rem; }
    .p-3 { padding: 0.75rem; }
    .rounded-full { border-radius: 9999px; }
    .bg-slate-800 { background-color: #1e293b; }
    .border { border-width: 1px; }
    .border-slate-700 { border-color: #334155; }
    .hover\\:border-emerald-400:hover { border-color: #4ade80; }
    .hover\\:bg-slate-800:hover { background-color: #1e293b; }
    .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .duration-300 { transition-duration: 300ms; }
    .group { }
    .w-6 { width: 1.5rem; }
    .h-6 { height: 1.5rem; }
    .text-slate-400 { color: #94a3b8; }
    .group-hover\\:text-emerald-400.group:hover { color: #4ade80; }
    .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .animate-bounce { animation: bounce 1s infinite; }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
      50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
    }
    
    @keyframes spin-float-1 {
      0%, 100% { transform: rotate(0deg) translateY(0px); }
      50% { transform: rotate(180deg) translateY(-10px); }
    }
    
    @keyframes spin-float-2 {
      0%, 100% { transform: rotate(0deg) translateY(0px); }
      50% { transform: rotate(-180deg) translateY(10px); }
    }
    
    @keyframes spin-float-3 {
      0%, 100% { transform: rotate(0deg) translateY(0px); }
      50% { transform: rotate(90deg) translateY(-5px); }
    }
    
    @keyframes spin-float-4 {
      0%, 100% { transform: rotate(0deg) translateY(0px); }
      50% { transform: rotate(-90deg) translateY(5px); }
    }
    
    @keyframes spin-float-5 {
      0%, 100% { transform: rotate(0deg) translateY(0px); }
      50% { transform: rotate(45deg) translateY(-8px); }
    }
    
    .animate-spin-float-1 { animation: spin-float-1 6s ease-in-out infinite; }
    .animate-spin-float-2 { animation: spin-float-2 8s ease-in-out infinite; }
    .animate-spin-float-3 { animation: spin-float-3 7s ease-in-out infinite; }
    .animate-spin-float-4 { animation: spin-float-4 9s ease-in-out infinite; }
    .animate-spin-float-5 { animation: spin-float-5 5s ease-in-out infinite; }
  `;

  return css;
};

const buildHeroSVG = async () => {
  try {
    console.log("🚀 Building Hero SVGs...");

    // Render the Hero component to HTML
    const heroElement = createElement(Hero);
    const html = renderToString(heroElement);

    // Clean the HTML
    const cleanedHtml = cleanHtml(html);

    // Create both theme variants
    const darkHtml = createThemeVariant(cleanedHtml, true);
    const lightHtml = createThemeVariant(cleanedHtml, false);

    // Extract Tailwind classes from both variants
    const darkClasses = extractTailwindClasses(darkHtml);
    const lightClasses = extractTailwindClasses(lightHtml);
    const allClasses = [...new Set([...darkClasses, ...lightClasses])];
    console.log(`📦 Found ${allClasses.length} unique Tailwind classes`);

    // Generate CSS for the classes
    const css = generateTailwindCSS(allClasses);

    // Read the SVG template
    const svgTemplatePath = path.join(
      process.cwd(),
      "public",
      "md-trick-template.svg"
    );
    const svgTemplate = fs.readFileSync(svgTemplatePath, "utf-8");

    // Create dark theme SVG
    const darkSVG = svgTemplate
      .replace("<!-- Content goes here -->", darkHtml)
      .replace("<!-- Css goes here -->", css);

    // Create light theme SVG
    const lightSVG = svgTemplate
      .replace("<!-- Content goes here -->", lightHtml)
      .replace("<!-- Css goes here -->", css);

    // Write both SVG files
    const darkOutputPath = path.join(
      process.cwd(),
      "public",
      "md-trick-dark.svg"
    );
    const lightOutputPath = path.join(
      process.cwd(),
      "public",
      "md-trick-light.svg"
    );

    fs.writeFileSync(darkOutputPath, darkSVG);
    fs.writeFileSync(lightOutputPath, lightSVG);

    console.log("✅ Hero SVGs built successfully!");
    console.log(`📁 Dark theme: ${darkOutputPath}`);
    console.log(`📁 Light theme: ${lightOutputPath}`);
    console.log(`📏 Dark SVG size: ${(darkSVG.length / 1024).toFixed(2)} KB`);
    console.log(`📏 Light SVG size: ${(lightSVG.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error("❌ Error building Hero SVGs:", error);
    process.exit(1);
  }
};

// Run the build if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildHeroSVG();
}

export { buildHeroSVG };
