// frontend/src/components/PackageForm.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { tryLoad } from '../../util/errors';
import AddressForm from '../share/AddressForm';
import { AddressAttributes, CreatePackageReq, PackageModel, UpdatePackageReq } from "@ddlabel/shared";
import { MessageContent } from '../../types';
import MessageAlert from '../share/MessageAlert';
import { AddressEnum } from '@ddlabel/shared';
import PackageApi from '../../api/PackageApi';
import { StyledBox } from '../../util/styled';

type QuickFieldProp = {
  name: keyof PackageModel;
  type?: 'text' | 'number';
  pattern?: string | null;
  required?: boolean;
};

const defautAddress = { addressType: AddressEnum.toPackage } as AddressAttributes;
const initialPackage = {
  fromAddress: defautAddress, toAddress: defautAddress,
} as PackageModel;

const PackageForm: React.FC = () => {
  const [packageData, setPackageData] = useState<PackageModel>(initialPackage);
  const [message, setMessage] = useState<MessageContent>(null);
  const navigate = useNavigate();
  const { id: packageId } = useParams<{ id: string }>(); // from url params

  const quickField = ({ name, type = 'number', pattern = '^[1-9][0-9]*$', required = true }: QuickFieldProp) => (
    <Grid item xs={12} sm={6}>
      <TextField
        required={required}
        fullWidth
        id={name}
        label={name}
        name={name}
        type={type}
        value={packageData[name] || ''}
        onChange={handleChange}
        inputProps={{ pattern }}
      /></Grid>
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    };
    
    if (!packageId) {
      return;
    }
    const callback = async () => {
      setPackageData((await PackageApi.getPackageById(packageId)).package);
    }
    tryLoad(setMessage, callback);
  }, [packageId]);

  const onSubmit = async (data: UpdatePackageReq | CreatePackageReq) => {
    if (message?.text && message.level === 'error') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const createOrUpdatePackage = async () => {
      if (packageId) {
        await PackageApi.updatePackage(packageId, data);
      } else {
        await PackageApi.createPackage(data);
        navigate('/packages');
      }
      setMessage({
        level: 'success',
        text: packageId ? 'Package updated successfully' : 'Package added successfully'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    tryLoad(setMessage, createOrUpdatePackage);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    setPackageData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleAddressChange =
    (addressType: 'fromAddress' | 'toAddress') => (e: React.ChangeEvent<HTMLInputElement>) => {
      setPackageData(prevData => ({
        ...prevData,
        [addressType]: {
          ...prevData[addressType],
          [e.target.name]: e.target.value,
        },
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(packageData);
  };

  return (
    <Container component="main" maxWidth="md">
      <StyledBox>
        <Typography component="h1" variant="h4">
          {packageId ? 'Edit Package' : 'Add Package'}
        </Typography>
        <MessageAlert message={message} />
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <AddressForm
              setMessage={setMessage}
              addressData={packageData.fromAddress}
              onChange={handleAddressChange('fromAddress')}
              title="Ship From Address"
            />
          </Grid>
          <Grid item xs={12} mt="1.5em">
            <AddressForm
              setMessage={setMessage}
              addressData={packageData.toAddress}
              onChange={handleAddressChange('toAddress')}
              title="Ship To Address"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography mb='1em' mt='1.5em' variant="h6">Package Info</Typography>
            <Grid container spacing={2}>
              {quickField({ name: 'length' })}
              {quickField({ name: 'width' })}
              {quickField({ name: 'height' })}
              {quickField({ name: 'weight' })}
              {quickField({ name: 'referenceNo', type: 'text', pattern: null })}
              {quickField({ name: 'trackingNo', type: 'text', pattern: null, required: false })}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {packageId ? 'Update Package' : 'Add Package'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </StyledBox>
    </Container>
  );
};

export default PackageForm;
