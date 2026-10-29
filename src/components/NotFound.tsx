import { lazy, Suspense } from "react";
import { Button, Crosshair, Hero as HeroShell } from "./m1";

const NotFoundTV = lazy(() => import("./tv/NotFoundTV"));

const EmptyFrame = () => (
  <div className="m1-hero-media">
    <div className="m1-hero-tv">
      <Crosshair className="m1-hero-tv-cross is-tl" />
      <Crosshair className="m1-hero-tv-cross is-br" />
    </div>
  </div>
);

export const NotFound = () => (
  <div className="min-h-screen bg-canvas text-ink flex items-center">
    <main className="mx-auto w-full max-w-[1120px] px-6 py-16 md:px-12">
      <HeroShell
        name="No signal"
        role="Error 404 · Channel lost"
        serial="E-404 · FRANCO.ROURA.DEV"
        lead="This channel isn't broadcasting. The page you're looking for doesn't exist or has moved."
        actions={
          <Button href="/" arrow magnetic>
            Back to home
          </Button>
        }
        media={
          <Suspense fallback={<EmptyFrame />}>
            <NotFoundTV />
          </Suspense>
        }
      />
    </main>
  </div>
);
