import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import adminUserManagementAPI from "../../../api/adminUserManagementAPI";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../../components/hook-form";
import { colors } from "../../../styles/Color/color";
import { UpdateUserType } from "../../../types/udpateUser";
import { UserInterface } from "../../../types/user";
import { Role } from "../../../routes/Roles";

interface updateModelProps {
  onOpen: boolean;
  onClose: () => void;
  userData: UserInterface;
  fetchData: () => void;
}

const UpdatePopup: React.FC<updateModelProps> = ({
  onOpen,
  onClose,
  userData,
  fetchData,
}) => {
  //Declare
  const defaultValues = {
    name: userData?.name,
    email: userData?.email,
    phoneNumber: userData?.phoneNumber,
    address: userData?.address,
    roleName: userData?.roleName,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Bắt buộc có tên người dùng")
      .min(1, "Tối thiểu 1 kí tự"),
    email: Yup.string()
      .trim()
      .required("Bắt buộc có email")
      .email("Email không hợp lệ")
      .min(5, "Tối thiểu 5 kí tự"),
    phoneNumber: Yup.string()
      .trim()
      .required("Bắt buộc có số điện thoại")
      .min(10, "Tối thiểu 10 kí tự"),
    address: Yup.string()
      .trim()
      .required("Bắt buộc có địa chỉ")
      .min(5, "Tối thiểu 5 kí tự"),
    roleName: Yup.string()
      .trim()
      .required("Bắt buộc có vai trò")
      .min(1, "Tối thiểu 1 kí tự"),
  });

  const methods = useForm<UpdateUserType>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  //call Api
  const udpateUser = async (values: UpdateUserType) => {
    try {
      const res: any = await adminUserManagementAPI.updateUserInf(
        userData?.userId,
        values
      );
      fetchData();
      toast.success(res.message);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  //role list
  const roleList = [
    { id: 1, role: Role.Admin, subName: "Quản trị viên" },
    { id: 2, role: Role.Customer, subName: "khách hàng" },
    { id: 3, role: Role.Staff, subName: "Nhân viên" },
    { id: 4, role: Role.Manager, subName: "Quản lý" },
  ];

  return (
    <>
      <Dialog open={onOpen}>
        <FormProvider methods={methods} onSubmit={handleSubmit(udpateUser)}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: colors.primary,
            }}
          >
            <DialogTitle sx={{ color: colors.white }}>
              Thêm mới người dùng
            </DialogTitle>
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ color: colors.white }} />
            </IconButton>
          </Box>
          <DialogContent>
            <RHFTextField name="name" label="Tên" sx={{ mb: 2 }} />
            <RHFTextField name="email" label="Email" sx={{ mb: 2 }} />

            <RHFTextField
              name="phoneNumber"
              label="Số điện thoại"
              sx={{ mb: 2 }}
            />
            <RHFTextField name="address" label="Địa chỉ" sx={{ mb: 2 }} />
            <RHFSelect name="roleName" label="Vai trò" sx={{ mb: 2 }}>
              {roleList?.map((r) => (
                <option key={r.id} value={r.role}>
                  {r.subName}
                </option>
              ))}
            </RHFSelect>
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

export default UpdatePopup;
