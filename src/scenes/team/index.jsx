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

const Team = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [selectedRow, setSelectedRow] = useState([]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setAction("");
    setOpen(false);
  };
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "reportCount",
      headerName: "ReportCount",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        const handleVerifyClick = () => {
          setAction("verify");
          setSelectedRow(row);
          handleOpen();
        };

        const handleBlockClick = () => {
          setAction("block");
          setSelectedRow(row);
          handleOpen();
        };

        return (
          <Box display="flex" justifyContent="space-around" width="100%">
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerifyClick}
              {...(row.status === "verified" && { disabled: true })}
            >
              Verify
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBlockClick}
            >
              Block
            </Button>
          </Box>
        );
      },
    },
  ];

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const users = data.data.users.map((user, index) => ({
        id: index + 1,
        username: user.username,
        status: user.status,
        email: user.email,
      }));
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const handleConfirmation = async () => {
    try {
      if (action === "verify") {
        await fetch(
          `http://localhost:8000/api/v1/admin/users/${selectedRow.id}/verify`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else if (action === "block") {
        await fetch(
          `http://localhost:8000/api/v1/admin/users/${selectedRow.id}/block`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Error performing action:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box m="20px">
      <Header title="USERS" />
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
        <DataGrid checkboxSelection rows={users} columns={columns} />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 600 }}>
          <h2 id="child-modal-title">
            {`${action.charAt(0).toUpperCase() + action.slice(1)} Confirmation`}
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

export default Team;
