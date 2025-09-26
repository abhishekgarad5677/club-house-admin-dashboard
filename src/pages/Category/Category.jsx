import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField } from "@mui/material";
import CategoryIcon from '@mui/icons-material/Category';
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
// import { useGetallcategoriesMutation } from "../../redux/slices/apiSlice";
import { CommonTable } from "../../components/table/Table";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { useGetAllCategoriesMutation } from "../../redux/slices/apiSlice";

const Category = () => {

    const [data, setData] = useState();

    const [postCategoryData, { isLoading, error, data: categotyData }] = useGetAllCategoriesMutation();

    useEffect(() => {
        postCategoryData({})
    }, []);

    useEffect(() => {
        if (categotyData) {
            setData(categotyData?.data);
        }
    }, [categotyData]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 130 },
        { field: 'name', headerName: "Name", width: 170 },
        { field: 'numberOfGames', headerName: 'Number of Games', width: 170 },
        { field: 'numberOfTests', headerName: 'Number of Tests', width: 170 },
        { field: 'ageGroup', headerName: 'Age Group', width: 170 },
        // { field: 'games', headerName: 'Games', width: 150 },
        // { field: 'tests', headerName: 'Tests', width: 150 },
    ];

    const navigate = useNavigate();

    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Category",
                        href: "/dashboard/category",
                        icon: <CategoryIcon fontSize="small" />
                    }
                ]}
            />
            <Paper sx={{ height: "auto", width: '100%', padding: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    mb={2}
                    sx={{
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}

                >
                    {/* search student */}
                    <TextField
                        label="search category"
                        variant="outlined"
                        size="small"
                        onChange={(e) => filterUserData(e)}
                    />

                    {/* add category button */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            width: { xs: '100%', sm: 'auto', backgroundColor: '#5D87FF' },
                        }}
                        onClick={() => navigate('/dashboard/add-category')}
                    >
                        Add Category
                    </Button>
                </Box>

                {/* category table data */}
                {isLoading ? <TableSkeleton rows={10} columns={6} /> : (
                    <CommonTable
                        userTableData={data}
                        columns={columns}
                        pageSizeOptions={[10, 15, 20, 50, 100]}
                    />
                )}

            </Paper>
        </>
    )
}

export default Category;