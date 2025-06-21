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

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60 hover:opacity-80 transition-opacity duration-300">
            {/* Netflix */}
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=120&h=60&fit=crop&crop=center"
                alt="Netflix"
                className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>

            {/* Apple */}
            <div className="flex justify-center">
              <svg
                className="w-8 h-8 fill-slate-400 hover:fill-slate-300 transition-colors"
                viewBox="0 0 24 24"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </div>

            {/* Google */}
            <div className="flex justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>

            {/* Amazon */}
            <div className="flex justify-center">
              <svg
                className="w-12 h-8 fill-slate-400 hover:fill-slate-300 transition-colors"
                viewBox="0 0 100 30"
              >
                <path d="M60.7 14.2c-8.6 0-12.9 6.4-12.9 12.9 0 6.9 4.9 12.9 13.5 12.9 3.9 0 7.3-1.4 9.9-4.2l-2.8-2.1c-1.8 2.1-4.2 3.2-6.8 3.2-4.2 0-7.7-3.2-8.1-7.7h17.8c.1-.7.1-1.4.1-2.1-.1-8.4-5.3-12.9-10.7-12.9zm-8.1 10.3c.7-3.9 3.5-6.8 7.7-6.8s6.8 2.8 7.4 6.8H52.6z" />
                <path d="M28.6 14.2c-3.9 0-7 1.8-8.4 4.9v-4.2h-3.5v24.6h3.5V26.9c0-5.6 2.8-9.1 7.7-9.1 4.2 0 6.8 2.8 6.8 7.7v13.9h3.5V24.8c0-6.4-4.2-10.6-9.6-10.6z" />
                <path d="M79.7 14.9v3.5h-3.5v13.2c0 1.8.7 2.8 2.8 2.8.7 0 1.4-.1 2.1-.4v3.2c-1.1.4-2.1.7-3.5.7-3.9 0-5.6-2.1-5.6-6.1V18.4h-2.8v-3.5h2.8v-7h3.5v7h3.2z" />
                <path d="M96.6 27.9c0-3.9-2.8-6.1-8.1-6.8l-3.2-.4c-3.2-.4-4.9-1.4-4.9-3.5 0-2.1 1.8-3.5 4.6-3.5 2.8 0 4.9 1.1 5.6 3.2l3.2-1.1c-1.1-3.2-4.2-5.6-8.8-5.6-4.9 0-8.4 2.8-8.4 7 0 4.2 2.8 6.1 7.7 6.8l3.2.4c3.5.4 5.3 1.4 5.3 3.9 0 2.5-2.1 4.2-5.3 4.2-3.5 0-6.1-1.4-7-4.2l-3.2 1.1c1.1 4.2 4.9 6.8 10.2 6.8 5.6-.1 9.1-3.3 9.1-7.3z" />
                <path d="M6.9 35.7c-7.7 0-12.9-5.6-12.9-12.9S-1.1 9.9 6.9 9.9c3.9 0 7.3 1.8 9.1 4.6l-2.8 2.1c-1.1-2.1-3.2-3.5-6.1-3.5-4.9 0-8.8 4.2-8.8 9.1s3.9 9.1 8.8 9.1c3.2 0 5.6-1.4 6.8-3.9l2.8 2.1c-1.8 3.5-5.3 5.2-9.8 5.2z" />
              </svg>
            </div>

            {/* Meta/Facebook */}
            <div className="flex justify-center">
              <svg
                className="w-8 h-8 fill-slate-400 hover:fill-slate-300 transition-colors"
                viewBox="0 0 24 24"
              >
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
              </svg>
            </div>

            {/* Microsoft */}
            <div className="flex justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#F35325" d="M1 1h10v10H1z" />
                <path fill="#81BC06" d="M12 1h10v10H12z" />
                <path fill="#05A6F0" d="M1 12h10v10H1z" />
                <path fill="#FFBA08" d="M12 12h10v10H12z" />
              </svg>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-6 italic">
            *No actual brand loyalty implied. Results may vary based on
            subscription fatigue.
          </p>
        </div>
      </div>
    </section>
  );
};
