import jsPDF from 'jspdf'

/**
 * Genera un documento de reservado para un análisis con números de Fiscalía Local e ISP
 * @param {Object} analysis - Análisis con información completa
 * @param {Array} reserveds - Array de números reservados (fiscal e ISP)
 */
export const generarReservadoPDF = (analysis, reserveds) => {
  if (!analysis) {
    console.error('No hay análisis para generar el documento')
    return
  }

  if (!reserveds || reserveds.length === 0) {
    console.error('No hay números reservados para generar el documento')
    return
  }

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20

  // Cargar y agregar logo
  const logo = new Image()
  logo.src = '/ssm/logo-ssm.png' // Ruta pública
  doc.addImage(logo, 'PNG', 15, 10, 25, 25)

  // Marca X en la esquina superior izquierda
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('X', 15, 45)

  // ENCABEZADO - RESERVADO
  doc.setFontSize(11)
  const reservedFiscal = reserveds.find((r) => r.fiscal)
  const reservedISP = reserveds.find((r) => r.isp)

  const reservedNumber = reservedFiscal
    ? reservedFiscal.number
    : reservedISP
      ? reservedISP.number
      : 'X'

  doc.text('RESERVADO.:', pageWidth - margin - 60, 35)
  doc.text('X', pageWidth - margin - 15, 35, { align: 'right' })
  doc.text('.-', pageWidth - margin - 5, 35, { align: 'right' })

  let yPos = 45

  // Información del acta
  const actaNumber = analysis.preAnalysis?.reception?.number || 'X'
  const policeData = analysis.preAnalysis?.reception?.police || {}
  const ord = analysis.preAnalysis?.reception?.of_number || 'X'
  const institutionData = policeData.institutionType || {}
  const commune = institutionData.commune?.name || 'COMUNA'
  const partNumber = analysis.preAnalysis?.reception?.part_number || 'Nº'

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  // Calcular posición para alinear a la derecha (cuadro ANT)
  const rightBoxX = pageWidth - margin - 80

  doc.text('ANT.:', rightBoxX, yPos)
  doc.text(`Acta de Recepción Nº`, rightBoxX + 10, yPos)
  doc.text(actaNumber.toString(), pageWidth - margin - 15, yPos, { align: 'right' })
  doc.text(`/20XX`, pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 6
  doc.text('Ordinario Nº', rightBoxX + 10, yPos)
  doc.text(ord.toString(), pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 6
  doc.text('UNIDAD POLICIAL', rightBoxX + 10, yPos)
  doc.text(commune, pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 6
  doc.text('Parte / Inf. Policial', rightBoxX + 10, yPos)
  doc.text(partNumber.toString(), pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 10
  doc.text('MAT.:', rightBoxX, yPos)
  doc.text('Informa resultado de análisis', rightBoxX + 10, yPos)

  yPos += 10
  const today = new Date()
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  const dateText = `DÍA-MES-AÑO`
  doc.text(`Punta Arenas,`, pageWidth - margin - 60, yPos)
  doc.text(dateText, pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 20

  // DE: / A:
  doc.setFont('helvetica', 'bold')
  doc.text('DE:', margin, yPos)
  doc.text('DIRECTOR SERVICIO SALUD MAGALLANES', margin + 15, yPos)

  yPos += 8
  doc.text('A:', margin, yPos)
  doc.text('DEPARTAMENTO SALUD AMBIENTAL', margin + 15, yPos)

  yPos += 5
  doc.text('SUBDEPARTAMENTO DE SUSTANCIAS ILÍCITAS', margin + 15, yPos)

  yPos += 5
  doc.text('INSTITUTO SALUD PÚBLICA', margin + 15, yPos)

  yPos += 5
  doc.text('MARATON Nº 1000', margin + 15, yPos)

  yPos += 5
  doc.text('ÑUÑOA, SANTIAGO', margin + 15, yPos)

  yPos += 15

  // Párrafo principal
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const mainText = `De acuerdo a los antecedentes adjuntos, remito a Ud., para su análisis:`
  const mainLines = doc.splitTextToSize(mainText, pageWidth - margin * 2 - 20)
  doc.text(mainLines, margin + 15, yPos)
  yPos += mainLines.length * 6

  yPos += 10

  // MUESTRA N 1
  doc.setFont('helvetica', 'bold')
  doc.text('MUESTRA N 1', margin + 30, yPos)

  yPos += 8

  doc.setFont('helvetica', 'normal')
  doc.text('CANTIDAD NETA Y DESCRIPCIÓN MUESTRA', margin + 50, yPos)

  yPos += 10

  // Texto de solicitud
  const requestText = reservedFiscal
    ? 'Se solicita remitir resultado de análisis: FISCALÍA LOCAL'
    : 'Se solicita remitir resultado de análisis: FISCALÍA LOCAL'

  doc.text(requestText, margin + 30, yPos)

  yPos += 15

  // Saludo final
  doc.text('Saluda atentamente a usted,', margin + 20, yPos)

  // PIE DE PÁGINA - FIRMA
  yPos = pageHeight - 60
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('DIRECTOR', pageWidth / 2, yPos, { align: 'center' })
  yPos += 5
  doc.text('SERVICIO DE SALUD MAGALLANES', pageWidth / 2, yPos, { align: 'center' })

  yPos += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('DISTRIBUCIÓN.:', margin, yPos)
  yPos += 4
  doc.setFont('helvetica', 'bold')
  doc.text('DSSM', margin, yPos)

  // Línea decorativa azul y roja
  doc.setLineWidth(2)
  // Línea azul
  doc.setDrawColor(0, 0, 255)
  doc.line(margin, yPos + 2, margin + 10, yPos + 2)
  // Línea roja
  doc.setDrawColor(255, 0, 0)
  doc.line(margin + 10, yPos + 2, margin + 30, yPos + 2)

  // Footer final
  yPos = pageHeight - 10
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  const footerText =
    'Lautaro Navarro N° 525 - Casilla N° 527 - Fono 61 2294000 - E-mail: direccion.ssm@redsalud.gob.cl - PUNTA ARENAS'
  doc.text(footerText, pageWidth / 2, yPos, { align: 'center' })

  // Generar y descargar PDF
  const fileName = `Reservado_ISP_Acta_${actaNumber}_Analisis_${analysis.id}_${Date.now()}.pdf`
  doc.save(fileName)
}

/**
 * Genera un documento de reservado para Fiscalía Local
 * @param {Object} analysis - Análisis con información completa
 * @param {Array} reserveds - Array de números reservados (fiscal e ISP)
 */
export const generarReservadoFiscaliaPDF = (analysis, reserveds) => {
  if (!analysis) {
    console.error('No hay análisis para generar el documento')
    return
  }

  if (!reserveds || reserveds.length === 0) {
    console.error('No hay números reservados para generar el documento')
    return
  }

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20

  // Cargar y agregar logo
  const logo = new Image()
  logo.src = '/ssm/logo-ssm.png' // Ruta pública
  doc.addImage(logo, 'PNG', 15, 10, 25, 25)

  // Marca X en la esquina superior izquierda
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('X', 15, 45)

  // ENCABEZADO - RESERVADO
  doc.setFontSize(11)
  const reservedFiscal = reserveds.find((r) => r.fiscal)
  const reservedISP = reserveds.find((r) => r.isp)

  const reservedNumber = reservedFiscal ? reservedFiscal.number : 'X'

  doc.text('RESERVADO.:', pageWidth - margin - 60, 35)
  doc.text('X', pageWidth - margin - 15, 35, { align: 'right' })
  doc.text('.-', pageWidth - margin - 5, 35, { align: 'right' })

  let yPos = 45

  // Información del acta
  const actaNumber = analysis.preAnalysis?.reception?.number || 'X'
  const policeData = analysis.preAnalysis?.reception?.police || {}
  const ord = analysis.preAnalysis?.reception?.of_number || 'X'
  const institutionData = policeData.institutionType || {}
  const commune = institutionData.commune?.name || 'COMUNA'
  const partNumber = analysis.preAnalysis?.reception?.part_number || '0'

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  // Calcular posición para alinear a la derecha (cuadro ANT)
  const rightBoxX = pageWidth - margin - 80

  doc.text('ANT.:', rightBoxX, yPos)
  doc.text(`Acta de Recepción Nº`, rightBoxX + 10, yPos)
  doc.text(actaNumber.toString(), pageWidth - margin - 15, yPos, { align: 'right' })
  doc.text(`/20XX`, pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 6
  doc.text('Ordinario Nº', rightBoxX + 10, yPos)
  doc.text(ord.toString(), pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 6
  doc.text('UNIDAD POLICIAL', rightBoxX + 10, yPos)
  doc.text(commune, pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 6
  doc.text('Parte / Inf. Policial', rightBoxX + 10, yPos)
  doc.text(partNumber.toString(), pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 10
  doc.text('MAT.:', rightBoxX - 5, yPos)
  doc.text('Informa resultado de análisis', rightBoxX + 10, yPos)

  yPos += 10
  const dateText = `DÍA-MES-AÑO`
  doc.text(`Punta Arenas,`, pageWidth - margin - 60, yPos)
  doc.text(dateText, pageWidth - margin - 5, yPos, { align: 'right' })

  yPos += 20

  // DE: / A:
  doc.setFont('helvetica', 'bold')
  doc.text('DE:', margin, yPos)
  doc.text('DIRECTOR SERVICIO SALUD MAGALLANES', margin + 15, yPos)

  yPos += 8
  doc.text('A:', margin, yPos)
  doc.text('FISCALÍA LOCAL', margin + 15, yPos)

  yPos += 5
  doc.text('PRESENTE', margin + 15, yPos)

  yPos += 15

  // Párrafo principal
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const mainText = `Junto con saludar, y en relación con documento Acta de Recepción N°${actaNumber}     /20XX se informa que las siguientes muestras fueron remitidas al I.S.P. para su correspondiente análisis mediante Reservado Nº ${reservedISP ? reservedISP.number : 'X'}     , quienes enviarán los resultados directamente a: FISCALÍA LOCAL`
  const mainLines = doc.splitTextToSize(mainText, pageWidth - margin * 2 - 20)
  doc.text(mainLines, margin + 15, yPos)
  yPos += mainLines.length * 6

  yPos += 10

  // MUESTRA N 1
  doc.setFont('helvetica', 'bold')
  doc.text('MUESTRA N° 1', margin + 30, yPos)

  yPos += 8

  doc.setFont('helvetica', 'normal')
  doc.text('CANTIDAD NETA Y DESCRIPCIÓN MUESTRA', margin + 50, yPos)

  yPos += 15

  // Saludo final
  doc.text('Se despide atentamente a usted,', margin + 30, yPos)

  // PIE DE PÁGINA - FIRMA
  yPos = pageHeight - 60
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('DIRECTOR', pageWidth / 2, yPos, { align: 'center' })
  yPos += 5
  doc.text('SERVICIO DE SALUD MAGALLANES', pageWidth / 2, yPos, { align: 'center' })

  yPos += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('DISTRIBUCIÓN.:', margin, yPos)
  yPos += 4
  doc.setFont('helvetica', 'bold')
  doc.text('DSSM', margin, yPos)

  // Línea decorativa azul y roja
  doc.setLineWidth(2)
  // Línea azul
  doc.setDrawColor(0, 0, 255)
  doc.line(margin, yPos + 2, margin + 10, yPos + 2)
  // Línea roja
  doc.setDrawColor(255, 0, 0)
  doc.line(margin + 10, yPos + 2, margin + 30, yPos + 2)

  // Footer final
  yPos = pageHeight - 10
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  const footerText =
    'Lautaro Navarro N° 525 - Casilla N° 527 - Fono 61 2294000 - E-mail: direccion.ssm@redsalud.gob.cl - PUNTA ARENAS'
  doc.text(footerText, pageWidth / 2, yPos, { align: 'center' })

  // Generar y descargar PDF
  const fileName = `Reservado_Fiscalia_Acta_${actaNumber}_Analisis_${analysis.id}_${Date.now()}.pdf`
  doc.save(fileName)
}
