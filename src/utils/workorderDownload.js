import jsZip from 'jszip';
import 'jspdf-autotable';
import saveAs from 'file-saver';
import moment from 'moment';
import { logo } from './cloudsbuzzLogo';
let jsPDF = null;

if (typeof window !== 'undefined') {
  import('jspdf').then((module) => {
    jsPDF = module.default;
  });
}
export const printWorkorderPdf = async (tsData) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });
  doc.addImage(logo, 'PNG', 15, 5, 43.99038461, 15);

  var width = doc.internal.pageSize.width - 15;

  doc.setFont('helvetica', '', 'bold');
  doc.setFontSize(20);
  doc.text(65, 15, 'Workorder Summary', {
    align: 'left',
  });

  doc.setLineWidth(0.1);
  doc.line(15, 25, width, 25);

  var finalY = 20;

  doc.setFontSize(15);
  doc.text(15, finalY + 15, 'Resource', {
    align: 'left',
  });

  doc.autoTable({
    headStyles: {
      fillColor: [13, 60, 97],
      // textColor: [0, 0, 0],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
      textColor: [0, 0, 0],
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },

    alternateRowStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { fontStyle: 'bold' },
    },
    head: [['ID Number#', `Requested Resource`, 'Official Email']],
    body: [[`WO8100006`, 'rohit singh', 'rohit@mailinator.com']],
    startX: 18,
    startY: finalY + 20,
  });

  finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(15);
  doc.text(15, finalY + 10, 'Work Assignment', {
    align: 'left',
  });

  doc.autoTable({
    headStyles: {
      fillColor: [13, 60, 97],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
      textColor: [0, 0, 0],
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },

    alternateRowStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { fontStyle: 'bold' },
    },
    head: [['Demand Id#', `Position Title`, 'Position Reports to']],
    body: [[`110002`, 'SD', 'rohan sai']],
    startX: 18,
    startY: finalY + 15,
  });

  finalY = doc.lastAutoTable.finalY;

  doc.autoTable({
    headStyles: {
      fillColor: [13, 60, 97],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
      textColor: [0, 0, 0],
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },

    alternateRowStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { fontStyle: 'bold' },
    },
    head: [['Job Type', 'Rate Card', 'Rate Type', 'Currency']],
    body: [['PART_TIME', '667', 'weekly', 'USD']],
    startX: 18,
    startY: finalY,
  });

  finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(15);
  doc.text(15, finalY + 10, 'Compensation Rates', {
    align: 'left',
  });

  doc.autoTable({
    headStyles: {
      fillColor: [13, 60, 97],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
      textColor: [0, 0, 0],
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },

    alternateRowStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { fontStyle: 'bold' },
    },
    head: [
      [
        'Regular Pay Rate',
        'Regular Mark-Up(%)',
        'Regular Bill Rate',
        'Contracted Fee',
        'Reimbursement Rate',
      ],
    ],
    body: [['677', '0', '677', '10', '667']],
    startX: 18,
    startY: finalY + 15,
  });

  finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(15);
  doc.text(15, finalY + 10, 'Estimated Work Order Amount', {
    align: 'left',
  });

  doc.autoTable({
    headStyles: {
      fillColor: [13, 60, 97],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
      textColor: [0, 0, 0],
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },

    alternateRowStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
    },
    columnStyles: {
      2: { fontStyle: 'bold' },
    },
    head: [
      ['Start Date', 'End Date', 'Estimated Total Spend', 'Duration (Months)'],
    ],
    body: [['24 May 2019', '29 May 2019', '677838', '10']],
    startX: 18,
    startY: finalY + 15,
  });

  finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(15);
  doc.text(15, finalY + 10, 'Client Organization Detail', {
    align: 'left',
  });

  doc.autoTable({
    headStyles: {
      fillColor: [13, 60, 97],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
      textColor: [0, 0, 0],
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },

    alternateRowStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
    head: [
      [
        'Organization Name',
        'Corporate Contact Infomation',
        'Corporate Invoicing Site',
      ],
    ],
    body: [
      [
        'google INc',
        'gjghj, ghj, hgjgh, bangalore, India - 6776766',
        'fghfh, hfgjgfh, gjghjg, fgh, India - 67767676',
      ],
    ],
    startX: 18,
    startY: finalY + 15,
  });

  finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(15);
  doc.text(15, finalY + 10, 'Vendor Organization Detail', {
    align: 'left',
  });

  doc.autoTable({
    headStyles: {
      fillColor: [13, 60, 97],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
      textColor: [0, 0, 0],
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },

    alternateRowStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
    },
    columnStyles: {
      0: { fontStyle: 'bold', minCellWidth: 40 },
    },
    head: [
      [
        'Organization Name',
        'Corporate Contact Infomation',
        'Corporate Invoicing Site',
      ],
    ],
    body: [
      [
        'Onparz',
        'gjghjakdjk lajdk klakdd jlkd , ghj, hgjgh, bangalore, India - 6776766',
        'fghfh, hfgjgfh, gjghjg, fgh, India - 67767676',
      ],
    ],
    startX: 18,
    startY: finalY + 15,
  });

  finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(15);
  doc.text(15, finalY + 10, 'Contractual Components', {
    align: 'left',
  });

  doc.autoTable({
    headStyles: {
      fillColor: [13, 60, 97],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
      textColor: [0, 0, 0],
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },

    alternateRowStyles: {
      // fillColor: [242, 242, 242],
      fillColor: [219, 226, 231],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
    head: [['', 'Version', 'Effective Date']],
    body: [
      ['Governing Master Service Aggrement', 'MSA v1', '09/29/19'],
      ['Statement of Work', 'Non Payroll - SF_30SEP2019', '09/29/19'],
    ],
    startX: 18,
    startY: finalY + 15,
  });

  finalY = doc.lastAutoTable.finalY;

  // doc.setFontSize(8);
  // doc.text(
  //   20,
  //   finalY + 15,
  //   '__________________________________________________________________',
  // );
  // doc.text(
  //   168,
  //   finalY + 15,
  //   '__________________________________________________________________',
  // );
  // doc.text(20, finalY + 20, `Resource`);
  // doc.text(118, finalY + 20, 'Date');

  // doc.text(168, finalY + 20, `Employee Name`);

  // doc.text(266, finalY + 20, 'Date');

  doc.save('workorder.pdf');
};
