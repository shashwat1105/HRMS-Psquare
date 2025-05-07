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
  statusOptions,
  positionOptions,
  addButtonText,
  onAddClick,
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
    setStatusFilter("");
    setPositionFilter("");
  };

  return (
    <div className={`${styles.filterControls} ${isMobile && !isFilterOpen ? styles.hidden : ''}`}>
      <div className={styles.filterGroup}>
        {/* Status Dropdown */}
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
        
        {/* Position Dropdown */}
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
        
        {/* Clear filters button */}
        {(statusFilter || positionFilter) && (
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
        <button 
          className={styles.addButton}
          onClick={onAddClick}
        >
          {addButtonText}
        </button>
      </div>
    </div>
  );
}