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
import { Role } from "../../../routes/Roles";
import { colors } from "../../../styles/Color/color";
import { CreateUserType } from "../../../types/createUser";

interface addModelProps {
  onOpen: boolean;
  onClose: () => void;
}

const AddNewUser: React.FC<addModelProps> = ({ onOpen, onClose }) => {
  //Declare
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    roleName: "",
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
    password: Yup.string()
      .trim()
      .required("Bắt buộc có mật khẩu")
      .min(6, "Tối thiểu 6 kí tự"),
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

  const methods = useForm<CreateUserType>({
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
  const createUser = async (values: CreateUserType) => {
    try {
      const res: any = await adminUserManagementAPI.createNewUser(values);
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
        <FormProvider methods={methods} onSubmit={handleSubmit(createUser)}>
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
            <RHFTextField
              name="name"
              label="Tên"
              sx={{ mb: 2 }}
              onChange={(e) => setValue("name", e.target.value)}
            />
            <RHFTextField name="email" label="Email" sx={{ mb: 2 }} />
            <RHFTextField
              name="password"
              label="Mật khẩu"
              type="password"
              sx={{ mb: 2 }}
            />
            <RHFTextField
              name="phoneNumber"
              label="Số điện thoại"
              sx={{ mb: 2 }}
            />
            <RHFTextField name="address" label="Địa chỉ" sx={{ mb: 2 }} />
            <RHFSelect name="roleName" label="Vai trò" sx={{ mb: 2 }}>
              {roleList?.map((i) => (
                <option key={i.id} value={i.role}>
                  {i.subName}
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

export default AddNewUser;
