// =====================================================
// מערכת הצבעה — קריית חינוך קציר רחובות
// הדבק את הקוד הזה ב-script.google.com ופרוס כ-Web App
// =====================================================

const SHEET_NAME = 'votes';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('Voting-Kiryat-Katzir');
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['timestamp', 'first', 'second', 'third']);
  }
  return sh;
}

function doGet(e) {
  const sh = getSheet_();
  const rows = sh.getDataRange().getValues();
  const votes = [];
  for (let i = 1; i < rows.length; i++) {
    const [ts, first, second, third] = rows[i];
    if (first || second || third) votes.push({ first, second, third, ts });
  }
  return ContentService
    .createTextOutput(JSON.stringify({ votes }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const first = String(body.first || '');
    const second = String(body.second || '');
    const third = String(body.third || '');
    if (!first || !second || !third) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'missing' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const sh = getSheet_();
    sh.appendRow([new Date().toISOString(), first, second, third]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function resetVotes() {
  const sh = getSheet_();
  sh.clear();
  sh.appendRow(['timestamp', 'first', 'second', 'third']);
}
