/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const adminIngredientsAPI = {
  getListIngredients: (params?: any) => {
    const url = "/admin/ingredients";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getListIngredientsDetail: (params?: any) => {
    const url = "/admin/ingredients/id";
    const newUrl = url.replace("id", params);
    return axiosClient.get(newUrl, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getListIngredientsType: (params?: any) => {
    const url = "/admin/ingredient-types";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  createNewIngredients: (params?: any) => {
    const url = "/admin/ingredients";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  createNewIngredientType: (params?: any) => {
    const url = "/admin/ingredient-types";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminIngredientsAPI;
