const apiNinjaKey = "99AjKhp1RQzEv03kBzu2GQ==v1iJX77bQdojqcox";

export const getFederalTaxData = async (
  salary: number,
  filingStatus: string
): Promise<any> => {
  const res = await fetch(
    `https://api.api-ninjas.com/v1/incometaxcalculator?country=US&region=CA&income=${salary}&filing_status=${filingStatus}
`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiNinjaKey,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed To Get Tax Data");
  }
  return res.json();
};
