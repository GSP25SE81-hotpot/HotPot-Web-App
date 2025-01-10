// // @mui
// import { Box, Card, Typography, Stack } from "@mui/material";

// // utils
// import { formatMoney } from "../../utils/fn";
// // @types
// // components
// import { Link } from "react-router-dom";
// import Image from "../Image";
// import config from "../../configs";

// // ----------------------------------------------------------------------

// type Props = {
//   product: Product;
// };

// export default function ProductCard({ product }: Props) {
//   const { name, sellingPrice, image, origin, id, discount } = product;

//   return (
//     <Link
//       to={config.routes.productDetail.replace(":id", id)}
//       style={{ textDecoration: "none" }}
//     >
//       <Card
//         sx={{
//           padding: "20px",
//           borderRadius: "5px",
//           width: "100%",
//           height: "100%",
//           color: "black",
//           transition: "transform 0.5s ease-in-out",
//           "&:hover": {
//             transform: "scale(1.05)",
//           },
//           boxShadow:
//             "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//           cursor: "pointer",
//         }}
//       >
//         <Box sx={{ position: "relative" }}>
//           <Image
//             alt={name}
//             src={image[0].imageURL}
//             sx={{ width: "100%", height: "200px", objectFit: "contain" }}
//           />
//         </Box>

//         <Stack spacing={1} sx={{ p: 1 }}>
//           <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//             {name}
//           </Typography>
//           <Typography variant="subtitle1">Xuất xứ: {origin.name}</Typography>

//           <Stack
//             direction="row"
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             <Stack direction="row" spacing={0.5}>
//               {discount > 0 && (
//                 <Typography
//                   component="span"
//                   sx={{
//                     color: "text.disabled",
//                     textDecoration: "line-through",
//                   }}
//                 >
//                   {formatMoney(sellingPrice)}
//                 </Typography>
//               )}

//               <Typography variant="subtitle1">
//                 {product
//                   ? formatMoney((sellingPrice * (100 - discount)) / 100)
//                   : 0}
//               </Typography>
//             </Stack>
//           </Stack>
//         </Stack>
//       </Card>
//     </Link>
//   );
// }
