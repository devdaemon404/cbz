import moment from 'moment';

export const getDates = (weekNumber) => {
  const startDate = moment()
    .day('Sunday')
    .week(weekNumber)
    .format('MMM Do YYYY');
  const endDate = moment()
    .day('Saturday')
    .week(weekNumber)
    .format('MMM Do YYYY');
  return `${startDate}-${endDate}`;
};

// function TestPage({ data }) {
//   console.log(data);
//   const renderTasksData = (tasks, taskName) => {
//     console.log(tasks, taskName);

//     return tasks.map((d) => (
//       <>
//         <tr style={{ padding: '0px', margin: '0px' }}>
//           <td style={{ padding: '0px', margin: '0px' }}>{d.date}</td>
//           <td style={{ padding: '0px', margin: '0px' }}>{d.hrs}</td>
//           <td style={{ padding: '0px', margin: '0px' }}>{taskName}</td>
//         </tr>
//       </>
//     ));
//   };
//   const renderTable = (tasksData) => {
//     const data = Object.keys(tasksData);
//     return data.map((d) => (
//       <>
//         {/* <h3 style={{padding:"5px 0 0 5px",fontSize:"18px",fontFamily:'sans-serif'}}>Task Name : {d}</h3> */}
//         <table style={{ padding: '0px', margin: '0px' }}>
//           <tr style={{ padding: '0px', margin: '0px' }}>
//             <th style={{ padding: '0px', margin: '0px' }}>Date</th>
//             <th style={{ padding: '0px', margin: '0px' }}>Hours</th>
//             <th style={{ padding: '0px', margin: '0px' }}>Task Name</th>
//           </tr>
//           {renderTasksData(tasksData[d].tasksData, d)}
//         </table>
//         <div
//           style={{
//             overflow: 'hidden',
//             backgroundColor: '#f1f1f1',
//             fontFamily: 'sans-serif',
//             fontWeight: 'bold',
//             padding: '0px',
//             margin: '0px',
//           }}>
//           Total Hours - {tasksData[d].hrs}{' '}
//         </div>
//       </>
//     ));
//   };

//   return (
//     <>
//       <div
//         style={{
//           overflow: 'hidden',
//           backgroundColor: '#f1f1f1',
//           padding: '10px 10px',
//           margin: '10px auto',
//           fontFamily: 'sans-serif',
//         }}>
//         <b>Cloudsbuzz</b>
//       </div>
//       <hr />
//       <div>
//         <ul style={{ padding: '0px', margin: '0px' }}>
//           <li
//             style={{
//               listStyle: 'none',
//               padding: '5px 0 0 5px',
//               fontSize: '18px',
//               fontFamily: 'sans-serif',
//             }}>
//             <b>
//               {data.name} timesheet for {getDates(data.weekNumber)}
//             </b>
//           </li>
//           <li
//             style={{
//               listStyle: 'none',
//               padding: '0 0 5px 5px',
//               fontSize: '13px',
//               fontFamily: 'sans-serif',
//             }}>
//             <b>
//               Status:{data.status}| Profile Name: {data.profileName} | Last
//               Approved: {data.updateDate}
//             </b>
//           </li>
//         </ul>
//       </div>

//       <hr />
//       <div style={{ padding: '0px', margin: '0px' }}>
//         {renderTable(data.allTasksData)}
//       </div>
//     </>
//   );
// }

// export default TestPage;
