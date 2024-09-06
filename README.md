# PYTALENT PROJECT API

- Description: A game-based testing system used for candidates during recruitment, contains Admin webpage, API and website. This is backend API for the project.
- Technologies used: NestJS, TypeORM, SQLite, TypeORM-Seeding,...
- Cronjob enabled for games.

## API Usage

### Admin features

POST: /login - Login for admin {body: {email, password}}

#### /admin/users/hr

POST: /create - Create new HR {body: {email, password, role}}
POST: /games/add - Add games to Hr_games {body: {id, gameIds[]}}

### HR features

POST: /login - Login for HR {body: {email, password}}
GET: /assessments - Get All Assessments that HR created
GET: /assessments/:assessment_id - Get One Assessment that HR created by ID
GET: /assessments/:assessment_id/result - Get One Assessment Result by ID

#### /hr

POST: /invite - Invite new Candidate {body: {email, assessment_id}}

#### /hr/assessments

POST: /create - Create new Assessment {body: {name, description, (start_date), (end_date)}}
POST: /:assessment_id/add-games - Add games to Assessment by ID {body: {gameIds[]}}
PATCH: /archive/:assessment_id - Archive an Assessment by ID
PATCH: /update/:assessment_id - Update an Assessment by ID
DELETE: /delete/:assessment_id - Delete an Assessment by ID

### Candidate/Game features

#### /assessments/invite/:invitation_id/authenticate

POST: / - authenticate Candidate that is invited to the exact Assessment within the invitation {body: {email}}

#### /games/:game_id

POST: /start - Start Game by ID {body: {assessmentId, candidateId, (level)}}
POST: /submit-answer-lqg - Submit answer for Logical_questions Game {body: {assessmentId, candidateId, questionOrder, answer, startTime}}
POST: /skip-question - Skip question for Logical_questions Game {body: {assessmentId, candidateId, questionOrder, startTime}}
POST: /submit-answer-mg - Submit answer for Memory Game {body: {assessmentId, candidateId, levelOrder, answer, startTime}}
POST: /end - End Game by ID {body: {assessmentId, candidateId}}
