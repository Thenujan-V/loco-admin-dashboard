import { useState, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { STATUS, RestaurantRow } from './restaurant-list-view';
import { Grid, IconButton } from '@mui/material';

type Props = {
  id: string;
};

// Extends base row with document tracking
export type RestaurantDocuments = RestaurantRow & {
  userPicture: string;
  userPictureStatus: string;
  userPictureReason: string;
  userDocument: string;
  userDocumentStatus: string;
  userDocumentReason: string;
  restaurantDocument: string;
  restaurantDocumentStatus: string;
  restaurantDocumentReason: string;
};

const MOCK_RESTAURANT: RestaurantDocuments = {
  id: 1,
  name: 'Spicy Loco Kitchen',
  address: '123 Main St, Tech Park',
  email: 'contact@locokitchen.com',
  phoneNumber: '+1 234 567 8900',
  image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Spicy',
  isVerified: false,
  isActive: true,
  status: STATUS.PENDING,
  
  userPicture: 'https://api.dicebear.com/7.x/personas/svg?seed=SpicyUser',
  userPictureStatus: STATUS.PENDING,
  userPictureReason: '',
  
  userDocument: 'https://placehold.co/600x400/png?text=Passport+ID',
  userDocumentStatus: STATUS.PENDING,
  userDocumentReason: '',
  
  restaurantDocument: 'https://placehold.co/600x400/png?text=Business+License',
  restaurantDocumentStatus: STATUS.PENDING,
  restaurantDocumentReason: '',
};

export default function RestaurantDetailsView({ id }: Props) {
  const router = useRouter();

  const [data, setData] = useState<RestaurantDocuments>(MOCK_RESTAURANT);

  // Big View Image State
  const [viewImage, setViewImage] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.restaurants.list);
  }, [router]);

  const handleDocChange = (field: keyof RestaurantDocuments, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOverallStatusChange = (newStatus: string) => {
    setData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleSaveVerifications = () => {
    // Check if everything is approved to optionally auto-approve the restaurant entirely if the user didn't do it
    console.info('Saving verification data:', data);
    alert('Documents verified and saved successfully!');
  };

  const renderOverviewTab = (
    <Card sx={{ mb: 3 }}>
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }) }}>
          <Avatar src={data.image} sx={{ width: 80, height: 80, mb: 2 }} />
          <Typography variant="h6">{data.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{data.email}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{data.phoneNumber}</Typography>
          <Box mt={2}>
             <Label color={data.isActive ? 'success' : 'error'}>{data.isActive ? 'Active' : 'Inactive'}</Label>
             <Label color={data.isVerified ? 'success' : 'warning'} sx={{ ml: 1 }}>{data.isVerified ? 'Verified' : 'Unverified'}</Label>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ px: { md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Business Address</Typography>
          <Typography variant="body1">{data.address}</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ pl: { md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }) }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Overall Restaurant Status</Typography>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={data.status}
              label="Status"
              onChange={(e) => handleOverallStatusChange(e.target.value)}
            >
              <MenuItem value={STATUS.PENDING}>PENDING</MenuItem>
              <MenuItem value={STATUS.APPROVED}>APPROVED</MenuItem>
              <MenuItem value={STATUS.REJECTED}>REJECTED</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );

  const renderDocumentCard = (
    title: string,
    imgUrl: string,
    statusField: keyof RestaurantDocuments,
    reasonField: keyof RestaurantDocuments
  ) => {
    const statusVal = data[statusField] as string;
    const reasonVal = data[reasonField] as string;

    return (
      <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        
        <Box 
          component="img" 
          src={imgUrl} 
          sx={{ 
            width: '100%', 
            height: 200, 
            objectFit: 'cover', 
            borderRadius: 1, 
            cursor: 'zoom-in',
            border: (theme) => `1px solid ${theme.palette.divider}`
          }} 
          onClick={() => setViewImage(imgUrl)}
        />

        <Stack spacing={2} sx={{ mt: 3, flexGrow: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusVal}
              label="Status"
              onChange={(e) => handleDocChange(statusField, e.target.value)}
            >
              <MenuItem value={STATUS.PENDING}>PENDING</MenuItem>
              <MenuItem value={STATUS.APPROVED}>APPROVED</MenuItem>
              <MenuItem value={STATUS.REJECTED}>REJECTED</MenuItem>
            </Select>
          </FormControl>

          {statusVal === STATUS.REJECTED && (
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Rejection Reason"
              value={reasonVal}
              onChange={(e) => handleDocChange(reasonField, e.target.value)}
              placeholder="Explain why this document was rejected"
            />
          )}
        </Stack>
      </Card>
    );
  };

  const renderVerification = (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          {renderDocumentCard('User Picture', data.userPicture, 'userPictureStatus', 'userPictureReason')}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {renderDocumentCard('User ID Document', data.userDocument, 'userDocumentStatus', 'userDocumentReason')}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {renderDocumentCard('Restaurant License', data.restaurantDocument, 'restaurantDocumentStatus', 'restaurantDocumentReason')}
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
         <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<Iconify icon="solar:diskette-bold" />}
            onClick={handleSaveVerifications}
          >
           Save Verifications
         </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <Button
            size="small"
            color="inherit"
            onClick={handleBack}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>Restaurant Profile</Typography>
        </Box>

        {renderOverviewTab}

        <Typography variant="h5" sx={{ mt: 5, mb: 3 }}>Document Verification</Typography>
        {renderVerification}
      </Container>


      {/* Big Image Viewer Modal */}
      <Dialog 
        open={!!viewImage} 
        onClose={() => setViewImage(null)} 
        maxWidth="lg"
      >
        <Box sx={{ position: 'relative' }}>
           <IconButton
             onClick={() => setViewImage(null)} 
             sx={{ position: 'absolute', top: 8, right: 8, color: 'common.white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
           >
              <Iconify icon="solar:close-circle-bold" />
           </IconButton>
           <Box 
             component="img" 
             src={viewImage || ''} 
             sx={{ display: 'block', maxWidth: '100%', maxHeight: '90vh' }} 
           />
        </Box>
      </Dialog>
    </>
  );
}
