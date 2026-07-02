import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

const sitemap = new SitemapStream({
  hostname: "https://your-domain.com",
});

const routes = [
  "/",
  "/about",
  "/services",
  "/gallery",
  "/contact",
  "/booking",
];

routes.forEach((route) => sitemap.write({ url: route }));

sitemap.end();

streamToPromise(sitemap).then((data) => {
  createWriteStream("./public/sitemap.xml").write(data);
});