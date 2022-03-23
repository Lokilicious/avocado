package com.dynatrace.avocado.utils;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;

import com.dynatrace.avocado.domain.Survey;

import static org.assertj.core.api.Assertions.assertThat;

class SurveyUtilsTest {
    @Test
    void createSurvey() throws IOException {
        // given
        InputStream input = ExcelUtilsTest.class.getResourceAsStream("/xls/testdata1.xlsx");
        ExcelTable table = ExcelUtils.parseExcel(input);
        
        // when

        Survey actual = SurveyUtils.createSurvey(table);
        

        // then
        assertThat(actual).isNotNull();
    }
}
