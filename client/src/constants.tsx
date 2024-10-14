// const BACKEND_URL = "https://backend.warhosuse.run.place";

// const BACKEND_URL = "http://localhost:8080";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend.warhosuse.run.place";

export { BACKEND_URL };
