// frontend/src/components/beans/BeansRoutesTable.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FlexBox, StyledBox, StyledTabelCell } from '../../util/styled';
import { MessageContent } from '../../types';
import BeansTableSideBar from './BeansTableSideBar';
import MessageAlert from '../share/MessageAlert';
import BeansApi from '../../external/beansApi';
import { toDateTime } from '../../util/time';
import { tryLoad } from '../../util/errors';
import { BeansAI, Models } from '@ddlabel/shared';
import BeansRoutesActions from './BeansRoutesActions';

const BeansRoutes: React.FC = () => {
  const [records, setBeansRecords] = useState<BeansAI.Route[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);

  useEffect(() => {
    const callback = async () => {
      const records = (await BeansApi.getRoutes()).route;
      setBeansRecords(records);
    };
	  tryLoad(setMessage, callback);
  }, []);

  return (
    <FlexBox component="main" maxWidth="lg">
      <BeansTableSideBar/>
    
      <StyledBox>
        <Typography component="h1" variant="h4">Beans Routes</Typography>
        <MessageAlert message={message} />
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records?.map((record) => (
                <TableRow key={`record_${record.listRouteId}`}>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>{record.startMode}</TableCell>
                  <TableCell>{record.endMode}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>{toDateTime(record.createdAt || '')}</TableCell>
                  <StyledTabelCell style={{ width: '200px', whiteSpace: 'nowrap' }}>
                    <BeansRoutesActions model={record as any as Models} listRouteId={record.listRouteId} setMessage={setMessage} />
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

export default BeansRoutes;
