package com.dynatrace.avocado.utils;

import java.util.List;

public class ExcelColumn {
    private String header;
    private List<String> values;

    public ExcelColumn(String header) {
        this.header = header;
    }

    void addValue(String value) {
        values.add(value);
    }
}
