const { sequelize, Sequelize } = require("./paginateMember");

module.exports = (sequelize,Sequelize)=>{
  const Member = sequelize.define('member',{
    idMem:{
      type: Sequelize.STRING
    },
    email:{
      type: Sequelize.STRING
    },
    pws:{
      type: Sequelize.STRING
    },
    fname:{
      type: Sequelize.STRING
    },
    regisdate:{
      type: Sequelize.STRING
    }
  });
}
