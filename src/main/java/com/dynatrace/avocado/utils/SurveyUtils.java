package com.dynatrace.avocado.utils;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.dynatrace.avocado.domain.Answer;
import com.dynatrace.avocado.domain.Question;
import com.dynatrace.avocado.domain.Survey;
import com.dynatrace.avocado.domain.Team;

import org.apache.poi.ss.usermodel.DateUtil;

public class SurveyUtils {
    public static Survey createSurvey(ExcelTable table, Team team) {
        Survey survey = new Survey();
        
        Date surveyDate = DateUtil.getJavaDate(Double.parseDouble(table.getColumns().get(1).getValues().get(0)));
        
        survey.setTeam(team);
        //survey.setId(UUID.randomUUID());
        survey.setSurveyDate(surveyDate.toInstant());
        survey.setCreatedDate(new Date().toInstant());
        List<ExcelColumn> subColumns = table.getColumns().subList(5, table.getColumns().size() - 1); // last freetext question ommitted

        for(ExcelColumn c : subColumns){
            Answer answer = new Answer();
            //answer.setId(UUID.randomUUID());
            Question question = new Question();
            //question.setId(UUID.randomUUID());
            
            question.text(c.getHeader());
            answer.setQuestion(question);
            answer.setResultNumeric(getAverage(c.getValues()));
            answer.setNumResponses((long) c.getValues().size());
            answer.setSurvey(survey);
            survey.addAnswer(answer);
        }

        return survey;
    } 

    public static double getAverage(List<String> values) {
        Integer sum = 0;
        for(String s : values){
            sum += parseValue(s);
        }
        return (double) sum / values.size();
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
                    return (Integer.parseInt(s) - 1) / (3 - 1);
                } catch (NumberFormatException e) {
                    return 0;
                }
        }
    }
}