// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
  });

  const Cat = mongoose.model('Cat', catSchema);

//   const george = new Cat({
//     name: "Mrs. Morris",
//     age: 15,
//     temperament: "Rowand"
//   });

//   george.save(function(err, cat){
//     if(err){
//         console.log(handleError(err));
//     } else {
//         console.log('We just saved a cat to the db:');
//         console.log(cat);
//     }
//   });

Cat.find({}, function(err,cats){
    if(err){
        console.log(err);
    } else {
        console.log('All Cats');
        console.log(cats);
    }
});


Cat.create({
    name: 'Pedro',
    age: 6,
    temperament: 'Silly'
}, function (err,cat) {
    if(err){
        console.log(err);
    } else {
        console.log(cat);
    }
});

