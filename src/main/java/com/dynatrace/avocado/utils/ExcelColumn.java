package com.dynatrace.avocado.utils;

import java.util.ArrayList;
import java.util.List;

public class ExcelColumn {
    private String header;
    private List<String> values = new ArrayList<>();

    public ExcelColumn(String header) {
        this.header = header;
    }

    public void addValue(String value) {
        values.add(value);
    }

    public List<String> getValues() {
        return values;
    }

    public String getHeader() {
        return header;
    }
}
