import fetch from "node-fetch";

export default (req, res) => {
  const { category, amount } = req.query;

  return fetch("https://api.airtable.com/v0/appvXmCsMU0ihECMq/Expense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Date: new Date().toISOString(),
            Category: category,
            Amount: Number(String(amount).split(",").join(".")),
          },
        },
      ],
    }),
  })
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
};
