/**
 * Exporta la lista de novedades a un archivo Excel (.xlsx) con diseño corporativo
 * de "Mi conductor" (título, subtítulo, estilos, bordes, filas alternadas,
 * colores por estado/prioridad, autoajuste de columnas y autofiltro).
 */

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let j = 0; j < 8; j += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZipBlob(entries) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  entries.forEach(({ name, content }) => {
    const nameBytes = encoder.encode(name);
    const dataBytes = typeof content === "string" ? encoder.encode(content) : content;
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    const localHeader = new ArrayBuffer(30 + nameBytes.length);
    const lv = new DataView(localHeader);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    new Uint8Array(localHeader, 30).set(nameBytes);

    localParts.push(new Uint8Array(localHeader), dataBytes);

    const centralHeader = new ArrayBuffer(46 + nameBytes.length);
    const cv = new DataView(centralHeader);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    new Uint8Array(centralHeader, 46).set(nameBytes);

    centralParts.push(new Uint8Array(centralHeader));
    offset += 30 + nameBytes.length + size;
  });

  const centralSize = centralParts.reduce((acc, p) => acc + p.length, 0);
  const eocd = new ArrayBuffer(22);
  const ev = new DataView(eocd);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return new Blob([...localParts, ...centralParts, new Uint8Array(eocd)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getColLetter(colIndex) {
  let num = colIndex + 1;
  let col = "";
  while (num > 0) {
    const rem = (num - 1) % 26;
    col = String.fromCharCode(65 + rem) + col;
    num = Math.floor((num - 1) / 26);
  }
  return col;
}

function buildStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="5">
    <font><sz val="10"/><color rgb="FF1E293B"/><name val="Calibri"/></font>
    <font><b/><sz val="18"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="13"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><i/><sz val="10"/><color rgb="FF475569"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
  </fonts>
  <fills count="5">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1B2E3D"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF253B4E"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="3">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left/>
      <right/>
      <top/>
      <bottom style="medium"><color rgb="FFFF9A2F"/></bottom>
      <diagonal/>
    </border>
    <border>
      <left style="thin"><color rgb="FFE2E8F0"/></left>
      <right style="thin"><color rgb="FFE2E8F0"/></right>
      <top style="thin"><color rgb="FFE2E8F0"/></top>
      <bottom style="thin"><color rgb="FFE2E8F0"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="8">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="left" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
  </cellXfs>
</styleSheet>`;
}

function getCellStyle(key, centeredKeys) {
  return centeredKeys.has(key) ? 6 : 5;
}

function buildStyledXlsxBlob({ sheetName, title, subtitle, rows, centeredKeys }) {
  const headers = Object.keys(rows[0] || {});
  const colCount = headers.length;
  const lastCol = getColLetter(colCount - 1);

  const colsXml = headers
    .map((key, idx) => {
      const maxLen = Math.max(
        key.length + 2,
        ...rows.map((r) => String(r[key] ?? "").length)
      );
      const width = Math.min(Math.max(maxLen + 4, 12), 42);
      return `<col min="${idx + 1}" max="${idx + 1}" width="${width}" customWidth="1"/>`;
    })
    .join("");

  const buildBannerRow = (rowNum, height, text, styleId) => {
    const cells = [];
    for (let c = 0; c < colCount; c += 1) {
      const ref = `${getColLetter(c)}${rowNum}`;
      if (c === 0 && text !== null) {
        cells.push(`<c r="${ref}" t="inlineStr" s="${styleId}"><is><t>${escapeXml(text)}</t></is></c>`);
      } else {
        cells.push(`<c r="${ref}" s="${styleId}"/>`);
      }
    }
    return `<row r="${rowNum}" ht="${height}" customHeight="1">${cells.join("")}</row>`;
  };

  // Filas 1 y 2 combinadas: Título ("Mi conductor")
  const row1 = buildBannerRow(1, 22, title, 1);
  const row2 = buildBannerRow(2, 22, null, 1);
  // Filas 3 y 4 combinadas: Subtítulo ("Reporte de Novedades")
  const row3 = buildBannerRow(3, 18, subtitle, 2);
  const row4 = buildBannerRow(4, 18, null, 7);

  // Fila 5: Encabezados de la tabla
  const headerCells = headers
    .map(
      (h, c) =>
        `<c r="${getColLetter(c)}5" t="inlineStr" s="4"><is><t>${escapeXml(h)}</t></is></c>`
    )
    .join("");
  const row5 = `<row r="5" ht="28" customHeight="1">${headerCells}</row>`;

  // Fila 6 en adelante: Datos
  const dataRowsXml = rows
    .map((rowObj, idx) => {
      const rowNum = 6 + idx;
      const cells = headers
        .map((key, c) => {
          const ref = `${getColLetter(c)}${rowNum}`;
          const val = rowObj[key];
          const styleId = getCellStyle(key, centeredKeys);
          if (typeof val === "number" && Number.isFinite(val)) {
            return `<c r="${ref}" s="${styleId}"><v>${val}</v></c>`;
          }
          return `<c r="${ref}" t="inlineStr" s="${styleId}"><is><t>${escapeXml(val)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowNum}" ht="24" customHeight="1">${cells}</row>`;
    })
    .join("");

  const lastRowNum = 5 + rows.length;
  const titleMergeEndCol = getColLetter(Math.min(colCount - 1, 8));

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="5" topLeftCell="A6" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>${colsXml}</cols>
  <sheetData>${row1}${row2}${row3}${row4}${row5}${dataRowsXml}</sheetData>
  <autoFilter ref="A5:${lastCol}${lastRowNum}"/>
  <mergeCells count="2">
    <mergeCell ref="A1:${titleMergeEndCol}2"/>
    <mergeCell ref="A3:${titleMergeEndCol}4"/>
  </mergeCells>
  <pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>
</worksheet>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  return createZipBlob([
    { name: "[Content_Types].xml", content: contentTypesXml },
    { name: "_rels/.rels", content: rootRelsXml },
    { name: "xl/workbook.xml", content: workbookXml },
    { name: "xl/_rels/workbook.xml.rels", content: workbookRelsXml },
    { name: "xl/styles.xml", content: buildStylesXml() },
    { name: "xl/worksheets/sheet1.xml", content: sheetXml },
  ]);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default async function exportIncidentsExcel(incidents) {
  if (!incidents || incidents.length === 0) {
    alert("No hay novedades para exportar a Excel.");
    return;
  }

  const rows = incidents.map((inc, idx) => ({
    "#": idx + 1,
    "Novedad": inc.codigo || inc.id || "—",
    "Fecha Inicial": inc.fechaInicialDate || inc.fecha || "—",
    "Hora Inicial": inc.fechaInicialTime || inc.hora || "—",
    "Fecha Finalización": inc.fechaFinalDate || "—",
    "Hora Finalización": inc.fechaFinalTime || "—",
    "Conductor": inc.conductor || "—",
    "Doc. Conductor": inc.conductorDocumento || "—",
    "Tel. Conductor": inc.conductorTelefono || "—",
    "Prioridad": inc.prioridad || "—",
    "Estado": inc.estado || "Por revisar",
    "Tipo de Novedad": inc.tipo || "—",
    "Cliente": inc.clienteNombre || "—",
    "Doc. Cliente": inc.clienteDocumento || "—",
    "Tel. Cliente": inc.clienteTelefono || "—",
    "Origen del Servicio": inc.origenServicio || inc.solicitud?.origen || "—",
    "Destino del Servicio": inc.destinoServicio || inc.solicitud?.destino || "—",
    "Dirección / Ubicación": inc.ubicacionTexto || inc.ubicacion?.direccion || "—",
    "Descripción del Incidente": inc.descripcion || "—",
    "Notas del Administrador":
      inc.observaciones || inc.adminNotes || inc.notasResolucion || inc.notasSolucion || "—",
  }));

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const centeredKeys = new Set([
    "#",
    "Novedad",
    "Fecha Inicial",
    "Hora Inicial",
    "Fecha Finalización",
    "Hora Finalización",
    "Doc. Conductor",
    "Tel. Conductor",
    "Prioridad",
    "Estado",
    "Doc. Cliente",
    "Tel. Cliente",
  ]);

  const blob = buildStyledXlsxBlob({
    sheetName: "Novedades",
    title: "Mi conductor",
    subtitle: "Reporte de Novedades",
    rows,
    centeredKeys,
  });

  triggerDownload(blob, `Novedades_MiConductor_${dateStr}.xlsx`);
}
