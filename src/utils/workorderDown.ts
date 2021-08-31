import { jsPDF } from 'jspdf';
import * as faker from 'faker';
import 'jspdf-autotable';

// CluodsBuzz Logo
const image =
  'data:image/png;base64,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';
const alignRight = { halign: 'right' };
const alignCenter = { halign: 'center' };
const alignHeadRight = (title: string) => ({
  content: title,
  styles: alignRight,
});
const alignHeadCenter = (title: string) => ({
  content: title,
  styles: alignCenter,
});

const themeColor = '#0D3C61';

// Util function to put appropriate commas for numbers in INR
const formatToINR = (amount: number) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
  const arr = formatted.split('');
  arr.shift();
  return arr.join('');
};

interface IInvoiceData {
  tableData: ITableData[];
  vendor: IEnterprise;
  client: IEnterprise;
  contractRate: number;
  clientFeeRate: number;
  // Billing week as string
  billingPeriod: string;
  id: string;
  date: string;
  rate: string;
  requestedResource: string;
  positionTitle: string;
  currency: string;
  demandId: string;
  jobType: string;
  officialEmail: string;
  reportsTo: string;
  startDate: string;
  endDate: string;
  duration: string;
}

interface IEnterprise {
  name: string;
  address: string;
}

interface ITableData {
  hours: number;
  rate: number;
  name: string;
  demandId: string;
  project: string;
  hiringManagerName: string;
}

export class CloudsBuzzInvoice {
  data: IInvoiceData;
  eotX?: number;
  eotY?: number;
  totalAmount: number = 0;
  totalClientFee: number = 0;
  totalCloudsBuzzFee: number = 0;
  totalGrossAmount: number = 0;
  totalWorkHours: number = 0;
  fontSize: number = 30;

  constructor(data: IInvoiceData) {
    this.data = data;
  }

  addWorkOrder = (doc: jsPDF) => {
    const pageWidth = doc.internal.pageSize.getWidth() - 14;
    const sectionDelta = 15;
    const rowDelta = 7;
    let sectionY = 100;
    this.rowTitle(doc, 'Resource', 14, sectionY);
    sectionY += rowDelta;
    this.rowData(doc, 14, sectionY, [
      {
        key: 'Resource Name',
        value: this.data.requestedResource,
      },
      {
        key: 'Work Order ID',
        value: this.data.id,
      },
      {
        key: 'official email',
        value: this.data.officialEmail,
      },
    ]);

    doc.line(14, sectionY + 7, pageWidth, sectionY + 7);
    sectionY += sectionDelta;
    this.rowTitle(doc, 'Work Assignment', 14, sectionY);
    sectionY += rowDelta;
    this.rowData(doc, 14, sectionY, [
      {
        key: 'Demand ID',
        value: this.data.demandId,
      },
      {
        key: 'Job Type',
        value: this.data.jobType,
      },
      {
        key: 'Reporting Manager',
        value: this.data.reportsTo,
      },
    ]);
    sectionY += rowDelta;
    this.rowData(doc, 14, sectionY, [
      // {
      //   key: 'Designation',
      //   value: ,
      // },
      {
        key: 'Currency',
        value: this.data.currency,
      },
      {
        key: 'Rate Card',
        value: this.data.rate,
      },
    ]);
    doc.line(14, sectionY + 7, pageWidth, sectionY + 7);
    sectionY += sectionDelta;
    this.rowTitle(doc, 'Estimated Work Order Amount', 14, sectionY);
    sectionY += rowDelta;
    this.rowData(doc, 14, sectionY, [
      {
        key: 'Start Date',
        value: this.data.startDate,
      },
      {
        key: 'End Date',
        value: this.data.endDate,
      },
      {
        key: 'Duration',
        value: this.data.duration,
      },
    ]);
  };

  // Generate and save the PDF
  generatePDF(fileName: string) {
    const doc = new jsPDF({
      orientation: 'landscape',
      format: 'A4',
    });

    this.addTitle(doc);
    // this.addHeaders(doc);
    this.addFooters(doc);
    this.addWorkOrder(doc);
    doc.save(fileName);
  }

  addFooters = (doc: jsPDF) => {
    const pageCount = doc.internal.pages.length - 1;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 20,
        7,
        {
          align: 'center',
        },
      );
    }
  };

  addHeaders = (doc: jsPDF) => {
    const pageCount = doc.internal.pages.length;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    // Start from Page 2
    for (var i = 2; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`CloudsBuzz Commercial Invoice`, 14, 7);
    }
  };

  setFontBold(doc: jsPDF) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(this.fontSize);
  }

  setFontNormal(doc: jsPDF) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(this.fontSize);
  }

  addTitle = (doc: jsPDF) => {
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
  };
  rowTitle = (doc: jsPDF, title: string, x: number, y: number) => {
    this.setFontBold(doc);
    doc.setFontSize(12);
    doc.text(title, x, y, {
      align: 'left',
    });
  };
  rowData = (doc: jsPDF, x: number, y: number, data: any) => {
    let xOffset = 0;
    doc.setFontSize(8);
    for (const d of data) {
      this.setFontBold(doc);
      doc.setFillColor('#DBE2E7');
      doc.rect(x + xOffset, y - 3.8, 36, 7, 'F');
      doc.text(d.key, x + xOffset + 35, y, {
        align: 'right',
      });
      this.setFontNormal(doc);
      doc.text(d.value, x + xOffset + 40, y, {
        maxWidth: 30,
        align: 'left',
      });
      xOffset += 80;
    }
    const finalY = 180;
    doc.setFontSize(8);
    doc.text(
      '__________________________________________________________________',
      14,
      finalY + 15,
    );
    doc.text(
      '__________________________________________________________________',
      175,
      finalY + 15,
    );
    doc.text('Director', 14, finalY + 20);
    doc.text('Date', 107, finalY + 20);

    doc.text(`Procurement Manager`, 180, finalY + 20);
    doc.text('Date', 268, finalY + 20);
  };
}
const tableData: any = [];

for (let i = 0; i < 40; i++) {
  const data: ITableData = {
    name: faker.name.findName(),
    hiringManagerName: faker.name.findName(),
    rate: Math.ceil(Math.random() * 50),
    hours: Math.ceil(Math.random() * 60),
    demandId: `D-000${Math.ceil(Math.random() * 100)}`,
    project: 'Standard Timecard',
  };
  tableData.push(data);
}

// export const sampleData: IInvoiceData = {
//   client: {
//     name: 'Target India',
//     address:
//       'Client Company Pvt. Ltd, C-2 Manyata Embassy, Business Park - SEZ Unit Nagawara Hobli, Outer Ring Road, Hebbal, Bangalore, Karnataka - 560045',
//   },
//   vendor: {
//     name: 'Future World',
//     address:
//       'Vendor Company Pvt. Ltd, #1277, H.B Complex, 3rd Floor, 25th Main Road, Jayanagar 9th Block, Bangalore, KA 560069',
//   },
//   id: 'INV-10000000',
//   billingPeriod: '30-May-2021 to 07-Jun-2021',
//   contractRate: 1.3,
//   clientFeeRate: 1.3,
//   date: '07-Jun-2021',
//   tableData,
// };

// const pdfx = new CloudsBuzzInvoice(sampleData);
// pdfx.generatePDF('wo.pdf');
