// Import a file's raw source as a string (Vite). Used by the docs to show an
// example's source verbatim alongside its live render, so they can't drift.
declare module '*?raw' {
  const content: string
  export default content
}
