import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generarActaPDF = (form, substances) => {
  const doc = new jsPDF('p', 'mm', 'a4', true) // 'true' para compresión
  const policeName =
    `${form.police?.firstName || ''} ${form.police?.firstLastName || ''}`.trim() || '—'
  const policeRut = form.police?.rut || '—'
  const policeGrade = form.police?.grade?.name || '—'
  const policeInstitution = form.police?.institutionType?.institution?.name || '—'
  const policeCommune = form.police?.institutionType?.commune?.name || '—'

  // === Encabezado ===
  const logo = new Image()
  logo.src = '/ssm/logo-ssm.png'

  // Agregar imagen con compresión
  doc.addImage(logo, 'PNG', 15, 10, 25, 25, undefined, 'FAST')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('ACTA DE RECEPCIÓN N°', 70, 20)
  doc.text(`${form.number}`, 130, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Punta Arenas,', 130, 28)
  doc.text(
    new Date(form.date_reception).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    155,
    28,
  )

  doc.setFontSize(11)
  doc.text(
    `El Servicio de Salud Magallanes, en conformidad al Artículo N° 41 y 43 de la ley 20.000, recepciona:`,
    15,
    45,
  )
  doc.text(
    `Ord N° ${form.of_number} con fecha ${new Date(form.of_number_date).toLocaleDateString(
      'es-CL',
    )} - ${(form.police?.institutionType?.institution?.name || '').toUpperCase()} - ${
      form.police.institutionType.commune.name
    }`,
    15,
    51,
  )

  // === Tabla de Sustancias ===
  const columns = [
    { header: 'Muestra Nº', dataKey: 'n' },
    { header: 'Presunto', dataKey: 'presunto' },
    { header: 'NUE', dataKey: 'nue' },
    { header: 'Peso Bruto (g)', dataKey: 'peso' },
    { header: 'Peso Neto (g)', dataKey: 'peso_neto' },
    { header: 'Unidad', dataKey: 'unidad' },
    { header: 'Descripción muestra', dataKey: 'descripcion' },
  ]

  const data = (substances || []).map((s, i) => ({
    n: s.nsubstance || '—',
    presunto: s.substanceType.name || '—',
    nue: s.nue || '—',
    peso: s.weight ? Number(s.weight).toFixed(2) : '—',
    peso_neto: s.weight_net ? Number(s.weight_net).toFixed(2) : '—',
    unidad: s.unity || '—',
    descripcion: s.description || '—',
  }))

  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: data.map((d) => Object.values(d)),
    startY: 60,
    styles: { fontSize: 9, cellPadding: 2, halign: 'center', valign: 'middle' },
    headStyles: { fillColor: [200, 200, 200] },
  })

  let y = doc.lastAutoTable.finalY + 15

  // === Firmas ===
  doc.setFontSize(10)
  doc.text('Funcionario que entrega', 20, y)
  doc.text('Funcionario que recibe', 130, y)

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.text(`${policeName}`, 20, y)
  doc.text(`${form.user_destination.username || ' '}`, 130, y)

  y += 5
  doc.text(`RUT: ${policeRut}`, 20, y)
  doc.text(`RUT: ${form.user_destination.rut || ' '}`, 130, y)

  y += 5
  doc.text(`Grado: ${policeGrade}`, 20, y)
  doc.text('Servicio de Salud Magallanes', 130, y)

  y += 5
  doc.text(`Unidad: ${policeInstitution}`, 20, y)
  doc.text(`Comuna: ${policeCommune}`, 20, y + 5)

  // === Guardar archivo ===
  const filename = `Acta_Recepcion_${form.number}.pdf`
  doc.save(filename)
}
