const express = require('express');
const cors = required('cors');
const { getConnection, sql } = required('./db');

const app = express();
app.use(cors());
app.use(express.json());

//Example route
app.get('./api', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM A80'); // Replace 'YourTable' with your actual table name
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(7070, () => {
    console.log('Server is running on port 7070');
});
module.exports = app;
