import { AddressChange, CsvRecord, PortInfo, ZipInfo } from '@ddlabel/shared';
import stateDataJson from '../data/stateSmall.json';
import portDataJson from '../data/portSmall.json';
import { InvalidInputError } from './errorClasses';
const stateData = stateDataJson as ZipInfo[];
const portData = portDataJson as PortInfo[];
type PortData = {
  zip: string;
  sortCode: string;
  state: string;
  city: string;
  proposal: string;
  startZip: string;
}

type StateData = {
  zip: string;
  city: string;
  state: string;
  county?: string;
  tz?: string;
}

export const extractAddressZip = (address?: string): string => {
	const zip = address?.trim().match(/\b\d{5}\b/);
	return zip ? zip[0] : '';
}

export const fixCityState = <T extends AddressChange>(attr: T): T => {
  if (attr.city && attr.state) { return attr }
  const info = getZipInfo(attr.zip)
    || getZipInfo(extractAddressZip(attr.address2))
    || getZipInfo(extractAddressZip(attr.address1));
  if (!info) {
    const error = new InvalidInputError(`ZipInfo not found`, 'ZipInfo', attr);
    throw error;
  }
  return { ...attr, city: info.city, state: info.state };
}

export const fixPort = <T extends AddressChange>(attr: T): T => {
  if (attr.proposal) { return attr }
  const info = getPortInfo(attr.zip);
  if (!info) {
    throw new Error(`Port not found for ${attr.zip}`);
  }
  return { ...attr, proposal: info.proposal, sortCode: info.sortCode };
}

const getInfo = <T extends StateData | PortData>(zip: string, data: T[]) => {
  if (!zip || !data || !data.length) { return }
  return data.find(x => x.zip === zip);
};
export const getZipInfo = (zip: string): ZipInfo | undefined => getInfo<ZipInfo>(zip, stateData);
export const getPortInfo = (zip: string): PortInfo | undefined => getInfo<PortInfo>(zip, portData);

export const getFromAddressZip = (mappedData: CsvRecord): string =>
  mappedData['fromAddressZip'] && mappedData['fromAddressZip']
  || mappedData['fromAddress2'] && extractAddressZip(mappedData['fromAddress2'])
  || extractAddressZip(mappedData['fromAddress1'])
  || '';

export const getToAddressZip = (mappedData: CsvRecord): string =>
  mappedData['toAddressZip'] && mappedData['toAddressZip']
  || mappedData['toAddress2'] && extractAddressZip(mappedData['toAddress2'])
  || extractAddressZip(mappedData['toAddress1'])
  || '';

export default getZipInfo;
