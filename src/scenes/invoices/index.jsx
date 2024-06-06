import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const Invoices = () => {
  const [posts, setPosts] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
    },

    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "domain",
      headerName: "Domain",
      flex: 1,
    },
  ];

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/admin/posts", {
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
      const posts = data.posts.map((post, index) => ({
        id: index + 1,
        title: post.title,
        description: post.description.slice(0, 20) + "...",
        user: post.userId.username,
        type: post.type,
        domain: post.domain,
      }));
      setPosts(posts);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box m="20px">
      <Header title="List of Posts" />
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
        <DataGrid checkboxSelection rows={posts} columns={columns} />
      </Box>
    </Box>
  );
};

export default Invoices;
