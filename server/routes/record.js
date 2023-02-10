const express = require("express");

// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/record").get(function (req, res) {
  try {
    let db_connect = dbo.getDb("staging-live");

   db_connect
      .collection("EAN")
      .find({}).project({ _id: 0, EAN: 1 })
      
      
      .limit(50)
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        
        res.json(result);
      });
    console.log()
    res.status(200);
  } catch (error) {
    console.log(error);
  }
});

//agreagate - create new collection on database
recordRoutes.route("/record2").get( async function (req, res) {

  //db.countries.aggregate({$unwind:'$data.country.neighbor.name'})

  const agg = [
    {
      '$match': {
        'date': {
          '$gte': new Date('Thu, 01 Aug 2002 00:00:00 GMT'), 
          '$lt': new Date('Sat, 31 Aug 2002 00:00:00 GMT')
        }
      }
    }, {
      '$lookup': {
        
        'from': 'movies', 
        'localField': 'movie_id', 
        'foreignField': '_id', 
        'as': 'movie_info'
      }
    }, 

    {
      '$out': 'mergeMoviesandCommens'
    }, 
  ];

  try {
    let db_connect = dbo.getDb("sample_mflix").collection("comments").aggregate(agg)
    // .limit(50)
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        
        res.json(result);
      });


    

    // const cursor = db_connect.aggregate(agg)
    // const result = await cursor.toArray();
    // console.log(result)

  //  db_connect.comments.aggregate([
  //   {
  //     '$match': {
  //       'date': {
  //         '$gte': new Date('Thu, 01 Aug 2002 00:00:00 GMT'), 
  //         '$lt': new Date('Sat, 31 Aug 2002 00:00:00 GMT')
  //       }
  //     }
  //   }, {
  //     '$lookup': {
  //       'from': 'movies', 
  //       'localField': 'movie_id', 
  //       'foreignField': '_id', 
  //       'as': 'movie_info'
  //     }
  //   }, {
  //     '$out': 'mergeMoviesandCommens'
  //   }
  //  ])
  //  .limit(50).toArray(function (err, result) {
  //   if (err) {
  //     throw err;
  //   }
    
  //   res.json(result);
  //});

  res.status(200);
} catch (error) {
  console.log(error);
}
});



//---------------------------ENBRO 


recordRoutes.route("/join2").get( async function (req, res) {

  const agg = [
    
    {
      '$lookup': {    
            'from': 'energyMandates', 
            'localField': 'leadID', 
            'foreignField': 'leadID', 
            'as': 'contract_data'
      }
    }, 

    {
      '$out': 'merge33'
    }, 
    
  ];

  try {
    let db_connect = dbo.getDb("staging-live").collection("EAN").aggregate(agg)
    //.limit(50)
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        
        res.json(result);
      });


  res.status(200);
} catch (error) {
  console.log(error);
}
});














recordRoutes.route("/record3").get(function (req, res) {
  try {
    let db_connect = dbo.getDb("sample_mflix");

   db_connect
      .collection("asdf")
      .find({}).project({ _id: 1, name: 1, email: 1, plot: "$movie_info.plot"
      , genres: "$movie_info.genres"})
    
      
      //.limit(50)`
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        
        res.json(result);
      });
    console.log()
    res.status(200);
  } catch (error) {
    console.log(error);
  }
});













// recordRoutes.route("/strasburg").get(function (req, res) {
//   try {
//     let db_connect = dbo.getDb("staging-live");

//     db_connect
//       .collection("companies")
//       .find({ city: "Strasbourg" }).limit(50)
//       .toArray(function (err, result) {
//         if (err) {
//           throw err;
//         }

//         res.json(result);
//       });

//     res.status(200);
//   } catch (error) {
//     console.log(error);
//   }
// });











// get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("companies").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    summary: req.body.summary,
    bedrooms: req.body.bedrooms,
    property_type: req.body.property_type,
  };
  db_connect
    .collection("listingsAndReviews")
    .insertOne(myobj, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
});

// update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      summary: req.body.summary,
      bedrooms: req.body.bedrooms,
      property_type: req.body.property_type,
    },
  };
  db_connect
    .collection("listingsAndReviews")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection("listingsAndReviews")
    .deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      response.json(obj);
    });
});

module.exports = recordRoutes;
