import { DataGrid } from "@mui/x-data-grid"

export const CommonTable = (props) => {

    const { userTableData, columns, pageSizeOptions } = props
    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <DataGrid
            rows={userTableData}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={pageSizeOptions}
            disableRowSelectionOnClick
            sx={{
                border: 0,
                width: "100%",
                "& .MuiDataGrid-cell:focus": {
                    outline: "none", // Remove focus outline for all cells
                },
                "& .MuiDataGrid-cell[data-field='actions']": {
                    outline: "none", // Explicitly remove focus outline for actions column
                },
                "& .MuiDataGrid-cell[data-field='actions']:focus-within": {
                    outline: "none", // Remove focus for buttons in actions column
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600, // Set font weight of table headers
                },
            }}
        />
    )
}