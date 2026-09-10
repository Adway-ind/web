const { google } = require("googleapis");
const ExcelJS = require("exceljs");
const supabase = require("./supabase");

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SHEET_NAME = process.env.GOOGLE_SHEET_NAME || "Sheet1";

const MS_GRAPH_TENANT_ID = process.env.MS_GRAPH_TENANT_ID;
const MS_GRAPH_CLIENT_ID = process.env.MS_GRAPH_CLIENT_ID;
const MS_GRAPH_CLIENT_SECRET = process.env.MS_GRAPH_CLIENT_SECRET;
const MS_GRAPH_USER_ID = process.env.MS_GRAPH_USER_ID;
const MS_GRAPH_WORKBOOK_ITEM_ID = process.env.MS_GRAPH_WORKBOOK_ITEM_ID;
const MS_GRAPH_WORKBOOK_SHEET_NAME = process.env.MS_GRAPH_WORKBOOK_SHEET_NAME || "Sheet1";

function buildApplicationTableRows(apps) {
  const header = [
    "ID", "Name", "Email", "Position", "Phone", "Portfolio",
    "LinkedIn", "Cover Note", "Resume", "Status", "Created At", "Updated At",
  ];

  const rows = apps.map((app) => [
    app.id, app.name, app.email, app.position,
    app.phone || "", app.portfolio || "", app.linkedin || "",
    app.coverNote || "", app.resume || "", app.status || "",
    app.created_at ? new Date(app.created_at).toISOString() : "",
    app.updated_at ? new Date(app.updated_at).toISOString() : "",
  ]);

  return [header, ...rows];
}

async function createApplicationsExcelBuffer(apps) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");
  const rows = buildApplicationTableRows(apps);
  worksheet.addRows(rows);
  worksheet.columns.forEach((column) => { column.width = 22; });
  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  return workbook.xlsx.writeBuffer();
}

async function getAllApplications() {
  const { data } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getGoogleAuth() {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_KEY) return null;
  const auth = new google.auth.JWT(
    GOOGLE_SERVICE_ACCOUNT_EMAIL, null, GOOGLE_SERVICE_ACCOUNT_KEY,
    ["https://www.googleapis.com/auth/spreadsheets"],
  );
  await auth.authorize();
  return auth;
}

async function syncApplicationsToGoogleSheet(apps) {
  if (!GOOGLE_SHEETS_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error("Google Sheets sync is not configured.");
  }
  const auth = await getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const values = buildApplicationTableRows(apps);
  await sheets.spreadsheets.values.update({
    spreadsheetId: GOOGLE_SHEETS_ID,
    range: `${GOOGLE_SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: { values },
  });
}

async function getMicrosoftGraphAccessToken() {
  if (!MS_GRAPH_TENANT_ID || !MS_GRAPH_CLIENT_ID || !MS_GRAPH_CLIENT_SECRET) return null;
  const url = `https://login.microsoftonline.com/${MS_GRAPH_TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: MS_GRAPH_CLIENT_ID,
    client_secret: MS_GRAPH_CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || "Graph token request failed.");
  return data.access_token;
}

async function syncApplicationsToMicrosoftGraph(apps) {
  if (!MS_GRAPH_WORKBOOK_ITEM_ID || !MS_GRAPH_TENANT_ID || !MS_GRAPH_CLIENT_ID || !MS_GRAPH_CLIENT_SECRET) {
    throw new Error("Microsoft Graph sync is not configured.");
  }
  const token = await getMicrosoftGraphAccessToken();
  const workbookPath = MS_GRAPH_USER_ID
    ? `/users/${MS_GRAPH_USER_ID}/drive/items/${MS_GRAPH_WORKBOOK_ITEM_ID}`
    : `/me/drive/items/${MS_GRAPH_WORKBOOK_ITEM_ID}`;
  const values = buildApplicationTableRows(apps);
  const url = `https://graph.microsoft.com/v1.0${workbookPath}/workbook/worksheets('${encodeURIComponent(MS_GRAPH_WORKBOOK_SHEET_NAME)}')/range(address='A1')`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Microsoft Graph sync failed: ${res.status} ${body}`);
  }
}

async function syncApplicationRecords() {
  const apps = await getAllApplications();
  const result = { google: null, microsoft: null };

  if (GOOGLE_SHEETS_ID && GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      await syncApplicationsToGoogleSheet(apps);
      result.google = "ok";
    } catch (err) {
      result.google = err.message;
    }
  }

  if (MS_GRAPH_WORKBOOK_ITEM_ID && MS_GRAPH_TENANT_ID && MS_GRAPH_CLIENT_ID && MS_GRAPH_CLIENT_SECRET) {
    try {
      await syncApplicationsToMicrosoftGraph(apps);
      result.microsoft = "ok";
    } catch (err) {
      result.microsoft = err.message;
    }
  }

  return result;
}

module.exports = {
  syncApplicationRecords,
  getAllApplications,
  createApplicationsExcelBuffer,
  buildApplicationTableRows,
};
