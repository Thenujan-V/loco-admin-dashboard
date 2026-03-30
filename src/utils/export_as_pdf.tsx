import { useMemo } from 'react';
import {
  StyleSheet,
  Font,
  Document,
  Page,
  View,
  Text,
  Image,
} from '@react-pdf/renderer';

// ---------- Register Fonts ----------
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf' },
  ],
});

// ---------- Props ----------
export type ExportAsPdfProps = {
  GeneratedDateTime: string;
  tableColumns: any[];
  tableRows: (string | number)[][];
};

// ---------- Styles ----------
const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        bold: { fontWeight: 'bold' },

        mb25: { marginBottom: 25 },

        h3: { fontSize: 16, fontWeight: 'bold' as const },

        subtitle1: { fontSize: 10, fontWeight: 'bold' as const },
        subtitle3: { fontSize: 9 },

        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          padding: 40,
        },

        gridContainer: {
          flexDirection: 'row' as const,
          justifyContent: 'space-between' as const,
          alignItems: 'center' as const,
        },

        // ✅ FULL WIDTH TABLE
        table: {
          width: '100%',
          borderWidth: 1,
          borderColor: '#DFE3E8',
          borderStyle: 'solid' as const,
          marginBottom: 10,
        },

        tableRow: {
          flexDirection: 'row' as const,
          width: '100%', // IMPORTANT
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
          borderStyle: 'solid' as const,
        },

        tableHeader: {
          backgroundColor: '#F0F0F0',
        },

        tableCell: {
          flex: 1, // Equal column width
          padding: 6,
          textAlign: 'left' as const,
        },
      }),
    []
  );

// ---------- Component ----------
export default function ExportAsPdf({
  GeneratedDateTime,
  tableColumns,
  tableRows,
}: ExportAsPdfProps) {
  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.gridContainer, styles.mb25]}>
          {/* <View>
            <Image
              source="/logo/logo_single.png"
              style={{ width: 48, height: 48 }}
            />
          </View> */}

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.h3}>Ceylon Reload</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.bold}>Generated at</Text>
            <Text>{GeneratedDateTime}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            {tableColumns.map((column, index) => (
              <View key={index} style={styles.tableCell}>
                <Text style={styles.subtitle1}>{String(column)}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {tableRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {row.map((cell, cellIndex) => (
                <View key={cellIndex} style={styles.tableCell}>
                  <Text style={styles.subtitle3}>{String(cell)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}