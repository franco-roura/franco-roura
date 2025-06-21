import { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "./ui/carousel";

const ConsumerBrands = () => {
  const { scrollNext } = useCarousel();

  useEffect(() => {
    const interval = setInterval(() => {
      scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [scrollNext]);

  const brands = [
    {
      name: "Apple",
      image: "/brand_logos/apple.webp",
    },
    {
      name: "AWS",
      image: "/brand_logos/aws.webp",
    },
    {
      name: "Disney+",
      image: "/brand_logos/disney.webp",
    },
    {
      name: "HBO",
      image: "/brand_logos/hbo.webp",
    },
    {
      name: "Netflix",
      image: "/brand_logos/netflix.webp",
    },
    {
      name: "Nintendo",
      image: "/brand_logos/nintendo.svg",
    },
    {
      name: "Spotify",
      image: "/brand_logos/spotify.webp",
    },
    {
      name: "Steam",
      image: "/brand_logos/steam.webp",
    },
    {
      name: "Xbox",
      image: "/brand_logos/xbox.webp",
    },
  ];

  return (
    <CarouselContent>
      {brands.map((brand) => (
        <CarouselItem className="basis-1/5 flex justify-center items-center">
          <img
            src={brand.image}
            alt={brand.name}
            className="h-12 object-contain transition-all"
          />
        </CarouselItem>
      ))}
    </CarouselContent>
  );
};

export const AboutSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <span className="text-2xl">👋</span>
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 hover:border-emerald-400/30 transition-all duration-300 mb-12">
          <p className="text-lg text-slate-300 leading-relaxed">
            I'm a software architect who thrives on solving complex problems
            with simple, scalable solutions. I speak fluent backend, dabble in
            DevOps, and can make frontend behave. When I'm not writing code, I'm
            probably redesigning it in my head. I do enjoy playing video games
            every once in a while, but I always end up reverse engineering them.
          </p>
        </div>

        {/* Consumer Brands Section */}
        <div className="text-center">
          <h3 className="text-xl text-slate-400 mb-8 font-medium">
            Avid consumer of{" "}
            <span className="text-slate-500 text-sm italic">(apparently)</span>
          </h3>

          <Carousel
            className="bg-slate-400/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 hover:border-emerald-400/30 transition-all duration-300"
            opts={{ loop: true, align: "center" }}
          >
            <CarouselPrevious className="hidden lg:inline-flex" />
            <ConsumerBrands />
            <CarouselNext className="hidden lg:inline-flex" />
          </Carousel>
          <p className="text-xs text-slate-500 mt-6 italic">
            *No actual brand loyalty implied. Results may vary based on
            subscription fatigue.
          </p>
        </div>
      </div>
    </section>
  );
};
