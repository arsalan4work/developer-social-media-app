// sanity/fetchData.ts
const serverToken = process.env.SANITY_WRITE_TOKEN;

export const fetchData = async () => {
  const res = await fetch(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}`, {
    headers: {
      Authorization: `Bearer ${serverToken}`,  // Using the server token here
    },
  });

  const data = await res.json();
  return data;
};
