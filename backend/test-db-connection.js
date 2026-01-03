const { sql, poolPromise } = require("./src/config/database");

async function testConnection() {
  try {
    console.log("Testing MSSQL database connection...");
    console.log("Host:", process.env.DB_HOST);
    console.log("Database:", process.env.DB_NAME);
    console.log("User:", process.env.DB_USER);
    console.log("-----------------------------------\n");

    // Get pool connection
    const pool = await poolPromise;
    console.log("✓ Successfully connected to database!");

    // Test basic query
    const result1 = await pool.request().query("SELECT 1 + 1 AS result");
    console.log("✓ Test query executed successfully:", result1.recordset[0]);

    // Get database name
    const result2 = await pool
      .request()
      .query("SELECT DB_NAME() as CurrentDatabase");
    console.log(
      "✓ Connected to database:",
      result2.recordset[0].CurrentDatabase
    );

    // Get SQL Server version
    const result3 = await pool.request().query("SELECT @@VERSION as Version");
    const version = result3.recordset[0].Version.split("\n")[0];
    console.log("✓ SQL Server version:", version);

    // List tables
    const result4 = await pool.request().query(`
      SELECT TABLE_SCHEMA, TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);
    console.log("✓ Number of tables in database:", result4.recordset.length);
    if (result4.recordset.length > 0) {
      console.log("  Sample tables:");
      result4.recordset.slice(0, 10).forEach((t) => {
        console.log(`    - ${t.TABLE_SCHEMA}.${t.TABLE_NAME}`);
      });
    }
    
    console.log("\n✓ Database connection test completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Database connection failed:");
    console.error("Error:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    console.error("\nPlease check:");
    console.error("1. Database server is accessible");
    console.error("2. .env file has correct credentials");
    console.error("3. Database exists");
    console.error("4. User has proper permissions");
    console.error("5. Firewall allows connection from your IP");
    process.exit(1);
  }
}

testConnection();
