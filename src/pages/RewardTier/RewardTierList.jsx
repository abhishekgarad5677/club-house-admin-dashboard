import { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import AddIcon from "@mui/icons-material/Add";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { useNavigate } from "react-router-dom";
import { useGetRewardTierListMutation } from "../../redux/slices/apiSlice";
import { TableWithExport } from "../../components/table/TableWithExport";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const RewardTierList = () => {
  const [data, setData] = useState();
  const [rowCount, setRowCount] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const [postData, { isLoading, error, data: rewardTierData }] =
    useGetRewardTierListMutation();

  useEffect(() => {
    postData({});
  }, []);

  useEffect(() => {
    if (rewardTierData) {
      console.log("Reward Tier List:", rewardTierData?.data);
      setData(rewardTierData?.data);
      setRowCount(rewardTierData?.data?.length || 0);
    }
  }, [rewardTierData]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 300 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}
        >
          <Tooltip title="View Breakdown" arrow>
            <RemoveRedEyeIcon
              onClick={() =>
                navigate(`/dashboard/reward-tier-info/${params.row.id}`)
              }
              sx={{ color: "#5d87ff", cursor: "pointer" }}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomBreadcrumbs
          items={[
            {
              label: "Reward Tier",
              href: "/dashboard/reward-tier-list",
              icon: <MilitaryTechIcon fontSize="small" />,
            },
          ]}
        />
      </Box>
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
          sx={{
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              width: { xs: "100%", sm: "auto", backgroundColor: "#1E218D" },
            }}
            onClick={() => navigate("/dashboard/create-reward-tier")}
          >
            Create Reward Tier
          </Button>
        </Box>
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <TableWithExport
            userTableData={data?.map((d) => ({ ...d, id: d.id }))}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        )}
      </Paper>
    </>
  );
};

export default RewardTierList;
