import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCompoundDetails } from "../api";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Paper,
} from "@mui/material";
import OCL from "openchemlib/full"; // ✅ Import OpenChemLib

function CompoundDetail() {
  const { chemblId } = useParams();
  const [compound, setCompound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [molSVG, setMolSVG] = useState(""); // ✅ Store SVG for molecule rendering

  useEffect(() => {
    fetchCompoundDetails(chemblId)
      .then((data) => {
        setCompound(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching compound details:", err);
        setLoading(false);
      });
  }, [chemblId]);

  useEffect(() => {
    if (compound?.canonical_smiles) {
      try {
        const molecule = OCL.Molecule.fromSmiles(compound.canonical_smiles); // ✅ Convert SMILES to Molecule
        const svg = molecule.toSVG(300, 300); // ✅ Generate SVG
        setMolSVG(svg);
      } catch (error) {
        console.error("Error rendering molecule:", error);
        setMolSVG("<p style='color:red'>Error loading structure</p>");
      }
    }
  }, [compound]);

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 3 }} />
    );

  return (
    <Box sx={{ maxWidth: 700, margin: "auto", textAlign: "center", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        {compound.pref_name || "Unknown Compound"}
      </Typography>

      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            ChEMBL ID: <b>{compound.chembl_id}</b>
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography>
            <b>Molecule Type:</b> {compound.molecule_type}
          </Typography>
          <Typography>
            <b>Molecular Weight:</b> {compound.full_mwt}
          </Typography>
          <Typography>
            <b>LogP:</b> {compound.alogp}
          </Typography>
          <Typography>
            <b>HBD:</b> {compound.hbd}
          </Typography>
          <Typography>
            <b>HBA:</b> {compound.hba}
          </Typography>
          <Typography>
            <b>PSA:</b> {compound.psa || "N/A"}
          </Typography>
          <Typography>
            <b>TPSA:</b> {compound.tpsa || "N/A"}
          </Typography>
          <Typography>
            <b>Max Phase: {compound.max_phase}</b>
          </Typography>
          <Typography>
            <b>First Approval Year:</b> {compound.first_approval_year || "N/A"}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* 🔬 2D Molecular Viewer in a Box Layout */}
          <Paper
            sx={{
              p: 2,
              border: "1px solid #ddd",
              borderRadius: "5px",
              background: "#f9f9f9",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              2D Molecular Structure 🔬
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: molSVG }} />
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CompoundDetail;
