import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sri Gaur Nitai",
    short_name: "Gaur Nitai",
    description: "Contests, celebrations, businesses and community opportunities.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf2",
    theme_color: "#7a2418",
  };
}
