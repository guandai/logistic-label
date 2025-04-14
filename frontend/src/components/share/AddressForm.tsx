// frontend/src/components/AddressForm.tsx
import React, { useEffect, useState } from 'react';
import { TextField, Grid, Typography } from '@mui/material';
import { SetMessage, tryLoad } from '../../util/errors';
import { AddressAttributes } from '@ddlabel/shared';
import { ZipCodeApi } from '../../api/ZipCodeApi';
import { extractAddressZip } from '../../util/functions';

type QuickFieldProps = {
  name: keyof AddressAttributes;
  pattern?: RegExp | string;
  autoComplete: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string;
}

interface AddressFormProps {
  setMessage: SetMessage;
  addressData: AddressAttributes;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ setMessage, addressData, onChange, title }) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    const zip = extractAddressZip(addressData.address2) || extractAddressZip(addressData.address1);
    if (zip.length === 5) {
        onChange({ target: { name: 'zip', value: zip } } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [addressData.address1, addressData.address2, onChange]);

  useEffect(() => {
    setCity('');
    setState('');
    if (addressData?.zip && addressData?.zip.length === 5) {
      const callback = async () => {
        const info = await new ZipCodeApi().getZipInfo(addressData.zip);
        setCity(info.city);
        setState(info.state);
        setMessage(null);
      };
      tryLoad(setMessage, callback);
    }
  }, [addressData.zip, setMessage]);

  useEffect(() => {
    onChange({ target: { name: 'city', value: city } } as React.ChangeEvent<HTMLInputElement>);
    onChange({ target: { name: 'state', value: state } } as React.ChangeEvent<HTMLInputElement>);
  }, [city, state, onChange]);


  const quickField = (prop: QuickFieldProps) => {
    const { name, autoComplete, required = true, readOnly = false, value = '', pattern = null } = prop;
    return (
      <Grid item xs={12} sm={6}>
        <TextField
          sx={{
            pointerEvents: readOnly ? 'none' : 'auto',
            backgroundColor: readOnly ? "#dddddd" : "transparent"
          }}
          required={required}
          id={`address-form-${name}`}
          fullWidth
          label={name}
          name={name}
          autoComplete={autoComplete}
          value={value || addressData[name] || ''}
          onChange={onChange}
          inputProps={{ pattern, maxLength: 38 }}
        />
      </Grid>
    )
  };

  return (
    <>
      <Typography variant="h6" mb='1em'>{title}</Typography>
      <Grid container spacing={2}>
        {quickField({ name: 'name', autoComplete: 'name' })}
        {quickField({ name: 'zip', autoComplete: 'postal-code', pattern: '[0-9]{5}', value: addressData.zip })}
        {quickField({ name: 'address1', autoComplete: 'address-line1', value: addressData.address1 })}
        {quickField({ name: 'address2', autoComplete: 'address-line2', value: addressData.address2, required: false })}
        {quickField({ name: 'city', autoComplete: 'address-level2', readOnly: true, value: city })}
        {quickField({ name: 'state', autoComplete: 'address-level1', readOnly: true, value: state })}
        {quickField({ name: 'phone', autoComplete: 'tel', required: false, pattern: '[+]?[0-9]{5,}' })}
        {quickField({ name: 'email', autoComplete: 'email', required: false, pattern: '^[\\w\\-\\.]+@([\\w\\-]+\\.)+[\\w\\-]{2,4}$' })}
      </Grid>
    </>
  );
};

export default AddressForm;
