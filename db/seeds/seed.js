const { insertData } = require("../insert-data");
const { dropTables, createTables } = require("../manage-tables");

function seed(data) {
  // add seeding functionality here
  // this function should take as argument(s) all the data it needs to seed
  // it should insert this data into the relevant tables in your database
  const { categoryData, commentsData, reviewsData, usersData } = data;

  return dropTables()
    .then(() => {
      return createTables();
    })
    .then(() => {
      return insertData(categoryData, usersData, reviewsData, commentsData);
    });
}

module.exports = { seed };
