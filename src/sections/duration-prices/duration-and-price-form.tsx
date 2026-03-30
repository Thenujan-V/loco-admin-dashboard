import * as Yup from "yup";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// MUI
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { MenuItem, Stack, Typography } from "@mui/material";

// Components
import { useSnackbar } from "src/components/snackbar";
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";

// ----------------------------------------------------------------------

const MONTHDURATION_OPTIONS = [
  { value: "1 Month", label: "1 Month" },
  { value: "3 Months", label: "3 Months" },
  { value: "6 Months", label: "6 Months" },
  { value: "12 Months", label: "12 Months" },
];

// ----------------------------------------------------------------------
const DURATION_OPTIONS = [
  { value: "1 Month", label: "1 Month" },
  { value: "3 Months", label: "3 Months" },
  { value: "6 Months", label: "6 Months" },
  { value: "12 Months", label: "12 Months" },
];

type FormValues = {
  duration: string;
  priceINR: string;
};

interface Props {
  currentData?: FormValues | null; // null -> create, object -> edit
  open: boolean;
  onClose: VoidFunction;
  from: "offer" | "package";
}

// ----------------------------------------------------------------------

export default function DurationAndPriceForm({ currentData, open, onClose,from }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  // Detect Mode
  const isEdit = !!currentData;

  // Validation
  const PackageSchema = Yup.object().shape({
    duration: Yup.string().required("Duration is required"),
    minInactiveDuration: Yup.string().required("Minimum inactive duration is required"),
    priceINR: Yup.string()
      .required("Price is required")
      .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Price must be a valid number with up to 2 decimal places"),
  });

  // Default Values
  const defaultValues: FormValues = useMemo(
    () => ({
      duration: currentData?.duration || "",
      priceINR: currentData?.priceINR || "",
    }),
    [currentData]
  );

  // Form
  const methods = useForm<FormValues>({
    resolver: yupResolver(PackageSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [currentData, defaultValues, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (isEdit) {
        enqueueSnackbar("Package updated successfully!");
      } else {
        enqueueSnackbar("Package created successfully!");
      }

      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  // ----------------------------------------------------------------------


  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {isEdit ? "Update Package Duration & Price" : "New Package Duration & Price"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{mt:1}}>

            <RHFSelect
              name="duration"
              label="Duration"
              size="small"
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {MONTHDURATION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {/* Minimum Inactive Duration */}
{  from == "offer" &&          <RHFSelect
              name="minInactiveDuration"
              size="small"
              label="Minimum inactive duration"
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {DURATION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>}

            <RHFTextField
              name="priceINR"
              label="Price (INR)"
              size="small"
              type="number"
            />
          </Stack>

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {isEdit ? "Update" : "Create"}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}