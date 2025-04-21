const getSelectedJson = (row: Record<string, unknown>) => {
  const selectKeys = ['error_data', 'error_name', 'status', 'message'];
  const filtered = Object.keys(row).filter((key) => selectKeys.includes(key))
  const selectedObj = {} as Record<string, unknown>;
  filtered.forEach((key) => {
    Object.assign(selectedObj, { [key]: row[key] })
  })
  return selectedObj;
};

const rename_keys = (json: Record<string, unknown>, prefix = "") => {
  Object.entries(json).forEach(([key, value]) => {
    const full_prefix = prefix ? `${prefix}_` : "";
    json[`${full_prefix}_${key}`] = value;
    delete json[key];
  })
}

const getFlattedJson = (json: Record<string, unknown>[]) => json.map((row: Record<string, unknown>) => {
  const selectedJson = getSelectedJson(row);
  const dataObj: Record<string, unknown> = (
    typeof selectedJson.error_data === 'object' && selectedJson.error_data !== null 
    ? selectedJson.error_data as Record<string, unknown>
    : {})

  delete selectedJson.error_data;
  rename_keys(selectedJson)
  const data =  { ...selectedJson, ...dataObj };
  
  return data
});

const getCsvHeaders = (json: Record<string, unknown>[]) => {
  const headers = new Set<string>();
  json.forEach((row) => {
    Object.keys(row).forEach((key) => {
      headers.add(key);
    });
  });
  return Array.from(headers);
};
const getCsv = (json: Record<string, unknown>[]) => {
  const csvHeaders = getCsvHeaders(json);
  const csvRows = json.map(row => {
    return csvHeaders.map((key) => row[key]).join(',');
  });
  return `${csvHeaders.join(',')}\n${csvRows.join('\n')}`;
}

export const jsonToTxt = (json: Record<string, unknown>[]) => JSON.stringify(json, null, 2);
export const jsonToCsv = (json: Record<string, unknown>[]) => getCsv(getFlattedJson(json));
