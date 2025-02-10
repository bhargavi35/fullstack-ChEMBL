const express = require("express");
const cors = require("cors");
const pool = require("./db");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Testing API
app.get("/", (req, res) => {
    res.send("API is working! 🔥");
});

// ✅ API: Search, Filter, Sort, and Paginate Compounds
app.get("/compounds", async (req, res) => {
    try {
        const {
            name, min_weight, max_weight, molecule_types,
            sort_by, order, page = 1, limit = 10
        } = req.query;

        // const offset = (page - 1) * limit;
        let query = `
            SELECT m.chembl_id, m.pref_name, m.molecule_type, m.max_phase, 
                   p.full_mwt, p.alogp, p.hbd, p.hba
            FROM molecule_dictionary m
            JOIN compound_properties p ON m.molregno = p.molregno
            WHERE 1=1
        `;

        const queryParams = [];

        // 🔍 Search by Name or ChEMBL ID
        if (name) {
            query += ` AND (m.pref_name ILIKE $${queryParams.length + 1} OR m.chembl_id ILIKE $${queryParams.length + 2}) `;
            queryParams.push(`%${name}%`, `%${name}%`);
        }

        // ⚖️ Filter by Molecular Weight
        if (min_weight) {
            query += ` AND p.full_mwt >= $${queryParams.length + 1} `;
            queryParams.push(min_weight);
        }
        if (max_weight) {
            query += ` AND p.full_mwt <= $${queryParams.length + 1} `;
            queryParams.push(max_weight);
        }

        // 🔬 Filter by Molecule Type (Multi-Select)
        if (molecule_types) {
            const typesArray = molecule_types.split(",");
            query += ` AND m.molecule_type = ANY($${queryParams.length + 1}) `;
            queryParams.push(typesArray);
        }

        // // 🔀 Sorting (Only if Provided)
        // if (sort_by) {
        //     query += ` ORDER BY ${sort_by} ${order === "DESC" ? "DESC" : "ASC"} `;
        // }

        const defaultLimit = 100;
        const limitValue = limit ? parseInt(limit, 10) : defaultLimit;
        const offset = (page - 1) * limitValue;

        const defaultSortBy = "m.chembl_id"; // Default sorting by ChEMBL ID
        const defaultOrder = "ASC";

        const validColumns = {
            chembl_id: "m.chembl_id",
            name: "m.pref_name",
            molecular_weight: "p.full_mwt",
            type: "m.molecule_type"
        };

        const sortColumn = sort_by && validColumns[sort_by] ? validColumns[sort_by] : defaultSortBy;
        const sortOrder = order && (order.toUpperCase() === "DESC" || order.toUpperCase() === "ASC") ? order.toUpperCase() : defaultOrder;

        query += ` ORDER BY ${sortColumn} ${sortOrder} `;
        query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limitValue, offset);


        const result = await pool.query(query, queryParams);
        res.json({
            data: result.rows,
            totalRecords: result.rows.length > 0 ? result.rows[0].total_records : 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ API to fetch details of a single compound by ChEMBL ID
app.get("/compounds/:chemblId", async (req, res) => {
    try {
        const { chemblId } = req.params;

        const query = `
      SELECT m.chembl_id, m.pref_name, m.molecule_type, m.max_phase, p.full_mwt, 
             p.alogp, p.hbd, p.hba, s.canonical_smiles
      FROM molecule_dictionary m
      JOIN compound_properties p ON m.molregno = p.molregno
      JOIN compound_structures s ON m.molregno = s.molregno
      WHERE m.chembl_id = $1
    `;

        const result = await pool.query(query, [chemblId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Compound not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Ensure WebSockets Do Not Interfere with API
io.on("connection", (socket) => {
    console.log("Client connected to WebSocket ✅");

    const sendData = async () => {
        try {
            const result = await pool.query(`
        SELECT molecule_type, COUNT(*) as count
        FROM molecule_dictionary
        GROUP BY molecule_type;
      `);
            socket.emit("chartUpdate", result.rows); // ✅ Send live chart data
        } catch (error) {
            console.error("Error fetching real-time data:", error);
        }
    };

    const interval = setInterval(sendData, 5000);

    socket.on("disconnect", () => {
        console.log("Client disconnected ❌");
        clearInterval(interval);
    });
});

// ✅ Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
