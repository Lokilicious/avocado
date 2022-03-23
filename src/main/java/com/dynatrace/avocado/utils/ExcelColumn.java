package com.dynatrace.avocado.utils;

import java.util.ArrayList;
import java.util.List;

public class ExcelColumn {
    private String header;
    private List<String> values = new ArrayList<>();

    public ExcelColumn(String header) {
        this.header = header;
    }

    void addValue(String value) {
        values.add(value);
    }

    List<String> getValues() {
        return values;
    }

    String getHeader() {
        return header;
    }
}
