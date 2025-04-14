import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { tryLoad } from '../../util/errors';

import { AddressEnum, GetRecordsReq, GetRecordsRes, isGetPackagesRes, isGetTransactionsRes, isGetUsersRes } from '@ddlabel/shared';
import { MessageContent, SearchOptions } from '../../types';
import { toDateTime } from '../../util/time';
import RecordsQuerySearch from './RecordsQuerySearch';
import RecordsPageQuery from './RecordsPageQuery';

const PerPageList = [5, 10, 20, 40, 80];
const SearchList: SearchOptions[] = ['address', 'date', 'trackingNo'];
export type FilterConfig = {
	startDate: Date | null;
	endDate: Date | null;
	trackingNo: string;
	address: string;
	addressType: AddressEnum;
};
type Props = {
	searchList?: SearchOptions[];
	perPageList?: number[];
	setFilter?: (filter: FilterConfig) => void;
	getRecords: (params: GetRecordsReq) => Promise<GetRecordsRes>;
	setRecords: (records: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const RecordsQuery: React.FC<Props> = (prop) => {
	const { getRecords, setRecords, setMessage, setFilter, perPageList = PerPageList, searchList=SearchList } = prop;
	const [page, setPage] = useState(1);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [perPage, setPerPage] = useState(perPageList[0]);
	const [total, setTotal] = useState(0);
	const [maxPage, setMaxPage] = useState(1);
	const [trackingNo, setTrackingNo] = useState('');
	const [address, setAddress] = useState('');
	const [email, setEmail] = useState('');
	const addressType = AddressEnum.toPackage;

	useEffect(() => {
		setFilter && setFilter({ startDate, endDate, trackingNo, address, addressType });
		const callback = async () => {
			const params: GetRecordsReq = {
				startDate: startDate ? toDateTime(startDate, false) : '',
				endDate: endDate ? toDateTime(endDate, false) : '',
				trackingNo,
				email,
				address,
				addressType: AddressEnum.toPackage,
				limit: perPage,
				offset: (page - 1) * perPage
			};
			const recordsRes: GetRecordsRes = await getRecords(params); //sent query

			if (isGetPackagesRes(recordsRes)) {
				setRecords(recordsRes.packages);
			} else if (isGetTransactionsRes(recordsRes)) {
				setRecords(recordsRes.transactions);
			} else if (isGetUsersRes(recordsRes)) {
				setRecords(recordsRes.users);
			}
			setMaxPage(Math.ceil(recordsRes.total / perPage));
			setTotal(recordsRes.total);
		}
		tryLoad(setMessage, callback);
	}, [addressType, address, email, endDate, page, perPage, startDate, trackingNo, getRecords, setRecords, setMessage, setFilter]);

	return (
		<Box width='100%' sx={{ mt: 2 }}>
			<RecordsQuerySearch
				setPage={setPage}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
				trackingNo={trackingNo}
				setTrackingNo={setTrackingNo}
				address={address}
				setAddress={setAddress}
				searchList={searchList}
				email={email}
				setEmail={setEmail}
			/>
			<RecordsPageQuery
				page={page}
				setPage={setPage}
				perPage={perPage}
				setPerPage={setPerPage}
				total={total}
				maxPage={maxPage}
				setMaxPage={setMaxPage}
				perPageList={perPageList} 
			/>
		</Box>
	);
};

export default RecordsQuery;
