import { Box, useTheme, IconButton, Typography } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import { useState } from "react";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Sample data for users and their publications
  const initialData = [
    { id: 1, user: "Name of user 1", publication: "Publication 1" },
    { id: 2, user: "Name of user 2", publication: "Publication 2" },
    { id: 3, user: "Name of user 3", publication: "Publication 3" },
    { id: 4, user: "Name of user 4", publication: "Publication 4" },
    { id: 5, user: "Name of user 5", publication: "Publication 5" },
  ];

  const [data, setData] = useState(initialData);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure to delete this publication?");
    if (confirmed) {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    }
  };

  return (
    <Box m="20px">
      <Header title="Publications" />

      {data.map((item) => (
        <Accordion key={item.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              {item.user}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" alignItems="center">
              <IconButton
                color="secondary"
                onClick={() => handleDelete(item.id)}
              >
                <DeleteIcon />
              </IconButton>
              <Typography ml={2}>{item.publication}</Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;
