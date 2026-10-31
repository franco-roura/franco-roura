const TV = String.raw`
      \   /
   .___\_/____.
   | .------. |o
   | |  FR  | |o
   | '------' |=
   '----------'
      _|__|_`;

// A hello for anyone who opens devtools on the site
export const printConsoleHello = () => {
  console.log(`%c${TV}`, "color: #ff5f1f; font-family: monospace; line-height: 1.25");
  console.log(
    "%cReverse engineering this? Let's talk → https://www.linkedin.com/in/franco-roura/",
    "font: 600 13px Manrope, system-ui, sans-serif; color: #1c1e21; padding: 4px 0"
  );
  console.log(`%cBUILD ${__BUILD_COMMIT__} · ${__BUILD_DATE__}`, "font-family: monospace; color: #7c818a");
};
