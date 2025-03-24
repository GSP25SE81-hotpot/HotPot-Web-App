// proofOfDeliveryService.ts
// import { axiosClient } from "../axiosInstance";
import {
  ApiResponse,
  ProofOfDeliveryDto,
  ProofOfDeliveryFormRequest,
  ProofOfDeliveryRequest,
  ProofOfDeliveryResponse,
  ShippingListDto,
} from "../../types/proofOfDelivery";
import axiosClient from "../axiosInstance";

// Save proof of delivery with JSON data
export const saveProofOfDelivery = async (
  shippingOrderId: number,
  data: ProofOfDeliveryRequest
): Promise<ApiResponse<ProofOfDeliveryResponse>> => {
  const response = await axiosClient.post(
    `/staff/proof-delivery/${shippingOrderId}`,
    data
  );
  return response.data;
};

// Get proof of delivery
export const getProofOfDelivery = async (
  shippingOrderId: number
): Promise<ApiResponse<ProofOfDeliveryDto>> => {
  const response = await axiosClient.get(
    `/staff/proof-delivery/${shippingOrderId}`
  );
  return response.data;
};

// Upload proof of delivery with form data (for image upload)
export const uploadProofOfDelivery = async (
  shippingOrderId: number,
  formData: ProofOfDeliveryFormRequest
): Promise<ApiResponse<ProofOfDeliveryResponse>> => {
  const form = new FormData();

  if (formData.proofImage) {
    form.append("ProofImage", formData.proofImage);
  }

  if (formData.base64Signature) {
    form.append("Base64Signature", formData.base64Signature);
  }

  if (formData.deliveryNotes) {
    form.append("DeliveryNotes", formData.deliveryNotes);
  }

  const response = await axiosClient.post(
    `/staff/proof-delivery/${shippingOrderId}/upload`,
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Get shipping detail
export const getShippingDetail = async (
  shippingOrderId: number
): Promise<ShippingListDto> => {
  const response = await axiosClient.get(`/staff/shipping/${shippingOrderId}`);
  return response.data.data;
};

// Get pending shipping list for a staff member
export const getPendingShippingList = async (
  staffId: number
): Promise<ShippingListDto[]> => {
  const response = await axiosClient.get(`/staff/shipping/pending/${staffId}`);
  return response.data.data;
};
