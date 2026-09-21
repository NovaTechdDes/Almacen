import * as FileSystemLegacy from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getProductosAgrupadosPorRubro, RubroConProductos } from '../actions/producto.actions';
import { Producto } from '../interface';
import { mensaje } from './mensaje';

/**
 * Convierte un URI de archivo local (file://) a data URI en base64
 */
const convertirImagenABase64 = async (uri: string): Promise<string | null> => {
  if (!uri) return null;
  // Si ya es una URL web o un data:image existente
  if (uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('data:')) {
    return uri;
  }

  try {
    const ext = uri.split('.').pop()?.toLowerCase() || 'jpeg';
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    const base64 = await FileSystemLegacy.readAsStringAsync(uri, {
      encoding: FileSystemLegacy.EncodingType.Base64,
    });
    return `data:${mime};base64,${base64}`;
  } catch (error) {
    console.warn('No se pudo convertir imagen a base64:', uri, error);
    return null;
  }
};

/**
 * Genera la plantilla HTML para el catálogo de productos optimizada para tamaño A4 e impresión
 */
export const generarHtmlCatalogo = async (rubros: RubroConProductos[]): Promise<string> => {
  const fechaActual = new Date().toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalProductos = rubros.reduce((acc, curr) => acc + curr.productos.length, 0);

  // Procesar rubros y convertir imágenes de cada producto de forma asíncrona
  const rubrosHtmlArray = await Promise.all(
    rubros.map(async (grupo) => {
      const filasArray = await Promise.all(
        grupo.productos.map(async (p: Producto) => {
          // Precios mayoristas en formato legible
          const mayoristas =
            p.precios_mayoristas && p.precios_mayoristas.length > 0
              ? p.precios_mayoristas.map((m) => `<span class="badge-mayorista">≥${m.cant_mayorista}u: $${Number(m.precio_mayorista).toFixed(2)}</span>`).join(' ')
              : '<span class="text-muted">-</span>';

          // Convertir a base64 para que el motor de renderizado del PDF lo dibuje sin restricciones
          const base64Img = p.imagen_local ? await convertirImagenABase64(p.imagen_local) : null;
          const imagenHtml = base64Img
            ? `<img src="${base64Img}" class="prod-img" alt="" />`
            : `<div class="prod-img-placeholder">-</div>`;

          return `
            <tr>
              <td class="col-img">${imagenHtml}</td>
              <td class="col-codigo">${p.codigo || '-'}</td>
              <td class="col-desc">${p.descripcion}</td>
              <td class="col-mayoristas">${mayoristas}</td>
            </tr>
          `;
        })
      );

      const filasProductos = filasArray.join('');

      return `
        <div class="rubro-section">
          <div class="rubro-header">
            <h2>${grupo.nom_rubro.toUpperCase()}</h2>
            <span class="rubro-count">${grupo.productos.length} prod.</span>
          </div>
          <table>
            <thead>
              <tr>
                <th class="col-img">Img</th>
                <th class="col-codigo">Código</th>
                <th class="col-desc">Descripción</th>
                <th class="col-mayoristas">Precios Mayoristas</th>
              </tr>
            </thead>
            <tbody>
              ${filasProductos}
            </tbody>
          </table>
        </div>
      `;
    })
  );

  const rubrosHtml = rubrosHtmlArray.join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Catálogo de Productos</title>
        <style>
          @page {
            size: A4;
            margin: 12mm 10mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.3;
          }
          .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 8px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            color: #0f172a;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .header .subtitle {
            color: #64748b;
            font-size: 11px;
            margin-top: 3px;
          }
          .header-meta {
            text-align: right;
            font-size: 10px;
            color: #475569;
          }
          .header-meta strong {
            color: #0f172a;
          }
          .rubro-section {
            margin-bottom: 18px;
            page-break-inside: auto;
          }
          .rubro-header {
            background-color: #f1f5f9;
            border-left: 4px solid #2563eb;
            padding: 6px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 3px;
            margin-bottom: 6px;
            page-break-after: avoid;
          }
          .rubro-header h2 {
            margin: 0;
            font-size: 12px;
            font-weight: 700;
            color: #1e293b;
          }
          .rubro-count {
            font-size: 10px;
            color: #64748b;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          thead {
            display: table-header-group;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 700;
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #cbd5e1;
            padding: 5px 6px;
            text-align: left;
          }
          td {
            padding: 5px 6px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 10px;
            vertical-align: middle;
          }
          tr:nth-child(even) {
            background-color: #fafafa;
          }
          .col-img {
            width: 38px;
            text-align: center;
            padding: 3px 4px;
          }
          .prod-img {
            width: 32px;
            height: 32px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
            display: block;
            margin: 0 auto;
          }
          .prod-img-placeholder {
            width: 32px;
            height: 32px;
            border-radius: 4px;
            background-color: #f1f5f9;
            color: #94a3b8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            margin: 0 auto;
          }
          .col-codigo {
            width: 14%;
            font-family: monospace;
            font-weight: 600;
            color: #334155;
          }
          .col-desc {
            width: 48%;
            font-weight: 500;
            color: #0f172a;
          }
          .col-mayoristas {
            width: 38%;
          }
          .text-center {
            text-align: center;
          }
          .text-right {
            text-align: right;
          }
          .text-muted {
            color: #94a3b8;
          }
          .badge-mayorista {
            display: inline-block;
            background-color: #ecfdf5;
            color: #059669;
            border: 1px solid #a7f3d0;
            border-radius: 3px;
            padding: 1px 4px;
            font-size: 8.5px;
            font-weight: 600;
            margin: 1px 2px 1px 0;
            white-space: nowrap;
          }
          .footer {
            margin-top: 24px;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            font-size: 9px;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Catálogo de Productos</h1>
            <div class="subtitle">Lista general agrupada por rubros y categorías</div>
          </div>
          <div class="header-meta">
            <div>Fecha: <strong>${fechaActual}</strong></div>
            <div>Total: <strong>${totalProductos} productos</strong> en <strong>${rubros.length} rubros</strong></div>
          </div>
        </div>

        ${rubrosHtml}

        <div class="footer">
          Documento generado automáticamente desde Almacén Móvil
        </div>
      </body>
    </html>
  `;
};

/**
 * Consulta la base de datos, compila el PDF y abre la ventana nativa de compartir
 */
export const exportarCatalogoPdf = async (): Promise<boolean> => {
  try {
    const rubros = await getProductosAgrupadosPorRubro();

    if (!rubros || rubros.length === 0) {
      mensaje('error', 'Sin productos', 'No se encontraron productos para generar el PDF');
      return false;
    }

    const html = await generarHtmlCatalogo(rubros);

    // Generar archivo PDF temporal en el dispositivo
    const { uri } = await Print.printToFileAsync({ html });

    // Compartir o abrir el archivo generado
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'Exportar Catálogo de Productos',
      });
      mensaje('success', 'PDF generado', 'Catálogo exportado exitosamente');
      return true;
    } else {
      mensaje('info', 'PDF generado', `Guardado en: ${uri}`);
      return true;
    }
  } catch (error) {
    console.error('Error al exportar PDF de productos:', error);
    mensaje('error', 'Error al exportar PDF', 'Ocurrió un fallo al crear el documento');
    return false;
  }
};
