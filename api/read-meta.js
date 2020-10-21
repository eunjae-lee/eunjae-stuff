import urlMetadata from "url-metadata";

export default async (req, res) => {
  const { url } = req.query;
  const result = await urlMetadata(url);

  const title = result["og:title"] || result["title"];
  const author = result["author"];
  const titleAndAuthor = author ? `${title} by ${author}` : title;

  res.json({
    title,
    author,
    titleAndAuthor,
  });
};
