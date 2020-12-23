import fetch from "node-fetch";

export default async (req, res) => {
  if (req.query.check !== process.env.GET_EXPENSE_CHECK_PHRASE) {
    res.json({});
    return;
  }

  const bearer = `Bearer ${process.env.AIRTABLE_API_KEY}`;

  const res1 = await fetch(
    "https://api.airtable.com/v0/appvXmCsMU0ihECMq/Period?sort%5B0%5D%5Bdirection%5D=desc&sort%5B0%5D%5Bfield%5D=Start%20Date&maxRecords=1",
    {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    }
  );
  const {
    Name: currentPeriod,
    "Start Date": startDate,
    "End Date": endDate,
  } = (await res1.json()).records[0].fields;

  const res2 = await fetch(
    `https://api.airtable.com/v0/appvXmCsMU0ihECMq/Category?filterByFormula=%7BPeriod%7D%20%3D%20'${encodeURIComponent(
      currentPeriod
    )}'`,
    {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    }
  );
  const categories = (await res2.json()).records.map(
    ({ fields: { Name, Budget } }) => ({
      name: Name,
      budget: Budget,
    })
  );

  const res3 = await fetch(
    `https://api.airtable.com/v0/appvXmCsMU0ihECMq/Expense?filterByFormula=AND(IS_AFTER(%7BDate%7D%2C%20'${encodeURIComponent(
      startDate
    )}')%2C%20IS_BEFORE(%7BDATE%7D%2C%20'${encodeURIComponent(endDate)}'))`,
    {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    }
  );
  const expenses = (await res3.json()).records.map(
    ({ fields: { Category, Amount } }) => ({
      category: Category,
      amount: Amount,
    })
  );

  res.json({
    expenses,
    categories,
    currentPeriod,
    startDate,
    endDate,
  });
};
