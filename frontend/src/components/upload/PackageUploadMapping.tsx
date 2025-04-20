import React, { useState } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { Box, Typography, Button, Modal, Alert } from '@mui/material';
import PackageUploadButton, { RunStatus } from './PackageUploadButton';
import { Upload } from '@mui/icons-material';
import CloseButton from '../dialog/CloseButton';
import { KeyCsvRecord, HeaderMapping, CSV_KEYS, defaultMapping, CSV_KEYS_REQUIRED } from '@ddlabel/shared';
import CsvHeaderList from './CsvHeaderList';
import { MessageContent, MsgLevel } from '../../types';

const PackageUploadMapping: React.FC = () => {
  const [message, setMessage] = useState<MessageContent>(null);
  const [runStatus, setRunStatus] = useState<RunStatus>(RunStatus.ready);
  const [uploadFile, setUploadFile] = useState<File>();

  const [csvLength, setCsvLength] = useState<number>(0);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<HeaderMapping>(defaultMapping);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const getAutoMapping = (headers: string[]): HeaderMapping => {
    const autoMapping = {} as HeaderMapping;
    CSV_KEYS.forEach((key, idx) => {
      const str = headers.find( s => s.toLowerCase().includes(key.toLowerCase()) );

      if ( str ) { Object.assign(autoMapping, { [key]: str }); }
    });
    return autoMapping;
  };

  const complete = (csvResults: ParseResult<object>) => {
    const firstRow = csvResults.data[0];
    const length = csvResults.data.length;
    if (!firstRow) {
      return;
    }
    const headers = Object.keys(firstRow);
    setCsvHeaders(headers);

    const initialMapping = getAutoMapping(headers);
    setHeaderMapping(initialMapping);
    setCsvLength(length);
    setModalOpen(true); // Open the modal when the CSV is parsed
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    setUploadFile(file);

    Papa.parse(file, {
      header: true,
      complete,
    });
  };

  const handleMappingChange = (requiredField: KeyCsvRecord, csvHeader: string) => {
    setMessage(null);
    setHeaderMapping((prevMapping) => ({
      ...prevMapping,
      [requiredField]: csvHeader
    }));
  };

  const validateForm = () => {
    const missingKeys = CSV_KEYS_REQUIRED.filter(key => !headerMapping[key]);

    if (missingKeys.length > 0) {
      setMessage({
        level: MsgLevel.error,
        text: `The following fields are missing: ${missingKeys.join(', ')}`
      });
      return false;
    }
    setMessage(null);
    return true;
  };

  const handleModalClose = () => {
    // setModalOpen(false);
    // setRunStatus(RunStatus.ready);
    // setMessage(null);
    // setHeaderMapping(defaultMapping);
    // setCsvHeaders([]);
    // setCsvLength(0);
    // setUploadFile(undefined)
    window.location.reload();
  };

  const TextWithLineBreaks = ({ text }: {text: string}) => {
    return (
      <Typography
        component="div"
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
      />
    );
  };

  const closeButton = 
    <Button variant="contained" color="secondary" onClick={handleModalClose} sx={{ ml: 2, float: 'right' }}>
      Close
    </Button>

  return (
    <>
      <Button variant="contained" disabled={runStatus === RunStatus.running} startIcon={<Upload />} component="label" fullWidth >
        {'Upload CSV'}
        <input type="file" required accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
      </Button>
      <Modal
        open={modalOpen}
        // onClose={handleModalClose}
      >
        <Box sx={{
          position: 'absolute', p: 4, width: 600,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', boxShadow: 24,
        }}>
          {csvHeaders.length > 0 && (
            <>
              <Typography variant="h6" sx={ {mb: 2}} id="modal-title">Map CSV Headers</Typography>

              {runStatus !== RunStatus.running && <CloseButton handleModalClose={handleModalClose} />}
              {message && <Alert severity={message.level}><TextWithLineBreaks text={message.text}/></Alert>}
              {runStatus === RunStatus.ready &&
                <CsvHeaderList
                  csvHeaders={csvHeaders}
                  headerMapping={headerMapping}
                  handleMappingChange={handleMappingChange}
                />
              }
              {uploadFile && <PackageUploadButton
                closeButton={closeButton}
                setMessage={setMessage}
                uploadFile={uploadFile}
                headerMapping={headerMapping}
                setRunStatus={setRunStatus}
                runStatus={runStatus}
                csvLength={csvLength}
                validateForm={validateForm} // Pass the validation function to the button
              />}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PackageUploadMapping;
