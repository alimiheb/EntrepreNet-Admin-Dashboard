import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >

      </Box>

      {/* ICONS */}
      <Box display="flex">

        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>


      </Box>
    </Box>
  );
};

export default Topbar;
