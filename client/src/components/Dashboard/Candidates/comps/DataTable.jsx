import { useState } from "react";
import { MoreVertical } from "lucide-react";
import styles from "./DataTable.module.css";
import StatusBadge from "./StatusBadge";
import ActionDropdown from "./ActionDropdown";

export default function DataTable({
  columns,
  data,
  onStatusChange,
  statusOptions,
  actionItems
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleActionClick = (id, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={item.id}>
              {columns.map((column) => {
                const columnKey = column.replace(/\s+/g, '').toLowerCase();
                const cellValue = item[column] || item[columnKey];
                
                if (column === "Status") {
                  return (
                    <td key={`status-${rowIndex}`}>
                      <StatusBadge
                        status={item.Status}
                        statusOptions={statusOptions}
                        onChange={(newStatus) => 
                          onStatusChange(cellValue?.id, newStatus)
                        }
                      />
                    </td>
                  );
                }
                
                if (column === "Action") {
                  return (
                    <td key={`action-${rowIndex}`}>
                      <div className={styles.actionCell}>
                        <button onClick={(e) => handleActionClick(rowIndex, e)}>
                          <MoreVertical className={styles.actionIcon} />
                        </button>
                        {activeDropdown === rowIndex && (
                          <ActionDropdown 
                            items={actionItems} 
                            onItemClick={(action) => {
                              action.handler(item.id || rowIndex);
                              setActiveDropdown(null);
                            }}
                          />
                        )}
                      </div>
                    </td>
                  );
                }
                
                return <td key={`${columnKey}-${rowIndex}`}>{cellValue}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// export default function DataTable({
//   columns,
//   data,
//   onStatusChange,
//   statusOptions,
//   actionItems
// }) {
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   return (
//     <div className={styles.tableContainer}>
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             {columns.map((column, index) => (
//               <th key={index}>{column}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => (
//             <tr key={item.id}>
//               {columns.map((column) => {
//                 const columnKey = column.replace(/\s+/g, '').toLowerCase();
                
//                 if (column === "Status") {
//                   return (
//                     <td key={`${item.id}-status`}>
//                       <StatusBadge
//                         status={item.Status} // Directly use the status value
//                         statusOptions={statusOptions}
//                         onChange={(newStatus) => onStatusChange(item.id, newStatus)}
//                       />
//                     </td>
//                   );
//                 }
                
//                 if (column === "Action") {
//                   return (
//                     <td key={`${item.id}-action`}>
//                       <ActionDropdown 
//                         items={actionItems}
//                         onItemClick={(action) => action.handler(item.id)}
//                       />
//                     </td>
//                   );
//                 }
                
//                 return <td key={`${item.id}-${columnKey}`}>{item[column]}</td>;
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }