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
export const printPdf = async (data) => {
  const zip = new jsZip();
  let tsFolder;
  if (data.length === 1) {
    tsFolder = zip.folder('timesheet');
  } else {
    tsFolder = zip.folder('timesheets');
  }
  // Document of 297mm wide and 210mm high (landscape)
  for await (const tsData of data) {
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
    });

    doc.addImage(logo, 'PNG', 15, 5, 43.99038461, 15);

    const pageCount = doc.internal.pages.length - 1;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        5,
        {
          align: 'center',
        },
      );
    }

    var width = doc.internal.pageSize.width - 35;
    const presentDate = new moment(Date()).format('do MMM YYYY, hh:mm:ss');

    doc.setFontSize(9);
    // doc.setFontType('bold');
    doc.setFont('helvetica');
    doc.text(width, 35, `Client: ${tsData.clientName}`, { align: 'right' });
    doc.text(width, 40, `Vendor: ${tsData.vendorName}`, { align: 'right' });

    let startDate = moment()
      .day('Sunday')
      .week(tsData.weekNumber)
      .format('MMM Do');
    let endDate = moment()
      .day('Saturday')
      .week(tsData.weekNumber)
      .format('MMM Do YYYY');
    doc.setLineWidth(0.5);
    doc.line(15, 30, 283, 30);
    doc.line(15, 42, 283, 42);

    doc.setFontSize(12);
    // doc.setFontType('bold');
    doc.text(
      15,
      35,
      tsData.name.toUpperCase() + `'s timesheet for ${startDate} - ${endDate}`,
    );
    doc.setFontSize(10);
    // doc.setFontType('bold');
    doc.setFont('helvetica', 'bold');
    doc.text(
      15,
      40,
      `Status : ${tsData.status} | Download Date and Time : ${presentDate}`,
    );

    doc.setFontSize(9);
    // doc.setFontType('bold');
    doc.text(15, 50, `Last Approved `);
    // doc.setFontType('normal');
    doc.text(40, 50, `${tsData.lastApproved}`);

    // doc.setFontType('bold');
    doc.text(15, 55, `Last Submitted`);
    // doc.setFontType('normal');
    doc.text(40, 55, `${tsData.updateDate}`);
    // doc.autoTable({
    //   headStyles: {
    //     fillColor: [242, 242, 242],
    //     textColor: [0, 0, 0],
    //     fontSize: 13,
    //     fontStyle: 'bold',
    //     halign: 'center',
    //     valign: 'middle',
    //   },
    //   bodyStyles: {
    //     fillColor: [255, 255, 255],
    //     textColor: [0, 0, 0],
    //     fontSize: 13,
    //     halign: 'center',
    //     valign: 'middle',
    //   },

    //   alternateRowStyles: {
    //     fillColor: [255, 255, 255],
    //   },
    //   columnStyles: {
    //     0: { fontStyle: 'bold' },
    //     2: { fontStyle: 'bold' },
    //   },
    //   head: [['Employee Name', 'Timesheet Duration']],
    //   body: [[tsData.name.toUpperCase(), `${startDate} - ${endDate}`]],
    //   startX: 18,
    //   startY: 26,
    // });
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
        fillColor: [242, 242, 242],

        textColor: [0, 0, 0],
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
      },

      alternateRowStyles: {
        fillColor: [242, 242, 242],
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        2: { fontStyle: 'bold' },
      },
      head: [['Timesheet ID', `Project Manager's Name`, 'Designation']],
      body: [
        [
          `${tsData.id}`,
          tsData.projectManagerData.firstName.toUpperCase() +
            tsData.projectManagerData.lastName.toUpperCase(),
          `${tsData.profileName}`,
          // `${startDate} - ${endDate}`,
        ],
      ],
      startX: 18,
      startY: 65,
    });
    // doc.autoTable({
    //   headStyles: {
    //     fillColor: [242, 242, 242],
    //     textColor: [0, 0, 0],
    //     fontSize: 13,
    //     fontStyle: 'bold',
    //     halign: 'center',
    //     valign: 'middle',
    //   },
    //   bodyStyles: {
    //     fillColor: [255, 255, 255],
    //     textColor: [0, 0, 0],
    //     fontSize: 13,
    //     halign: 'center',
    //     valign: 'middle',
    //   },

    //   alternateRowStyles: {
    //     fillColor: [255, 255, 255],
    //   },
    //   columnStyles: {
    //     0: { fontStyle: 'bold' },
    //     // 2: { fontStyle: 'bold' },
    //     // 4: { fontStyle: 'bold' },
    //   },
    //   head: [['Status', 'Last Submitted', 'Last Approved']],
    //   body: [
    //     [`${tsData.status}`, `${tsData.updateDate}`, `${tsData.lastApproved}`],
    //   ],
    //   startX: 18,
    //   startY: doc.lastAutoTable.finalY + 5,
    // });
    // if (tsData.status === 'REJECTED') {
    //   doc.autoTable({
    //     headStyles: {
    //       fillColor: [242, 242, 242],
    //       textColor: [0, 0, 0],
    //       fontSize: 13,
    //       fontStyle: 'bold',
    //       halign: 'center',
    //       valign: 'middle',
    //     },
    //     bodyStyles: {
    //       fillColor: [255, 255, 255],
    //       textColor: [0, 0, 0],
    //       fontSize: 13,
    //       halign: 'center',
    //       valign: 'middle',
    //     },

    //     alternateRowStyles: {
    //       fillColor: [255, 255, 255],
    //     },
    //     columnStyles: {
    //       0: { fontStyle: 'bold' },
    //     },
    //     head: [['Rejection Reason']],
    //     body: [[`${tsData.suggestion}`]],
    //     startY: doc.lastAutoTable.finalY + 5,
    //   });
    // }
    const tableData = tsData.allTasksData;
    console.log('Table Data:', tsData);
    // const data = Object.keys(tableData);
    // const testDATA = Object.entries(tableData).map((e) => ({ [e[0]]: e[1] }));
    //  console.log('testDATA', testDATA);
    //  let taskData = {}
    // data.map((d) => {
    //   const totalHours = tableData[d].hrs;
    //    taskData = tableData[d].tasksData.map((_d) => {
    //     // console.log('Date: Hrs: Task Name: ', _d.date, _d.hrs, d);
    //     return [_d.date, _d.hrs,tsData.allTasksData.taskName, d,tsData.projectId,tsData.projectName];
    //   });
    // let totalHours = 0;
    // totalHours = tsData.allTasksData.weekData.map((week) => week.hrs);

    var finalY = doc.lastAutoTable.finalY || 10;
    doc.autoTable({
      headStyles: {
        fillColor: [13, 60, 97],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        // fontSize: 11,
        // lineWidth: 0.2,
        lineColor: 255,
      },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold',
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          cellWidth: 40,
          halign: 'left',
          valign: 'middle',
        },
        1: {
          cellWidth: 30,
          halign: 'center',
          valign: 'middle',
        },
        2: { fontStyle: 'bold', halign: 'left', valign: 'middle' },
        3: { cellWidth: 40, halign: 'center', valign: 'middle' },
        4: { halign: 'left', valign: 'middle', fontStyle: 'bold' },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      head: [
        [
          { content: 'Date', styles: { halign: 'left' } },
          'Hrs/Day',
          { content: 'Task Name', styles: { halign: 'left' } },
          'Project ID',
          { content: 'Project Name', styles: { halign: 'left' } },

          // 'Project ID',
          // 'Project Name',
        ],
      ],
      body: [
        // ...taskData
        [
          moment(tableData.weekData.Sun.date).format('Do MMM ddd, YYYY'),
          tableData.weekData.Sun.hrs,
          tsData.allTasksData.taskName,
          tsData.projectId,
          tsData.projectName,
        ],
        [
          moment(tableData.weekData.Mon.date).format('Do MMM ddd, YYYY'),
          tableData.weekData.Mon.hrs,
          tsData.allTasksData.taskName,
          tsData.projectId,
          tsData.projectName,
        ],
        [
          moment(tableData.weekData.Tue.date).format('Do MMM ddd, YYYY'),
          tableData.weekData.Tue.hrs,
          tsData.allTasksData.taskName,
          tsData.projectId,
          tsData.projectName,
        ],
        [
          moment(tableData.weekData.Wed.date).format('Do MMM ddd, YYYY'),
          tableData.weekData.Wed.hrs,
          tsData.allTasksData.taskName,
          tsData.projectId,
          tsData.projectName,
        ],
        [
          moment(tableData.weekData.Thu.date).format('Do MMM ddd, YYYY'),
          tableData.weekData.Thu.hrs,
          tsData.allTasksData.taskName,
          tsData.projectId,
          tsData.projectName,
        ],
        [
          moment(tableData.weekData.Fri.date).format('Do MMM ddd, YYYY'),
          tableData.weekData.Fri.hrs,
          tsData.allTasksData.taskName,
          tsData.projectId,
          tsData.projectName,
        ],
        [
          moment(tableData.weekData.Sat.date).format('Do MMM ddd, YYYY'),
          tableData.weekData.Sat.hrs,
          tsData.allTasksData.taskName,
          tsData.projectId,
          tsData.projectName,
        ],
      ],
      // foot: [[``, `Total Hours: 12`]],
      foot: [[``, `Total Hours: ${tsData.hrs}`]],
      startX: 18,
      startY: finalY + 5,
    });

    //   console.log('Final task data:', taskData);
    //   doc.autoTable({
    //     headStyles: {
    //       fillColor: [242, 242, 242],
    //       textColor: [0, 0, 0],
    //       fontSize: 13,
    //       fontStyle: 'bold',
    //       lineWidth: 0.2,
    //       lineColor: 242,
    //       halign: 'center',
    //       valign: 'middle',
    //     },
    //     bodyStyles: {
    //       fillColor: [255, 255, 255],
    //       textColor: [0, 0, 0],
    //       fontSize: 13,
    //       lineWidth: 0.2,
    //       lineColor: 242,
    //     },
    //     footStyles: {
    //       fillColor: [255, 255, 255],
    //       textColor: [0, 0, 0],
    //       fontSize: 13,
    //       halign: 'center',
    //       valign: 'middle',
    //       fontStyle: 'bold',
    //     },
    //     columnStyles: {
    //       0: {
    //         fontStyle: 'bold',
    //         cellWidth: 30,
    //         halign: 'center',
    //         valign: 'middle',
    //       },
    //       1: { cellWidth: 30, halign: 'center', valign: 'middle' },
    //       2: { fontStyle: 'bold', halign: 'left', valign: 'middle' },
    //     },
    //     alternateRowStyles: {
    //       fillColor: [252, 252, 252],
    //     },
    //     head: [
    //       [
    //         'Dates',
    //         'Hours',
    //         { content: 'Task Name', styles: { halign: 'left' } },
    //         'Project ID',
    //         'Project Name',
    //       ],
    //     ],
    //     body: taskData,
    //     foot: [[``, `Total ${totalHours}`]],
    //     startY: 18,
    //     startY: finalY + 5,
    //   });

    //   finalY = doc.lastAutoTable.finalY;
    // });
    finalY = doc.lastAutoTable.finalY + 20;

    doc.setFontSize(8);
    doc.text(
      20,
      finalY + 15,
      '__________________________________________________________________',
    );
    doc.text(
      168,
      finalY + 15,
      '__________________________________________________________________',
    );
    doc.text(20, finalY + 20, `Resource`);
    doc.text(118, finalY + 20, 'Date');

    doc.text(168, finalY + 20, `Employee Name`);
    doc.text(266, finalY + 20, 'Date');

    tsFolder.file(
      `${tsData.name}-${tsData.weekNumber}-${tsData.year}-timesheet.pdf`,
      btoa(doc.output()),
      {
        base64: true,
      },
    );
    // };
  }
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    // see FileSaver.js
    let zipName = data.length === 1 ? 'timesheet.zip' : 'timesheets.zip';
    saveAs(content, zipName);
  });
};
