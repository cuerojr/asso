// usePdfDownload.jsx
// Hook React para generar y descargar PDFs en el browser con pdfmake
//
// Instalar: npm install pdfmake
// ─────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";

// Carga pdfmake lazy para no inflar el bundle inicial
async function loadPdfMake() {
  const [pdfMakeModule, fontsModule] = await Promise.all([
    import("pdfmake/build/pdfmake"),
    import("pdfmake/build/vfs_fonts"),
  ]);
  const pdfMake = pdfMakeModule.default;

  const { default: _ignore, ...fontFiles } = fontsModule;
  Object.entries(fontFiles).forEach(([name, data]) => {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    pdfMake.virtualfs.writeFileSync(name, bytes);
  });

  pdfMake.fonts = {
    Roboto: {
      normal:      "Roboto-Regular.ttf",
      bold:        "Roboto-Medium.ttf",
      italics:     "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  };

  return pdfMake;
}

// ─────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────

const COLORS = {
  primary:      "#244b80",
  primaryLight: "#c7d2fe",
  headerBg:     "#244b80",
  sectionBg:    "#ede9fe",
  equipoBg:     "#f5f3ff",
  rowEven:      "#f8fafc",
  rowOdd:       "#ffffff",
  border:       "#e2e8f0",
  text:         "#0f172a",
  textMuted:    "#64748b",
  white:        "#ffffff",
  sinControl:   "#e2e8f0",
};

const MESES = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// ─────────────────────────────────────────────────────────────────────
// Helpers generales
// ─────────────────────────────────────────────────────────────────────

function mesLabel(mes) {
  return MESES[parseInt(mes, 10)] ?? mes;
}

function formatFecha(fechaStr) {
  if (!fechaStr) return "—";
  const d = new Date(fechaStr);
  if (isNaN(d)) return fechaStr;
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Elimina tags HTML y devuelve texto plano */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Convierte color hex a rgb [r, g, b] en rango 0-255 */
function hexToRgb(hex) {
  const clean = (hex ?? "#cccccc").replace("#", "");
  const val = parseInt(clean.padEnd(6, "0"), 16);
  return [(val >> 16) & 255, (val >> 8) & 255, val & 255];
}

/** Claridad perceptual para decidir si el texto encima es negro o blanco */
function luminance([r, g, b]) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function textColorForBg(hex) {
  return luminance(hexToRgb(hex)) > 0.55 ? COLORS.text : COLORS.white;
}

// ─────────────────────────────────────────────────────────────────────
// Helpers de celdas
// ─────────────────────────────────────────────────────────────────────

function headerCell(text, opts = {}) {
  return {
    text: text ?? "",
    fontSize: 7.5,
    bold: true,
    color: COLORS.white,
    fillColor: COLORS.primary,
    alignment: "center",
    margin: [4, 5, 4, 5],
    ...opts,
  };
}

function cell(text, opts = {}) {
  return {
    text: text ?? "—",
    fontSize: 8,
    color: COLORS.text,
    alignment: "left",
    margin: [4, 5, 4, 5],
    ...opts,
  };
}

function colorCell(text, bgColor, opts = {}) {
  const bg = bgColor ?? COLORS.sinControl;
  return {
    text: text ?? "—",
    fontSize: 7.5,
    bold: !!bgColor,
    color: bgColor ? textColorForBg(bg) : COLORS.textMuted,
    fillColor: bg,
    alignment: "center",
    margin: [4, 5, 4, 5],
    ...opts,
  };
}

function sectionTitle(text, { pageBreak = false } = {}) {
  return {
    stack: [
      {
        canvas: [{ type: "rect", x: 0, y: 0, w: 515, h: 26, color: COLORS.headerBg }],
      },
      {
        text: text,
        fontSize: 12,
        bold: true,
        color: COLORS.white,
        margin: [8, -20, 0, 6],
      },
    ],
    margin: [0, 12, 0, 8],
    ...(pageBreak ? { pageBreak: "before" } : {}),
  };
}

function subsectionTitle(text) {
  return {
    text: text,
    fontSize: 10,
    bold: true,
    color: COLORS.primary,
    margin: [0, 10, 0, 4],
    decoration: "underline",
  };
}

function divider() {
  return {
    canvas: [{ type: "line", x1: 0, y1: 4, x2: 515, y2: 4, lineWidth: 0.5, lineColor: COLORS.border }],
    margin: [0, 6, 0, 6],
  };
}

// ─────────────────────────────────────────────────────────────────────
// Sección 1: INTRODUCCIÓN (HTML → texto plano estructurado)
// ─────────────────────────────────────────────────────────────────────

function buildIntroduccion(html) {
  if (!html) return [];

  const texto = stripHtml(html);
  const lineas = texto.split("\n").filter((l) => l.trim());

  const paragraphs = lineas.map((linea) => {
    const isTitle = /^[A-Z\s:]{6,}$/.test(linea.trim());
    return {
      text: linea.trim(),
      fontSize: isTitle ? 10 : 9,
      bold: isTitle,
      color: isTitle ? COLORS.primary : COLORS.text,
      margin: [0, isTitle ? 6 : 2, 0, isTitle ? 2 : 1],
    };
  });

  return [sectionTitle("INTRODUCCIÓN"), ...paragraphs, divider()];
}

// ─────────────────────────────────────────────────────────────────────
// Sección 2: INFORME — equipos por mes con componentes
// ─────────────────────────────────────────────────────────────────────

function buildComponentesTable(componentes) {
  const headers = ["Componente", "Fecha", "Estado", "Observaciones", "Recomendaciones", "Fallas"].map((h) =>
    headerCell(h)
  );

  const rows = (componentes ?? []).map((comp, i) => {
    const bg = i % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd;
    const fallas = comp.fallas?.length ? comp.fallas.map((f) => f.falla).join(", ") : "—";
    return [
      cell(comp.nombre, { fillColor: bg }),
      cell(formatFecha(comp.fecha), { fillColor: bg, alignment: "center" }),
      colorCell(comp.estado ?? "Sin control", comp.color),
      cell(comp.observaciones || "—", { fillColor: bg }),
      cell(comp.recomendaciones || "—", { fillColor: bg }),
      cell(fallas, { fillColor: bg }),
    ];
  });

  return {
    table: {
      headerRows: 1,
      widths: [70, 58, 62, "*", "*", 70],
      body: [headers, ...rows],
    },
    layout: {
      hLineWidth: (i) => (i <= 1 ? 0 : 0.5),
      vLineWidth: () => 0,
      hLineColor: () => COLORS.border,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 0,
    },
    margin: [0, 0, 0, 8],
  };
}

function buildEquipoBlock(equipo) {
  const sinControl = !equipo.eq_fecha_control;

  return [
    {
      columns: [
        {
          stack: [
            {
              text: equipo.nombre_equipo,
              fontSize: 9,
              bold: true,
              color: COLORS.primary,
            },
            {
              text: equipo.nombre_seccion ?? "",
              fontSize: 7.5,
              color: COLORS.textMuted,
            },
          ],
          margin: [8, 6, 0, 6],
          width: "*",
        },
        {
          stack: [
            colorCell(
              sinControl ? "Sin control" : (equipo.eq_estado ?? "—"),
              sinControl ? null : equipo.eq_color_estado,
              { fontSize: 8, margin: [6, 4, 6, 2] }
            ),
            sinControl
              ? {}
              : {
                  text: `Controlado: ${formatFecha(equipo.eq_fecha_control)}`,
                  fontSize: 7,
                  color: COLORS.textMuted,
                  alignment: "right",
                  margin: [0, 0, 8, 4],
                },
          ],
          width: "auto",
        },
      ],
      fillColor: COLORS.equipoBg,
      margin: [0, 4, 0, 2],
    },
    buildComponentesTable(equipo.componentes ?? []),
  ];
}

function buildInforme(detalleInforme) {
  if (!detalleInforme?.length) return [];

  const content = [sectionTitle("INFORME DE EQUIPOS", { pageBreak: false })];

  detalleInforme.forEach((mesData) => {
    content.push({
      text: `${mesLabel(mesData.mes)} ${mesData.anio}`,
      fontSize: 10,
      bold: true,
      color: COLORS.white,
      fillColor: COLORS.headerBg,
      margin: [8, 6, 8, 6],
    });

    (mesData.equipos ?? []).forEach((equipo) => {
      buildEquipoBlock(equipo).forEach((block) => content.push(block));
    });

    content.push(divider());
  });

  return content;
}

// ─────────────────────────────────────────────────────────────────────
// Sección 3: RESUMEN DE ESTADOS
// Incluye: tabla detalle_equipos, tabla detalle_estados,
//          gráfico de barras apiladas (canvas pdfmake), líneas (canvas)
// ─────────────────────────────────────────────────────────────────────

/**
 * Gráfico de barras verticales simples usando canvas de pdfmake.
 * datasets: [{ label, data: number[], backgroundColor }]
 * labels: string[]
 */
function buildBarChart(labels, datasets, { title = "", width = 515, height = 160, barGroupWidth = 40 } = {}) {
  if (!labels?.length || !datasets?.length) return [];

  const maxVal = Math.max(...datasets.flatMap((d) => d.data), 1);
  const leftPad = 30;
  const topPad = 20;
  const bottomPad = 30;
  const chartH = height - topPad - bottomPad;
  const chartW = width - leftPad - 10;
  const groupCount = labels.length;
  const dsCount = datasets.length;
  const groupSpacing = chartW / groupCount;
  const totalBarW = Math.min(barGroupWidth, groupSpacing * 0.8);
  const singleBarW = totalBarW / dsCount;

  const canvasItems = [];

  // Eje Y — líneas de guía
  [0, 0.25, 0.5, 0.75, 1].forEach((frac) => {
    const y = topPad + chartH * (1 - frac);
    canvasItems.push({
      type: "line", x1: leftPad, y1: y, x2: leftPad + chartW, y2: y,
      lineWidth: 0.4, lineColor: "#e2e8f0", dash: { length: 3 },
    });
    canvasItems.push({
      type: "rect", x: 0, y: y - 5, w: leftPad - 2, h: 10,
      color: "#ffffff", lineColor: "#ffffff",
    });
  });

  // Barras
  datasets.forEach((ds, dsIdx) => {
    (ds.data ?? []).forEach((val, gIdx) => {
      if (!val) return;
      const barH = (val / maxVal) * chartH;
      const x = leftPad + gIdx * groupSpacing + (groupSpacing - totalBarW) / 2 + dsIdx * singleBarW;
      const y = topPad + chartH - barH;
      canvasItems.push({
        type: "rect", x, y, w: Math.max(singleBarW - 1, 2), h: barH,
        color: ds.backgroundColor ?? COLORS.primary, r: 2,
      });
    });
  });

  // Eje X
  canvasItems.push({
    type: "line", x1: leftPad, y1: topPad + chartH, x2: leftPad + chartW, y2: topPad + chartH,
    lineWidth: 1, lineColor: COLORS.textMuted,
  });

  const canvasEl = { canvas: canvasItems, margin: [0, 4, 0, 4] };

  // Etiquetas eje X (texto pdfmake aparte)
  const labelRow = {
    columns: labels.map((lbl) => ({
      text: lbl.replace(" 2025", "").replace(" 2026", ""),
      fontSize: 6.5,
      color: COLORS.textMuted,
      alignment: "center",
      width: groupSpacing,
    })),
    margin: [leftPad, -8, 0, 2],
  };

  // Leyenda
  const legend = {
    columns: datasets.map((ds) => ({
      columns: [
        { canvas: [{ type: "rect", x: 0, y: 2, w: 10, h: 10, color: ds.backgroundColor ?? "#999", r: 2 }], width: 14 },
        { text: ds.label ?? "", fontSize: 7, color: COLORS.text, width: "*" },
      ],
      width: "auto",
      margin: [0, 0, 12, 0],
    })),
    margin: [leftPad, 4, 0, 6],
  };

  const result = [];
  if (title) result.push(subsectionTitle(title));
  result.push(canvasEl, labelRow, legend);
  return result;
}

/**
 * Gráfico de líneas usando canvas de pdfmake.
 */
function buildLineChart(labels, datasets, { title = "", width = 515, height = 130 } = {}) {
  if (!labels?.length || !datasets?.length) return [];

  // Filtrar datasets vacíos
  const activeDs = datasets.filter((ds) => ds.data?.some((v) => v > 0));
  if (!activeDs.length) return [];

  const maxVal = Math.max(...activeDs.flatMap((d) => d.data), 1);
  const leftPad = 30;
  const topPad = 14;
  const bottomPad = 24;
  const chartH = height - topPad - bottomPad;
  const chartW = width - leftPad - 10;
  const step = chartW / (labels.length - 1 || 1);

  const canvasItems = [];

  // Líneas de guía
  [0, 0.5, 1].forEach((frac) => {
    const y = topPad + chartH * (1 - frac);
    canvasItems.push({
      type: "line", x1: leftPad, y1: y, x2: leftPad + chartW, y2: y,
      lineWidth: 0.4, lineColor: "#e2e8f0",
    });
  });

  // Dibujar líneas
  activeDs.forEach((ds) => {
    const points = (ds.data ?? []).map((val, i) => ({
      x: leftPad + i * step,
      y: topPad + chartH - (val / maxVal) * chartH,
    }));

    for (let i = 0; i < points.length - 1; i++) {
      canvasItems.push({
        type: "line",
        x1: points[i].x, y1: points[i].y,
        x2: points[i + 1].x, y2: points[i + 1].y,
        lineWidth: 2,
        lineColor: ds.borderColor ?? ds.backgroundColor ?? COLORS.primary,
      });
    }

    // Puntos
    points.forEach((p, i) => {
      if ((ds.data ?? [])[i] > 0) {
        canvasItems.push({
          type: "ellipse", x: p.x, y: p.y, r1: 3, r2: 3,
          color: ds.borderColor ?? ds.backgroundColor ?? COLORS.primary,
        });
      }
    });
  });

  // Eje X
  canvasItems.push({
    type: "line", x1: leftPad, y1: topPad + chartH, x2: leftPad + chartW, y2: topPad + chartH,
    lineWidth: 1, lineColor: COLORS.textMuted,
  });

  const canvasEl = { canvas: canvasItems, margin: [0, 4, 0, 2] };

  const labelRow = {
    columns: labels.map((lbl) => ({
      text: lbl.replace(" 2025", "").replace(" 2026", ""),
      fontSize: 6.5,
      color: COLORS.textMuted,
      alignment: "center",
      width: step,
    })),
    margin: [leftPad, -4, 0, 2],
  };

  const legend = {
    columns: activeDs.map((ds) => ({
      columns: [
        {
          canvas: [{ type: "line", x1: 0, y1: 5, x2: 14, y2: 5, lineWidth: 2, lineColor: ds.borderColor ?? "#999" }],
          width: 18,
        },
        { text: ds.label ?? "", fontSize: 7, color: COLORS.text, width: "*" },
      ],
      width: "auto",
      margin: [0, 0, 12, 0],
    })),
    margin: [leftPad, 2, 0, 6],
  };

  const result = [];
  if (title) result.push(subsectionTitle(title));
  result.push(canvasEl, labelRow, legend);
  return result;
}

/**
 * Tabla de detalle de equipos (matriz de sección/equipo/mes+color)
 * Formato: array de columnas: [["SECCIÓN", ...], ["EQUIPOS", ...], ["MES", color1, color2...]]
 */
function buildDetalleEquiposTable(detalleEquipos) {
  if (!detalleEquipos?.length) return [];

  // detalleEquipos es column-major: cada sub-array es una columna
  // Necesitamos transponer a row-major para pdfmake
  const cols = detalleEquipos;
  const numRows = cols[0]?.length ?? 0;

  const tableBody = [];
  for (let row = 0; row < numRows; row++) {
    const isHeader = row <= 1;
    const tableRow = cols.map((col, colIdx) => {
      const val = col[row];
      if (isHeader) {
        return headerCell(val ?? "", { fillColor: row === 0 ? COLORS.headerBg : COLORS.primary });
      }
      // Para filas de mes, val puede ser un color hex o ""
      const isColor = typeof val === "string" && val.startsWith("#");
      if (isColor) {
        return colorCell("", val);
      }
      return cell(val ?? "—", {
        fillColor: colIdx % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd,
        alignment: colIdx === 0 ? "left" : "center",
      });
    });
    tableBody.push(tableRow);
  }

  return [
    subsectionTitle("Detalle por equipo"),
    {
      table: {
        headerRows: Math.min(2, tableBody.length),
        widths: [60, ...Array(cols.length - 1).fill("*")],
        body: tableBody,
      },
      layout: {
        hLineWidth: (i) => (i <= 2 ? 0 : 0.5),
        vLineWidth: () => 0.5,
        hLineColor: () => COLORS.border,
        vLineColor: () => COLORS.border,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 0, 10],
    },
  ];
}

/**
 * Tabla de detalle de estados (filas: mes/estado, cols: tipos de estado)
 * Cada objeto: { "0": "AGO2025", "18": "3<br>100%", ... }
 */
function buildDetalleEstadosTable(detalleEstados) {
  if (!detalleEstados?.length) return [];

  const colorRow = detalleEstados[0];   // { "0": "row_background_color", ... }
  const labelRow = detalleEstados[1];   // { "0": "ESTADO", ... }
  const dataRows  = detalleEstados.slice(2);

  const keys = Object.keys(labelRow).filter((k) => k !== "0");

  // Cabecera
  const headerRow = [
    headerCell("MES"),
    ...keys.map((k) =>
      colorCell(labelRow[k], colorRow[k] ?? COLORS.primary, {
        fontSize: 7.5, bold: true,
      })
    ),
  ];

  const bodyRows = dataRows.map((row, i) => {
    const bg = i % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd;
    return [
      cell(row["0"], { fillColor: bg, bold: true }),
      ...keys.map((k) => {
        const raw = row[k] ?? "—";
        const text = String(raw).replace("<br>", "\n").replace("%", " %");
        return cell(text, { fillColor: bg, alignment: "center" });
      }),
    ];
  });

  return [
    subsectionTitle("Detalle de estados por período"),
    {
      table: {
        headerRows: 1,
        widths: [55, ...Array(keys.length).fill("*")],
        body: [headerRow, ...bodyRows],
      },
      layout: {
        hLineWidth: (i) => (i <= 1 ? 0 : 0.5),
        vLineWidth: () => 0.5,
        hLineColor: () => COLORS.border,
        vLineColor: () => COLORS.border,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 0, 10],
    },
  ];
}

function buildResumenEstados(resumenRes) {
  if (!resumenRes) return [];

  const content = [sectionTitle("RESUMEN DE ESTADOS", { pageBreak: true })];

  // Gráfico barras: controlados vs no controlados por mes
  const barData = resumenRes.totales_periodo_barras;
  if (barData?.labels?.length) {
    content.push(...buildBarChart(barData.labels, barData.datasets, {
      title: "Equipos controlados vs no controlados",
    }));
  }

  // Gráfico líneas: estados a lo largo del período
  const lineData = resumenRes.totales_periodo_lineas;
  if (lineData?.labels?.length) {
    content.push(...buildLineChart(lineData.labels, lineData.datasets, {
      title: "Evolución de estados",
    }));
  }

  // Tabla detalle_equipos
  if (resumenRes.detalle_equipos?.length) {
    content.push(...buildDetalleEquiposTable(resumenRes.detalle_equipos));
  }

  // Tabla detalle_estados
  if (resumenRes.detalle_estados?.length) {
    content.push(...buildDetalleEstadosTable(resumenRes.detalle_estados));
  }

  content.push(divider());
  return content;
}

// ─────────────────────────────────────────────────────────────────────
// Sección 4: FALLAS
// ─────────────────────────────────────────────────────────────────────

/**
 * Tabla resumen_fallas
 * Formato: [{ "0": "row_background_color", "28": "#b80000" }, { "0": "TIPO...", "28": "falla1" }, ...filas de meses]
 */
function buildResumenFallasTable(resumenFallas) {
  if (!resumenFallas?.length) return [];

  const colorRow = resumenFallas[0];
  const labelRow = resumenFallas[1];
  const dataRows  = resumenFallas.slice(2);

  const keys = Object.keys(labelRow).filter((k) => k !== "0");

  const headerRow = [
    headerCell("MES"),
    ...keys.map((k) =>
      colorCell(labelRow[k], colorRow[k] ?? COLORS.primary, {
        fontSize: 7.5, bold: true,
      })
    ),
  ];

  const bodyRows = dataRows.map((row, i) => {
    const bg = i % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd;
    return [
      cell(row["0"], { fillColor: bg, bold: true }),
      ...keys.map((k) => cell(String(row[k] ?? "0"), { fillColor: bg, alignment: "center" })),
    ];
  });

  return [
    subsectionTitle("Resumen de fallas por período"),
    {
      table: {
        headerRows: 1,
        widths: [55, ...Array(keys.length).fill("*")],
        body: [headerRow, ...bodyRows],
      },
      layout: {
        hLineWidth: (i) => (i <= 1 ? 0 : 0.5),
        vLineWidth: () => 0.5,
        hLineColor: () => COLORS.border,
        vLineColor: () => COLORS.border,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 0, 10],
    },
  ];
}

function buildFallas(fallasRes) {
  if (!fallasRes) return [];

  const content = [sectionTitle("FALLAS", { pageBreak: true })];

  // Gráfico de líneas de fallas
  const lineData = fallasRes.totales_periodo_lineas;
  if (lineData?.labels?.length) {
    content.push(...buildLineChart(lineData.labels, lineData.datasets, {
      title: "Evolución de fallas en el período",
    }));
  }

  // Gráficos de barras por mes (barras_fallas)
  if (fallasRes.barras_fallas?.length) {
    // Mostrar los meses que tengan al menos un dato
    const mesesConDatos = fallasRes.barras_fallas.filter((mesChart) => {
      const vals = Object.values(mesChart.datasets?.data ?? {});
      return vals.some((v) => v > 0);
    });

    if (mesesConDatos.length) {
      content.push(subsectionTitle("Fallas por mes"));

      // Mostrar hasta 2 por fila usando columns
      for (let i = 0; i < mesesConDatos.length; i += 2) {
        const pair = mesesConDatos.slice(i, i + 2);
        content.push({
          columns: pair.map((mesChart) => {
            const ds = [{
              label: "",
              data: Object.values(mesChart.datasets?.data ?? {}),
              backgroundColor: mesChart.datasets?.backgroundColor ?? [],
            }];
            // Normalizar para que backgroundColor sea por barra
            const flatDs = mesChart.labels.map((lbl, idx) => ({
              label: lbl,
              data: mesChart.labels.map((_, j) => j === idx ? (Object.values(mesChart.datasets?.data ?? {})[idx] ?? 0) : 0),
              backgroundColor: (mesChart.datasets?.backgroundColor ?? [])[idx] ?? COLORS.primary,
            }));

            // Simplificado: un dataset por tipo de falla
            return {
              stack: [
                { text: mesChart.titulo, fontSize: 8, bold: true, color: COLORS.primary, margin: [0, 4, 0, 2] },
                ...buildBarChart(mesChart.labels, flatDs, { width: 240, height: 110, barGroupWidth: 20 }),
              ],
              width: "50%",
            };
          }),
          margin: [0, 0, 0, 8],
          columnGap: 10,
        });
      }
    }
  }

  // Tabla resumen de fallas
  if (fallasRes.resumen_fallas?.length) {
    content.push(...buildResumenFallasTable(fallasRes.resumen_fallas));
  }

  content.push(divider());
  return content;
}

// ─────────────────────────────────────────────────────────────────────
// HOOK: usePdfDownload
// ─────────────────────────────────────────────────────────────────────
//
// download({
//   filename : "reporte",
//   title    : "Reporte de vibraciones",
//   subtitle : "Agosto – Noviembre 2025",
//   data     : {
//     intro,            // string HTML opcional
//     detalle_informe,  // array de meses con equipos
//     resumenRes,       // objeto con gráficos y tablas de estados
//     fallasRes,        // objeto con gráficos y tablas de fallas
//     // + campos planos: titulo, control, desde, hasta, equipos, secciones
//   },
// });

// ─────────────────────────────────────────────────────────────────────
// Helper: convierte una URL de imagen a dataURL base64 via canvas
// Retorna null si falla (CORS, formato inválido, etc.)
// ─────────────────────────────────────────────────────────────────────
export async function imageUrlToBase64(url) {
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          // Validar que sea un dataURL real
          if (!dataUrl || dataUrl === "data:," || !dataUrl.startsWith("data:image")) {
            reject(new Error("Canvas devolvió dataURL inválido"));
          } else {
            resolve(dataUrl);
          }
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error("No se pudo cargar la imagen: " + url));
      // Forzar recarga limpia para evitar caché sin CORS headers
      img.src = url + (url.includes("?") ? "&" : "?") + "_t=" + Date.now();
    });
  } catch (err) {
    console.warn("[imageUrlToBase64] Falló, el PDF se generará sin logo:", err.message);
    return null;
  }
}

export function usePdfDownload() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const download = useCallback(async (config = {}) => {
    const {
      filename = "reporte",
      title,
      subtitle = "",
      logoBase64 = null,
      data = {},
    } = config;

    if (!data || !data.detalle_informe?.length) {
      setError("No hay datos para exportar.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const pdfMake = await loadPdfMake();

      // Validar que logoBase64 sea un dataURL real antes de pasarlo a pdfmake
      const safeLogo = (logoBase64 && logoBase64.startsWith("data:image")) ? logoBase64 : null;

      const reportTitle  = title ?? data.titulo ?? "Reporte";
      const reportSubtitle = subtitle ||
        [data.control, data.desde && data.hasta ? `${data.desde} – ${data.hasta}` : ""]
          .filter(Boolean)
          .join("  ·  ");
      const totalEquipos   = data.equipos ?? "—";
      const totalSecciones = data.secciones ?? "—";
      const dateStr = new Date().toLocaleDateString("es-AR", {
        day: "2-digit", month: "long", year: "numeric",
      });

      // ── Armar contenido en orden ─────────────────────────────────
      // Cada sección fuerza página nueva con pageBreak en su primer elemento.
      // El informe además arranca cada mes en página nueva.

      const content = [
        // Espacio inicial (debajo del header fijo)
        { text: "", margin: [0, 4] },

        // Pág 1: Introducción
        ...buildIntroduccion(data.intro),

        // Pág 2: Resumen de estados
        ...buildResumenEstados(data.resumenRes),

        // Pág 3: Fallas
        ...buildFallas(data.fallasRes),

        // Pág 4+: Informe mes a mes
        ...buildInforme(data.detalle_informe),
      ];

      const docDef = {
        pageSize:    "A4",
        pageMargins: [40, 75, 40, 50],
        defaultStyle: { font: "Roboto" },

        // ── Header ─────────────────────────────────────────────────
        header: () => ({
          stack: [
            {
              canvas: [{ type: "rect", x: 0, y: 0, w: 595, h: 64, color: COLORS.primary }],
              absolutePosition: { x: 0, y: 0 },
            },
            {
              columns: [
                // Columna izquierda: logo (si existe) + título
                {
                  stack: [
                    {
                      text: reportTitle,
                      fontSize: 14,
                      bold: true,
                      color: COLORS.white,
                      margin: [0, 0, 0, 2],
                    },
                    {
                      text: reportSubtitle || dateStr,
                      fontSize: 7.5,
                      color: COLORS.primaryLight,
                    },
                  ],
                  margin: [40, 14, 0, 0],
                  width: "*",
                },
                // Columna derecha: logo + equipos/secciones
                {
                  stack: [
                    ...(safeLogo
                      ? [{
                          image: safeLogo,
                          height: 28,
                          fit: [90, 28],
                          alignment: "right",
                          margin: [0, 0, 0, 2],
                        }]
                      : []),
                    {
                      text: `${totalEquipos} equipos · ${totalSecciones} sección/es`,
                      fontSize: 7.5,
                      color: COLORS.primaryLight,
                      alignment: "right",
                    },
                  ],
                  margin: [0, 12, 40, 0],
                  width: "auto",
                },
              ],
            },
          ],
        }),

        // ── Footer ─────────────────────────────────────────────────
        footer: (currentPage, pageCount) => ({
          stack: [
            {
              canvas: [{ type: "rect", x: 0, y: 0, w: 595, h: 30, color: COLORS.primary }],
              absolutePosition: { x: 0, y: 0 },
            },
            {
              columns: [
                {
                  text: `Generado el ${dateStr}`,
                  fontSize: 7,
                  color: COLORS.primaryLight,
                  margin: [40, 8, 0, 0],
                },
                {
                  text: `Página ${currentPage} de ${pageCount}`,
                  fontSize: 7,
                  color: COLORS.primaryLight,
                  alignment: "right",
                  margin: [0, 8, 40, 0],
                },
              ],
            },
          ],
        }),

        content,
      };

      pdfMake
        .createPdf(docDef)
        .download(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);

    } catch (err) {
      console.error("[usePdfDownload]", err);
      setError(err.message ?? "Error al generar el PDF");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { download, isGenerating, error };
}