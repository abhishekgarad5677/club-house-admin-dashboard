import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetRewardTierInfoMutation } from "../../redux/slices/apiSlice";
import { Paper } from "@mui/material";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import { TableWithExport } from "../../components/table/TableWithExport";
import { formatDateTime } from "../../utils/Hooks";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const RewardTierInfo = () => {
  const [postData, { isLoading, error, data: rewardTierInfo }] =
    useGetRewardTierInfoMutation();

  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const { id } = useParams();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (id) {
      const formData = new FormData();
      formData.append("rewardTierId", id);
      postData(formData);
    }
  }, [id]);

  useEffect(() => {
    if (rewardTierInfo) {
      setData(rewardTierInfo?.data?.rewardSets || []);
      setRowCount(rewardTierInfo?.data?.rewardSets?.length || 0);
    }
  }, [rewardTierInfo]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "label", headerName: "Label", width: 250 },
    { field: "startRank", headerName: "Start Rank", width: 200 },
    { field: "endRank", headerName: "End Rank", width: 200 },
    { field: "amountPerUser", headerName: "Amount Per User", width: 200 },
  ];

  return (
    <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
      <Link
        style={{
          textDecoration: "none",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        to={"/dashboard/reward-tier-list"}
      >
        <ArrowBackIosIcon sx={{ fontSize: 14 }} />
        back
      </Link>

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
  );
};

export default RewardTierInfo;
