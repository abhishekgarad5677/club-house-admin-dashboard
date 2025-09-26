import { Box, Paper, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import Grid from '@mui/material/Grid2';
import Chart from "react-apexcharts";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";


const Dashboard = () => {

    const [chartData] = useState({
        series: [44, 55, 41, 17, 15],
        options: {
            labels: ["A", "B", "C", "D", "E"],
        },
    });

    return (
        <>
            <CustomBreadcrumbs
                items={[
                    { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon fontSize="small" /> }
                ]}
            />
            <Paper sx={{ height: "85vh", width: '100%', padding: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                    {/* <Grid container spacing={2}>
                        <Grid size={4} style={{ display: "flex", justifyContent: "center" }}>
                            <Paper elevation={2} >
                                <Chart options={chartData.options} series={chartData.series} type="donut" width={"100%"} />
                            </Paper>
                        </Grid>
                        <Grid size={8}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    // flexWrap: 'wrap',
                                    overflow: 'hidden',
                                    gap: 2,
                                    padding: 2,
                                    '& > :not(style)': {
                                        // m: 2,
                                        width: 200,
                                        height: 200,
                                    },
                                }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >

                                    <Box sx={{ borderRadius: '50%', padding: 2, backgroundColor: '#ccc' }}>
                                        <GroupIcon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography variant="h6" >
                                        Users
                                    </Typography>
                                </Paper>
                                <Paper elevation={2} />
                                <Paper elevation={2} />
                                <Paper elevation={2} />
                            </Box>
                        </Grid>
                    </Grid> */}
                </Box>

            </Paper >
        </>
    )
}

export default Dashboard