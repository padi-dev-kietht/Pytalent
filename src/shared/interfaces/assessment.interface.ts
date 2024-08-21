export interface FindOrCreateAssessmentInterface {
  name?: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  is_archived: boolean;
  created_by: number;
}
