# Rive avatar for the hero TV

Drop an `avatar.riv` file in this folder and the TV in the hero shows it on channel 1, with
the photo on channel 2. Without the file nothing Rive-related loads: no runtime, no WASM, and
the screen shows the photo.

The site drives the file through one state machine, so author it with exactly these names.

| What | Name | Type | Notes |
| --- | --- | --- | --- |
| Artboard | `Avatar` | 4:3 (e.g. 800×600) | Rendered onto the TV screen, which is 1.3:1, so keep the face away from the very edges |
| State machine | `Avatar` | | Must loop on its own: idle breathing, blinking |
| Input | `lookX` | Number, −100 to 100 | Where the eyes and head point horizontally. −100 is far left, 100 is far right |
| Input | `lookY` | Number, −100 to 100 | Vertically, in screen terms: −100 is up, 100 is down |
| Input | `poke` | Trigger | Fired when someone clicks the screen. A short reaction, then back to idle |
| Input | `exploded` | Boolean | True while the TV is exploded. Use it for a surprised look, for example |

How the site sets `lookX` and `lookY`:

- They follow the cursor anywhere on the page, eased so the motion stays smooth.
- After 2.5 seconds without cursor movement, they ease toward the "Get in touch" button.
  People tend to look where a face looks, so the avatar quietly points visitors at the CTA.
- On touch devices there is no cursor, so the avatar looks at the button.

Rive listeners are turned off (the site feeds the inputs instead), so don't rely on
pointer listeners inside the file. Text runs aren't needed; the site uses the smaller
`@rive-app/canvas-lite` runtime.
