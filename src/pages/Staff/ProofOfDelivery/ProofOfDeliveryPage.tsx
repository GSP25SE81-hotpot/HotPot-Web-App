import { Box } from "@mui/material";
import { AuthContextProvider } from "../../../context/AuthContext";
// import ProofOfDelivery from "../../../containers/ProofOfDelivery/ProofOfDelivery";
import MockProofOfDelivery from "../../../containers/ProofOfDelivery/MockProofOfDelivery";

export const ProofOfDeliveryPage = () => {
  return (
    <AuthContextProvider>
      <Box>
        {/* <ProofOfDelivery /> */}
        <MockProofOfDelivery />
      </Box>
    </AuthContextProvider>
  );
};
