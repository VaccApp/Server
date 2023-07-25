# VaccApp

## Welcome to the VaccApp server repository

## app access

[Try VaccApp!](https://vaccapp.netlify.app/)

## Description

VaccApp es una herramienta online que permite sustituir la clásica cartilla de vacunación por una moderna app que permite llevar un registro de las vacunas que se han aplicado a cada persona y las citas de vacunación, además de poder consultar información sobre las vacunas y sus enfermedades asociadas. Está principalmente enfocada para que los padres puedan llevar un control de las vacunas que se les han aplicado a sus hijos, así como de las citas de vacunación, pero también puede ser utilizado por cualquier persona que quiera llevar un registro de sus vacunas.

VaccApp is an online tool that allows to replace the classic vaccination card with a modern app that allows you to keep a record of the vaccines that have been applied to each person and vaccination appointments, as well as being able to consult information about vaccines and their associated diseases. It is mainly designed for parents who want to keep track of the vaccines that have been applied to their children, as well as vaccination appointments, but it can also be used by anyone who wants to keep a record of their vaccines.

## Built With

- Javascript

- npm / MongoDB / Express / Node.js / Nodemailer

- axios / jsonwebtoken / RegEx / cors

## Server Routes

|     **Route**    | **HTTP Verb** |                     **Description**                    | **Request - body** |
|------------------|---------------|--------------------------------------------------------|--------------------|
| /auth/signup     | POST          | Signup a user                                          | {email, password, name, surname, DNI} |
| /auth/login      | POST          | Login a user                                           | {email, password} |
| /auth/verify     | GET           | Verify a user                                          | {token} |
| /auth/join-family/:familyId | POST      | Join a family                                          | req.params.familyId |
| /auth/:userId    | GET           | Get user info                                          | req.params.userId |
| /auth/:userId    | PUT           | Update user info                                       | req.params.userId, {name, surname, profilePic} |
| /auth/:userId    | DELETE        | Delete user                                            | req.params.userId |
| /family/     | GET           | Get family info                                        | req.payload._id |
| /family/     | POST          | Create a family                                        | {name, surname} |
| /family/:familyId | GET           | Get family info                                        | req.params.familyId |
| /family/:familyId | PUT           | Update family info                                     | req.params.familyId, {name, surname} |
| /family/:familyId | POST          | Add a child                             | req.params.familyId, {name, birthdate, healthcard, childPic} |
| /family/:familyId/children | GET           | Get children info                                      | req.params.familyId |
| /family/:familyId/vaccines | GET           | Get vaccines info                                      | req.params.familyId |
| /family/:familyId/appointments | GET           | Get appointments info                                  | req.params.familyId |
| /family/:familyId/invite | POST          | Invite a user to join a family                         | req.params.familyId, {email} |
| /family/:familyId | DELETE        | Delete family                                          | req.params.familyId |
| /child/:childId  | GET           | Get child info                                         | req.params.childId |
| /child/:childId  | PUT           | Update child info                                      | req.params.childId, {name, birthdate, childPic} |
| /child/:childId/sync | GET           | Sync child with institutional data                     | req.params.childId |
| /child/:childId/new | GET           | Get official vaccines for child                             | req.params.childId |
| /child/:childId/calendar | GET           | Get child vaccines calendar                            | req.params.childId |
| /child/vaccine/:vaccineId | GET           | Get vaccine appointment                                | req.params.vaccineId |
| /child/vaccine/:vaccineId | POST          | Add an appointment for a vaccine                       | req.params.vaccineId, {selectedDate} |
| /child/vaccine/:vaccineId | PUT           | Update vaccine appointment                             | req.params.vaccineId, {selectedDate} |
| /child/:childId | DELETE        | Delete child                                           | req.params.childId |
| /vaccines/     | GET           | Get vaccines info                                      | |
| /vaccines/calendar | GET           | Get vaccines official calendar                         | |
| /vaccines/:vaccineId | GET           | Get vaccine info                                       | req.params.vaccineId |
| /vaccines/:receiverId | POST          | Add a vaccine to a child                               | req.params.receiverId, {name, dose, disease, creator, expires, batch, status, vaccinationAge, vaccinationDate} |
| /vaccines/:vaccineId | PUT           | Update vaccine info                                    | req.params.vaccineId, {name, dose, disease, creator, expires, batch, status, vaccinationAge, vaccinationDate} |
| /vaccines/:vaccineId | DELETE        | Delete vaccine                                         | req.params.vaccineId |
| /centers/centers | GET           | Get vaccination centers                                | |

## Models

### User model

```javascript
{
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  surname: {type: String, required: true},
  DNI: {type: String, required: true, unique: true},
  profilePic: {type: String, default: 'https://cdn-icons-png.flaticon.com/512/5348/5348883.png'},
  family: {type: Schema.Types.ObjectId, ref: 'Family'},
}
```

### Family model

```javascript
{
  surname: {type: String, required: true},
  parents: [{type: Schema.Types.ObjectId, ref: 'User'}],
  children: [{type: Schema.Types.ObjectId, ref: 'Child'}],
}
```

### Child model

```javascript
{
  name: {type: String, required: true},
  birthdate: {type: Date, required: true},
  healthcard: {type: String, required: true},
  childPic: {type: String, default: 'https://cdn3.iconfinder.com/data/icons/materia-human/24/013_042_newborn_infant_child_baby-512.png'},
  family: {type: Schema.Types.ObjectId, ref: 'Family'},
  vaccines: [{type: Schema.Types.ObjectId, ref: 'Vaccine'}],
}
```

### Vaccine model

```javascript
{
  name: {type: String, required: true},
  dose: {type: String, required: true},
  disease: {type: String, required: true},
  creator: {type: String, required: true},
  expires: {type: Date, required: true},
  batch: {type: String, required: true},
  status: {type: String, enum: ['pending', 'applied', 'programmed'], default: 'pending'},
  vaccinationAge: {type: Number, required: true},
  vaccinationDate: {type: Date, required: true},
  center: {type: String},
}
```

## Backlog

- User with multiple families.

## Links

### Trello

[Link to your trello board](https://trello.com/b/s2kDxZgh/vaccapp-backlog)

### Git

[Server repository Link](https://github.com/VaccApp/Server)

[Client repository Link](https://github.com/VaccApp/Client)

[Fake-API repository Link](https://github.com/VaccApp/API)

[Deploy Link](https://vaccapp.fly.dev/)

### Slides

[Slides Link](https://docs.google.com)
