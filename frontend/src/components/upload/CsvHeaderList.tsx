import React from 'react';
import { Box, Select, MenuItem, Grid, FormControl, InputLabel } from '@mui/material';
import { KeyCsvRecord, HeaderMapping, CSV_KEYS, CSV_KEYS_REQUIRED, CsvRecord } from '@ddlabel/shared';

type Prop = {
	csvHeaders: string[];
	headerMapping: HeaderMapping;
	handleMappingChange: (keys: KeyCsvRecord, value: string) => void;
}

const CsvHeaderList: React.FC<Prop> = (prop) => {
	const { csvHeaders, headerMapping, handleMappingChange } = prop;
	// const third = Math.ceil(CSV_KEYS.length / 3);
	// const col1 = CSV_KEYS.slice(0, third);
	// const col2 = CSV_KEYS.slice(third, third * 2);
	// const col3 = CSV_KEYS.slice(third * 2);

	const col1 = ['weight', 'length', 'width', 'height', 'referenceNo'] as Partial<typeof CSV_KEYS>;
	const col2 = ['fromAddressName', 'fromAddress1', 'fromAddress2', 'fromAddressZip', 'fromAddressPhone'] as Partial<typeof CSV_KEYS>;
	const col3 = ['toAddressName', 'toAddress1', 'toAddress2', 'toAddressZip', 'toAddressPhone'] as Partial<typeof CSV_KEYS>;


	const keysRows = [col1, col2, col3] as unknown as Array<Array<keyof CsvRecord>>;

	const selectKey = (key: keyof CsvRecord, required: boolean) =>
		<Box key={key} mb={2}>
			<FormControl fullWidth>
				<InputLabel id={`${key}-label`}>{key} {required && '*'}</InputLabel>
				<Select
					variant="outlined"
					label={key}
					labelId={`${key}-label`}
					required={required}
					placeholder='None'
					value={headerMapping && headerMapping[key] ? headerMapping[key] : ''}
					onChange={e => handleMappingChange(key, String(e.target.value))}
				>
					<MenuItem key='empty' value={undefined}><em>None</em></MenuItem>
					{csvHeaders.map((header) => (
						<MenuItem key={header} value={header}>
							{header}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>

	return (
		<Grid container spacing={2}>{
			keysRows.map((keysRow, idx) => (
				<Grid key={idx} item xs={4} sx={{ display: 'flex', flexDirection: 'column' }}>{
					keysRow.map((key: keyof CsvRecord) => {
						const required = CSV_KEYS_REQUIRED.includes(key)
						return selectKey(key, required);
					})
				}</Grid>
			))
		}</Grid>
	);
}
export default CsvHeaderList;
