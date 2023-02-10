const express = require("express");
const subProcess = require('child_process')
const XLSX = require('xlsx')

const Routes = express.Router();
 
const dbo = require("../db/conn");
 
const ObjectId = require("mongodb").ObjectId;
//===========================================

Routes.route("/join3").get( async function (req, res) {

  const agg = [
    {
        '$lookup': {
            'from': 'energyMandates', 
            'localField': 'leadID', // are these correct? 
            'foreignField': 'leadID', 
            'as': 'contract_data'
        }
    }, {
        '$limit': 200
    }, {
        '$out': 'mergeZX'
    }
]

  try {
    let db_connect = dbo.getDb("staging-live").collection("EAN").aggregate(agg)
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

module.exports = Routes;
 

Routes.route("/records").get(function (req, res) {
  try {
    let db_connect = dbo.getDb("staging-live");

  db_connect
      .collection("mergeZX") 
      .find({}).project({ _id: 0, EAN: 1,  ECAID: "$contract_data.id_old",
      Status: "$contract_data.status", 
      street: 1, house_number :1, bus: 1,
      postal_code: 1, city: 1, type: 1, meter: 1,
      Total: "$volume.total", Mono_annual_volume:  "$volume.mono", Peak_annual_volume: "$volume.peak",
      Off_Peak_Annual_Volume: "$volume.offpeak", Excl_Annual_volume: "$volume.exclusive"


        //document_reference: "$contract_data.document_reference"
      
   })
      
      //.limit(50)
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




Routes.route("/enbro-gaele").get(function (req, res) {
  try {
    let db_connect = dbo.getDb("staging-live");

  db_connect
      .collection("EnbroClients")
      .find({end_date: ""}).project({ContactEmail: "$contacts.email", ContactFN: "$contacts.firstname",
      ContactLN: "$contacts.lastname", Language: "$contacts.language", 
      Electricity: "$tariffs.electricity.product_name",
      Gas: "$tariffs.gas.product_name"
    })
      
      //.limit(50)
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





//======================================Earth====

Routes.route("/earth").get(function (req, res) {
  try {
    let db_connect = dbo.getDb("staging-live");

  db_connect
      .collection("projects")
      .find( {host: { $ne: 'onebillglobal' }, installation: { $exists: true }, installation: { $gt: 1609455600000 } })
      .project({ContactEmail: "$email", ContactFN: "$firstname",
      ContactLN: "$lastname", Language: "$language", 
      
    })
      
      //.limit(50)
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

//--------------------Companies B2B - Enbro

Routes.route("/companies_b2b_enbro").get(function (req, res) {
  try {
    let db_connect = dbo.getDb("staging-live");

  db_connect
      .collection("CompaniesEnbro2")
      .find().project({ContactEmail: "$contacts.email", ContactFN: "$contacts.firstname",
      ContactLN: "$contacts.lastname", Language: "$contacts.language", 
      Electricity: "$tariffs.electricity.product_name",
      Gas: "$tariffs.gas.product_name"
    })
      
      //.limit(50)
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


///-------------Companies B2C Gaele

Routes.route("/CompaniesGaele").get(function (req, res) {
  try {
    let db_connect = dbo.getDb("staging-live");

  db_connect
      .collection("CompaniesGaele")
      .find().project({ContactEmail: "$contacts.email", ContactFN: "$contacts.firstname",
      ContactLN: "$contacts.lastname", Language: "$contacts.language", 
      Electricity: "$tariffs.electricity.product_name",
      Gas: "$tariffs.gas.product_name"
    })
      
      //.limit(50)
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


///---------PrivatePersonsActive

Routes.route("/PrivatePersonsActive").get(function (req, res) {
  try {
    let db_connect = dbo.getDb("staging-live");

  db_connect
      .collection("GaelePP")
      .find().project({ContactEmail: "$contacts.email", ContactFN: "$contacts.first_name",
      ContactLN: "$contacts.last_name", Language: "$contacts.language", 
      Electricity: "$tariffs.electricity.product_name",
      Gas: "$tariffs.gas.product_name"
    })
      
      //.limit(50)
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

Routes.route("/message").get(function (req, res){
  res.json({ message: "Mail sent!" });

  subProcess.exec('node index.js', (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
        console.log(`The stdout Buffer from shell: ${stdout.toString()}`)
        //console.log(`The stderr Buffer from shell: ${stderr.toString()}`)
        
    }
  })
})