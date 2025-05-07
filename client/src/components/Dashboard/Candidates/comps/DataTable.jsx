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
          {data.map((item) => (
            <tr key={item.id}>
              {Object.keys(item).map((key) => {
                if (key === "status") {
                  return (
                    <td key={key}>
                      <StatusBadge
                        status={item[key]}
                        statusOptions={statusOptions}
                        onChange={(newStatus) => onStatusChange(item.id, newStatus)}
                      />
                    </td>
                  );
                }
                if (key === "actions") {
                  return (
                    <td key={key}>
                      <div className={styles.actionCell}>
                        <button onClick={(e) => handleActionClick(item.id, e)}>
                          <MoreVertical className={styles.actionIcon} />
                        </button>
                        {activeDropdown === item.id && (
                          <ActionDropdown 
                            items={actionItems} 
                            onItemClick={(action) => {
                              action.handler(item.id);
                              setActiveDropdown(null);
                            }}
                          />
                        )}
                      </div>
                    </td>
                  );
                }
                return <td key={key}>{item[key]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}