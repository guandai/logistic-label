import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, Typography
} from '@mui/material';
import { AddressEnum, BeansAI, BeansStatus, PackageModel } from '@ddlabel/shared';
import { tryLoad } from '../../util/errors';

import MessageAlert from '../share/MessageAlert';
import PackageApi from '../../api/PackageApi';
import { toDateTime } from '../../util/time';
import PackageTableSideBar from './PackageTableSideBar';
import { FlexBox, StatusLabel, StyledBox, StyledTabelCell } from '../../util/styled';
import RecordsQuery, { FilterConfig } from '../query/RecordsQuery';
import PackageActions from './PackageActions';
import BeansAiApi from '../../external/beansApi';
import { MessageContent } from '../../types';
import LoadingSpinner from '../../util/Spinner';

type StatusLogsMaps = { [x: number]: BeansAI.ListItemReadableStatusLogs }

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageModel[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);
  const [statusLogs, setStatusLogs] = useState<StatusLogsMaps >([]);
  const [filter, setFilter] = useState<FilterConfig>({ startDate: null, endDate: null, trackingNo: '', address: '', addressType: AddressEnum.toPackage });

  useEffect(() => {
    const callback = async () => {
      const statusLogsMap: StatusLogsMaps = {};
      for (const pkg of packages) {
        const log = (await BeansAiApi.getStatusLog({ trackingNo: pkg.trackingNo })).listItemReadableStatusLogs;
        statusLogsMap[pkg.id] = log || [];
      }
      setStatusLogs(statusLogsMap);
    };
    tryLoad(setMessage, callback);
  }, [packages]);

  const toStatus = (pkgId: number) => {
    return (statusLogs?.[pkgId]?.[0]?.item.status || 'N/A') as BeansStatus;
  };

  return (
    <FlexBox component="main" maxWidth="lg" >
      <PackageTableSideBar filter={filter} />
      <StyledBox>
        <Typography component="h1" variant="h4">Packages</Typography>
        <MessageAlert message={message} />
        <RecordsQuery getRecords={PackageApi.getPackages} setRecords={setPackages} setMessage={setMessage} perPageList={[5, 10, 20]} setFilter={setFilter} />
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTabelCell>Ship To Address</StyledTabelCell>
                <StyledTabelCell>Created Time</StyledTabelCell>
                <StyledTabelCell>Status</StyledTabelCell>
                <StyledTabelCell>Tracking</StyledTabelCell>
                <StyledTabelCell>Actions</StyledTabelCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <StyledTabelCell sx={{ margin: '0px' }} >{pkg.toAddress?.address1}</StyledTabelCell>
                  <StyledTabelCell>{toDateTime(pkg.createdAt)}</StyledTabelCell>
                  <StyledTabelCell>
                  { !statusLogs[pkg.id] ? <LoadingSpinner/> : <StatusLabel status={toStatus(pkg.id)}> {toStatus(pkg.id)} </StatusLabel> }
                  </StyledTabelCell>
                  <StyledTabelCell>{pkg.trackingNo}</StyledTabelCell>
                  <StyledTabelCell style={{ width: '200px', whiteSpace: 'nowrap' }}>
                    <PackageActions pkg={pkg} setMessage={setMessage} />
                  </StyledTabelCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledBox>
    </FlexBox>
  );
};

export default PackageTable;
