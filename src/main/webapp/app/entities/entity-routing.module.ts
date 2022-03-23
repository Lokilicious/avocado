import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'capability',
        data: { pageTitle: 'Capabilities' },
        loadChildren: () => import('./capability/capability.module').then(m => m.CapabilityModule),
      },
      {
        path: 'team',
        data: { pageTitle: 'Teams' },
        loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
      },
      {
        path: 'survey',
        data: { pageTitle: 'Surveys' },
        loadChildren: () => import('./survey/survey.module').then(m => m.SurveyModule),
      },
      {
        path: 'question',
        data: { pageTitle: 'Questions' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'answer',
        data: { pageTitle: 'Answers' },
        loadChildren: () => import('./answer/answer.module').then(m => m.AnswerModule),
      },
      {
        path: 'sla-block',
        data: { pageTitle: 'SLABlocks' },
        loadChildren: () => import('./sla-block/sla-block.module').then(m => m.SLABlockModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
