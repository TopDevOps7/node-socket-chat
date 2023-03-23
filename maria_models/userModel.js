const { Sequelize, DataTypes } = require('sequelize')
const connectDB = require('../config/maria_database.js')

const userSchemaModel = connectDB.sequelize.define("users", {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
     },
     token: {
          type: Sequelize.TEXT('long'),
          defaultValue: ''
     },
     email: {
          type: DataTypes.STRING,
          required: true,
          trim: true,
          unique: true,
          lowercase: true,
          max: 50,
          min: 5
     },
     name: {
          type: DataTypes.STRING
     },
     password: {
          type: DataTypes.STRING,
          required: true
     },
     originPassword: {
          type: DataTypes.STRING
     },
     gender: {
          type: DataTypes.INTEGER,
          defaultValue: 0  // male: 0, female: 1, business: 2
     },
     role: {
          type: DataTypes.STRING,
          defaultValue: 'user'
     },
     avatarUrl: {
          type: DataTypes.STRING,
          defaultValue: 'default-user-profile-image.png'
     },
     img: {
          type: DataTypes.STRING,
          defaultValue: 'default-user-profile-image.png'
     },
     bio: {
          type: DataTypes.STRING,
          defaultValue: 'Hi iam using V Chat App'
     },
     phoneNumber: DataTypes.STRING,
     address: {
          type: DataTypes.STRING,
          defaultValue: ''
     },
     zipCode: DataTypes.STRING,
     country: {
          type: DataTypes.STRING,
          defaultValue: ''
     },
     state: DataTypes.STRING,
     city: DataTypes.STRING,
     status: {
          type: DataTypes.STRING,
          defaultValue: 'active'
     },
     chatstatus: {
          type: DataTypes.STRING,
          defaultValue: 'online'
     },
     online: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
     },
     created: { 
          type: DataTypes.DATE,
          defaultValue: new Date()
     },
     deviceToken: {
          type: DataTypes.STRING
     }
      /*
      number: {
          type: DataTypes.STRING,
          trim: true,
          unique: true
      },
      coverage: {
          type: DataTypes.NUMBER
      },
      like: {
          type: DataTypes.NUMBER,
          defaultValue: 0
      },
      dislike: {
          type: DataTypes.NUMBER,
          defaultValue: 0
      },
      likeUsers: {
          type: Array,
          defaultValue: []
      },
      dislikeUsers: {
          type: Array,
          defaultValue: []
      },
      balance: {
          type: DataTypes.NUMBER,
          defaultValue: 0
      },
      balanceCurrency: {
          type: DataTypes.STRING,
          defaultValue: 'USD'
      },
      punishment: {
          type: DataTypes.NUMBER,
          defaultValue: 0
      },
      location: {
          type: {
              type: DataTypes.STRING,
              enum: ['Point'],
              defaultValue: 'Point'
          },
          coordinates: {
              type: [DataTypes.NUMBER],
              defaultValue: [0,0]
          }
      },
      fixedLocation: DataTypes.STRING,
      note: {
          type: DataTypes.STRING
      },
      created: {
          type: DataTypes.DATE,
          defaultValue: new Date()
      },
      use_current_location_as_permanent: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      display_position_with_random_offset: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      all_new_message_alert: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      public_chat_room_me_alert: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      change_kilometers_to_miles: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      voice_alert: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      vibration_alert: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      do_not_disturb: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
*/
},
{
    timestamps: false
});

userSchemaModel.sync().then(() => {
     console.log('users table created successfully!');
}).catch((error) => {
     console.error('Unable to create users table');
});

module.exports = {
     userSchemaModel,
}