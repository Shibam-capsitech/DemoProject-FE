import React, { useEffect, useMemo, useState } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  type IColumn,
  SearchBox,
  Stack,
  Text,
  Dropdown,
  type IDropdownOption,
  type IDropdownStyles,
  mergeStyleSets,
  FontWeights,
} from "@fluentui/react";
import { ChevronLeft, ChevronRight, Inbox, ListFilterPlus, Search } from "lucide-react";
import {
  FocusTrapCallout,
  FocusZone,
  FocusZoneTabbableElements,
} from "@fluentui/react";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { useBoolean, useId } from "@fluentui/react-hooks";
import apiService from "../api/apiService";
import { useLocation } from "react-router-dom";
import { boolean } from "yup";

interface ColumnConfig {
  key: string;
  name: string;
  fieldName: string;
  minWidth?: number;
  maxWidth?: number;
  isResizable?: boolean;
  isSorted?: boolean;
  isSortedDescending?: boolean;
  onRender?: (item: any) => JSX.Element;
}

interface CustomTableProps {
  columns: ColumnConfig[];
  items: any[];
  selectionMode?: SelectionMode;
  onRowClick?: (item: any) => void;
  actions?: React.ReactNode;
  pageSize?: number;
  filterCriteria?: IDropdownOption[];
  filterValue?: Record<string, IDropdownOption[]>;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  items,
  selectionMode = SelectionMode.none,
  onRowClick,
  actions,
  pageSize,
  filterCriteria,
  filterValue,
}) => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  const buttonId = useId("callout-button");
  const [selectedCriteria, setSelectedCriteria] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string>();
  const [filteredTableData, setFilteredTableData] = useState<any[] | null>(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const location = useLocation();
  const isClientActive = location.pathname.includes("client");
  const isTaskActive = location.pathname.includes("task");
  
  const slnoColumn: IColumn = {
  key: 'slno',
  name: 'SL/No',
  fieldName: 'slno',
  minWidth: 80,
  maxWidth: 100,
  onRender: (item: any, index?: number) => {
    const serial = (currentPage - 1) * (pageSize || 10) + (index ?? 0) + 1;
    return (
      <span style={{
        fontFamily: 'monospace',
        padding: '2px 6px',
        borderRadius: 4,
        display: 'inline-block',
      }}>
        {serial}
      </span>
    );
  },
};

const combinedColumns: IColumn[] = [slnoColumn, ...columns];

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: "100%" },
  };

  const styles = mergeStyleSets({
    callout: {
      width: 320,
      padding: "20px 24px",
    },
    title: {
      marginBottom: 12,
      fontWeight: FontWeights.semilight,
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 20,
    },
  });

  const handleItemInvoked = (item: any) => {
    onRowClick?.(item);
  };

  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async (_?: any, newValue?: string, page = 1) => {
    const keyword = newValue !== undefined ? newValue : filterText;
    setFilterText(keyword);
    setCurrentPage(page);

    try {
      const queryParams = new URLSearchParams();

      if (selectedCriteria && selectedValue) {
        queryParams.append("criteria", selectedCriteria);
        queryParams.append("value", selectedValue);
      }

      if (keyword) {
        queryParams.append("search", keyword);
      }

      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize?.toString() || "10");

      const endpoint = isClientActive
        ? `/Business/get-all-businesses?${queryParams.toString()}`
        : `/Task/get-all-task?${queryParams.toString()}`;

      const res = await apiService.get(endpoint);

      setFilteredTableData(res.tasks || res.businesses || []);
      setTotalCount(res.pagination?.totalCount || 0);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleCancelFilter = async()=>{
    try {
      const endpoint = isClientActive
        ? `/Business/get-all-businesses`
        : `/Task/get-all-task`;

      const res = await apiService.get(endpoint);

      setFilteredTableData(res.tasks || res.businesses || []);
      setTotalCount(res.pagination?.totalCount || 0);
    } catch (error) {
      
    }
  }
  useEffect(() => {
    handleSearch(undefined, "", 1); 
  }, []);
  const handleApplyFilter = () => {
    handleSearch(null, filterText);
    setIsFilterApplied(true)
    toggleIsCalloutVisible();
  };

  const visibleItems = filteredTableData ?? items;
  const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 1;

  return (
    <Stack styles={{ root: { width: "100%" } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        {actions && <Stack.Item>{actions}</Stack.Item>}
        <Stack.Item grow styles={{ root: { display: "flex", justifyContent: "flex-end", gap: 10 } }}>
          <div style={{ position: "relative", maxWidth: 220, width: "100%" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                color: "#666",
                pointerEvents: "none",
              }}
            />
            <SearchBox
              placeholder="Search..."
              value={filterText}
              onChange={handleSearch}
              styles={{
                root: { width: "100%" },
                icon: { display: "none" },
                field: { paddingLeft: 2 },
              }}
            />
          </div>
          {isFilterApplied && (
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 6 }}
              styles={{ root: { marginTop: 0 } }}
            >
              <span
                style={{
                  background: "#e5f1fb",
                  color: "#004578",
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {`${selectedCriteria}: ${selectedValue}`}
                <span
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => {
                    setSelectedCriteria(undefined);
                    setSelectedValue(undefined);
                    setIsFilterApplied(false)
                    setFilteredTableData(null);
                    handleCancelFilter()
                  }}
                >
                  &times;
                </span>
              </span>
            </Stack>
          )}

          <DefaultButton
            id={buttonId}
            onClick={toggleIsCalloutVisible}
            text="Add Filter"
            onRenderIcon={() => <ListFilterPlus size={20} />}
            styles={{ root: { backgroundColor: "#DEECF9", borderRadius: "15px" } }}
          />

          {isCalloutVisible && (
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#${buttonId}`}
              onDismiss={toggleIsCalloutVisible}
              setInitialFocus
            >
              <Text block variant="xLarge" className={styles.title}>
                Add Filter
              </Text>

              <Dropdown
                placeholder="Select criteria"
                label="Criteria"
                options={filterCriteria}
                styles={dropdownStyles}
                selectedKey={selectedCriteria}
                onChange={(_, option) => {
                  setSelectedCriteria(option?.key as string);
                  setSelectedValue(undefined);
                }}
              />

              {selectedCriteria && (
                <Dropdown
                  placeholder="Select value"
                  label="Value"
                  options={filterValue?.[selectedCriteria] ?? []}
                  styles={dropdownStyles}
                  selectedKey={selectedValue}
                  onChange={(_, option) => setSelectedValue(option?.key as string)}
                />
              )}

              <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton
                    onClick={handleApplyFilter}
                    disabled={!selectedCriteria || !selectedValue}
                  >
                    Apply
                  </PrimaryButton>
                  <DefaultButton onClick={toggleIsCalloutVisible}>Cancel</DefaultButton>
                  {/* <DefaultButton
                    onClick={() => {
                      setFilteredTableData(null);
                      setSelectedCriteria(undefined);
                      setSelectedValue(undefined);
                      toggleIsCalloutVisible();
                    }}
                    styles={{ root: { whiteSpace: "noWrap" } }}
                  >
                    Clear Filter
                  </DefaultButton> */}
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          )}
        </Stack.Item>
      </Stack>

      {visibleItems.length > 0 ? (
        <>
          <DetailsList
            items={visibleItems}
            columns={combinedColumns as IColumn[]}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={selectionMode}
            onItemInvoked={handleItemInvoked}
            styles={{
              root: { overflowX: "auto", width: "100%" },
              headerWrapper: {
                selectors: {
                  ".ms-DetailsHeader-cell": {
                    background: "#f4f4f4 !important",
                    color: "#005a9e",
                    fontSize: "18px",
                    fontWeight: 600,
                  },
                },
              },
              contentWrapper: {
                selectors: {
                  ".ms-DetailsRow-cell": {
                    fontSize: "15px !important",
                    padding: "8px 12px",
                  },
                },
              },
            }}
          />

          {pageSize && totalPages > 1 && (
            <Stack
              horizontal
              horizontalAlign="center"
              verticalAlign="center"
              tokens={{ childrenGap: 8 }}
              styles={{ root: { paddingTop: 12 } }}
            >
              <ChevronLeft
                size={20}
                style={{
                  cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                  opacity: currentPage <= 1 ? 0.3 : 1,
                }}
                onClick={() => {
                  if (currentPage > 1) {
                    handleSearch(undefined, filterText, currentPage - 1);
                  }
                }}
              />

              <Text>Page {currentPage} of {totalPages}</Text>

              <ChevronRight
                size={20}
                style={{
                  cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage >= totalPages ? 0.3 : 1,
                }}
                onClick={() => {
                  if (currentPage < totalPages) {
                    handleSearch(undefined, filterText, currentPage + 1);
                  }
                }}
              />

            </Stack>
          )}
        </>
      ) : (
        <Stack
          verticalAlign="center"
          horizontalAlign="center"
          tokens={{ childrenGap: 12 }}
          styles={{
            root: {
              padding: 40,
              border: "1px dashed #d0d7de",
              borderRadius: 8,
              marginTop: 24,
              background: "#fdfdfd",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            },
          }}
        >
          <Inbox size={48} color="#888" strokeWidth={1.2} />
          <Text variant="xLarge" styles={{ root: { color: "#555", fontWeight: 500 } }}>
            No data to show
          </Text>
          <Text variant="medium" styles={{ root: { color: "#777", maxWidth: 300 } }}>
            We couldn't find any records matching your current filters or search.
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default CustomTable;
