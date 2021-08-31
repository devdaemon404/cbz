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
  const scaleDown = 6.5; // Scale down factor
  const [iX, iY] = [305 / scaleDown, 104 / scaleDown];
  doc.addImage(image, 14, 5, iX, iY);

  const pageWidth = doc.internal.pageSize.getWidth() - 14;
  console.log(doc.internal.pageSize.getWidth());
  const [c1x, c2x] = [14, pageWidth];
  const [r1y, r2y, r3y, r4y] = [30, 35, 45, 50];
  const line1Y = r1y - 5;
  const line2Y = r2y + 3;
  const fontSize = 10;
  this.fontSize = 10;
  const maxWidth = 80;

  //     this.setFontBold(doc);
  //     doc.text(`Currency: INR`, c1x, r1y);
  //     doc.text(`Statement Date: ${this.data.date}`, c2x, r1y, {
  //       align: 'right',
  //     });
  //
  //     doc.text(`Billing Period: ${this.data.billingPeriod}`, c1x, r2y);
  //     doc.text(`Invoice Number: ${this.data.id}`, c2x, r2y, {
  //       align: 'right',
  //     });
  //
  //     doc.setLineWidth(0.4);
  //     doc.line(14, line1Y, pageWidth, line1Y);
  //     doc.line(14, line2Y, pageWidth, line2Y);

  this.setFontBold(doc);
  doc.text('Vendor Organization', c1x, r3y);
  doc.text('Client Organization', c2x, r3y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  const { address: cAddr, name: cName } = this.data.client;
  const { address: vAddr, name: vName } = this.data.vendor;
  const cFormattedData = `${cName}\n${cAddr}`;
  const vFormattedData = `${vName}\n${vAddr}\n\nPAN    : BBJPD0431K\nGSTN : 29BBJPD0431K1ZS`;
  doc.text(vFormattedData, c1x, r4y, {
    maxWidth,
  });
  doc.text(cFormattedData, c2x, r4y, {
    maxWidth,
    align: 'right',
  });
  const pageWidth = doc.internal.pageSize.getWidth() - 14;
  const sectionDelta = 15;
  const rowDelta = 7;
  let sectionY = 100;
  this.rowTitle(doc, 'Resource', 14, sectionY);
  sectionY += rowDelta;
  this.rowData(doc, 14, sectionY, [
    {
      key: 'Resource Name',
      value: 'Muaaz Khan',
    },
    {
      key: 'Work Order ID',
      value: 'WO-1001200',
    },
    {
      key: 'official email',
      value: 'muaaz@onpar.in',
    },
  ]);

  doc.line(14, sectionY + 7, pageWidth, sectionY + 7);
  sectionY += sectionDelta;
  this.rowTitle(doc, 'Work Assignment', 14, sectionY);
  sectionY += rowDelta;
  this.rowData(doc, 14, sectionY, [
    {
      key: 'Demand ID',
      value: 'Muaaz Khan',
    },
    {
      key: 'Job Type',
      value: 'Full Time',
    },
    {
      key: 'Reporting Manager',
      value: 'Ashwin Prasad',
    },
  ]);
  sectionY += rowDelta;
  this.rowData(doc, 14, sectionY, [
    {
      key: 'Designation',
      value: 'Junior Developer',
    },
    {
      key: 'Currency',
      value: 'INR',
    },
    {
      key: 'Rate Card',
      value: '200',
    },
  ]);
  doc.line(14, sectionY + 7, pageWidth, sectionY + 7);
  sectionY += sectionDelta;
  this.rowTitle(doc, 'Estimated Work Order Amount', 14, sectionY);
  sectionY += rowDelta;
  this.rowData(doc, 14, sectionY, [
    {
      key: 'Start Date',
      value: '22/11/2020',
    },
    {
      key: 'End Date',
      value: '22/03/2021',
    },
    {
      key: 'Duration',
      value: '54 Days',
    },
  ]);

  doc.save('workorder.pdf');
};
