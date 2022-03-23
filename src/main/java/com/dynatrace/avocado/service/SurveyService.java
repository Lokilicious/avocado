package com.dynatrace.avocado.service;

import com.dynatrace.avocado.repository.QuestionRepository;
import com.dynatrace.avocado.repository.SurveyRepository;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.dynatrace.avocado.domain.Answer;
import com.dynatrace.avocado.domain.Question;
import com.dynatrace.avocado.domain.Survey;
import com.dynatrace.avocado.domain.Team;

import org.apache.poi.ss.usermodel.DateUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dynatrace.avocado.utils.ExcelTable;
import com.dynatrace.avocado.utils.ExcelColumn;

@Service
@Transactional
public class SurveyService {
    private final SurveyRepository surveyRepository;
    private final QuestionRepository questionRepository;


    public SurveyService(SurveyRepository surveyRepository, QuestionRepository questionRepository) {
        this.surveyRepository = surveyRepository;
        this.questionRepository = questionRepository;
    }

    public Survey createSurvey(ExcelTable table, Team team) {
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
            Optional<Question> q = questionRepository.findOneByText(c.getHeader());

            if(q.isEmpty()){
                Question question = new Question();
                question.setText(c.getHeader());
                question.setId(UUID.randomUUID());
                questionRepository.save(question);
                answer.setQuestion(question);
            } else {
                answer.setQuestion(q.get());
            }

            answer.setResultNumeric(getAverage(c.getValues()));
            answer.setNumResponses((long) c.getValues().size());
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