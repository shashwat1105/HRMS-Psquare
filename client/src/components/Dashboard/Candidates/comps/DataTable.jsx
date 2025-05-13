import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import styles from "./DataTable.module.css";
import StatusBadge from "./StatusBadge";
import ActionDropdown from './ActionDropDown';


export default function DataTable({
  columns,
  data,
  onStatusChange,
  statusOptions,
  actionItems,
  renderStatusCell
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
                      {renderStatusCell ? (
                        renderStatusCell(item) 
                      ) : (
                        <StatusBadge
                          status={item.Status}
                          statusOptions={statusOptions}
                          onChange={(newStatus) => 
                            onStatusChange(item.id, newStatus)
                          }
                        />
                      )}
                    </td>
                  );
                }
                
                if (column === "Action") {
                  return (
                    <td key={`action-${rowIndex}`}>
                      <div className={styles.actionCell}>
                        <button
                          onClick={(e) => {
                            if (actionItems?.length > 0) {
                              handleActionClick(rowIndex, e);
                            } else {
                              e.stopPropagation(); 
                            }
                          }}
                          className={styles.actionButton}
                          disabled={actionItems?.length === 0}
                        >
                          <MoreVertical className={styles.actionIcon} />
                        </button>
                
                        {activeDropdown === rowIndex && actionItems?.length > 0 && (
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
                
                
                return <td key={`${column}-${rowIndex}`}>
                {React.isValidElement(cellValue) ? cellValue : String(cellValue ?? '')}
              </td>
              
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


 