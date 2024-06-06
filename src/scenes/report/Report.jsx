import { Box, Button, Modal, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import Header from "../../components/Header";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Report = () => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [action, setAction] = useState("");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "reportedUserName",
      headerName: "Reported Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "reportedUserStatus",
      headerName: "Reported User Status",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "count",
      headerName: "Report Count",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        const handleblock = () => {
          handleOpen();
          setSelectedRow(row);
          setAction("block");
        };

        const handleUnblock = () => {
          handleOpen();
          setSelectedRow(row);
          setAction("unblock");
        };
        return (
          <Box display="flex" justifyContent="space-around" width="100%">
            <Button
              variant="contained"
              color="error"
              onClick={handleblock}
              {...(row.reportedUserStatus === "blocked" && { disabled: true })}
            >
              Block
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleUnblock}
              {...(row.reportedUserStatus !== "blocked" && { disabled: true })}
            >
              Unblock
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleConfirmation = async () => {
    try {
      await fetch(
        `http://localhost:8000/api/v1/admin/users/${selectedRow.reportedUser_id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchReports();
      handleClose();
    } catch (error) {
      console.error("Error performing action:", error);
      throw error;
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/admin/reports",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const reports = data?.reportedUsers.map((report, index) => ({
        id: index + 1,
        reportedUserName: report.reportedUserName,
        reportedUserStatus: report.reportedUserStatus,
        count: report.reportCount,
        reportedUser_id: report.reportedUserId,
      }));
      setReports(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Box m="20px">
      <Header title="Reports" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={reports} columns={columns} />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 600 }}>
          <h2 id="child-modal-title">
            {action + " " + selectedRow.reportedUserName}
          </h2>
          <p id="child-modal-description">
            Are you sure you want to perform this action?
          </p>
          <Button
            variant="contained"
            style={{ marginRight: "10px" }}
            onClick={handleConfirmation}
          >
            Confirm
          </Button>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Report;
