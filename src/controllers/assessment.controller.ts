import { Controller } from '@nestjs/common';

import { AssessmentService } from '../services/assessment.service';
import { BaseController } from './base.controller';

@Controller('assessments')
export class AssessmentController extends BaseController {
  constructor(private assessmentService: AssessmentService) {
    super();
  }
}
