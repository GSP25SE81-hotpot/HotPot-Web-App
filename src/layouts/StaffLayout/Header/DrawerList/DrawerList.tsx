import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";

interface DrawerListProps {
  toggleDrawer: (open: boolean) => void;
}

const DrawerList: React.FC<DrawerListProps> = ({ toggleDrawer }) => {
  const jsonString = localStorage.getItem("userInfo") || null;
  const user = JSON.parse(jsonString || "{}");

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
    >
      <List>
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="" sx={{ color: "red" }} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
};

export default DrawerList;
