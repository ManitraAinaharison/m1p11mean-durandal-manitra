module.exports.admin = {
  firstname: "admin",
  lastname: "admin",
  email: "admin@example.com",
  username: "admin",
  password: "admin",
  subServices: [],
  imgPath: "img-path",
};

module.exports.customers = [
  {
    firstname: "LeBron",
    lastname: "James",
    email: "lebronJames@gmail.com",
    username: "KingJames",
    password: "mdp",
  },
];

module.exports.employees = [
  {
    firstname: "Caroline",
    lastname: "Garcia",
    email: "eva.garcia@company.com",
    username: "egarcia",
    password: "Eva1234",
    subServices: [],
    imgPath: "img-path",
  },
  {
    firstname: "Wagner",
    firstname: "Frantz",
    lastname: "Rodriguez",
    email: "frank.rodriguez@company.com",
    username: "frodriguez",
    password: "FrankPass",
    subServices: [],
    imgPath: "img-path",
  },
  {
    firstname: "Victor",
    lastname: "Wembanyama",
    email: "victor.wembanyama@company.com",
    username: "hclark",
    password: "Henry1234",
    subServices: [],
    imgPath: "img-path",
  },
  {
    firstname: "D'angelo",
    lastname: "Russel",
    email: "isabel.wright@company.com",
    username: "iwright",
    password: "IsabelPass",
    subServices: [],
    imgPath: "img-path",
  },
  {
    firstname: "Tobias",
    lastname: "Harris",
    email: "liam.harris@company.com",
    username: "lharris",
    password: "Liam9876",
    subServices: [],
    imgPath: "img-path",
  },
].map((el) => ({
  ...el,
  workSchedule: {
    day: 1,
    schedule: [
      {
        start: new Date("1970-01-01T05:00:00.000+00:00"),
        end: new Date("1970-01-01T09:00:00.000+00:00"),
      },
      {
        start: new Date("1970-01-01T11:00:00.000+00:00"),
        end: new Date("1970-01-01T14:00:00.000+00:00"),
      },
    ],
  }
}));
