package com.dynatrace.avocado.utils;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;

public class ExcelUtils {

    public static ExcelTable parseExcel(InputStream input) throws IOException {
        XSSFWorkbook wb = new XSSFWorkbook(input);

        XSSFSheet sheet = wb.getSheetAt(0);

        ExcelTable table = new ExcelTable();
        for (Row cells : sheet) {
            for (Cell cell : cells) {
                if (cells.getRowNum() == 0) {
                    table.getColumns()
                        .add(new ExcelColumn(cell.getStringCellValue()));
                } else {
                    table.getColumns()
                        .get(cell.getColumnIndex())
                        .addValue(cell.getStringCellValue());
                }
            }
        }

        return table;
    }

    public static int parseValue(String s) {
        switch (s) {
            case "No":
                return 1;
            case "Partly":
                return 2;
            case "Yes":
                return 3;
            default:
                try {
                    return Integer.parseInt(s);
                } catch (NumberFormatException e) {
                    return 0;
                }
        }
    }
}
