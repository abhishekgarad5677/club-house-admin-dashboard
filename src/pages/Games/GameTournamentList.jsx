import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetTournamentByGameIdMutation } from "../../redux/slices/apiSlice";
import { Paper } from "@mui/material";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import { TableWithExport } from "../../components/table/TableWithExport";
import {
  formatDateTime,
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";  

const GameTournamentList = () => {
  const [postData, { isLoading, error, data: tournamentData }] =
    useGetTournamentByGameIdMutation();

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
      formData.append("GameId", id);
      formData.append("FilterType", "lifetime");
      formData.append("PageSize", paginationModel.pageSize);
      formData.append("PageNumber", paginationModel.page + 1);
      postData(formData);
    }
  }, [id, paginationModel]);

  useEffect(() => {
    if (tournamentData) {
      console.log(tournamentData?.data);
      setData(tournamentData?.data?.tournaments);
      setRowCount(tournamentData?.data?.totalCount);
    }
  }, [tournamentData]);


  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "gameName", headerName: "Game Name", width: 200 },
    { field: "minPlayers", headerName: "Minimum Players", width: 150 },
    { field: "maxPlayers", headerName: "Maximum Players", width: 150 },
    { field: "prizePool", headerName: "Prize Pool", width: 150 },
    { field: "joinedPlayers", headerName: "Joined Players", width: 150 },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 200,
      renderCell: (params) => formatDateTime(params?.row?.startTime),
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 200,
      renderCell: (params) => formatDateTime(params?.row?.endTime),
    },
    { field: "status", headerName: "Status", width: 150 },
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
        to={"/dashboard/games"}
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

export default GameTournamentList;
