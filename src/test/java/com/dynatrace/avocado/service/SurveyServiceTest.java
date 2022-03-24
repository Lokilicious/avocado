package com.dynatrace.avocado.service;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;

import com.dynatrace.avocado.domain.Survey;
import com.dynatrace.avocado.domain.Team;
import com.dynatrace.avocado.utils.ExcelTable;
import com.dynatrace.avocado.utils.ExcelUtils;

import static org.assertj.core.api.Assertions.assertThat;

class SurveyServiceTest {
    @Test
    void createSurvey() throws IOException {
        // given
        InputStream input = SurveyServiceTest.class.getResourceAsStream("/xls/testdata1.xlsx");
        ExcelTable table = ExcelUtils.parseExcel(input);
        
        // when

        //Survey actual = SurveyService.createSurvey(table, new Team());
        

        // then
        //assertThat(actual).isNotNull();
    }
}
