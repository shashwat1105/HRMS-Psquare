import { useState } from "react";
import { Search, X, Check, ChevronDown } from "lucide-react";
import styles from "./FilterOptions.module.css";

export default function FilterOptions({
  isMobile,
  isFilterOpen,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  positionFilter,
  setPositionFilter,
  statusOptions = [],
  positionOptions = [],
  addButtonText,
  onAddClick,
  onReset,
  hideStatusFilter = false,
  hidePositionFilter = false,
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);

  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
  };

  const handlePositionSelect = (position) => {
    setPositionFilter(position);
    setShowPositionDropdown(false);
  };

  const clearFilters = () => {
    if (!hideStatusFilter) {
      setStatusFilter("");
    }
    if (!hidePositionFilter) {
      setPositionFilter("");
    }
    setSearchTerm("");
    if (onReset) {
      onReset();
    }
  };

  const shouldShowClearButton = 
    (!hideStatusFilter && statusFilter) || 
    (!hidePositionFilter && positionFilter) || 
    searchTerm;

  return (
    <div className={`${styles.filterControls} ${isMobile && !isFilterOpen ? styles.hidden : ''}`}>
      <div className={styles.filterGroup}>
        {!hideStatusFilter && (
          <div className={styles.customDropdown}>
            <button 
              className={`${styles.dropdownButton} ${statusFilter ? styles.activeFilter : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusDropdown(!showStatusDropdown);
                setShowPositionDropdown(false);
              }}
            >
              {statusFilter || "Status"}
              <ChevronDown className={styles.dropdownButtonIcon} />
            </button>
            {showStatusDropdown && (
              <div className={styles.dropdownMenu}>
                {statusOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`${styles.dropdownItem} ${statusFilter === option ? styles.selected : ''}`}
                    onClick={() => handleStatusSelect(option)}
                  >
                    {option}
                    {statusFilter === option && <Check className={styles.checkIcon} size={16} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {!hidePositionFilter && (
          <div className={styles.customDropdown}>
            <button 
              className={`${styles.dropdownButton} ${positionFilter ? styles.activeFilter : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowPositionDropdown(!showPositionDropdown);
                setShowStatusDropdown(false);
              }}
            >
              {positionFilter || "Position"}
              <ChevronDown className={styles.dropdownButtonIcon} />
            </button>
            {showPositionDropdown && (
              <div className={styles.dropdownMenu}>
                {positionOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`${styles.dropdownItem} ${positionFilter === option ? styles.selected : ''}`}
                    onClick={() => handlePositionSelect(option)}
                  >
                    {option}
                    {positionFilter === option && <Check className={styles.checkIcon} size={16} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {shouldShowClearButton && (
          <button 
            onClick={clearFilters}
            className={styles.clearButton}
          >
            <X className={styles.clearIcon} />
            Clear
          </button>
        )}
      </div>
      
      <div className={styles.searchGroup}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>
        {addButtonText && onAddClick && (
  <button 
    className={styles.addButton}
    onClick={onAddClick}
  >
    {addButtonText}
  </button>
)}

      </div>
    </div>
  );
}