import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import {
  FormProvider,
  RHFDatePicker,
  RHFTextField,
} from "../../../components/hook-form";
import { colors } from "../../../styles/Color/color";
import { CreateDiscountType } from "../../../types/createDiscountType";
import adminDiscountApi from "../../../api/Services/adminDiscountAPI";
import { toast } from "react-toastify";

interface CreateNewDiscountProps {
  onOpen: boolean;
  onClose: () => void;
  fetchDiscounts: () => void;
}

const CreateNewDiscount: React.FC<CreateNewDiscountProps> = ({
  onOpen,
  onClose,
  fetchDiscounts,
}) => {
  // Declare
  const defaultValues = {
    title: "",
    description: "",
    discountPercentage: 1,
    date: "",
    duration: "",
    pointCost: 1,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required("Bắt buộc có tên người dùng")
      .min(1, "Tối thiểu 1 kí tự"),
    description: Yup.string()
      .trim()
      .required("Bắt buộc có mô tả về giảm giá")
      .min(5, "Tối thiểu 5 kí tự"),
    discountPercentage: Yup.number()
      .required("Bắt buộc phải nhập vào phần trăm giảm giá")
      .max(100, "Tối đa giảm 100%"),
    date: Yup.string().required("Ngày bắt đầu là bắt buộc"),
    duration: Yup.string().nullable(),
    pointCost: Yup.number().required(
      "Bắt buộc phải nhâpj vào giá mua phiếu giảm giá"
    ),
  });

  const methods = useForm<CreateDiscountType>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  // call Api submit
  const createDiscount = async (values: CreateDiscountType) => {
    try {
      await adminDiscountApi.createDiscount({
        ...values,
      });
      onClose();
      fetchDiscounts();
      toast.success("Tạo ưu đãi thành công");
    } catch (error) {
      console.error("Error creating discount:", error);
      toast.error("Tạo ưu đãi thất bại");
    }
  };

  return (
    <>
      <Dialog open={onOpen}>
        <FormProvider methods={methods} onSubmit={handleSubmit(createDiscount)}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: colors.primary,
            }}
          >
            <DialogTitle sx={{ color: colors.white }}>
              Thêm ưu đãi mới
            </DialogTitle>
            <IconButton onClick={onClose}>
              <Close sx={{ color: colors.white }} />
            </IconButton>
          </Box>
          <DialogContent>
            <RHFTextField name="title" label="Tên" sx={{ mb: 2 }} />
            <RHFTextField name="description" label="Mô tả" sx={{ mb: 2 }} />
            <RHFTextField
              name="discountPercentage"
              label="Phần trăm giảm giá"
              type="number"
              sx={{ mb: 2 }}
            />
            <RHFTextField
              name="pointCost"
              label="Giá mua phiếu giảm giá"
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <RHFDatePicker name="date" label="Ngày Bắt Đầu" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <RHFDatePicker
                name="duration"
                label="Ngày Kết Thúc"
                minDate={watch("date") ? dayjs(watch("date")) : undefined}
                helperText="Chọn ngày kết thúc (nếu có)"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              sx={{ ml: "auto" }}
            >
              Thêm
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default CreateNewDiscount;
