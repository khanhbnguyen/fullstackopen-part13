const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('session', {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      sess: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      expire: {
        type: DataTypes.DATE(6),
        allowNull: false,
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('session')
  },
}