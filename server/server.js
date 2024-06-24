const PORT = process.env.PORT ?? 8000;
const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const pool = require("./db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require("dotenv").config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

//upload reports
app.post("/ReportsPage", upload.single("pdfFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "PDF file is required" });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({
      error: "File size limit exceeded. Please upload a file under 5MB.",
    });
  }

  const { user_email } = req.body;
  const fileBuffer = req.file.buffer;
  const fileName = generateFileName();

  const key = `${fileName}.pdf`;

  const bucket = bucketName;

  const uploadParams = {
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: req.file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));

    const id = uuidv4();
    await pool.query(
      `INSERT INTO pdf_reports(id, user_email, file_path, file_name) 
       VALUES($1, $2, $3, $4)`,
      [id, user_email, fileName, req.file.originalname]
    );

    res.json({ message: "PDF file uploaded successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the PDF file" });
  }
});

//get reports
app.get("/ReportsPage/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const pdfReports = await pool.query(
      "SELECT * FROM pdf_reports WHERE user_email = $1",
      [userEmail]
    );

    for (let report of pdfReports.rows) {
      const signedurl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: `${report.file_path}.pdf`,
        }),
        { expiresIn: 60 }
      );

      report.signedurl = signedurl;
    }

    res.json(pdfReports.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching PDF reports" });
  }
});

// Delete a report
app.delete("/ReportsPage/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pdfReport = await pool.query(
      "SELECT * FROM pdf_reports WHERE id = $1",
      [id]
    );

    if (pdfReport.rows.length === 0) {
      return res.status(404).json({ error: "PDF report not found" });
    }

    const key = `${pdfReport.rows[0].file_path}.pdf`;

    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    await pool.query("DELETE FROM pdf_reports WHERE id = $1", [id]);

    res.json({ message: "PDF file deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the PDF file" });
  }
});

//get all the input data
app.get("/Input/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const inputValues = await pool.query(
      "SELECT * FROM inputValues WHERE user_email = $1",
      [userEmail]
    );
    res.json(inputValues.rows);
  } catch (err) {
    console.log(err);
  }
});

//delete vitals data
app.delete("/Input/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const inputValues = await pool.query(
      "SELECT * FROM inputValues WHERE id = $1",
      [id]
    );

    if (inputValues.rows.length === 0) {
      return res.status(404).json({ error: "vitals not found" });
    }

    await pool.query("DELETE FROM inputValues WHERE id = $1", [id]);

    res.json({ message: "Vitals deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the vitals" });
  }
});

//get all the form data
app.get("/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const inputValues = await pool.query(
      "SELECT * FROM formData WHERE user_email = $1",
      [userEmail]
    );
    res.json(inputValues.rows);
  } catch (err) {
    console.log(err);
  }
});

app.post("/", async (req, res) => {
  const {
    user_email,
    name,
    age,
    emergencycontact,
    gender,
    medicalconditions,
    bloodgroup,
  } = req.body;

  try {
    const existingData = await pool.query(
      "SELECT * FROM formData WHERE user_email = $1",
      [user_email]
    );

    if (existingData.rows.length > 0) {
      res.status(409).json({ message: "Data already exists" });
    } else {
      const id = uuidv4();
      await pool.query(
        `INSERT INTO formData(id, user_email, name, age, emergencycontact, gender, medicalconditions, bloodgroup) 
         VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          user_email,
          name,
          age,
          emergencycontact,
          gender,
          medicalconditions,
          bloodgroup,
        ]
      );
      res.json({ message: "Data inserted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Update existing form data
app.put("/", async (req, res) => {
  const {
    user_email,
    name,
    age,
    emergencycontact,
    gender,
    medicalconditions,
    bloodgroup,
  } = req.body;

  try {
    const existingData = await pool.query(
      "SELECT * FROM formData WHERE user_email = $1",
      [user_email]
    );

    if (existingData.rows.length > 0) {
      await pool.query(
        `UPDATE formData SET name = $2, age = $3, emergencycontact = $4, gender = $5, medicalconditions = $6, bloodgroup = $7 WHERE user_email = $1`,
        [
          user_email,
          name,
          age,
          emergencycontact,
          gender,
          medicalconditions,
          bloodgroup,
        ]
      );
      res.json({ message: "Data updated successfully" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//create a new input data
app.post("/Input", async (req, res) => {
  const {
    user_email,
    bpsys,
    bpdia,
    pulserate,
    totalcholesterol,
    hdlcholesterol,
    ldlcholesterol,
    bloodglucosefasting,
    bloodglucosepp,
    creatinine,
    date,
  } = req.body;

  const id = uuidv4();
  try {
    const newInputValues = pool.query(
      `INSERT INTO inputValues (id, user_email, bpsys, bpdia, pulserate, totalcholesterol , hdlcholesterol, ldlcholesterol, bloodglucosefasting, bloodglucosepp, creatinine, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        id,
        user_email,
        bpsys,
        bpdia,
        pulserate,
        totalcholesterol,
        hdlcholesterol,
        ldlcholesterol,
        bloodglucosefasting,
        bloodglucosepp,
        creatinine,
        date,
      ]
    );
    res.json(newInputValues);
  } catch (err) {
    console.error(err);
  }
});

//sign up
app.post("/signup", async (req, res) => {
  const { email, password, license_key } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  let role = "user";

  if (license_key) {
    const existingAdmin = await pool.query(
      "SELECT * FROM users WHERE role = 'admin' AND license_key = $1",
      [license_key]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ detail: "License key is already in use" });
    } else {
      const licensePattern = /^HSP-\d{4,5}-\d{4}-IN$/;
      if (licensePattern.test(license_key)) {
        role = "admin";
      } else {
        return res.status(400).json({ detail: "Invalid license key format" });
      }
    }
  }

  try {
    const signUp = await pool.query(
      `INSERT INTO users (email, hashed_password, role, license_key) VALUES($1, $2, $3, $4)`,
      [email, hashedPassword, role, license_key]
    );

    const token = jwt.sign({ email, role }, "secret", { expiresIn: "1hr" });

    res.json({ email, role, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!users.rows.length) {
      return res.status(404).json({ detail: "User does not exist!" });
    }

    const user = users.rows[0];
    const success = await bcrypt.compare(password, user.hashed_password);

    if (success) {
      const token = jwt.sign({ email: user.email, role: user.role }, "secret", {
        expiresIn: "1hr",
      });
      res.status(200).json({ email: user.email, role: user.role, token });
    } else {
      res.status(401).json({ detail: "Incorrect password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: "Internal server error" });
  }
});

//Role based authentication middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.sendStatus(403);
  }
  next();
};

app.get(
  "/AdminPage/:userEmail",
  authenticateJWT,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { userEmail } = req.params;

    try {
      const formDataValues = await pool.query(
        "SELECT * FROM formData WHERE user_email = $1",
        [userEmail]
      );
      res.json(formDataValues.rows);
    } catch (err) {
      console.log(err);
    }
  }
);

app.get(
  "/AdminPage/InputValues/:userEmail",
  authenticateJWT,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { userEmail } = req.params;

    try {
      const inputValues = await pool.query(
        "SELECT * FROM inputValues WHERE user_email = $1",
        [userEmail]
      );
      res.json(inputValues.rows);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching input values data" });
    }
  }
);

app.get(
  "/AdminPage/PDFData/:userEmail",
  authenticateJWT,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { userEmail } = req.params;

    try {
      const pdfReports = await pool.query(
        "SELECT * FROM pdf_reports WHERE user_email = $1",
        [userEmail]
      );

      for (let report of pdfReports.rows) {
        const signedurl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: bucketName,
            Key: `${report.file_path}.pdf`,
          }),
          { expiresIn: 60 }
        );

        report.signedurl = signedurl;
      }
      res.json(pdfReports.rows);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching PDF reports" });
    }
  }
);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
