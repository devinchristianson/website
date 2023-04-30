export const DarkThemeLauncher = () => (
  // a bunch of shenanigans to check if the user prefers a light theme, otherwise set the theme to dark
  <script dangerouslySetInnerHTML={`if(!(localStorage.theme==="light" || window.matchMedia("(prefers-color-scheme: light)").matches)){document.documentElement.classList.add("dark");}`} />
);
