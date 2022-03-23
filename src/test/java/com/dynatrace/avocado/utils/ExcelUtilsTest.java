package com.dynatrace.avocado.utils;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;

import static org.assertj.core.api.Assertions.assertThat;

class ExcelUtilsTest {

    @Test
    void parseExcel() throws IOException {
        // given
        InputStream input = ExcelUtilsTest.class.getResourceAsStream("/xls/testdata1.xlsx");

        // when
        ExcelTable actual = ExcelUtils.parseExcel(input);

        // then
        assertThat(actual).isNotNull();
    }
}
