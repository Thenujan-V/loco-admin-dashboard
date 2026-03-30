// @mui
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
// components
import { useSettingsContext } from "src/components/settings";
import Button from "@mui/material/Button";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import Card from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import useTable from "src/components/table/use-table";
import { useCallback, useState } from "react";
import { _packagePlanMockData, _packagesMockData } from "src/_mock/_user";

import { useBoolean } from "src/hooks/use-boolean";
import Scrollbar from "src/components/scrollbar";
import Table from "@mui/material/Table";
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from "src/components/table";
import TableBody from "@mui/material/TableBody";
import { isEqual } from "lodash";
import { _statusOptions, CUSTOMER_STATUS_OPTIONS } from "src/_mock/assets";
import { useRouter } from "src/routes/hooks/use-router";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Label from "src/components/label/label";
import { useLocation } from "react-router";
import { useSearchParams } from 'src/routes/hooks';
import { packageDetails } from "../packageDetails";
import { PackagePlan } from "../packagePlan";
import DurationAndPriceForm from "../duration-and-price-form";
import DurationPriceTableToolbar from "../duration-price-table-toolbar";
import DurationPriceTableFiltersResult from "../duration-price-table-filters-result";
import DurationAndPriceTableRow from "../duration-and-price-table-row";
import { ConfirmDialog } from "src/components/custom-dialog";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "duration", label: "Duration (Months)" },
  { id: "INRprice", label: "Price (INR)" },
  { id: "LKRprice", label: "Price (LKR)" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions", align: "center" },
];

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...CUSTOMER_STATUS_OPTIONS];

const defaultFilters = {
  name: "",
  status: 'all',
};

export default function DurationAndPriceView({from}) {
    const { state } = useLocation();
    
    const params = useSearchParams();
    const id = 2;

    const settings = useSettingsContext();

    const packagesPlanList = _packagePlanMockData as unknown as PackagePlan[];
    const planForPackage = packagesPlanList.filter(
        (pkg) => pkg.packageId === Number(id),
    );

  const table = useTable();

  const quickEdit = useBoolean();

  const [tableData, setTableData] = useState(planForPackage ? planForPackage : []);

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  
  const handleFilters = useCallback(
    (name: any, value: any) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );
  
   const handleFilterStatus = useCallback(
    (event: any, newValue: any) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const [currentEditData, setCurrentEditData] = useState(null);
  
  const handleEdit = useCallback(
    (id: any) => {
      const plan = tableData.find((plan) => plan.id === id);
      setCurrentEditData({ duration: plan.durationLabel, priceINR: plan.priceINR });
      quickEdit.onTrue();
    },
    [quickEdit, tableData],
  );

  const handleRemove = useCallback(
    (id: any) => {
      confirm.onTrue();
    },
    [confirm],
  );

  return (
    <><Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value || 'all'}
              label={tab.label}
              icon={<Label
                variant={((tab.value === "all" || tab.value === filters.status) &&
                  "filled") ||
                  "soft"}
                color={(tab.value === "active" && "success") ||
                  (tab.value === "inactive" && "error") ||
                  "default"}
              >
                {tab.value === "all" && tableData.length}
                {tab.value === "active" &&
                  tableData.filter((user) => user.status === "active").length}

                {tab.value === "inactive" &&
                  tableData.filter((user) => user.status === "inactive")
                    .length}
              </Label>} />
          ))}
        </Tabs>
        <DurationPriceTableToolbar
          filters={filters}
          onFilters={handleFilters} />
        {canReset && (
          <DurationPriceTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }} />
        )}

        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 960 }}
            >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                onSort={table.onSort} />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <DurationAndPriceTableRow
                      key={row.id}
                      row={row}
                      onEdit={(id) => handleEdit(id)}
                      onRemove={(id) => handleRemove(id)} />
                  ))}

                <TableEmptyRows
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    tableData.length
                  )} />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense} />
      </Card>
      <DurationAndPriceForm
        from={from}
        currentData={currentEditData}
        open={quickEdit.value}
        onClose={quickEdit.onFalse} />
    </Container>
    <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Remove"
        content="Are you sure want to Remove?"
        action={<Button variant="contained" color="error" onClick={() => {confirm.onFalse();} }>
          Remove
        </Button>} /></>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (status !== 'all') {
    inputData = inputData.filter((user: { status: any; }) => user.status === status);
  }

  return inputData;
}
