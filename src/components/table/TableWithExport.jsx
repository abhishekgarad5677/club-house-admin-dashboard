// Add these imports
import { GridToolbar } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

// Custom toolbar with export
const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ fileName: "students_data" }} />
    </GridToolbarContainer>
  );
};

// Updated CommonTable component
export const TableWithExport = (props) => {
  const {
    userTableData,
    columns,
    pageSizeOptions,
    rowCount,
    paginationModel,
    onPaginationModelChange,
  } = props;
  // const paginationModel = { page: 0, pageSize: 10 };

  return (
    <DataGrid
      rows={userTableData}
      columns={columns}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={pageSizeOptions}
      rowCount={rowCount}
      disableRowSelectionOnClick
      // slots={{ toolbar: CustomToolbar }}
      sx={{
        border: 0,
        width: "100%",
        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },
        '& .MuiDataGrid-cell[data-field="actions"]': {
          outline: "none",
        },
        '& .MuiDataGrid-cell[data-field="actions"]:focus-within': {
          outline: "none",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: 600,
        },
      }}
    />
  );
};
