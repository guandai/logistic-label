import React from 'react';
import QRCode from 'qrcode.react';
import BarcodeComponent from './BarcodeComponent';
import { Box, Typography } from '@mui/material';
import ErrorBoundary from '../share/ErrorBoundary';
import brandLogo from '../../assets/png/brand_logo.png'; // Import the main logo
import brandFont from '../../assets/png/brand_font.png'; // Import the bottom-right logo
import styled from 'styled-components';
import { scaleStyle } from '../../util/styled';
import { FE_URL } from '../../env_var';
import { cleanAddress, getStateId } from '../../util/functions';
import { PackageModel } from '@ddlabel/shared';

type MonoSmallProp = {
  factor: number;
}
type MonoNormalProp = {
  factor: number;
}
const MonoTypoSmall = styled(Typography)<MonoSmallProp>(({ factor }) => ({
  fontFamily: 'monospace',
  fontSize: `${0.11 * factor}in`
}));
const MonoTypoNormal = styled(Typography)<MonoNormalProp>(({ factor }) => ({
  fontFamily: 'monospace',
  fontSize: `${0.15 * factor}in`
}));

interface PackageLabelProps {
  pkg: PackageModel;
  factor?: number;
  width?: string;
  height?: string;
}

export const PackageLabel: React.FC<PackageLabelProps> = (prop) => {
  const { width, height, pkg, factor = 1 } = prop;
  const scaledWidth = scaleStyle(width || '4in', factor);
  const scaledHeight = scaleStyle(height || '6in', factor);
  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
    <Box sx={{
      width: `calc(${scaledWidth} - ${0.02 * factor}in * 2)`,  // Adjusted width to account for border on both sides
      height: `calc(${scaledHeight} - ${0.02 * factor}in * 2)`, // Adjusted height to account for border on top and bottom
      padding: `${0.1 * factor}in`,
      margin: 0,
      border: `${0.02 * factor}in solid black`,
      boxSizing: 'content-box', // Ensure padding and border are included within the specified width and height
    }}>
      {/* main upper */}
      <Box sx={{ height: `${1.9 * factor}in`, display: 'flex', justifyContent: 'space-between', alignItems: 'top', }}>
        {/* top left part */}
        <Box sx={{ textAlign: 'left', mr: `${8 * factor}px`, width: '70%' }}>
          {/* logo part */}
          <Box>
            <img src={brandLogo} alt="Brand Logo" style={{ display: 'inline', width: `${0.7 * factor}in`}} />
            <Typography variant="h4" sx={{ fontSize: `${2 * factor }rem`, float: 'right', display: 'inline', fontWeight: 'bold' }}>{pkg.toAddress?.sortCode}</Typography>
          </Box>

          {/* Return to part */}
          <Box sx={{ height: `${1.05 * factor}in`, textAlign: 'left' }}>
            <MonoTypoSmall factor={factor} variant='body1'>Return to:</MonoTypoSmall>
            <MonoTypoSmall factor={factor} >{pkg.fromAddress?.name}</MonoTypoSmall>
            <MonoTypoSmall factor={factor} >{cleanAddress(pkg, 'from', pkg.fromAddress?.address1)}</MonoTypoSmall>
            <MonoTypoSmall factor={factor} >{cleanAddress(pkg, 'from', pkg.fromAddress?.address2)}</MonoTypoSmall>
            <MonoTypoSmall factor={factor} >{pkg.fromAddress?.city}, {getStateId(pkg.fromAddress?.state)}, {pkg.fromAddress?.zip}</MonoTypoSmall>
          </Box>
        </Box>

        {/* top right part */}
        <Box sx={{ textAlign: 'right', width: '30%' }}>
          <QRCode value={`${FE_URL}/packages/${pkg.id}`} size={100 * factor} /> {/* Increase QR code size */}
          <Typography sx={{ textAlign: 'center', fontSize: `${3 * factor}rem`, fontWeight: 'bold', lineHeight: 1 }}>{pkg.toAddress?.proposal}</Typography>
          <Typography sx={{ textAlign: 'center', fontSize: `${2 * factor}rem`, color: 'white', backgroundColor: 'black', lineHeight: 1 }}>{pkg.toAddress?.zip}</Typography>
        </Box>
      </Box>

      {/* Ship to part */}
      <Box mt={1} sx={{ height: `${1.15 * factor}in`, borderTop: 'solid' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>SHIP TO:</Typography>
        <MonoTypoNormal factor={factor} >{pkg.toAddress?.name}</MonoTypoNormal>
        <MonoTypoNormal factor={factor} >{cleanAddress(pkg,'to', pkg.toAddress?.address1)}</MonoTypoNormal>
        <MonoTypoNormal factor={factor} >{cleanAddress(pkg, 'to', pkg.toAddress?.address2)}</MonoTypoNormal>
        <MonoTypoNormal factor={factor} >{pkg.toAddress?.city}, {getStateId(pkg.toAddress?.state)}, {pkg.toAddress?.zip}</MonoTypoNormal>
      </Box>

      {/* lbs weight number */}
      <Box sx={{ height: `${0.2 * factor}in`, textAlign: 'right' }}>
        <Typography sx={{ fontSize: `${0.8 * factor}rem` }}>{pkg.weight} lbs.</Typography>
      </Box>

      {/* barcode tracking */}
      <Box sx={{ height: `${1.5 * factor}in`, width: '100%', textAlign: 'center' }}>
        <BarcodeComponent value={pkg.trackingNo} factor={factor} />
      </Box>

      {/* under barcode spacing */}
      <Box sx={{ height: `${0.7 * factor}in` }}>
        <Typography variant="body2" sx={{ textAlign: 'left', fontSize: `${0.8 * factor}rem` }}>
          Please return all packages instead of leaving them after finishing the Proof of Delivery (POD).
          <br />
          Pod check email : check@example.com
      </Typography>
      </Box>
      {/* bottom line */}
      <Box sx={{ height: `${0.2 * factor}in`, display: 'flex', justifyContent: 'space-between', alignItems: "end", }}>
        <Box sx={{fontSize: `${1 * factor}rem`,}}> Reference No: {pkg.referenceNo}</Box>
        <img src={brandFont} alt="Brand Font Logo" style={{ width: `${8 * factor}em` }} />
      </Box>
    </Box>
    </ErrorBoundary>
  );
};

export default PackageLabel;
