import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCompounds } from "../api";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  InputAdornment,
  IconButton,
  TableFooter,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
const moleculeTypeOptions = [
  "All",
  "Small molecule",
  "Biologic",
  "Protein",
  "Peptide",
];

function CompoundSearch() {
  const [filters, setFilters] = useState({
    name: "",
    min_weight: "",
    max_weight: "",
    molecule_types: [],
    sort_by: "chembl_id",
    order: "ASC",
  });

  const [compounds, setCompounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const totalRecords = 20; // Assume total records are 20 for now
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchFilteredCompounds = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.name) params.name = filters.name;
        if (filters.min_weight) params.min_weight = filters.min_weight;
        if (filters.max_weight) params.max_weight = filters.max_weight;
        if (
          filters.molecule_types.length > 0 &&
          !filters.molecule_types.includes("All")
        ) {
          params.molecule_types = filters.molecule_types.join(",");
        }
        if (filters.sort_by) {
          params.sort_by = filters.sort_by;
          params.order = filters.order;
        }
        params.page = page;
        params.limit = limit;

        const data = await fetchCompounds(params);
        setCompounds(data);
        setTotalRecords(data.length);
      } catch (error) {
        console.error("Error fetching compounds:", error);
        setTotalRecords(0);
      }
      setLoading(false);
    };

    fetchFilteredCompounds();
  }, [filters, page, limit]);

  const isNextDisabled = page * limit >= totalRecords || totalRecords === 0;

  // Prevent `NaN` issue in pagination UI
  const startRecord = totalRecords > 0 ? (page - 1) * limit + 1 : 0;
  const endRecord = Math.min(page * limit, totalRecords);

  const handleSort = (column) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sort_by: column,
      order: prevFilters.order === "ASC" ? "DESC" : "ASC",
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      min_weight: "",
      max_weight: "",
      molecule_types: [],
      sort_by: "chembl_id",
      order: "ASC",
    });
  };

  const hasFilters =
    filters.name ||
    filters.min_weight ||
    filters.max_weight ||
    filters.molecule_types.length > 0;

  return (
    <Box sx={{ maxWidth: "1100px", margin: "auto", padding: 2 }}>
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: "10px" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {/* 🔍 Search Field with Icon */}
              <TableCell sx={{ width: "30%", position: "relative" }}>
                <TextField
                  label={filters.name ? "" : "Search Name / ChEMBL ID"} // Hide label when typing
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.name}
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>

              {/* ⚖️ Min MW (Smaller Input) */}
              <TableCell sx={{ width: "20%" }}>
                <TextField
                  label="Min MW"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.min_weight}
                  onChange={(e) =>
                    setFilters({ ...filters, min_weight: e.target.value })
                  }
                  sx={{ minWidth: "100px" }}
                />
              </TableCell>

              {/* ⚖️ Max MW (Smaller Input) */}
              <TableCell sx={{ width: "20%" }}>
                <TextField
                  label="Max MW"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.max_weight}
                  onChange={(e) =>
                    setFilters({ ...filters, max_weight: e.target.value })
                  }
                  sx={{ minWidth: "100px" }}
                />
              </TableCell>

              {/* 🔬 Molecule Type (Increased Width) */}
              <TableCell sx={{ width: "30%" }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Molecule Type</InputLabel>
                  <Select
                    multiple
                    value={filters.molecule_types}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        molecule_types: e.target.value,
                      });
                    }}
                    renderValue={(selected) => selected.join(", ")} // Show selected values
                  >
                    {moleculeTypeOptions.map((type) => (
                      <MenuItem key={type} value={type}>
                        <input
                          type="checkbox"
                          checked={filters.molecule_types.includes(type)}
                          onChange={() => {
                            const selectedValues =
                              filters.molecule_types.includes(type)
                                ? filters.molecule_types.filter(
                                    (t) => t !== type
                                  )
                                : [...filters.molecule_types, type];
                            setFilters({
                              ...filters,
                              molecule_types: selectedValues,
                            });
                          }}
                          style={{ marginRight: "8px" }}
                        />
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableHead>
            <TableRow>
              {/* Clear Filters Button (Shown only if filters are applied) */}
              {hasFilters && (
                <TableCell sx={{ width: "5%", height: "0.1%" }}>
                  <IconButton onClick={clearFilters} color="error">
                    <DeleteIcon /> clear
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          {/* 🔀 Table Headers with Sorting */}
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              {["ChEMBL ID", "Name", "Molecular Weight", "Type"].map(
                (header, index) => (
                  <TableCell
                    key={index}
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
                    <TableSortLabel
                      active={
                        filters.sort_by ===
                        header.toLowerCase().replace(" ", "_")
                      }
                      direction={filters.order.toLowerCase()}
                      onClick={() =>
                        handleSort(header.toLowerCase().replace(" ", "_"))
                      }
                      sx={{
                        color: "#fff",
                        "&.MuiTableSortLabel-root": { color: "#fff" },
                      }}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          {/* 🔄 Table Data */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              compounds.map((c) => (
                <TableRow key={c.chembl_id}>
                  <TableCell>
                    <Link
                      to={`/compound/${c.chembl_id}`}
                      style={{ textDecoration: "none", color: "#1976d2" }}
                    >
                      {c.chembl_id}
                    </Link>
                  </TableCell>
                  <TableCell>{c.pref_name || "N/A"}</TableCell>
                  <TableCell>{c.full_mwt}</TableCell>
                  <TableCell>{c.molecule_type}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          {/* 📌 Pagination in Table Footer static */}
          {/* <TableBody>
            <TableRow>
              <TableCell colSpan={2}>
                <Box display="flex" alignItems="center">
                  Rows per page:
                  <Select
                    size="small"
                    value={limit}
                    onChange={(e) => {
                      setLimit(e.target.value);
                      setPage(1); // Reset to first page when limit changes
                    }}
                    sx={{ ml: 1 }}
                  >
                    {[10, 25, 50].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </TableCell>

              <TableCell colSpan={2} align="right">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <span>
                    {`${(page - 1) * limit + 1}–${Math.min(
                      page * limit,
                      totalRecords
                    )} of ${totalRecords}`}
                  </span>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={{
                      border: "none",
                      background: "none",
                      margin: "0 10px",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    {"<"}
                  </button>
                  <button
                    disabled={page * limit >= totalRecords}
                    onClick={() => setPage(page + 1)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor:
                        page * limit >= totalRecords
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {">"}
                  </button>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody> */}

          {/* dynamic page */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>
                <Box display="flex" alignItems="center">
                  Rows per page:
                  <Select
                    size="small"
                    value={limit}
                    onChange={(e) => {
                      setLimit(e.target.value);
                      setPage(1); // Reset to first page when limit changes
                    }}
                    sx={{ ml: 1 }}
                  >
                    {[5, 10, 25, 50].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </TableCell>
              <TableCell colSpan={2} align="right">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <span>
                    {`${startRecord}–${endRecord} of ${totalRecords}`}
                  </span>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={{
                      border: "none",
                      background: "none",
                      margin: "0 10px",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    {"<"}
                  </button>
                  <button
                    disabled={isNextDisabled}
                    onClick={() => setPage(page + 1)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: isNextDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {">"}
                  </button>
                </Box>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CompoundSearch;
