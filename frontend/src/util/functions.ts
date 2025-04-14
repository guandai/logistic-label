import { PackageModel } from "@ddlabel/shared/src/models";

export const extractAddressZip = (address?: string): string => {
	const zip = address?.trim().match(/\b\d{5}\b/);
	return zip ? zip[0] : '';
}

const statesAbbreviations = {
	"alabama": "AL",
	"alaska": "AK",
	"arizona": "AZ",
	"arkansas": "AR",
	"california": "CA",
	"colorado": "CO",
	"connecticut": "CT",
	"delaware": "DE",
	"district of columbia": "DC",
	"florida": "FL",
	"georgia": "GA",
	"guam": "GU",
	"hawaii": "HI",
	"idaho": "ID",
	"illinois": "IL",
	"indiana": "IN",
	"iowa": "IA",
	"kansas": "KS",
	"kentucky": "KY",
	"louisiana": "LA",
	"maine": "ME",
	"maryland": "MD",
	"massachusetts": "MA",
	"michigan": "MI",
	"minnesota": "MN",
	"mississippi": "MS",
	"missouri": "MO",
	"montana": "MT",
	"nebraska": "NE",
	"nevada": "NV",
	"new hampshire": "NH",
	"new jersey": "NJ",
	"new mexico": "NM",
	"new york": "NY",
	"north carolina": "NC",
	"north dakota": "ND",
	"northern mariana islands": "MP",
	"ohio": "OH",
	"oklahoma": "OK",
	"oregon": "OR",
	"pennsylvania": "PA",
	"puerto rico": "PR",
	"rhode island": "RI",
	"south carolina": "SC",
	"south dakota": "SD",
	"tennessee": "TN",
	"texas": "TX",
	"trust territories": "TT",
	"utah": "UT",
	"vermont": "VT",
	"virginia": "VA",
	"virgin islands": "VI",
	"washington": "WA",
	"west virginia": "WV",
	"wisconsin": "WI",
	"wyoming": "WY"
};

export const getStateId = (state: string): string => 
	{
		if (!state) { return ''; }
		return statesAbbreviations[state?.toLowerCase() as keyof typeof statesAbbreviations];
  }

export const cleanAddress = (pkg: PackageModel, dest: 'to' | 'from',  addressString?: string) => {
	const addressObj = dest === 'to' ? pkg.toAddress : pkg.fromAddress;
	if (!addressString) { return addressString; };

	[addressObj.city, addressObj.state, addressObj.zip, getStateId(addressObj.state)]
		.forEach((str) => 
			addressString = addressString?.replace(new RegExp(`\\b${str}\\b`, 'i'), '')
		)

	return addressString.trim().replace(/[,\s]+$/ , '');
}
